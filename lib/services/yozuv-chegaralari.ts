// Bitta ovqat yozuvi qiymatlarining chegaralari — yagona manba: server (`yozuv-kirish.ts`),
// tasdiq/tahrir formasi (`yozuv-forma.ts`) va E5 porsiya tanlagichi shu yerdan o'qiydi.
// Maqsad — xato terishdan himoya ("2500" o'rniga "25000"), oddiy ovqat bularga yetmaydi.
// Sof modul: bazaga bog'liq emas.

import { VAZN_CHEGARASI } from "./skan-hisob.ts";

/** Bitta yozuvning eng katta kaloriyasi, kkal. */
export const KALORIYA_CHEGARASI = 5000;

/** Bitta yozuvdagi oqsil, yog' yoki uglevodning eng kattasi, g. */
export const MAKRO_CHEGARASI = 500;

/** Dona, bo'lak, kosa kabi sanoq birliklarida eng katta miqdor. */
export const SANOQ_CHEGARASI = 50;

const VAZN_BIRLIKLARI = ["g", "ml", "г", "мл"];

/** Birlikka qarab eng katta miqdor: gramm va millilitrda 5000, sanoq birliklarida 50. */
export function miqdorChegarasi(birlik: string): number {
  return VAZN_BIRLIKLARI.includes(birlik.trim().toLowerCase()) ? VAZN_CHEGARASI : SANOQ_CHEGARASI;
}

/** Miqdor yaroqli: 0 dan katta va birlik chegarasidan oshmagan son. */
export function miqdorYaroqli(miqdor: number, birlik: string): boolean {
  return Number.isFinite(miqdor) && miqdor > 0 && miqdor <= miqdorChegarasi(birlik);
}

const PORSIYA_QOLIPI = /^\s*(-?\d+(?:[.,]\d+)?)\s*(.*)$/;

/**
 * Yozuvdagi porsiya matni ("350 g", "2 dona") yaroqlimi. Son bilan boshlanmagan erkin matn
 * ("yarim kosa") tekshirilmaydi — unda miqdor yo'q.
 */
export function porsiyaMatniYaroqli(porsiya: string): boolean {
  const mos = PORSIYA_QOLIPI.exec(porsiya);
  if (!mos) return true;
  return miqdorYaroqli(Number(mos[1].replace(",", ".")), mos[2] || "g");
}
