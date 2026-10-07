// Admin paneli ekranlari (A2 ro'yxat, A3 karta) uchun sof hisob — bazaga bog'lanmagan,
// klient komponentlar ham shu yerdan import qiladi. Panel faqat o'zbekcha (admin-tz.md §1).

import type { Tarif } from "./huquqlar.ts";
import { toshkentSanasi } from "./yozuv-hisob.ts";

export const FOYDALANUVCHI_FILTRLARI = ["hammasi", "free", "pro", "bloklangan"] as const;
export type FoydalanuvchiFiltri = (typeof FOYDALANUVCHI_FILTRLARI)[number];

/** So'rovdagi noma'lum qiymat — hammasi. */
export function filtrniOqi(qiymat: unknown): FoydalanuvchiFiltri {
  return FOYDALANUVCHI_FILTRLARI.find((filtr) => filtr === qiymat) ?? "hammasi";
}

/** Chipdagi nom (prototip: Hammasi · FREE · PRO · Bloklangan). */
export const FILTR_NOMLARI: Record<FoydalanuvchiFiltri, string> = {
  hammasi: "Hammasi",
  free: "FREE",
  pro: "PRO",
  bloklangan: "Bloklangan",
};

/** A2 sahifalash: 50 tadan (admin-tz.md). */
export const SAHIFA_HAJMI = 50;

/** So'rovdagi sahifa raqami: 1 dan boshlanadi, yaroqsiz qiymat — 1. */
export function sahifaniOqi(qiymat: unknown): number {
  const son = Number(qiymat);
  return Number.isInteger(son) && son >= 1 ? son : 1;
}

/** Qidiruv matni: bo'shliqlar olib tashlanadi, 64 belgigacha; bo'sh — null. */
export function qidiruvniOqi(qiymat: unknown): string | null {
  if (typeof qiymat !== "string") return null;
  const matn = qiymat.trim().slice(0, 64);
  return matn === "" ? null : matn;
}

/** Jadvaldagi "Rol" ustuni (prototip): bloklangan hamma narsadan ustun, keyin PRO, qolgani FREE. */
export type FoydalanuvchiHolati = "free" | "pro" | "bloklangan";

export function foydalanuvchiHolati(bloklangan: boolean, pro: boolean): FoydalanuvchiHolati {
  if (bloklangan) return "bloklangan";
  return pro ? "pro" : "free";
}

export const HOLAT_NOMLARI: Record<FoydalanuvchiHolati, string> = {
  free: "FREE",
  pro: "PRO",
  bloklangan: "Bloklangan",
};

/** `obunalar.manba`: to'lov orqali yoki admin paneldan qo'lda. */
export type ObunaManbai = "tolov" | "qolda";

export function manbaniOqi(qiymat: string): ObunaManbai {
  return qiymat === "qolda" ? "qolda" : "tolov";
}

/** A1 jurnalidagi amal nomi (prototip: "PRO berildi — Kamola Tosheva"). */
export const AMAL_NOMLARI: Record<string, string> = {
  pro_berish: "PRO berildi",
  muddat_uzaytirish: "Muddat uzaytirildi",
  pro_olish: "PRO olib qo'yildi",
  bloklash: "Bloklandi",
  blok_yechish: "Blok yechildi",
  hisob_ochirish: "Hisob o'chirildi",
  taom_qoshish: "Taom qo'shildi",
  taom_tahrir: "Taom tahrirlandi",
  retsept_qoshish: "Retsept qo'shildi",
  retsept_tahrir: "Retsept tahrirlandi",
  retsept_chop_etish: "Retsept chop etildi",
};

export function amalNomi(tur: string): string {
  return AMAL_NOMLARI[tur] ?? tur;
}

/** Tarifning paneldagi nomi; tarifsiz muddat (uzaytirish, boshqa muddat) — "Qo'lda". */
export function tarifMatni(tarif: Tarif | string): string {
  switch (tarif) {
    case "oylik":
      return "Oylik";
    case "yarim_yillik":
      return "6 oylik";
    case "yillik":
      return "Yillik";
    default:
      return "Qo'lda";
  }
}

/** Jadvaldagi sana: "2026-01-08" (Toshkent kuni). Prototip ro'yxati shu ko'rinishda. */
export function sanaMatni(iso: string): string {
  return toshkentSanasi(new Date(iso));
}

/** Obuna tugaydigan kun: tugash aynan yarim tunga to'g'ri kelsa oxirgi to'liq kun (F4 bilan bir xil). */
export function tugashKuni(iso: string): string {
  return toshkentSanasi(new Date(Date.parse(iso) - 1));
}

/** A3 yozuvlar jadvalidagi vaqt: "13.09 08:20" (Toshkent). */
export function kunOyVaqt(iso: string): string {
  const [, oy, kun] = toshkentSanasi(new Date(iso)).split("-");
  const vaqt = new Date(Date.parse(iso) + SILJISH_MS).toISOString().slice(11, 16);
  return `${kun}.${oy} ${vaqt}`;
}

const KUN_MS = 24 * 60 * 60 * 1000;
/** Toshkent UTC+5, yozgi vaqt yo'q. */
const SILJISH_MS = 5 * 60 * 60 * 1000;

/**
 * "Oxirgi faollik" ustuni: hodisalardagi oxirgi kun bugunga nisbatan — "bugun", "kecha",
 * "N kun oldin"; hech qachon kirmagan (eski hisob) — "—".
 */
export function faollikMatni(sana: string | null, bugun: string): string {
  if (!sana) return "—";
  const farq = Math.round((Date.parse(bugun) - Date.parse(sana)) / KUN_MS);
  if (farq <= 0) return "bugun";
  if (farq === 1) return "kecha";
  return `${farq} kun oldin`;
}

/** Jadval tagidagi "50 tadan 1–50" matni; bo'sh ro'yxatda "0". */
export function sahifaMatni(sahifa: number, jami: number, hajm = SAHIFA_HAJMI): string {
  if (jami === 0) return "0";
  const boshi = (sahifa - 1) * hajm + 1;
  const oxiri = Math.min(sahifa * hajm, jami);
  return `${jami} tadan ${boshi}–${oxiri}`;
}

/** Jami sahifalar soni, kamida 1. */
export function sahifalarSoni(jami: number, hajm = SAHIFA_HAJMI): number {
  return Math.max(1, Math.ceil(jami / hajm));
}

/** Telegram ID matn ko'rinishida (JSON'da BigInt yo'q); yo'q bo'lsa "—". */
export function telegramIdMatni(telegramId: string | null): string {
  return telegramId ?? "—";
}

/** "1 870" — raqamlar o'zbekcha guruhlanadi. */
export function son(qiymat: number): string {
  return new Intl.NumberFormat("uz-Latn-UZ").format(qiymat);
}

/** Profil kartasidagi til nomi — o'z tilida, prototipdagidek. */
export function tilMatni(til: string): string {
  switch (til) {
    case "ru":
      return "Русский";
    case "en":
      return "English";
    default:
      return "O'zbekcha";
  }
}
