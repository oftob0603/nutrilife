// Profil ekrani (F1, profil-tz.md) uchun sof hisob — bazaga bog'lanmagan.

import type { Kalit, Tarjimon, Til } from "../lugat/tarjima.ts";
import type { ObunaHolati, Rol } from "./huquqlar.ts";
import { kgdanLb, MAQSADLAR, type OvqatlanishOdati } from "./onboarding-hisob.ts";
import type { Sozlamalar } from "./sozlamalar-hisob.ts";
import { kunOyMatni, toshkentSanasi } from "./yozuv-hisob.ts";

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
  /** Amaldagi kunlik norma, kkal (`rejalar` ning oxirgi qatori); hali hisoblanmagan bo'lsa null. */
  norma: number | null;
  sozlamalar: Sozlamalar;
  /** Shaxsiy ma'lumot (F3) — onboarding javoblari; bo'y santimetrda. */
  jins: string | null;
  yosh: number | null;
  boyi: number | null;
  faollik: string | null;
  ovqatAfzalliklari: string[];
  ovqatlanishOdati: OvqatlanishOdati | null;
};

const KUN_MS = 24 * 60 * 60 * 1000;

/** Ro'yxatdan o'tgan kun — 1-kun; kun Toshkent kalendari bo'yicha almashadi. */
export function ilovadaKun(yaratilgan: Date, hozir: Date = new Date()): number {
  const boshi = Date.parse(`${toshkentSanasi(yaratilgan)}T00:00:00.000Z`);
  const bugun = Date.parse(`${toshkentSanasi(hozir)}T00:00:00.000Z`);
  return Math.max(1, Math.round((bugun - boshi) / KUN_MS) + 1);
}

/** Maqsadning lug'atdagi nomi (o'zbekcha kalit) — ekranda `t()` bilan ko'rsatiladi. */
export function maqsadNomi(maqsad: string | null): Kalit | null {
  return MAQSADLAR.find((variant) => variant.qiymat === maqsad)?.nomi ?? null;
}

/** "84,5 kg", "85,0 kg" (prototip `kg1` — doim bitta kasr xona) yoki "186 lb". Inglizchada kasr nuqta bilan. */
export function vaznMatni(
  kg: number,
  birlik: Sozlamalar["vaznBirligi"],
  { til, t }: Tarjimon,
): string {
  if (birlik === "lb") return `${kgdanLb(kg)} lb`;
  const son = kg.toFixed(1);
  return `${til === "en" ? son : son.replace(".", ",")} ${t("kg")}`;
}

/**
 * Obuna tugaydigan kun: "21-oktabr". Tugash lahzasi aynan yarim tunga to'g'ri kelsa, oxirgi
 * to'liq kun ko'rsatiladi — "21-oktabrgacha faol" deyilgan kuni PRO hali ishlab turishi kerak.
 */
export function tugashKuni(tugash: string, til: Til = "uz"): string {
  return kunOyMatni(toshkentSanasi(new Date(Date.parse(tugash) - 1)), til);
}

/** Obuna kartasidagi sarlavha (profil-tz.md, F1). */
export function obunaSarlavhasi(obuna: Profil["obuna"], { til, t }: Tarjimon): string {
  if (obuna.holat === "pro" && obuna.tugash) {
    return t("PRO · {0}gacha faol", tugashKuni(obuna.tugash, til));
  }
  if (obuna.holat === "tugagan") return t("PRO muddati tugadi · tarix ochiq qoladi");
  return t("Bepul reja");
}
