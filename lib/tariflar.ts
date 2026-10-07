// PRO tariflari: identifikatorlar, muddatlar va boshlang'ich narxlar. S6 A12 dan narxlarning
// yagona manbai `tariflar` jadvali (lib/services/narxlar.ts) — bu yerdagi qiymatlar faqat
// migratsiya seed'i va muddat (oylar) uchun; ekran narxni `GET /api/tariflar` orqali oladi.

import type { Tarif } from "./services/huquqlar.ts";

/** Narxi bor tariflar — "qolda" (admin bergan tarifsiz muddat) bu yerga kirmaydi. */
export type TarifId = Exclude<Tarif, "qolda">;

export type TarifNarxi = {
  id: TarifId;
  /** So'mda. */
  narx: number;
  oylar: number;
  /** Oldindan tanlangan va "Tavsiya etiladi" belgisi bilan chiqadi (PRD 8-bo'lim). */
  tavsiya?: true;
};

/** Ekranlardagi tartib: oylik · 6 oylik · yillik. */
export const TARIF_IDLARI: readonly TarifId[] = ["oylik", "yarim_yillik", "yillik"];

/** Tarif muddati oylarda — o'zgarmas, A12 faqat narxni o'zgartiradi. */
export const TARIF_OYLARI: Record<TarifId, number> = { oylik: 1, yarim_yillik: 6, yillik: 12 };

/** Migratsiya seed'i bilan bir xil boshlang'ich narxlar (s6_tariflar_narx). */
export const BOSHLANGICH_TARIFLAR: TarifNarxi[] = [
  { id: "oylik", narx: 39_000, oylar: 1 },
  { id: "yarim_yillik", narx: 170_000, oylar: 6 },
  { id: "yillik", narx: 290_000, oylar: 12, tavsiya: true },
];

export function tarifIdmi(qiymat: unknown): qiymat is TarifId {
  return (TARIF_IDLARI as readonly string[]).includes(qiymat as string);
}
