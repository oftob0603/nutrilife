// Retsept kategoriyalari (admin-tz.md A9): A9 tanlovi va "Yangi kategoriya" oynasi uchun
// ro'yxat va qo'shish. Taomlar bazasi olib tashlangach (DECISIONS 2026-10-07) kategoriyalar
// faqat retseptlarga xizmat qiladi.

import { db } from "../db.ts";

export type Kategoriya = { id: string; nomi: string };

/** Kategoriyalar nomi bo'yicha — A9 tanlovi va A8 filtri uchun. */
export async function kategoriyalarRoyxati(): Promise<Kategoriya[]> {
  return db.kategoriya.findMany({ orderBy: { nomi: "asc" }, select: { id: true, nomi: true } });
}

/** Yangi kategoriya; nomi band bo'lsa (katta-kichik harf farqsiz) "band". */
export async function kategoriyaQoshish(nomi: string): Promise<Kategoriya | "band"> {
  const bor = await db.kategoriya.findFirst({
    where: { nomi: { equals: nomi, mode: "insensitive" } },
    select: { id: true },
  });
  if (bor) return "band";
  return db.kategoriya.create({ data: { nomi }, select: { id: true, nomi: true } });
}

/** Kategoriya nomi: 2–40 belgi, bo'shliqlar tekislanadi; yaroqsiz — null. */
export function kategoriyaNominiOqi(qiymat: unknown): string | null {
  const nomi = (typeof qiymat === "string" ? qiymat.trim() : "").replace(/\s+/g, " ");
  return nomi.length >= 2 && nomi.length <= 40 ? nomi : null;
}
