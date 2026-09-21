// Profil ekrani (F1, profil-tz.md) uchun sof hisob — bazaga bog'lanmagan.

import type { ObunaHolati, Rol } from "./huquqlar.ts";
import { kgdanLb, MAQSADLAR } from "./onboarding-hisob.ts";
import { toshkentSanasi } from "./yozuv-hisob.ts";

/** `GET /api/profil` javobi. JSON'da sana matn bo'lib keladi, shuning uchun `tugash` — ISO matn. */
export type Profil = {
  ism: string | null;
  avatarUrl: string | null;
  ilovadaKun: number;
  rol: Rol;
  obuna: { holat: ObunaHolati["holat"]; tugash: string | null };
  maqsad: string | null;
  /** Kilogrammda; ko'rsatishda `birliklar` bo'yicha o'giriladi. */
  joriyVazn: number | null;
  maqsadVazn: number | null;
  birliklar: string;
};

const KUN_MS = 24 * 60 * 60 * 1000;

/** Ro'yxatdan o'tgan kun — 1-kun; kun Toshkent kalendari bo'yicha almashadi. */
export function ilovadaKun(yaratilgan: Date, hozir: Date = new Date()): number {
  const boshi = Date.parse(`${toshkentSanasi(yaratilgan)}T00:00:00.000Z`);
  const bugun = Date.parse(`${toshkentSanasi(hozir)}T00:00:00.000Z`);
  return Math.max(1, Math.round((bugun - boshi) / KUN_MS) + 1);
}

export function maqsadNomi(maqsad: string | null): string | null {
  return MAQSADLAR.find((variant) => variant.qiymat === maqsad)?.nomi ?? null;
}

/** "84,5 kg" yoki "186 lb" — onboardingdagi bilan bir xil yaxlitlash. */
export function vaznMatni(kg: number, birliklar: string): string {
  if (birliklar === "imperial") return `${kgdanLb(kg)} lb`;
  return `${(Math.round(kg * 10) / 10).toString().replace(".", ",")} kg`;
}

const OYLAR = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

/**
 * Obuna tugaydigan kun: "21-oktabr". Tugash lahzasi aynan yarim tunga to'g'ri kelsa, oxirgi
 * to'liq kun ko'rsatiladi — "21-oktabrgacha faol" deyilgan kuni PRO hali ishlab turishi kerak.
 */
export function tugashKuni(tugash: string): string {
  const sana = toshkentSanasi(new Date(Date.parse(tugash) - 1));
  return `${Number(sana.slice(8))}-${OYLAR[Number(sana.slice(5, 7)) - 1]}`;
}

/** Obuna kartasidagi sarlavha (profil-tz.md, F1). */
export function obunaSarlavhasi(obuna: Profil["obuna"]): string {
  if (obuna.holat === "pro" && obuna.tugash) return `PRO · ${tugashKuni(obuna.tugash)}gacha faol`;
  if (obuna.holat === "tugagan") return "PRO muddati tugadi · tarix ochiq qoladi";
  return "Bepul reja";
}
