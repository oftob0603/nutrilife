import { db } from "../db.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import { foydalanuvchiHuquqlari } from "./foydalanuvchilar.ts";
import { skanQoldigi, type Huquqlar, type SkanQoldigi } from "./huquqlar.ts";
import { bugunSana } from "./yozuv-hisob.ts";

const STANDART_CHEGARA = 50;

// Uzoqdagi bazaga har so'rov ~0,4 s — standart chegara (2 s kutish, 5 s ish) yetmaydi.
const TRANZAKSIYA_VAQTI = { maxWait: 10_000, timeout: 20_000 };

/**
 * Texnik chegara: bir hisobning bir kundagi AI chaqiriqlari (tanilmaganlari bilan birga).
 * Tarif limitlari undan past (PRO — 20 + 20), shuning uchun odatda ishlamaydi; favqulodda
 * holatda `SKAN_KUNLIK_CHEGARA` bilan pasaytiriladi. 0 — AI skan o'chiq.
 */
function kunlikChegara(): number {
  const berilgan = Number(process.env.SKAN_KUNLIK_CHEGARA);
  return Number.isInteger(berilgan) && berilgan >= 0 ? berilgan : STANDART_CHEGARA;
}

function kunKaliti(foydalanuvchiId: string, sana: string) {
  return { foydalanuvchiId, sana: new Date(`${sana}T00:00:00.000Z`) };
}

type Klient = Prisma.TransactionClient | typeof db;

async function qoldiq(
  klient: Klient,
  foydalanuvchiId: string,
  huquq: Huquqlar,
  sana: string,
): Promise<{ qoldiq: SkanQoldigi; bugunChaqiriqlar: number }> {
  // Ketma-ket: tranzaksiya bitta ulanishda ishlaydi, parallel so'rov baribir navbatda turadi.
  const bugun = await klient.skanHisobi.findUnique({
    where: { foydalanuvchiId_sana: kunKaliti(foydalanuvchiId, sana) },
    select: { soni: true, tanilmagan: true },
  });
  const jami = await klient.skanHisobi.aggregate({ where: { foydalanuvchiId }, _sum: { soni: true } });
  return {
    qoldiq: skanQoldigi(huquq, {
      bugun: bugun?.soni ?? 0,
      jami: jami._sum.soni ?? 0,
      bugunTanilmagan: bugun?.tanilmagan ?? 0,
    }),
    bugunChaqiriqlar: (bugun?.soni ?? 0) + (bugun?.tanilmagan ?? 0),
  };
}

/** Hisobning skan limiti va undan qolgani (E2 hisoblagichi, F1 kartasi); hisob topilmasa null. */
export async function skanLimitiHolati(foydalanuvchiId: string): Promise<SkanQoldigi | null> {
  const huquq = await foydalanuvchiHuquqlari(foydalanuvchiId);
  if (!huquq) return null;
  return (await qoldiq(db, foydalanuvchiId, huquq, bugunSana())).qoldiq;
}

/**
 * Nega skan berilmadi: "skan" — tarif limiti tugadi, "tanilmagan" — bugungi tanilmagan
 * urinishlar tugadi, "texnik" — kunlik texnik chegara.
 */
export type LimitSababi = "skan" | "tanilmagan" | "texnik";

export type SkanBandi =
  /** `sana` — skan yozilgan kun; qaytarish aynan shu kunga bo'ladi (yarim tundan o'tsa ham). */
  | { band: true; sana: string }
  | { band: false; sabab: LimitSababi; limit: SkanQoldigi };

/**
 * Limitdan bitta skan band qiladi. Tekshiruv va oshirish hisob bo'yicha qulf ostida, bitta
 * tranzaksiyada — parallel so'rovlar limitdan o'tib ham ketmaydi, oxirgi skanni nohaq rad ham
 * etmaydi. Hisob topilmasa null.
 */
export async function skanBandQil(foydalanuvchiId: string): Promise<SkanBandi | null> {
  const huquq = await foydalanuvchiHuquqlari(foydalanuvchiId);
  if (!huquq) return null;

  return db.$transaction(async (tx): Promise<SkanBandi> => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`skan:${foydalanuvchiId}`}))`;

    const sana = bugunSana();
    const { qoldiq: limit, bugunChaqiriqlar } = await qoldiq(tx, foydalanuvchiId, huquq, sana);
    if (limit.qoldi <= 0) return { band: false, sabab: "skan", limit };
    if (limit.tanilmaganQoldi <= 0) return { band: false, sabab: "tanilmagan", limit };
    if (bugunChaqiriqlar >= kunlikChegara()) return { band: false, sabab: "texnik", limit };

    const kalit = kunKaliti(foydalanuvchiId, sana);
    await tx.skanHisobi.upsert({
      where: { foydalanuvchiId_sana: kalit },
      create: { ...kalit, soni: 1 },
      update: { soni: { increment: 1 } },
    });
    return { band: true, sana };
  }, TRANZAKSIYA_VAQTI);
}

/**
 * Band qilingan skanni qaytaradi. `tanilmagan` — AI ishladi, lekin taomni taniy olmadi:
 * limitdan yeyilmaydi, tanilmagan urinish sifatida sanaladi. Aks holda (AI ishlamadi) skan
 * izsiz qaytadi — foydalanuvchi skanini yo'qotmasin.
 */
export async function skanQaytar(
  foydalanuvchiId: string,
  sana: string,
  { tanilmagan = false }: { tanilmagan?: boolean } = {},
): Promise<void> {
  await db.skanHisobi.update({
    where: { foydalanuvchiId_sana: kunKaliti(foydalanuvchiId, sana) },
    data: {
      soni: { decrement: 1 },
      ...(tanilmagan ? { tanilmagan: { increment: 1 } } : {}),
    },
  });
}
