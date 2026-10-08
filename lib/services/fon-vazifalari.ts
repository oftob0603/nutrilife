// Fon vazifalari (S5): Railway'dagi backend jarayonida har daqiqada (obuna xabarlari aniq soatda
// ketadi), rasm tozalash — soatiga bir marta (instrumentation.ts, `FON_VAZIFALARI=1`). Qo'lda: `node --env-file=.env scripts/fon-vazifalari.mjs`.
//
// Obuna muddati tugashi, kunlik skan limiti va kunlik xulosa bu yerda emas — ular vazifasiz
// to'g'ri ishlaydi: PRO `tugash > hozir` dan hisoblanadi, skanlar Toshkent kuni bo'yicha
// sanaladi, xulosa har yozuvda qayta hisoblanadi (DECISIONS 2026-09-22).
// Logga foydalanuvchi ma'lumoti yozilmaydi — faqat sonlar.

import { db } from "../db.ts";
import { tarjimon, tilniOqi } from "../lugat/tarjima.ts";
import { BotApiXatosi, BotTokenYoq, rasmYubor, xabarYubor } from "./bot-api.ts";
import { ilovaManzili } from "./bot.ts";
import { ombordanOchir } from "./ombor.ts";
import {
  navbatdagiKun,
  NOMZOD_OYNASI_MS,
  OXIRGI_KUN,
  segmentniAniqla,
  xabarniTayyorla,
} from "./marketing-xabar-hisob.ts";
import {
  bosqichMatni,
  navbatdagiBosqich,
  NOMZOD_OYNASI_KUN,
} from "./obuna-xabar-hisob.ts";

const KUN_MS = 24 * 60 * 60 * 1000;
/** Shundan eski, yozuvga bog'lanmagan rasm — tashlab ketilgan tahlil (DECISIONS 2026-09-20). */
const YETIM_RASM_MUDDATI_MS = KUN_MS;
/** Bir aylanishda o'chiriladigan rasmlar — qolgani keyingi soatda. */
const YETIM_RASM_PORSIYASI = 200;
const SOAT_MS = 60 * 60 * 1000;

/** Shu jarayonda rasm tozalash oxirgi marta qachon ishlagani. */
let oxirgiTozalash = 0;

/**
 * Qayta urinish befoyda xatolar: foydalanuvchi botni bloklagan yoki botni hech ochmagan.
 * Bunday bosqich "yuborilgan" deb belgilanadi — har soat qayta urinilmaydi.
 */
function doimiyXatomi(xato: unknown): boolean {
  return (
    xato instanceof BotApiXatosi &&
    /Forbidden|chat not found|user is deactivated/i.test(xato.message)
  );
}

/**
 * Obuna muddati haqidagi bot xabarlari: 7, 3, 1 kun oldin, tugaganda va 2 kundan keyin —
 * har biri o'z soatida (obuna-xabar-hisob.ts).
 * Faqat foydalanuvchining eng so'nggi obunasi olinadi — uzaytirgan odamga eski obunaning
 * "tugadi" xabari bormaydi.
 */
export async function obunaXabarlariniYubor(hozir = new Date()): Promise<number> {
  const nomzodlar = await db.obuna.findMany({
    where: {
      tugash: {
        gt: new Date(hozir.getTime() + NOMZOD_OYNASI_KUN.dan * KUN_MS),
        lte: new Date(hozir.getTime() + NOMZOD_OYNASI_KUN.gacha * KUN_MS),
      },
      xabarBosqichi: { lt: 5 },
      foydalanuvchi: { telegramId: { not: null } },
    },
    select: {
      id: true,
      foydalanuvchiId: true,
      tugash: true,
      xabarBosqichi: true,
      foydalanuvchi: { select: { telegramId: true, til: true } },
    },
  });

  const manzil = ilovaManzili();
  let yuborildi = 0;

  for (const obuna of nomzodlar) {
    const bosqich = navbatdagiBosqich(obuna.tugash, hozir, obuna.xabarBosqichi);
    if (!bosqich) continue;

    const keyingisi = await db.obuna.findFirst({
      where: { foydalanuvchiId: obuna.foydalanuvchiId, tugash: { gt: obuna.tugash } },
      select: { id: true },
    });
    if (keyingisi) continue;

    const { t } = tarjimon(tilniOqi(obuna.foydalanuvchi.til));
    const { matn, tugma } = bosqichMatni(bosqich, t);
    const tugmalar = manzil
      ? { reply_markup: { inline_keyboard: [[{ text: tugma, web_app: { url: `${manzil}${bosqich.sahifa}` } }]] } }
      : {};

    try {
      await xabarYubor(Number(obuna.foydalanuvchi.telegramId), matn, tugmalar);
      yuborildi += 1;
    } catch (xato) {
      if (xato instanceof BotTokenYoq) throw xato;
      if (!doimiyXatomi(xato)) {
        console.error("Fon: obuna xabari yuborilmadi, keyingi soatda qayta urinadi");
        continue;
      }
    }
    await db.obuna.update({ where: { id: obuna.id }, data: { xabarBosqichi: bosqich.raqam } });
  }
  return yuborildi;
}

/**
 * 7 kunlik bot xabarlari PRO olmagan foydalanuvchilarga (marketing-xabar-hisob.ts, DECISIONS 2026-10-08).
 * Nomzod: Telegram ID bor, zanjir tugamagan, to'xtatmagan, bloklanmagan, admin emas, hisobi 9 kundan
 * yangi. Har xabar oldidan: faol PRO bo'lsa zanjir butunlay yopiladi (bosqich = 7); segment skan va
 * yozuvlar soniga qarab qayta hisoblanadi. Telegram "Forbidden" (botni bloklagan) — zanjir yopiladi.
 */
export async function marketingXabarlariniYubor(hozir = new Date()): Promise<number> {
  const nomzodlar = await db.foydalanuvchi.findMany({
    where: {
      telegramId: { not: null },
      marketingBosqichi: { lt: OXIRGI_KUN },
      marketingToxtatildi: null,
      bloklangan: null,
      rol: { not: "admin" },
      yaratilgan: { gte: new Date(hozir.getTime() - NOMZOD_OYNASI_MS) },
    },
    select: { id: true, telegramId: true, til: true, yaratilgan: true, marketingBosqichi: true },
  });

  const manzil = ilovaManzili();
  if (!manzil) return 0;
  let yuborildi = 0;

  for (const f of nomzodlar) {
    const kun = navbatdagiKun(f.yaratilgan, hozir, f.marketingBosqichi);
    if (!kun) continue;

    const [obuna, skan, yozuvlar] = await Promise.all([
      db.obuna.findFirst({ where: { foydalanuvchiId: f.id, tugash: { gt: hozir } }, select: { id: true } }),
      db.skanHisobi.aggregate({ where: { foydalanuvchiId: f.id }, _sum: { soni: true } }),
      db.ovqatYozuvi.count({ where: { foydalanuvchiId: f.id } }),
    ]);
    if (obuna) {
      await db.foydalanuvchi.update({ where: { id: f.id }, data: { marketingBosqichi: OXIRGI_KUN } });
      continue;
    }

    const til = tilniOqi(f.til);
    const xabar = xabarniTayyorla(kun, segmentniAniqla(skan._sum.soni ?? 0, yozuvlar), til);
    if (!xabar) continue;
    const tugmalar = {
      inline_keyboard: [[{ text: xabar.tugma, web_app: { url: `${manzil}${xabar.sahifa}` } }]],
    };

    let bosqich = kun;
    try {
      await rasmYubor(Number(f.telegramId), `${manzil}${xabar.rasm}`, xabar.izoh, {
        parse_mode: "HTML",
        reply_markup: tugmalar,
      });
      yuborildi += 1;
    } catch (xato) {
      if (xato instanceof BotTokenYoq) throw xato;
      if (!doimiyXatomi(xato)) {
        console.error("Fon: marketing xabari yuborilmadi, keyingi daqiqada qayta urinadi");
        continue;
      }
      bosqich = OXIRGI_KUN;
    }
    await db.foydalanuvchi.update({ where: { id: f.id }, data: { marketingBosqichi: bosqich } });
  }
  return yuborildi;
}

/** Hech bir yozuvga bog'lanmagan eski rasmlarni ombordan va bazadan o'chiradi. */
export async function yetimRasmlarniTozala(hozir = new Date()): Promise<number> {
  const yetimlar = await db.rasm.findMany({
    where: { ovqatYozuviId: null, yaratilgan: { lt: new Date(hozir.getTime() - YETIM_RASM_MUDDATI_MS) } },
    select: { id: true, kalit: true },
    take: YETIM_RASM_PORSIYASI,
  });

  let ochirildi = 0;
  for (const { id, kalit } of yetimlar) {
    // Shart qayta tekshiriladi: o'qish va o'chirish orasida rasm yozuvga bog'lanib qolishi mumkin.
    const { count } = await db.rasm.deleteMany({ where: { id, ovqatYozuviId: null } });
    if (count === 0) continue;
    await ombordanOchir(kalit).catch(() => {});
    ochirildi += 1;
  }
  return ochirildi;
}

/**
 * Hamma fon vazifalari bir aylanishda. Bir nechta nusxa ishlasa ham bir vaqtda faqat bittasi
 * bajaradi — PostgreSQL qulfi tranzaksiya oxirigacha ushlanadi; qolganlari shu soatni o'tkazadi.
 */
export async function fonVazifalariniIshlat(): Promise<void> {
  await db.$transaction(
    async (tx) => {
      const [{ olindi }] = await tx.$queryRaw<{ olindi: boolean }[]>`
        SELECT pg_try_advisory_xact_lock(hashtext('fon-vazifalari')) AS olindi`;
      if (!olindi) return;

      const natija: string[] = [];
      try {
        const yuborildi = await obunaXabarlariniYubor();
        if (yuborildi > 0) natija.push(`obuna xabarlari: ${yuborildi}`);
      } catch (xato) {
        console.error("Fon: obuna xabarlari to'xtadi", xato instanceof Error ? xato.message : "");
      }
      try {
        const marketing = await marketingXabarlariniYubor();
        if (marketing > 0) natija.push(`marketing xabarlari: ${marketing}`);
      } catch (xato) {
        console.error("Fon: marketing xabarlari to'xtadi", xato instanceof Error ? xato.message : "");
      }
      if (Date.now() - oxirgiTozalash >= SOAT_MS) {
        oxirgiTozalash = Date.now();
        try {
          natija.push(`yetim rasmlar: ${await yetimRasmlarniTozala()}`);
        } catch (xato) {
          console.error("Fon: rasm tozalash to'xtadi", xato instanceof Error ? xato.message : "");
        }
      }
      // Har daqiqada log to'lib ketmasin — faqat biror ish bo'lganda yoziladi.
      if (natija.length > 0) console.log(`Fon vazifalari — ${natija.join(", ")}`);
    },
    { timeout: 10 * 60 * 1000, maxWait: 10_000 },
  );
}
