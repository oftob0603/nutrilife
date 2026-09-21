import { db } from "../db.ts";
import { bugunSana } from "./yozuv-hisob.ts";

/**
 * Analitika hodisalari. North star — 7-kun retention (DECISIONS 2026-09-21): `royxat`
 * va `kunlik_faollik` qatorlaridan hisoblanadi. Kogorta bo'yicha so'rov (S6 admin paneli
 * shuni ko'rsatadi; sinov hisoblari va adminlar `foydalanuvchilar` bilan JOIN qilib chiqariladi):
 *
 *   SELECT r.sana, count(*) AS royxat, count(f.id) AS qaytgan
 *   FROM hodisalar r
 *   LEFT JOIN hodisalar f ON f.foydalanuvchi_id = r.foydalanuvchi_id
 *     AND f.tur = 'kunlik_faollik' AND f.sana = r.sana + 7
 *   WHERE r.tur = 'royxat' AND r.sana <= CURRENT_DATE - 7
 *   GROUP BY r.sana;
 *
 * O'chirilgan hisob (egasi bo'sh qator) kogortada qoladi va "qaytmagan" sanaladi.
 */
export type HodisaTuri = "royxat" | "onboarding_tugadi" | "birinchi_skan" | "kunlik_faollik";

/** Hisobga faqat bir marta yoziladigan turlar; `kunlik_faollik` esa kuniga bitta. */
const BIR_MARTALIK: ReadonlySet<HodisaTuri> = new Set(["royxat", "onboarding_tugadi", "birinchi_skan"]);

/** Bugungi (Toshkent kuni) hodisa qatori — tranzaksiya ichida yozish uchun ham ishlatiladi. */
export function hodisaQatori(foydalanuvchiId: string, tur: HodisaTuri) {
  return { foydalanuvchiId, tur, sana: new Date(`${bugunSana()}T00:00:00.000Z`) };
}

/**
 * Hodisani yozadi; takroriy qator jimgina o'tkazib yuboriladi. Hech qachon xato tashlamaydi —
 * analitika asosiy oqimni buzmasligi kerak.
 */
export async function hodisaYoz(foydalanuvchiId: string, tur: HodisaTuri): Promise<void> {
  try {
    if (BIR_MARTALIK.has(tur)) {
      const mavjud = await db.hodisa.findFirst({ where: { foydalanuvchiId, tur }, select: { id: true } });
      if (mavjud) return;
    }
    await db.hodisa.createMany({ data: [hodisaQatori(foydalanuvchiId, tur)], skipDuplicates: true });
  } catch (xato) {
    console.error("Hodisa yozilmadi:", tur, xato instanceof Error ? xato.message : xato);
  }
}
