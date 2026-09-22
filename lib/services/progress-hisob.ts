import type { Til } from "../lugat/tarjima.ts";
import { kgdanLb, VAZN } from "./onboarding-hisob.ts";
import type { VaznBirligi } from "./sozlamalar-hisob.ts";
import { qoshniSana } from "./yozuv-hisob.ts";

// Progress (P1–P3) hisoblari — sof funksiyalar, bazasiz. Ta'riflar progress-tz.md 1-bo'limda
// qotirilgan: kuzatilgan kun — kamida bitta faol ovqat yozuvi bor kun (vazn kiritish kunni
// kuzatilgan qilmaydi); kun chegarasi — Toshkent vaqti. Sahifa raqamlarni izohlamaydi.

/** Bitta o'lchov. `sana` — Toshkent kuni; `birinchi` — onboarding yozuvi (o'chirilmaydi). */
export type VaznNuqtasi = { id: string; sana: string; vazn: number; birinchi: boolean };

export type Streak = { joriy: number; engUzun: number };

export type KunKatagi = { sana: string; kuzatilgan: boolean };

export type Progress = {
  bugun: string;
  /** Foydalanuvchi sozlamasi — faqat ko'rsatish uchun; qiymatlar doim kg. */
  vaznBirligi: VaznBirligi;
  /** Eskidan yangiga; kamida bitta (onboardingdan). */
  vaznlar: VaznNuqtasi[];
  maqsadVazn: number | null;
  /** Oxirgi o'lchov − birinchi o'lchov, kg. Bitta o'lchovda null. */
  ozgarish: number | null;
  maqsadFoizi: number | null;
  haftalikOzgarish: number | null;
  streak: Streak;
  kuzatilganJami: number;
  /** Oxirgi 30 kun, eskidan yangiga; oxirgisi — bugun. */
  oxirgi30: KunKatagi[];
};

/** Vazn o'zgarganda norma ham qayta hisoblanadi — P2'dagi "normangiz yangilandi" xabari uchun. */
export type NormaOzgarishi = { eski: number | null; yangi: number | null };

const KUN_MS = 24 * 60 * 60 * 1000;
export const KATAKLAR_SONI = 30;
/** Oldingi o'lchovdan shuncha kg dan ko'p farq — klient tasdiq so'raydi (to'smaydi). */
export const SAKRASH_CHEGARASI = 5;

function kunlarFarqi(boshi: string, oxiri: string): number {
  return Math.round((Date.parse(`${oxiri}T00:00:00.000Z`) - Date.parse(`${boshi}T00:00:00.000Z`)) / KUN_MS);
}

/**
 * Streak: ketma-ket kuzatilgan kunlar. Bugun yozuv bo'lmasa ham streak uzilmaydi — kun
 * tugamagan, sanoq kechadan boshlanadi. `sanalar` — kuzatilgan kunlar, tartibi ahamiyatsiz.
 */
export function streakHisobi(sanalar: readonly string[], bugun: string): Streak {
  const toplam = new Set(sanalar);

  let joriy = 0;
  let kun = toplam.has(bugun) ? bugun : qoshniSana(bugun, -1);
  while (toplam.has(kun)) {
    joriy++;
    kun = qoshniSana(kun, -1);
  }

  let engUzun = 0;
  let ketma = 0;
  let oldingi: string | null = null;
  for (const sana of [...toplam].sort()) {
    ketma = oldingi !== null && kunlarFarqi(oldingi, sana) === 1 ? ketma + 1 : 1;
    if (ketma > engUzun) engUzun = ketma;
    oldingi = sana;
  }
  return { joriy, engUzun };
}

/** Oxirgi 30 kunning kataklari, eskidan yangiga (oxirgisi — bugun). */
export function oxirgiKunlar(sanalar: readonly string[], bugun: string): KunKatagi[] {
  const toplam = new Set(sanalar);
  return Array.from({ length: KATAKLAR_SONI }, (_, i) => {
    const sana = qoshniSana(bugun, i - (KATAKLAR_SONI - 1));
    return { sana, kuzatilgan: toplam.has(sana) };
  });
}

/**
 * Yo'lning qancha qismi bosib o'tildi (boshlanish -> maqsad), 0–100. Maqsad vazn yo'q yoki
 * boshlanish maqsadga teng bo'lsa null — o'lchaydigan yo'l yo'q.
 */
export function maqsadFoizi(vaznlar: readonly VaznNuqtasi[], maqsad: number | null): number | null {
  if (maqsad === null || vaznlar.length === 0) return null;
  const boshi = vaznlar[0].vazn;
  const jami = boshi - maqsad;
  if (Math.abs(jami) < 0.05) return null;
  const otilgan = boshi - vaznlar[vaznlar.length - 1].vazn;
  return Math.max(0, Math.min(100, Math.round((otilgan / jami) * 100)));
}

/**
 * Haftalik o'rtacha o'zgarish, kg. Kamida 14 kunni qamragan ikki o'lchov kerak — undan kam
 * bo'lsa son shovqin, shuning uchun null (bo'lim ko'rsatilmaydi).
 */
export function haftalikOzgarish(vaznlar: readonly VaznNuqtasi[]): number | null {
  if (vaznlar.length < 2) return null;
  const boshi = vaznlar[0];
  const oxiri = vaznlar[vaznlar.length - 1];
  const kunlar = kunlarFarqi(boshi.sana, oxiri.sana);
  if (kunlar < 14) return null;
  return Math.round(((oxiri.vazn - boshi.vazn) / (kunlar / 7)) * 100) / 100;
}

export function progressHisobi({
  bugun,
  vaznBirligi,
  vaznlar,
  maqsadVazn,
  kuzatilganSanalar,
}: {
  bugun: string;
  vaznBirligi: VaznBirligi;
  vaznlar: VaznNuqtasi[];
  maqsadVazn: number | null;
  kuzatilganSanalar: readonly string[];
}): Progress {
  const ozgarish =
    vaznlar.length < 2
      ? null
      : Math.round((vaznlar[vaznlar.length - 1].vazn - vaznlar[0].vazn) * 10) / 10;
  return {
    bugun,
    vaznBirligi,
    vaznlar,
    maqsadVazn,
    ozgarish,
    maqsadFoizi: maqsadFoizi(vaznlar, maqsadVazn),
    haftalikOzgarish: haftalikOzgarish(vaznlar),
    streak: streakHisobi(kuzatilganSanalar, bugun),
    kuzatilganJami: new Set(kuzatilganSanalar).size,
    oxirgi30: oxirgiKunlar(kuzatilganSanalar, bugun),
  };
}

/** So'rovdagi vazn (kg): 30–300, 0,1 kg aniqlikda. Birlik (lb) klientda kg ga o'giriladi. */
export function vaznniTekshir(qiymat: unknown): { vazn: number } | { xato: string } {
  if (typeof qiymat !== "number" || !Number.isFinite(qiymat) || qiymat < VAZN.min || qiymat > VAZN.max) {
    return { xato: `Vazn ${VAZN.min}–${VAZN.max} kg oralig'ida bo'lsin` };
  }
  return { vazn: Math.round(qiymat * 10) / 10 };
}

// --- Ko'rsatish yordamchilari (P1–P3) --------------------------------------------------

export const ORALIQLAR = ["30", "90", "hammasi"] as const;
export type Oraliq = (typeof ORALIQLAR)[number];

/**
 * Grafik oralig'i: oxirgi N kundagi o'lchovlar. Oynadan oldingi eng so'nggi o'lchov ham
 * kiradi — chiziq oynaga "kirib kelsin", 30 kunda bitta o'lchov bo'lsa ham grafik chizilsin.
 * Oynada ikkitadan kam nuqta qolsa (hamma o'lchov eski) oxirgi ikkitasi olinadi — o'lchovlari
 * bor foydalanuvchiga "ikkinchi o'lchov yo'q" deyilmaydi (prototipda oraliq massiv kesimi).
 */
export function oraliqNuqtalari(
  vaznlar: readonly VaznNuqtasi[],
  oraliq: Oraliq,
  bugun: string,
): VaznNuqtasi[] {
  if (oraliq === "hammasi") return [...vaznlar];
  const boshi = qoshniSana(bugun, -Number(oraliq));
  const ichida = vaznlar.filter((nuqta) => nuqta.sana >= boshi);
  const oldingi = vaznlar.filter((nuqta) => nuqta.sana < boshi).at(-1);
  const nuqtalar = oldingi ? [oldingi, ...ichida] : ichida;
  return nuqtalar.length < 2 && vaznlar.length >= 2 ? vaznlar.slice(-2) : nuqtalar;
}

/** Vazn ko'rsatish birligida: kg — 0,1 aniqlikda, lb — butun (onboarding bilan bir xil). */
export function vaznQiymati(kg: number, birlik: VaznBirligi): number {
  return birlik === "lb" ? kgdanLb(kg) : Math.round(kg * 10) / 10;
}

/** Son matni: o'zbek va rus tilida kasr vergul bilan, inglizchada nuqta. */
export function sonMatni(son: number, til: Til): string {
  const matn = String(son);
  return til === "en" ? matn : matn.replace(".", ",");
}

/** Ishorali farq: "+1,2" · "−0,8" · "0" (minus — chiziqcha emas, matematik belgi). */
export function farqMatni(farq: number, til: Til): string {
  const yaxlit = Math.round(farq * 10) / 10;
  const belgi = yaxlit > 0 ? "+" : yaxlit < 0 ? "−" : "";
  return belgi + sonMatni(Math.abs(yaxlit), til);
}
