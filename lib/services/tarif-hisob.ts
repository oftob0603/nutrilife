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

/** Oldindan tanlanadigan tarif: tavsiya etilgani, bo'lmasa birinchisi. */
export function boshlangichTarif(tariflar: TarifNarxi[]): TarifNarxi["id"] | null {
  return (tariflar.find((tarif) => tarif.tavsiya) ?? tariflar[0])?.id ?? null;
}

/** Paywall qayerdan ochilgani — sarlavha va "Hozir emas" qaytadigan joy shunga bog'liq. */
export const PAYWALL_MANBALARI = ["onboarding", "profil", "limit", "imkoniyat"] as const;
export type PaywallManbai = (typeof PAYWALL_MANBALARI)[number];

/** So'rovdagi noma'lum qiymat — profil (foydalanuvchi o'zi kelgan). */
export function manbaniOqi(qiymat: unknown): PaywallManbai {
  return PAYWALL_MANBALARI.find((manba) => manba === qiymat) ?? "profil";
}

const SARLAVHALAR: Record<PaywallManbai, Kalit> = {
  onboarding: k("Nutrilife PRO bilan ko'proq"),
  profil: k("Nutrilife PRO"),
  limit: k("Bepul skanlar tugadi"),
  // Home'dagi yopiq PRO kartasidan (Nutrition Score, taom taklifi).
  imkoniyat: k("Nutrilife PRO"),
};

/** W1 sarlavhasi; muddati tugagan PRO'da manbadan qat'i nazar "PRO ni tiklash". */
export function paywallSarlavhasi(manba: PaywallManbai, muddatiTugagan: boolean): Kalit {
  return muddatiTugagan ? k("PRO ni tiklash") : SARLAVHALAR[manba];
}

/** "Hozir emas" qaytaradigan sahifa — paywall hech qachon tupik emas. */
export function paywallQaytishi(manba: PaywallManbai): string {
  return manba === "profil" ? "/profil" : "/";
}
