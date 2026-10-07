// Tarif narxlari — `tariflar` jadvalidan (S6 A12). W1 paywall (`GET /api/tariflar`), PRO berish
// (obuna qatoriga narx surati) va admin A12 shu yerdan o'qiydi.

import { db } from "../db.ts";
import { tarifIdmi, type TarifNarxi } from "../tariflar.ts";

/** Uch tarif ekran tartibida; notanish id'li qator (bo'lmasligi kerak) tashlab yuboriladi. */
export async function tariflarniOl(): Promise<TarifNarxi[]> {
  const qatorlar = await db.tarifNarxi.findMany({ orderBy: { tartib: "asc" } });
  const tariflar: TarifNarxi[] = [];
  for (const q of qatorlar) {
    if (!tarifIdmi(q.id)) continue;
    tariflar.push({ id: q.id, narx: q.narx, oylar: q.oylar, ...(q.tavsiya && { tavsiya: true as const }) });
  }
  return tariflar;
}
