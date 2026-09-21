// Profil sahifasidagi sozlama qatorlari (profil-tz.md F2; prototipda alohida sahifa emas).
// Sof modul — bazaga bog'liq emas, klient ham, server ham ishlatadi.

import { TILLAR, type Til } from "../lugat/tarjima.ts";
import { MAVZULAR, type Mavzu } from "../mavzu.ts";

export const VAZN_BIRLIKLARI = ["kg", "lb"] as const;
export const BOY_BIRLIKLARI = ["sm", "ft"] as const;

export type VaznBirligi = (typeof VAZN_BIRLIKLARI)[number];
export type BoyBirligi = (typeof BOY_BIRLIKLARI)[number];

/** Birlik faqat ko'rsatish qatlami: baza doim kg va sm da saqlaydi. */
export type Sozlamalar = {
  til: Til;
  mavzu: Mavzu;
  vaznBirligi: VaznBirligi;
  boyBirligi: BoyBirligi;
};

export type SozlamaKaliti = keyof Sozlamalar;

/** Til nomi o'z tilida turadi — interfeys qaysi tilda bo'lsa ham «Русский» «Русский» bo'lib qoladi. */
export const TIL_NOMLARI: Record<Til, string> = {
  uz: "O'zbekcha",
  ru: "Русский",
  en: "English",
};

export const SOZLAMA_VARIANTLARI: { [K in SozlamaKaliti]: readonly Sozlamalar[K][] } = {
  til: TILLAR,
  mavzu: MAVZULAR,
  vaznBirligi: VAZN_BIRLIKLARI,
  boyBirligi: BOY_BIRLIKLARI,
};

function variantdan<T extends string>(royxat: readonly T[], qiymat: unknown, zaxira: T): T {
  return royxat.find((variant) => variant === qiymat) ?? zaxira;
}

/** Bazadagi matn ustunlari -> sozlamalar; notanish qiymat standartga tushadi. */
export function sozlamalarniOqi(qator: {
  til: string;
  mavzu: string;
  vaznBirligi: string;
  boyBirligi: string;
}): Sozlamalar {
  return {
    til: variantdan(TILLAR, qator.til, "uz"),
    mavzu: variantdan(MAVZULAR, qator.mavzu, "tizim"),
    vaznBirligi: variantdan(VAZN_BIRLIKLARI, qator.vaznBirligi, "kg"),
    boyBirligi: variantdan(BOY_BIRLIKLARI, qator.boyBirligi, "sm"),
  };
}

/**
 * `PATCH /api/profil/sozlamalar` tanasini tekshiradi: kamida bitta sozlama, har biri o'z
 * variantlaridan. Notanish maydon yoki qiymat — butun so'rov rad etiladi.
 */
export function sozlamaniTekshir(tana: Record<string, unknown>): Partial<Sozlamalar> | null {
  const ozgarish: Record<string, string> = {};
  for (const [kalit, qiymat] of Object.entries(tana)) {
    if (!Object.hasOwn(SOZLAMA_VARIANTLARI, kalit)) return null;
    const variantlar: readonly string[] = SOZLAMA_VARIANTLARI[kalit as SozlamaKaliti];
    if (typeof qiymat !== "string" || !variantlar.includes(qiymat)) return null;
    ozgarish[kalit] = qiymat;
  }
  return Object.keys(ozgarish).length > 0 ? (ozgarish as Partial<Sozlamalar>) : null;
}
