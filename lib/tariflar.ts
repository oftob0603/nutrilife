// PRO tariflari va narxlari. Admin paneli (S6, A12) qurilguncha narxlarning yagona manbai shu
// fayl (DECISIONS 2026-09-21) — ekran ularni `GET /api/tariflar` orqali oladi, shuning uchun
// S6'da faqat shu manba bazaga almashadi.

import type { Tarif } from "./services/huquqlar.ts";

export type TarifNarxi = {
  id: Exclude<Tarif, "qolda">;
  /** So'mda. */
  narx: number;
  oylar: number;
  /** Oldindan tanlangan va "Tavsiya etiladi" belgisi bilan chiqadi (PRD 8-bo'lim). */
  tavsiya?: true;
};

export const TARIF_NARXLARI: TarifNarxi[] = [
  { id: "oylik", narx: 39_000, oylar: 1 },
  { id: "yarim_yillik", narx: 170_000, oylar: 6 },
  { id: "yillik", narx: 290_000, oylar: 12, tavsiya: true },
];
