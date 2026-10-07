// Foydalanuvchi tomonidagi retseptlar (R1–R3) uchun sof hisob — bazaga bog'lanmagan, server
// sahifa va klient komponentlar ham shu yerdan import qiladi. Kontent (nom, masalliqlar,
// qadamlar) foydalanuvchi tilida beriladi; tarjimasi bo'sh bo'lsa o'zbekcha qoladi.

import { k, type Kalit, type Til } from "../lugat/tarjima.ts";
import type { Murakkablik, UchTilda } from "./retsept-admin-hisob.ts";

/** Uch tildagi matndan foydalanuvchi tilidagisi; bo'sh bo'lsa o'zbekcha. */
export function matnTilda(uz: string, ru: string, en: string, til: Til): string {
  const matn = til === "ru" ? ru : til === "en" ? en : uz;
  return matn.trim() || uz;
}

/** Uch tildagi ro'yxatdan foydalanuvchi tilidagisi; bo'sh bo'lsa o'zbekcha. */
export function royxatTilda(royxat: UchTilda, til: Til): string[] {
  const tanlangan = royxat[til];
  return tanlangan.length > 0 ? tanlangan : royxat.uz;
}

/** Murakkablik — lug'at kaliti (prototip `t(recipe.murakkab)`). */
export const MURAKKABLIK_KALITLARI: Record<Murakkablik, Kalit> = {
  oson: k("Oson"),
  orta: k("O'rta"),
  qiyin: k("Qiyin"),
};

export function murakkablikKaliti(qiymat: string | null): Kalit | null {
  return qiymat && qiymat in MURAKKABLIK_KALITLARI ? MURAKKABLIK_KALITLARI[qiymat as Murakkablik] : null;
}

/** R1 kartasi — FREE'ga ham ko'rinadigan maydonlar (admin-tz.md A9: sarlavha, rasm, kaloriya, vaqt). */
export type RetseptKartasi = {
  id: string;
  nomi: string;
  kategoriya: string | null;
  kaloriya: number | null;
  vaqtDaqiqa: number | null;
  murakkablik: string | null;
  rasm: string | null;
  sevimli: boolean;
};

/** PRO imkoniyatlari qulfi: `true` — yopiq (prototip `proOpen` teskarisi, QulfJavobi kabi). */
export type RetseptQulfi = { toliqMatn: boolean; sevimli: boolean };

export type RetseptlarJavobi = {
  retseptlar: RetseptKartasi[];
  /** Chop etilgan retseptlardagi kategoriyalar — chiplar tartibi, takrorsiz. */
  kategoriyalar: string[];
  qulf: RetseptQulfi;
};

/** R3 — PRO'ga to'liq retsept. */
export type RetseptOchiq = RetseptKartasi & {
  yopiq: false;
  porsiya: string;
  oqsil: number | null;
  yog: number | null;
  uglevod: number | null;
  masalliqlar: string[];
  qadamlar: string[];
};

/** R2 — FREE'ga faqat sarlavha va sonlar; matn serverdan chiqmaydi. */
export type RetseptYopiq = RetseptKartasi & {
  yopiq: true;
  porsiya: string;
  masalliqSoni: number;
  qadamSoni: number;
};

export type RetseptDetali = RetseptOchiq | RetseptYopiq;

export type RetseptDetaliJavobi = { retsept: RetseptDetali; qulf: RetseptQulfi };

/** R1 chiplari: "sevimli" va "hammasi" — maxsus, qolgani kategoriya nomi (bazadagi qiymat). */
export const SEVIMLI_CHIPI = "sevimli";
export const HAMMASI_CHIPI = "hammasi";

/** `?kat=` qiymati: bo'sh yoki noma'lum — hammasi. Kategoriya nomi bazadagi ro'yxatda bo'lishi shart. */
export function chipniOqi(qiymat: unknown, kategoriyalar: readonly string[]): string {
  if (typeof qiymat !== "string") return HAMMASI_CHIPI;
  const toza = qiymat.trim();
  if (toza === SEVIMLI_CHIPI) return SEVIMLI_CHIPI;
  return kategoriyalar.includes(toza) ? toza : HAMMASI_CHIPI;
}

/** Tanlangan chip bo'yicha kartalar. Sevimli yopiq bo'lsa ro'yxat bo'sh. */
export function chipBoyicha(
  retseptlar: readonly RetseptKartasi[],
  chip: string,
  sevimliOchiq: boolean,
): RetseptKartasi[] {
  if (chip === SEVIMLI_CHIPI) return sevimliOchiq ? retseptlar.filter((r) => r.sevimli) : [];
  if (chip === HAMMASI_CHIPI) return [...retseptlar];
  return retseptlar.filter((r) => r.kategoriya === chip);
}

/** R1 manzili: "hammasi" yozilmaydi. */
export function retseptlarManzili(chip: string): string {
  return chip === HAMMASI_CHIPI ? "/retseptlar" : `/retseptlar?kat=${encodeURIComponent(chip)}`;
}

/** Chop etilgan retseptlardagi kategoriyalar — birinchi uchrash tartibida, takrorsiz. */
export function kategoriyalarRoyxati(retseptlar: readonly { kategoriya: string | null }[]): string[] {
  const korildi = new Set<string>();
  for (const r of retseptlar) if (r.kategoriya) korildi.add(r.kategoriya);
  return [...korildi];
}

/** Retsept rasmi hamma uchun ochiq yo'l (app/api/retsept-rasmlari); `v` — brauzer keshini yangilash uchun. */
export function retseptRasmYoli(id: string, yangilanganMs: number): string {
  return `/api/retsept-rasmlari/${id}?v=${yangilanganMs}`;
}
