// Taom takliflari navbati (S6 4-task, admin-tz.md A4/A5): foydalanuvchi tuzatishini navbatga
// qo'shish (E7 tasdig'ida), admin ro'yxati va kartasi, uchta qaror. Har qaror `admin_amallari`ga
// shu tranzaksiyada yoziladi (§4). Umumiy `taomlar` faqat shu yerdan o'zgaradi (DECISIONS 2026-09-13).

import { db } from "../db.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import { SAHIFA_HAJMI } from "./admin-hisob.ts";
import type { SkanNatija } from "./skan-hisob.ts";
import { tekisla, type Taom } from "./taom-hisob.ts";
import {
  bandBolmaganSlug,
  KUTAYOTGAN_HOLATLAR,
  porsiyaVariantlari,
  QAROR_AMAL_TURI,
  qarorTafsiloti,
  taomSlugi,
  tuzatishBormi,
  zichlik,
  type TaklifFiltri,
  type TaklifHolati,
  type TaklifQarori,
  type TasdiqlanganQiymatlar,
} from "./taom-taklif-hisob.ts";

// Uzoqdagi bazaga har so'rov ~0,4 s — standart tranzaksiya chegarasi yetmaydi (obuna-admin.ts kabi).
const TRANZAKSIYA_VAQTI = { maxWait: 10_000, timeout: 20_000 };

// ——— Foydalanuvchi tomoni: E7 tasdig'ida navbatga qo'shish ———

/**
 * AI natijasi bilan tasdiqlangan qiymatlar farq qilsa taklif yaratadi, aks holda hech narsa.
 * Yozuv allaqachon saqlangan — bu yerdagi xato foydalanuvchiga ko'rinmaydi (chaqiruvchi ushlaydi).
 */
export async function taklifniNavbatgaQoy(
  foydalanuvchiId: string,
  ovqatYozuviId: string,
  rasmId: string | null,
  ai: SkanNatija,
  tasdiq: TasdiqlanganQiymatlar,
): Promise<boolean> {
  if (!tuzatishBormi(ai, tasdiq)) return false;
  // Nom foydalanuvchi interfeysi tilida yozilgan — A5 shu til maydonini oldindan to'ldiradi.
  const hisob = await db.foydalanuvchi.findUnique({ where: { id: foydalanuvchiId }, select: { til: true } });
  await db.taomTaklifi.create({
    data: {
      foydalanuvchiId,
      ovqatYozuviId,
      rasmId,
      aiTaomNomi: ai.taomNomi,
      aiPorsiyaGramm: ai.porsiyaGramm,
      aiKaloriya100: ai.kaloriya100,
      aiOqsil100: ai.oqsil100,
      aiYog100: ai.yog100,
      aiUglevod100: ai.uglevod100,
      taomNomi: tasdiq.taomNomi,
      porsiyaGramm: tasdiq.porsiyaGramm,
      kaloriya: tasdiq.kaloriya,
      oqsil: tasdiq.oqsil,
      yog: tasdiq.yog,
      uglevod: tasdiq.uglevod,
      til: hisob?.til ?? "uz",
    },
  });
  return true;
}

/** Navbatda kutayotganlar soni (yangi + ko'rib chiqilmoqda) — qobiq va A1 uchun. */
export async function kutayotganTakliflarSoni(): Promise<number> {
  return db.taomTaklifi.count({ where: { holat: { in: [...KUTAYOTGAN_HOLATLAR] } } });
}

// ——— A4 ro'yxat ———

export type TaklifQatori = {
  id: string;
  holat: TaklifHolati;
  yaratilgan: string;
  /** Rasm bor bo'lsa admin ko'rish yo'li (`/api/admin/rasmlar/[id]`), yo'q bo'lsa null. */
  rasm: string | null;
  ai: { taomNomi: string; kaloriya100: number };
  tuzatish: { taomNomi: string; kaloriya100: number };
  kim: { id: string; ism: string | null } | null;
};

export type TakliflarSahifasi = { qatorlar: TaklifQatori[]; jami: number; sahifa: number };

const QATOR_MAYDONLARI = {
  id: true,
  holat: true,
  yaratilgan: true,
  rasmId: true,
  aiTaomNomi: true,
  aiKaloriya100: true,
  taomNomi: true,
  porsiyaGramm: true,
  kaloriya: true,
  oqsil: true,
  yog: true,
  uglevod: true,
  foydalanuvchi: { select: { id: true, profil: { select: { ism: true } } } },
} as const;

function holatniOqi(qiymat: string): TaklifHolati {
  return (["yangi", "korilmoqda", "tasdiqlandi", "rad_etildi"] as const).find((h) => h === qiymat) ?? "yangi";
}

function rasmYoli(rasmId: string | null): string | null {
  return rasmId ? `/api/admin/rasmlar/${rasmId}` : null;
}

/** A4 — takliflar ro'yxati: filtr, 50 tadan sahifa, eng eskisi birinchi (navbat unutilmasin). */
export async function takliflarRoyxati(filtr: TaklifFiltri, sahifa: number): Promise<TakliflarSahifasi> {
  const where: Prisma.TaomTaklifiWhereInput = filtr === "hammasi" ? {} : { holat: filtr };
  const [jami, takliflar] = await Promise.all([
    db.taomTaklifi.count({ where }),
    db.taomTaklifi.findMany({
      where,
      orderBy: { yaratilgan: "asc" },
      skip: (sahifa - 1) * SAHIFA_HAJMI,
      take: SAHIFA_HAJMI,
      select: QATOR_MAYDONLARI,
    }),
  ]);
  const qatorlar = takliflar.map(
    (t): TaklifQatori => ({
      id: t.id,
      holat: holatniOqi(t.holat),
      yaratilgan: t.yaratilgan.toISOString(),
      rasm: rasmYoli(t.rasmId),
      ai: { taomNomi: t.aiTaomNomi, kaloriya100: t.aiKaloriya100 },
      tuzatish: { taomNomi: t.taomNomi, kaloriya100: zichlik(t).kaloriya100 },
      kim: t.foydalanuvchi ? { id: t.foydalanuvchi.id, ism: t.foydalanuvchi.profil?.ism ?? null } : null,
    }),
  );
  return { qatorlar, jami, sahifa };
}

// ——— A5 karta ———

export type TaklifKartasi = {
  id: string;
  holat: TaklifHolati;
  yaratilgan: string;
  korilgan: string | null;
  rasm: string | null;
  til: string;
  ai: SkanNatija;
  tuzatish: TasdiqlanganQiymatlar;
  kim: { id: string; ism: string | null } | null;
  /** Nomi (uch tilning birida) tuzatish yoki AI nomiga mos keladigan bazadagi taom; yo'q — null. */
  oxshash: Taom | null;
  /** Qaror natijasi: yaratilgan yoki birlashtirilgan taom; rad etilganda sabab. */
  natija: { taom: { id: string; nomi: string } | null; radSababi: string | null; admin: string | null };
};

const TAOM_MAYDONLARI = {
  id: true,
  nomi: true,
  nomiRu: true,
  nomiEn: true,
  rasm: true,
  olchovMiqdori: true,
  olchovBirligi: true,
  kaloriya: true,
  oqsil: true,
  yog: true,
  uglevod: true,
  porsiyalar: true,
} as const;

/**
 * Bazadagi o'xshash taom: avval nomi aynan (tekislab) mos kelgani, bo'lmasa nomi ichida
 * uchragani. Tuzatish nomi AI nomidan ustun — foydalanuvchi to'g'rilagan nom qidiriladi.
 */
async function oxshashTaom(nomlar: string[]): Promise<Taom | null> {
  const taomlar = await db.taom.findMany({ select: TAOM_MAYDONLARI, orderBy: { nomi: "asc" } });
  const taomNomlari = (t: Taom) => [t.nomi, t.nomiRu, t.nomiEn].map(tekisla).filter(Boolean);
  for (const nom of nomlar.map(tekisla).filter(Boolean)) {
    const aynan = taomlar.find((t) => taomNomlari(t).includes(nom));
    if (aynan) return aynan;
  }
  for (const nom of nomlar.map(tekisla).filter((n) => n.length >= 3)) {
    const ichida = taomlar.find((t) => taomNomlari(t).some((tn) => tn.includes(nom) || nom.includes(tn)));
    if (ichida) return ichida;
  }
  return null;
}

/**
 * A5 — bitta taklif; topilmasa null. "Yangi" taklif ochilganda "ko'rib chiqilmoqda"ga o'tadi
 * (PRD.md 8-bo'lim zanjiri) — admin ko'rganini navbat eslab qoladi.
 */
export async function taklifKartasi(id: string): Promise<TaklifKartasi | null> {
  await db.taomTaklifi.updateMany({ where: { id, holat: "yangi" }, data: { holat: "korilmoqda" } });
  const t = await db.taomTaklifi.findUnique({
    where: { id },
    include: {
      foydalanuvchi: { select: { id: true, profil: { select: { ism: true } } } },
      taom: { select: { id: true, nomi: true } },
      admin: { select: { profil: { select: { ism: true } } } },
    },
  });
  if (!t) return null;

  const tuzatish: TasdiqlanganQiymatlar = {
    taomNomi: t.taomNomi,
    porsiyaGramm: t.porsiyaGramm,
    kaloriya: t.kaloriya,
    oqsil: t.oqsil,
    yog: t.yog,
    uglevod: t.uglevod,
  };
  const holat = holatniOqi(t.holat);
  return {
    id: t.id,
    holat,
    yaratilgan: t.yaratilgan.toISOString(),
    korilgan: t.korilgan?.toISOString() ?? null,
    rasm: rasmYoli(t.rasmId),
    til: t.til,
    ai: {
      taomNomi: t.aiTaomNomi,
      porsiyaGramm: t.aiPorsiyaGramm,
      kaloriya100: t.aiKaloriya100,
      oqsil100: t.aiOqsil100,
      yog100: t.aiYog100,
      uglevod100: t.aiUglevod100,
      vaznFoydalanuvchidan: false,
    },
    tuzatish,
    kim: t.foydalanuvchi ? { id: t.foydalanuvchi.id, ism: t.foydalanuvchi.profil?.ism ?? null } : null,
    // Qaror berilgan taklifda o'xshashni qidirish shart emas — natija allaqachon bor.
    oxshash: KUTAYOTGAN_HOLATLAR.includes(holat) ? await oxshashTaom([t.taomNomi, t.aiTaomNomi]) : null,
    natija: { taom: t.taom, radSababi: t.radSababi, admin: t.admin?.profil?.ism ?? null },
  };
}

// ——— Admin qarori ———

export type QarorNatijasi = "ok" | "topilmadi" | "yopilgan" | "taom_topilmadi";

/**
 * Taklif bo'yicha qaror. "yangi" — tuzatish zichligi 100 g o'lchovida yangi `taomlar` qatori;
 * "birlashtirish" — ko'rsatilgan taomning nomlari va (o'lchovi grammda bo'lsa) qiymatlari
 * yangilanadi; "rad" — baza o'zgarmaydi. Allaqachon yopilgan taklif qayta ko'rilmaydi.
 */
export async function taklifQarori(
  adminId: string,
  id: string,
  qaror: TaklifQarori,
  hozir: Date = new Date(),
): Promise<QarorNatijasi> {
  return db.$transaction(async (tx) => {
    const t = await tx.taomTaklifi.findUnique({ where: { id } });
    if (!t) return "topilmadi";
    if (!KUTAYOTGAN_HOLATLAR.includes(holatniOqi(t.holat))) return "yopilgan";

    const z = zichlik(t);
    let taomId: string | null = null;
    let eski: Prisma.InputJsonValue | undefined;
    let yangi: Prisma.InputJsonValue | undefined;

    if (qaror.qaror === "yangi") {
      const bandlar = new Set((await tx.taom.findMany({ select: { id: true } })).map((x) => x.id));
      taomId = bandBolmaganSlug(taomSlugi(qaror.nomlar.nomi), bandlar);
      const taom = await tx.taom.create({
        data: {
          id: taomId,
          ...qaror.nomlar,
          olchovMiqdori: 100,
          olchovBirligi: "g",
          kaloriya: z.kaloriya100,
          oqsil: z.oqsil100,
          yog: z.yog100,
          uglevod: z.uglevod100,
          porsiyalar: porsiyaVariantlari(t.porsiyaGramm),
        },
        select: TAOM_MAYDONLARI,
      });
      yangi = taom;
    } else if (qaror.qaror === "birlashtirish") {
      const joriy = await tx.taom.findUnique({ where: { id: qaror.taomId }, select: TAOM_MAYDONLARI });
      if (!joriy) return "taom_topilmadi";
      taomId = joriy.id;
      // Dona o'lchovli taomga 100 g zichligini o'tkazib bo'lmaydi — faqat nomlar yangilanadi.
      const grammda = joriy.olchovBirligi === "g" && joriy.olchovMiqdori > 0;
      const ulush = joriy.olchovMiqdori / 100;
      const yangilangan = await tx.taom.update({
        where: { id: joriy.id },
        data: {
          ...qaror.nomlar,
          ...(grammda
            ? {
                kaloriya: Math.round(z.kaloriya100 * ulush * 10) / 10,
                oqsil: Math.round(z.oqsil100 * ulush * 10) / 10,
                yog: Math.round(z.yog100 * ulush * 10) / 10,
                uglevod: Math.round(z.uglevod100 * ulush * 10) / 10,
              }
            : {}),
        },
        select: TAOM_MAYDONLARI,
      });
      eski = joriy;
      yangi = yangilangan;
    }

    await tx.taomTaklifi.update({
      where: { id },
      data: {
        holat: qaror.qaror === "rad" ? "rad_etildi" : "tasdiqlandi",
        radSababi: qaror.qaror === "rad" ? qaror.sabab : null,
        taomId,
        adminId,
        korilgan: hozir,
      },
    });
    await tx.adminAmali.create({
      data: {
        adminId,
        foydalanuvchiId: t.foydalanuvchiId,
        tur: QAROR_AMAL_TURI[qaror.qaror],
        tafsilot: qarorTafsiloti(qaror, t.taomNomi, taomId ?? undefined),
        sabab: qaror.qaror === "rad" ? qaror.sabab : "",
        eski: eski ?? { ai: t.aiTaomNomi, tuzatish: t.taomNomi, taklifId: t.id },
        yangi: yangi ?? { holat: "rad_etildi", taklifId: t.id },
      },
    });
    return "ok";
  }, TRANZAKSIYA_VAQTI);
}
