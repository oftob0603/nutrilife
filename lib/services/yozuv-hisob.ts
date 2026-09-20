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
  /** Bazadagi taomning rasmi; taom o'chgan yoki rasmsiz bo'lsa null. */
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
