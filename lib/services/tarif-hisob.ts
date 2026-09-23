// Tariflar ekrani (W1, paywall-tz.md) uchun sof hisob. Kartadagi har bir son narxdan
// hisoblanadi — narx o'zgarsa oylik qiymat ham, tejash foizi ham o'zi o'zgaradi.

import { k, type Kalit } from "../lugat/tarjima.ts";
import type { TarifNarxi } from "../tariflar.ts";

/** Oyiga tushadigan narx, 100 so'mgacha yaxlitlangan — ilova tiyin ko'rsatmaydi. */
export function oyiga({ narx, oylar }: TarifNarxi): number {
  return Math.round(narx / oylar / 100) * 100;
}

/** Oylik tarifga nisbatan tejash, foizda; oylik tarifning o'zida va oylik narx noma'lum bo'lsa 0. */
export function tejash({ narx, oylar }: TarifNarxi, oylikNarx: number): number {
  if (!oylikNarx || oylar === 1) return 0;
  return Math.max(0, Math.round((1 - narx / (oylikNarx * oylar)) * 100));
}

/** Ro'yxatdagi oylik tarif narxi; yo'q bo'lsa 0 — tejash ko'rsatilmaydi. */
export function oylikNarx(tariflar: TarifNarxi[]): number {
  return tariflar.find((tarif) => tarif.oylar === 1)?.narx ?? 0;
}

/** Paywall qayerdan ochilgani — sarlavha va "Hozir emas" qaytadigan joy shunga bog'liq. */
export const PAYWALL_MANBALARI = ["onboarding", "profil", "limit", "imkoniyat"] as const;
export type PaywallManbai = (typeof PAYWALL_MANBALARI)[number];

/** So'rovdagi noma'lum qiymat — profil (foydalanuvchi o'zi kelgan). */
export function manbaniOqi(qiymat: unknown): PaywallManbai {
  return PAYWALL_MANBALARI.find((manba) => manba === qiymat) ?? "profil";
}

const SARLAVHALAR: Record<PaywallManbai, Kalit> = {
  onboarding: k("NutriLifer PRO bilan ko'proq"),
  profil: k("NutriLifer PRO"),
  limit: k("Bepul skanlar tugadi"),
  // Home'dagi yopiq PRO kartasidan (Nutrition Score, taom taklifi).
  imkoniyat: k("NutriLifer PRO"),
};

/** W1 sarlavhasi; muddati tugagan PRO'da manbadan qat'i nazar "PRO ni tiklash". */
export function paywallSarlavhasi(manba: PaywallManbai, muddatiTugagan: boolean): Kalit {
  return muddatiTugagan ? k("PRO ni tiklash") : SARLAVHALAR[manba];
}

/**
 * Paywall'dan chiqishda zaxira sahifa: onboardingdan kelinganda yoki ilova tarixi bo'lmaganda
 * (odatda "Hozir emas" va orqaga tugmasi kelgan sahifaga qaytaradi) — tupik bo'lmasin.
 */
export function paywallQaytishi(manba: PaywallManbai): string {
  return manba === "profil" ? "/profil" : "/";
}

/** Telegram username (5–32 belgi: harf, raqam, _); boshidagi @ olib tashlanadi. Noto'g'ri — null. */
export function adminUsername(qiymat: string | undefined): string | null {
  const username = qiymat?.trim().replace(/^@/, "") ?? "";
  return /^[A-Za-z0-9_]{5,32}$/.test(username) ? username : null;
}

/** Tayyor xabardagi narx: "290 000" — minglar bo'sh joy bilan. */
export function xabarNarxi(narx: number): string {
  return Math.round(narx).toLocaleString("en-US").replaceAll(",", " ");
}

/**
 * Admin bilan chat havolasi, xabar maydonida tayyor matn bilan (DECISIONS 2026-09-22:
 * to'lov tizimlari ulanguncha obuna admin orqali qo'lda rasmiylashtiriladi).
 */
export function adminHavolasi(username: string, matn: string): string {
  return `https://t.me/${username}?text=${encodeURIComponent(matn)}`;
}
