// Tarjima vositalari — sof modul: server ham, klient ham ishlatadi. Lug'atning o'zi sozlar.ts da.

import { SOZLAR, type Kalit } from "./sozlar.ts";

export type { Kalit };

export const TILLAR = ["uz", "ru", "en"] as const;

export type Til = (typeof TILLAR)[number];

/** Noma'lum qiymat (bazadagi matn, cookie) — til kodi; tanish bo'lmasa o'zbekcha. */
export function tilniOqi(qiymat: unknown): Til {
  return TILLAR.find((til) => til === qiymat) ?? "uz";
}

/**
 * Matn ekranda emas, boshqa joyda (sof modul, API javobi) yozilganda uni lug'atga bog'laydi:
 * qiymat o'zgarmaydi, lekin lug'atda yo'q matn `tsc` xatosini beradi.
 */
export function k<K extends Kalit>(kalit: K): K {
  return kalit;
}

// Loyihada tutuq belgisi ikki xil yoziladi (' va ’) — bazadan kelgan matn lug'at kalitidan
// faqat shu belgi bilan farq qilsa ham tarjima topilsin.
const APOSTROFLAR = /[‘’ʻʼ`]/g;

const LUGAT = new Map<string, { ru: string; en: string }>(Object.entries(SOZLAR));

function top(til: Til, matn: string): string {
  if (til === "uz") return matn;
  const qator = LUGAT.get(matn) ?? LUGAT.get(matn.replace(APOSTROFLAR, "'"));
  return qator?.[til] ?? matn;
}

function joyla(qolip: string, qiymatlar: readonly (string | number)[]): string {
  return qolip.replace(/\{(\d)\}/g, (joy, i) => String(qiymatlar[Number(i)] ?? joy));
}

// Birlik so'zining son bo'yicha shakllari. «г», «шт.», «мл» qisqartma — o'zgarmaydi.
const KOPLIK: Record<string, { ru: [string, string, string]; en: [string, string] }> = {
  "bo'lak": { ru: ["кусок", "куска", "кусков"], en: ["slice", "slices"] },
  six: { ru: ["шампур", "шампура", "шампуров"], en: ["skewer", "skewers"] },
  porsiya: { ru: ["порция", "порции", "порций"], en: ["serving", "servings"] },
};

/** Ruscha son shakli: 1 кусок · 2 куска · 5 кусков (oxirgi raqamlar bo'yicha). */
function ruShakli(shakllar: [string, string, string], son: number): string {
  const butun = Math.abs(Math.round(son));
  const birlik = butun % 10;
  const onlik = butun % 100;
  if (son !== butun) return shakllar[1];
  if (birlik === 1 && onlik !== 11) return shakllar[0];
  if (birlik >= 2 && birlik <= 4 && (onlik < 10 || onlik >= 20)) return shakllar[1];
  return shakllar[2];
}

/** Birlik so'zi berilgan son uchun: ("bo'lak", 2) -> "куска" / "slices". */
function birlikMatni(til: Til, birlik: string, son: number): string {
  const shakllar = KOPLIK[birlik.replace(APOSTROFLAR, "'")];
  if (til === "ru" && shakllar) return ruShakli(shakllar.ru, son);
  if (til === "en" && shakllar) return shakllar.en[son === 1 ? 0 : 1];
  return top(til, birlik);
}

const PORSIYA_QOLIPI = /^\s*([\d.,]+)\s*(.*)$/;

/**
 * Porsiya matni ("350 g", "2 bo'lak") bazada til-betaraf saqlanadi — yozuv qaysi tilda
 * qo'shilgan bo'lsa o'shanda qotib qolmasin. Shu yerda, ko'rsatish paytida faqat birlik
 * so'zi tarjima qilinadi.
 */
function porsiyaMatni(til: Til, porsiya: string): string {
  const mos = PORSIYA_QOLIPI.exec(porsiya);
  if (!mos) return top(til, porsiya);
  const [, miqdor, birlik] = mos;
  if (!birlik.trim()) return miqdor;
  return `${miqdor} ${birlikMatni(til, birlik.trim(), Number(miqdor.replace(",", ".")) || 0)}`;
}

export type Tarjimon = {
  til: Til;
  /** Lug'atdagi matn; `{0}`, `{1}` o'rniga qiymatlar qo'yiladi. */
  t: (kalit: Kalit, ...qiymatlar: (string | number)[]) => string;
  /** Ma'lumot bo'lib kelgan matn (ovqat turi, birlik, server xabari): lug'atda bo'lmasa o'zi qaytadi. */
  erkin: (matn: string) => string;
  /** "2 bo'lak" -> "2 куска". */
  porsiya: (matn: string) => string;
  /** Miqdor va birlik alohida kelganda: (2, "bo'lak") -> "2 куска". */
  miqdor: (son: number, birlik: string) => string;
};

function yarat(til: Til): Tarjimon {
  return {
    til,
    t: (kalit, ...qiymatlar) => joyla(top(til, kalit), qiymatlar),
    erkin: (matn) => top(til, matn),
    porsiya: (matn) => porsiyaMatni(til, matn),
    miqdor: (son, birlik) => `${son} ${birlikMatni(til, birlik, son)}`,
  };
}

const TARJIMONLAR: Record<Til, Tarjimon> = { uz: yarat("uz"), ru: yarat("ru"), en: yarat("en") };

/** Til uchun tarjimon. Har til uchun bitta obyekt — React'da qayta chizishga sabab bo'lmaydi. */
export function tarjimon(til: Til): Tarjimon {
  return TARJIMONLAR[til];
}
