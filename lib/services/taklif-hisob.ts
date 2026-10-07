// Qolgan kaloriya va unga mos retsept taklifi — sof hisob, bazasiz (qolip: prototip
// `data-nutrition.jsx` dagi `mealSuggestion` va `fitGrams`). Home doirasidagi "qoldi",
// Home'dagi taklif kartasi va E7'dagi porsiya tavsiyasi — hammasi shu bitta manbadan.
// Taklif manbai retseptlar bazasi (DECISIONS 2026-10-07): taomlar jadvali olib tashlangan.

import type { Reja } from "./norma-hisob.ts";
import type { Jami } from "./yozuv-hisob.ts";

/** Shundan kam qolganda taklif berilmaydi — hech qaysi retsept porsiyasi sig'maydi. */
export const TAKLIF_ENG_KAM_KKAL = 80;

/** Bugun yana qancha yesa bo'ladi; normadan oshilgan bo'lsa 0 (manfiy bo'lmaydi). */
export function qolganKaloriya(jami: Pick<Jami, "kaloriya">, reja: Pick<Reja, "kaloriya">): number {
  return Math.max(0, reja.kaloriya - jami.kaloriya);
}

/** Taklif uchun retseptning qisqa surati: nom foydalanuvchi tilida, kaloriya bitta porsiya uchun. */
export type TaklifRetsepti = {
  id: string;
  nomi: string;
  rasm: string | null;
  /** Porsiya matni ("300 g"); bo'sh bo'lsa karta "1 porsiya" deydi. */
  porsiya: string;
  kaloriya: number;
};

/** API javobi: PRO'ga taklif (yoki mos retsept yo'q bo'lsa null), qolganlarga qulf. */
export type TaklifJavobi = { yopiq: true } | { yopiq: false; taklif: TaklifRetsepti | null };

/** Hisobsiz PRO imkoniyati (makro kuzatish, porsiya tavsiyasi): API faqat yopiq-ochiqligini aytadi. */
export type QulfJavobi = { yopiq: boolean };

/** Porsiya tavsiyasi uchun asos (E7): bugun qolgan kaloriya va imkoniyat PRO'ga yopiqmi. */
export type TavsiyaAsosi = { qoldi: number; yopiq: boolean };

/**
 * AI natijasi uchun tavsiya (E7, PRO; prototip `fitGrams`): AI bergan 100 g zichligidan qolgan
 * kaloriyaga sig'adigan gramm, 10 ga yaxlitlab (pastga).
 * Faqat kiritilgan porsiyadan kichik bo'lsa ma'noli — aks holda null (karta chiqmaydi).
 */
export function sigadiganGramm(kaloriya100: number, porsiyaGramm: number, qolgan: number): number | null {
  if (kaloriya100 <= 0 || qolgan <= 0) return null;
  const gramm = Math.floor(qolgan / (kaloriya100 / 100) / 10) * 10;
  return gramm > 0 && gramm < porsiyaGramm ? gramm : null;
}

/**
 * Qolgan kaloriyaga sig'adigan retsept: chop etilganlar ichida bir porsiyasi qolganga eng
 * yaqin, lekin oshmaydigani. Teng kelsa — ro'yxatda birinchisi (yangisi).
 */
export function retseptTaklifi(retseptlar: readonly TaklifRetsepti[], qolgan: number): TaklifRetsepti | null {
  if (qolgan < TAKLIF_ENG_KAM_KKAL) return null;
  let eng: TaklifRetsepti | null = null;
  for (const r of retseptlar) {
    if (r.kaloriya > qolgan || r.kaloriya <= 0) continue;
    if (!eng || r.kaloriya > eng.kaloriya) eng = r;
  }
  return eng;
}
