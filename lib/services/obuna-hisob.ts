// Obuna ekrani (F4, profil-tz.md) uchun sof hisob — bazaga bog'lanmagan.

import type { Kalit } from "../lugat/tarjima.ts";
import type { ObunaHolati, Tarif } from "./huquqlar.ts";
import { toshkentSanasi } from "./yozuv-hisob.ts";

/**
 * `GET /api/obuna` javobi. JSON'da sana matn bo'lib keladi, shuning uchun sanalar — ISO matn.
 * `muddat` faqat faol PRO'da bor.
 */
export type ObunaTafsiloti = {
  holat: ObunaHolati["holat"];
  muddat: { tarif: Tarif; boshlanish: string; tugash: string } | null;
};

const TARIF_NOMLARI: Record<Exclude<Tarif, "qolda">, Kalit> = {
  oylik: "Oylik",
  yarim_yillik: "6 oylik",
  yillik: "Yillik",
};

/** Tarifning lug'atdagi nomi; admin qo'lda bergan obunada tarif yo'q — null. */
export function tarifNomi(tarif: Tarif): Kalit | null {
  return tarif === "qolda" ? null : TARIF_NOMLARI[tarif];
}

/** Toshkent vaqti bo'yicha sana: "14.09.2026". */
export function nuqtaliSana(iso: string): string {
  return toshkentSanasi(new Date(iso)).split("-").reverse().join(".");
}

/**
 * Obuna tugaydigan kun. Tugash lahzasi aynan yarim tunga to'g'ri kelsa, oxirgi to'liq kun
 * ko'rsatiladi — F1 kartasidagi "…gacha faol" bilan bir xil kun chiqsin (`tugashKuni`).
 */
export function tugashSanasi(iso: string): string {
  return nuqtaliSana(new Date(Date.parse(iso) - 1).toISOString());
}
