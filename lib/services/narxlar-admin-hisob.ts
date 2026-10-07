// A12 narxlar (admin-tz.md) uchun sof hisob: so'rov tekshiruvi, o'zgarishlar ro'yxati va jurnal
// matni. Bazaga bog'lanmagan, klient komponent ham import qiladi.

import { TARIF_IDLARI, type TarifId, type TarifNarxi } from "../tariflar.ts";
import { tarifMatni } from "./admin-hisob.ts";
import { minglar } from "./admin-statistika-hisob.ts";

/** Narx chegaralari, so'mda: 1 000 dan 99 999 999 gacha, butun son. */
export const NARX_ENG_KAM = 1_000;
export const NARX_ENG_KOP = 99_999_999;

export type NarxSorovi = Record<TarifId, number>;

export type NarxOzgarishi = { id: TarifId; eski: number; yangi: number };

type Tekshiruv<T> = { sorov: T } | { xato: string };

/** Maydon matni → so'm: faqat raqamlar, bo'sh bo'lsa NaN (klient va server bir xil o'qiydi). */
export function narxniOqi(qiymat: unknown): number {
  if (typeof qiymat === "number") return Number.isInteger(qiymat) ? qiymat : NaN;
  if (typeof qiymat !== "string") return NaN;
  const toza = qiymat.replace(/\s/g, "");
  return /^\d+$/.test(toza) ? Number(toza) : NaN;
}

export function narxYaroqlimi(narx: number): boolean {
  return Number.isInteger(narx) && narx >= NARX_ENG_KAM && narx <= NARX_ENG_KOP;
}

/** Maydon ostidagi xato matni; yaroqli bo'lsa undefined. */
export function narxXatosi(qiymat: string): string | undefined {
  const narx = narxniOqi(qiymat);
  if (Number.isNaN(narx)) return "Narxni so'mda, butun son bilan kiriting";
  if (!narxYaroqlimi(narx)) return `${minglar(NARX_ENG_KAM)} dan ${minglar(NARX_ENG_KOP)} so'mgacha`;
  return undefined;
}

/** `PATCH /api/admin/narxlar` tanasi: `{ oylik, yarim_yillik, yillik }` — uchalasi ham yaroqli narx. */
export function narxlarniTekshir(xom: unknown): Tekshiruv<NarxSorovi> {
  const tana = (typeof xom === "object" && xom !== null ? xom : {}) as Record<string, unknown>;
  const sorov = {} as NarxSorovi;
  for (const id of TARIF_IDLARI) {
    const narx = narxniOqi(tana[id]);
    if (!narxYaroqlimi(narx)) {
      return { xato: `${tarifMatni(id)} narxi ${minglar(NARX_ENG_KAM)} dan ${minglar(NARX_ENG_KOP)} so'mgacha butun son bo'lsin` };
    }
    sorov[id] = narx;
  }
  return { sorov };
}

/** Faqat o'zgargan tariflar, ekran tartibida. */
export function narxOzgarishlari(eski: TarifNarxi[], yangi: NarxSorovi): NarxOzgarishi[] {
  const ozgarishlar: NarxOzgarishi[] = [];
  for (const id of TARIF_IDLARI) {
    const joriy = eski.find((t) => t.id === id);
    if (joriy && joriy.narx !== yangi[id]) ozgarishlar.push({ id, eski: joriy.narx, yangi: yangi[id] });
  }
  return ozgarishlar;
}

/** Jurnal tafsiloti: "Oylik 39 000 → 45 000 so'm; Yillik 290 000 → 320 000 so'm". */
export function narxTafsiloti(ozgarishlar: NarxOzgarishi[]): string {
  return ozgarishlar.map((o) => `${tarifMatni(o.id)} ${minglar(o.eski)} → ${minglar(o.yangi)} so'm`).join("; ");
}
