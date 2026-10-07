// Admin paneldan obunani qo'lda boshqarish (S6 3-task, admin-tz.md A3) uchun sof hisob —
// so'rovni tekshirish va muddat hisoblash. Bazaga bog'lanmagan, klient komponent ham import qiladi.

import { TARIF_OYLARI, tarifIdmi } from "../tariflar.ts";
import { tarifMatni, sanaMatni } from "./admin-hisob.ts";
import type { Tarif } from "./huquqlar.ts";

/** Sabab maydoni: majburiy, shunchagacha belgi (admin-tz.md §4). */
export const SABAB_CHEGARASI = 200;
/** "Boshqa muddat" kunlarda: 1 kundan 10 yilgacha. */
export const KUN_CHEGARASI = 3650;

/** PRO berish oynasidagi tarif tanlovi (prototip: Oylik · 6 oylik · Yillik · Boshqa muddat). */
export const BERISH_TARIFLARI: readonly { id: Tarif; nomi: string }[] = [
  { id: "oylik", nomi: "Oylik" },
  { id: "yarim_yillik", nomi: "6 oylik" },
  { id: "yillik", nomi: "Yillik" },
  { id: "qolda", nomi: "Boshqa muddat" },
];

/** Uzaytirish oynasidagi muddatlar (prototip: 1 oy · 3 oy · 6 oy · 1 yil) va "Boshqa" (kun). */
export const UZAYTIRISH_MUDDATLARI: readonly { id: string; nomi: string; oylar: number | null }[] = [
  { id: "1oy", nomi: "1 oy", oylar: 1 },
  { id: "3oy", nomi: "3 oy", oylar: 3 },
  { id: "6oy", nomi: "6 oy", oylar: 6 },
  { id: "1yil", nomi: "1 yil", oylar: 12 },
  { id: "boshqa", nomi: "Boshqa", oylar: null },
];

/** Muddat: oylarda (tarif yoki tayyor muddat) yoki kunlarda ("boshqa"). */
export type Muddat = { oylar: number } | { kunlar: number };

export type BerishSorovi = { tarif: Tarif; muddat: Muddat; sabab: string };
export type UzaytirishSorovi = { muddat: Muddat; sabab: string };

type Tekshiruv<T> = { sorov: T } | { xato: string };

function sababniOqi(qiymat: unknown): string | null {
  if (typeof qiymat !== "string") return null;
  const sabab = qiymat.trim();
  return sabab.length >= 1 && sabab.length <= SABAB_CHEGARASI ? sabab : null;
}

function kunlarniOqi(qiymat: unknown): number | null {
  const kunlar = typeof qiymat === "number" ? qiymat : Number(qiymat);
  return Number.isInteger(kunlar) && kunlar >= 1 && kunlar <= KUN_CHEGARASI ? kunlar : null;
}

/** Tarifning muddati oylarda (lib/tariflar.ts, o'zgarmas); "qolda" tarifsiz. */
export function tarifOylari(tarif: Tarif): number | null {
  return tarifIdmi(tarif) ? TARIF_OYLARI[tarif] : null;
}

/** `POST …/obuna` tanasi: `{ tarif, kunlar?, sabab }` — "qolda" tarifda kunlar shart. */
export function berishniTekshir(xom: unknown): Tekshiruv<BerishSorovi> {
  const tana = (typeof xom === "object" && xom !== null ? xom : {}) as Record<string, unknown>;
  const tarif = BERISH_TARIFLARI.find((t) => t.id === tana.tarif)?.id;
  if (!tarif) return { xato: "Tarifni tanlang" };
  const sabab = sababniOqi(tana.sabab);
  if (!sabab) return { xato: "Sababni yozing" };

  const oylar = tarifOylari(tarif);
  if (oylar !== null) return { sorov: { tarif, muddat: { oylar }, sabab } };
  const kunlar = kunlarniOqi(tana.kunlar);
  if (kunlar === null) return { xato: `Muddatni kunlarda kiriting (1–${KUN_CHEGARASI})` };
  return { sorov: { tarif, muddat: { kunlar }, sabab } };
}

/** `PATCH …/obuna` tanasi: `{ muddat, kunlar?, sabab }` — "boshqa" muddatda kunlar shart. */
export function uzaytirishniTekshir(xom: unknown): Tekshiruv<UzaytirishSorovi> {
  const tana = (typeof xom === "object" && xom !== null ? xom : {}) as Record<string, unknown>;
  const muddat = UZAYTIRISH_MUDDATLARI.find((m) => m.id === tana.muddat);
  if (!muddat) return { xato: "Muddatni tanlang" };
  const sabab = sababniOqi(tana.sabab);
  if (!sabab) return { xato: "Sababni yozing" };

  if (muddat.oylar !== null) return { sorov: { muddat: { oylar: muddat.oylar }, sabab } };
  const kunlar = kunlarniOqi(tana.kunlar);
  if (kunlar === null) return { xato: `Muddatni kunlarda kiriting (1–${KUN_CHEGARASI})` };
  return { sorov: { muddat: { kunlar }, sabab } };
}

/** `DELETE …/obuna` tanasi: `{ sabab }`. */
export function olishniTekshir(xom: unknown): Tekshiruv<{ sabab: string }> {
  const tana = (typeof xom === "object" && xom !== null ? xom : {}) as Record<string, unknown>;
  const sabab = sababniOqi(tana.sabab);
  return sabab ? { sorov: { sabab } } : { xato: "Sababni yozing" };
}

const KUN_MS = 24 * 60 * 60 * 1000;

/**
 * Muddat oxiri: oylar — kalendar oyi qo'shiladi (31-yanvar + 1 oy oy oxiridan oshsa keyingi
 * oyga o'tadi, to'lov obunalari bilan bir xil qoida), kunlar — aniq sutkalar.
 */
export function muddatOxiri(boshlanish: Date, muddat: Muddat): Date {
  if ("kunlar" in muddat) return new Date(boshlanish.getTime() + muddat.kunlar * KUN_MS);
  const oxiri = new Date(boshlanish);
  oxiri.setUTCMonth(oxiri.getUTCMonth() + muddat.oylar);
  return oxiri;
}

/** Muddatning o'qiladigan ko'rinishi: "6 oy", "45 kun". */
export function muddatMatni(muddat: Muddat): string {
  return "kunlar" in muddat ? `${muddat.kunlar} kun` : `${muddat.oylar} oy`;
}

/** Jurnal tafsiloti: "Yillik, 2027-10-06 gacha" yoki "45 kun, 2026-11-20 gacha". */
export function berishTafsiloti(tarif: Tarif, muddat: Muddat, tugash: Date): string {
  const nomi = tarif === "qolda" ? muddatMatni(muddat) : tarifMatni(tarif);
  return `${nomi}, ${sanaMatni(tugash.toISOString())} gacha`;
}

export function uzaytirishTafsiloti(muddat: Muddat, eskiTugash: Date, yangiTugash: Date): string {
  return `${muddatMatni(muddat)}: ${sanaMatni(eskiTugash.toISOString())} → ${sanaMatni(yangiTugash.toISOString())}`;
}
