// Qolgan kaloriya va unga mos taom taklifi — sof hisob, bazasiz (qolip: prototip
// `data-nutrition.jsx` dagi `mealSuggestion` va `portionAdvice`). Home doirasidagi "qoldi",
// Home'dagi taklif kartasi va E5'dagi porsiya tavsiyasi — hammasi shu bitta manbadan.

import type { Reja } from "./norma-hisob.ts";
import { porsiyaHisobi, type PorsiyaHisobi, type Taom } from "./taom-hisob.ts";
import type { Jami } from "./yozuv-hisob.ts";

/** Shundan kam qolganda taklif berilmaydi — hech qaysi standart porsiya sig'maydi. */
export const TAKLIF_ENG_KAM_KKAL = 80;

/** Bugun yana qancha yesa bo'ladi; normadan oshilgan bo'lsa 0 (manfiy bo'lmaydi). */
export function qolganKaloriya(jami: Pick<Jami, "kaloriya">, reja: Pick<Reja, "kaloriya">): number {
  return Math.max(0, reja.kaloriya - jami.kaloriya);
}

export type TaomTaklifi = { taom: Taom; miqdor: number; porsiya: PorsiyaHisobi };

/** API javobi: PRO'ga taklif (yoki mos taom yo'q bo'lsa null), qolganlarga qulf. */
export type TaklifJavobi = { yopiq: true } | { yopiq: false; taklif: TaomTaklifi | null };

/**
 * Qolgan kaloriyaga sig'adigan taom: taomlar bazasidagi standart porsiyalar ichida
 * kaloriyasi qolganga eng yaqin, lekin oshmaydigani. Teng kelsa — ro'yxatda birinchisi.
 */
export function taomTaklifi(taomlar: readonly Taom[], qolgan: number): TaomTaklifi | null {
  if (qolgan < TAKLIF_ENG_KAM_KKAL) return null;
  let eng: TaomTaklifi | null = null;
  for (const taom of taomlar) {
    for (const miqdor of taom.porsiyalar) {
      const porsiya = porsiyaHisobi(taom, miqdor);
      if (porsiya.kaloriya > qolgan || porsiya.kaloriya <= 0) continue;
      if (!eng || porsiya.kaloriya > eng.porsiya.kaloriya) eng = { taom, miqdor, porsiya };
    }
  }
  return eng;
}

export type PorsiyaTavsiyasi = {
  miqdor: number;
  kaloriya: number;
  /** Byudjet ko'proqqa yo'l qo'yardi, lekin odatdagi katta porsiya shifti ushladi. */
  chegaralangan: boolean;
};

/**
 * Shu taomdan qolgan kaloriyaga sig'adigan miqdor (E5, PRO). Shifti — taomning eng katta
 * standart porsiyasi: chegarasiz hisob "710 g osh" deydi, bu arifmetikaga to'g'ri, likopga emas.
 * Gramm/millilitr 10 ga, sanoq birligi butunga yaxlitlanadi (pastga).
 */
export function porsiyaTavsiyasi(taom: Taom, qolgan: number): PorsiyaTavsiyasi | null {
  if (qolgan <= 0 || taom.olchovMiqdori <= 0 || taom.kaloriya <= 0 || taom.porsiyalar.length === 0) {
    return null;
  }
  const birlikKaloriyasi = taom.kaloriya / taom.olchovMiqdori;
  const xom = qolgan / birlikKaloriyasi;
  const ogirlikda = taom.olchovBirligi === "g" || taom.olchovBirligi === "ml";
  const sigadi = ogirlikda ? Math.floor(xom / 10) * 10 : Math.floor(xom);
  if (sigadi <= 0) return null;
  const shift = Math.max(...taom.porsiyalar);
  const miqdor = Math.min(sigadi, shift);
  return {
    miqdor,
    kaloriya: porsiyaHisobi(taom, miqdor).kaloriya,
    chegaralangan: sigadi > shift,
  };
}
