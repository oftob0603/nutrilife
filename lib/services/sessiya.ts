import { db } from "../db.ts";

/**
 * So'rov egasining `foydalanuvchilar.id` si; aniqlanmasa null. API yo'llari egani faqat
 * shu yerdan oladi — servislarga ID tayyor holda uzatiladi.
 *
 * VAQTINCHA (S3 2-task): sessiya hali yo'q (3-task), shuning uchun hamma so'rov bazadagi
 * birinchi hisob — birinchi admin — nomidan o'tadi. 3-taskda shu funksiyaning ichi
 * sessiyani o'qishga almashadi, chaqiruvchilar o'zgarmaydi.
 */
export async function joriyFoydalanuvchiId(sorov: Request): Promise<string | null> {
  void sorov; // 3-taskda sessiya shu so'rovdan o'qiladi.
  const birinchi = await db.foydalanuvchi.findFirst({
    orderBy: { yaratilgan: "asc" },
    select: { id: true },
  });
  return birinchi?.id ?? null;
}

/** Egasi aniqlanmagan so'rovga javob. */
export function kirishKerak(): Response {
  return Response.json({ xato: "Kirish talab qilinadi" }, { status: 401 });
}
