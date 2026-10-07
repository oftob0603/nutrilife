// Admin paneldan hisobni bloklash, blokni yechish va ma'lumotini o'chirish (S6 8-task,
// admin-tz.md A3) uchun sof hisob — so'rovni tekshirish va jurnal matnlari. Bazaga bog'lanmagan,
// klient komponent ham import qiladi.

import { sanaMatni } from "./admin-hisob.ts";
import { SABAB_CHEGARASI } from "./obuna-admin-hisob.ts";

type Tekshiruv<T> = { sorov: T } | { xato: string };

function sababniOqi(qiymat: unknown): string | null {
  if (typeof qiymat !== "string") return null;
  const sabab = qiymat.trim();
  return sabab.length >= 1 && sabab.length <= SABAB_CHEGARASI ? sabab : null;
}

function tanaOl(xom: unknown): Record<string, unknown> {
  return (typeof xom === "object" && xom !== null ? xom : {}) as Record<
    string,
    unknown
  >;
}

/** `POST …/blok` va `DELETE …/blok` tanasi: `{ sabab }` (admin-tz.md §4: sabab majburiy). */
export function blokniTekshir(xom: unknown): Tekshiruv<{ sabab: string }> {
  const sabab = sababniOqi(tanaOl(xom).sabab);
  return sabab ? { sorov: { sabab } } : { xato: "Sababni yozing" };
}

/**
 * O'chirish oynasida qo'lda yoziladigan tasdiq matni (prototip: «ism» deb yozing). Ismi yo'q
 * hisobda Telegram ID yoziladi — ikkalasi ham bo'lmasa (faqat dev) "ochirish".
 */
export function ochirishTasdigi(
  ism: string | null,
  telegramId: string | null,
): string {
  const toza = ism?.trim();
  if (toza) return toza;
  if (telegramId) return telegramId;
  return "ochirish";
}

export type OchirishSorovi = { tasdiq: string; sabab: string };

/**
 * `DELETE …/foydalanuvchilar/[id]` tanasi: `{ tasdiq, sabab }`. `tasdiq` ning kutilgan matnga
 * mosligi servisda, hisob o'qilgach tekshiriladi (`tasdiqMosmi`) — tasodifiy DELETE o'tmaydi.
 */
export function ochirishniTekshir(xom: unknown): Tekshiruv<OchirishSorovi> {
  const tana = tanaOl(xom);
  const tasdiq = typeof tana.tasdiq === "string" ? tana.tasdiq.trim() : "";
  if (!tasdiq) return { xato: "Tasdiq matnini yozing" };
  const sabab = sababniOqi(tana.sabab);
  return sabab ? { sorov: { tasdiq, sabab } } : { xato: "Sababni yozing" };
}

/** Yozilgan tasdiq kutilgan matn bilan aynan (chekka bo'sh joylarsiz) mos keladimi. */
export function tasdiqMosmi(
  tasdiq: string,
  ism: string | null,
  telegramId: string | null,
): boolean {
  return tasdiq.trim() === ochirishTasdigi(ism, telegramId);
}

/** Blokni yechish jurnali: "2026-10-07 dan beri bloklangan edi". */
export function blokYechishTafsiloti(bloklangan: Date): string {
  return `${sanaMatni(bloklangan.toISOString())} dan beri bloklangan edi`;
}

/**
 * O'chirish jurnali: hisob o'chgach `foydalanuvchi_id` bo'shaydi (ON DELETE SET NULL), shuning
 * uchun kim ekani tafsilotning o'zida qoladi: "Kamola Tosheva · Telegram ID 123456789".
 */
export function ochirishTafsiloti(
  ism: string | null,
  telegramId: string | null,
): string {
  const bolaklar = [ism?.trim() || "Ismsiz"];
  if (telegramId) bolaklar.push(`Telegram ID ${telegramId}`);
  return bolaklar.join(" · ");
}
