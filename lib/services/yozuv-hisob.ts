// Ovqat yozuvlari bilan bog'liq sof hisob — bazaga bog'liq emas, shuning uchun
// klient komponentlar ham shu yerdan import qiladi.

export const OVQAT_TURLARI = ["Nonushta", "Tushlik", "Kechki", "Gazak"] as const;

export type OvqatTuri = (typeof OVQAT_TURLARI)[number];

export type Yozuv = {
  id: string;
  taomId: string | null;
  taomNomi: string;
  porsiya: string;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
  ovqatTuri: string;
  /** "qolda" yoki "ai" — AI orqali kirgan yozuvda "AI taxmini" belgisi turadi. */
  manba: string;
  /** Yuklangan rasm (`/api/rasmlar/<id>`) yoki bazadagi taom rasmi; ikkalasi ham yo'q bo'lsa null. */
  rasm: string | null;
  /** ISO matn — server va klient bir xil qiymatni ko'rsin. */
  vaqt: string;
};

export type Jami = {
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
};

/** Kun davomidagi yozuvlarning yig'indisi. */
export function kunlikJami(yozuvlar: Yozuv[]): Jami {
  return yozuvlar.reduce<Jami>(
    (jami, yozuv) => ({
      kaloriya: jami.kaloriya + yozuv.kaloriya,
      oqsil: jami.oqsil + yozuv.oqsil,
      yog: jami.yog + yozuv.yog,
      uglevod: jami.uglevod + yozuv.uglevod,
    }),
    { kaloriya: 0, oqsil: 0, yog: 0, uglevod: 0 },
  );
}

export type YozuvGuruhi = { turi: string; yozuvlar: Yozuv[]; kaloriya: number };

/**
 * Jurnal (E9) uchun yozuvlarni ovqat turi bo'yicha guruhlaydi: avval ma'lum turlar o'z
 * tartibida, keyin (bo'lsa) notanish turlar. Bo'sh guruh qaytarilmaydi.
 */
export function turBoyichaGuruh(yozuvlar: Yozuv[]): YozuvGuruhi[] {
  const turlar = [
    ...OVQAT_TURLARI,
    ...new Set(
      yozuvlar
        .map((yozuv) => yozuv.ovqatTuri)
        .filter((turi) => !(OVQAT_TURLARI as readonly string[]).includes(turi)),
    ),
  ];
  return turlar
    .map((turi) => {
      const guruh = yozuvlar.filter((yozuv) => yozuv.ovqatTuri === turi);
      return { turi, yozuvlar: guruh, kaloriya: kunlikJami(guruh).kaloriya };
    })
    .filter((guruh) => guruh.yozuvlar.length > 0);
}

const SANA_QOLIPI = /^\d{4}-\d{2}-\d{2}$/;

/** "YYYY-MM-DD" ko'rinishidagi haqiqiy sana ("2026-02-31" kabi emas). */
export function sanaYaroqli(sana: string): boolean {
  if (!SANA_QOLIPI.test(sana)) return false;
  const vaqt = Date.parse(`${sana}T00:00:00.000Z`);
  return !Number.isNaN(vaqt) && new Date(vaqt).toISOString().slice(0, 10) === sana;
}

/** Sanadan `kun` kun oldingi (manfiy) yoki keyingi (musbat) sana. */
export function qoshniSana(sana: string, kun: number): string {
  const vaqt = Date.parse(`${sana}T00:00:00.000Z`) + kun * 24 * 60 * 60 * 1000;
  return new Date(vaqt).toISOString().slice(0, 10);
}

// O'zbekiston vaqti — UTC+5, yozgi vaqt yo'q. Server qaysi mintaqada turishidan
// qat'i nazar "bugun" bir xil hisoblansin uchun siljish qo'lda qo'shiladi.
const SILJISH_MS = 5 * 60 * 60 * 1000;

/** Bugungi sana "YYYY-MM-DD" ko'rinishida (Toshkent vaqti bo'yicha). */
export function bugunSana(): string {
  return new Date(Date.now() + SILJISH_MS).toISOString().slice(0, 10);
}

/** Sana matnidan shu kunning boshi va oxiri (UTC lahzalari sifatida). */
export function sanaOraligi(sana: string): { boshi: Date; oxiri: Date } {
  const boshi = new Date(Date.parse(`${sana}T00:00:00.000Z`) - SILJISH_MS);
  return { boshi, oxiri: new Date(boshi.getTime() + 24 * 60 * 60 * 1000) };
}

/** Yozuv vaqti: "08:20". */
export function vaqtMatni(iso: string): string {
  return new Date(Date.parse(iso) + SILJISH_MS).toISOString().slice(11, 16);
}

/**
 * Yozuv vaqtining soat-daqiqasini almashtiradi, kuni (Toshkent bo'yicha) o'zgarmaydi.
 * "HH:MM" noto'g'ri bo'lsa null.
 */
export function vaqtniAlmashtir(iso: string, soatDaqiqa: string): string | null {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(soatDaqiqa)) return null;
  const sana = new Date(Date.parse(iso) + SILJISH_MS).toISOString().slice(0, 10);
  return new Date(Date.parse(`${sana}T${soatDaqiqa}:00.000Z`) - SILJISH_MS).toISOString();
}

/** Sarlavhadagi sana: "20-sentabr, shanba". */
export function sanaMatni(sana: string): string {
  const OYLAR = [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
  ];
  const KUNLAR = [
    "yakshanba", "dushanba", "seshanba", "chorshanba",
    "payshanba", "juma", "shanba",
  ];
  const kun = new Date(`${sana}T00:00:00.000Z`);
  return `${kun.getUTCDate()}-${OYLAR[kun.getUTCMonth()]}, ${KUNLAR[kun.getUTCDay()]}`;
}
