// Ovqat yozuvlari bilan bog'liq sof hisob — bazaga bog'liq emas, shuning uchun
// klient komponentlar ham shu yerdan import qiladi.

import type { Til } from "../lugat/tarjima.ts";

/** Bazada shu o'zbekcha nomlar saqlanadi; ekranda lug'at orqali tarjima qilinadi. */
export const OVQAT_TURLARI = ["Nonushta", "Tushlik", "Kechki", "Gazak"] as const;

export type OvqatTuri = (typeof OVQAT_TURLARI)[number];

export type Yozuv = {
  id: string;
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

// Dushanbadan boshlab. Nomlar qo'lda yozilgan (Intl emas) — server va brauzer bir xil matn chizsin.
const HAFTA_KUNLARI: Record<Til, readonly string[]> = {
  uz: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
  ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
};

/** Sananing qisqa hafta kuni nomi: "Du", "Пн", "Mo" (haftalik hisobot ustunlari ostida). */
export function haftaKuniNomi(sana: string, til: Til = "uz"): string {
  return HAFTA_KUNLARI[til][(new Date(`${sana}T00:00:00.000Z`).getUTCDay() + 6) % 7];
}

export type HaftaKuni = { sana: string; nomi: string; kun: number };

/** Sana joylashgan haftaning yetti kuni, dushanbadan yakshanbagacha (Home'dagi kun tanlagich). */
export function haftaKunlari(sana: string, til: Til = "uz"): HaftaKuni[] {
  // getUTCDay: yakshanba = 0. Dushanbadan sanash uchun bir kunga suriladi.
  const dushanbadan = (new Date(`${sana}T00:00:00.000Z`).getUTCDay() + 6) % 7;
  return HAFTA_KUNLARI[til].map((nomi, i) => {
    const kunSanasi = qoshniSana(sana, i - dushanbadan);
    return { sana: kunSanasi, nomi, kun: Number(kunSanasi.slice(8)) };
  });
}

// O'zbekiston vaqti — UTC+5, yozgi vaqt yo'q. Server qaysi mintaqada turishidan
// qat'i nazar "bugun" bir xil hisoblansin uchun siljish qo'lda qo'shiladi.
const SILJISH_MS = 5 * 60 * 60 * 1000;

/** Lahzaning Toshkent vaqti bo'yicha sanasi: "YYYY-MM-DD". */
export function toshkentSanasi(vaqt: Date): string {
  return new Date(vaqt.getTime() + SILJISH_MS).toISOString().slice(0, 10);
}

/** Bugungi sana "YYYY-MM-DD" ko'rinishida (Toshkent vaqti bo'yicha). */
export function bugunSana(): string {
  return toshkentSanasi(new Date());
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

const OYLAR: Record<Til, readonly string[]> = {
  uz: [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
  ],
  // Sana ichida oy qaratqich kelishigida turadi: "20 сентября".
  ru: [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

// Yakshanbadan boshlab — `getUTCDay` tartibida.
const KUNLAR: Record<Til, readonly string[]> = {
  uz: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"],
  ru: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

/** "20.09.2026" — prototip `sanaToliq` (Home sarlavhasi, vazn tarixi va paneli). */
export function sanaToliq(sana: string): string {
  return `${sana.slice(8, 10)}.${sana.slice(5, 7)}.${sana.slice(0, 4)}`;
}

/** "20.09" — prototip `sanaQisqa` (statistika qatorlari, grafikdagi tanlangan nuqta). */
export function sanaQisqa(sana: string): string {
  return `${sana.slice(8, 10)}.${sana.slice(5, 7)}`;
}

/** Kun va oy: "20-sentabr" · "20 сентября" · "20 September". */
export function kunOyMatni(sana: string, til: Til = "uz"): string {
  const kun = new Date(`${sana}T00:00:00.000Z`);
  const oy = OYLAR[til][kun.getUTCMonth()];
  return til === "uz" ? `${kun.getUTCDate()}-${oy}` : `${kun.getUTCDate()} ${oy}`;
}

/** Sarlavhadagi sana: "20-sentabr, shanba" · "20 сентября, суббота" · "20 September, Saturday". */
export function sanaMatni(sana: string, til: Til = "uz"): string {
  const kun = new Date(`${sana}T00:00:00.000Z`);
  return `${kunOyMatni(sana, til)}, ${KUNLAR[til][kun.getUTCDay()]}`;
}
