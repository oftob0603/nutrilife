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

export type KategoriyaOqibati = { kategoriya: Kategoriya; retseptlar: number };

/** O'chirish oynasi uchun: kategoriya va unga bog'langan retseptlar soni; topilmasa null. */
export async function kategoriyaOqibati(id: string): Promise<KategoriyaOqibati | null> {
  const k = await db.kategoriya.findUnique({
    where: { id },
    select: { id: true, nomi: true, _count: { select: { retseptlar: true } } },
  });
  return k ? { kategoriya: { id: k.id, nomi: k.nomi }, retseptlar: k._count.retseptlar } : null;
}

/**
 * Kategoriyani o'chiradi: bog'langan retseptlar kategoriyasiz qoladi (`kategoriya_id` SetNull),
 * jurnalga `kategoriya_ochirish` shu tranzaksiyada (nom va retseptlar soni tafsilotda). Topilmasa
 * "topilmadi". Sabab so'ralmaydi — kontent amallari kabi.
 */
export async function kategoriyaOchirish(adminId: string, id: string): Promise<KategoriyaOqibati | "topilmadi"> {
  return db.$transaction(async (tx) => {
    const k = await tx.kategoriya.findUnique({
      where: { id },
      select: { id: true, nomi: true, _count: { select: { retseptlar: true } } },
    });
    if (!k) return "topilmadi";
    await tx.kategoriya.delete({ where: { id } });
    await tx.adminAmali.create({
      data: {
        adminId,
        tur: "kategoriya_ochirish",
        tafsilot: `${k.nomi} · ${k._count.retseptlar} retsept`,
        sabab: "",
        eski: { id: k.id, nomi: k.nomi, retseptlar: k._count.retseptlar },
      },
    });
    return { kategoriya: { id: k.id, nomi: k.nomi }, retseptlar: k._count.retseptlar };
  });
}
