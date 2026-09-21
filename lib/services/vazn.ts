import { db } from "../db.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import { xulosaniYangilash } from "./kunlik-xulosa.ts";
import type { NormaOzgarishi } from "./progress-hisob.ts";
import { rejaniYangilash } from "./rejalar.ts";
import { bugunSana, toshkentSanasi } from "./yozuv-hisob.ts";

// Uzoqdagi bazaga har so'rov ~0,4 s — standart chegara (2 s kutish, 5 s ish) yetmaydi.
const TRANZAKSIYA_VAQTI = { maxWait: 10_000, timeout: 20_000 };

const REJA_MAYDONLARI = { kaloriya: true, oqsil: true, yog: true, uglevod: true } as const;

export type VaznNatijasi = { id: string; yangilandi: boolean; norma: NormaOzgarishi };

/** Onboardingdagi birinchi o'lchov o'chirilmaydi — u grafikning boshlang'ich nuqtasi (P3). */
export class BirinchiOlchov extends Error {}

/**
 * O'lchov o'zgargach norma qayta hisoblanadi (`rejalar` ga yangi qator — faqat natija
 * o'zgarsa). Bugungi norma o'zgarsa bugungi Nutrition Score ham eskiradi — xulosa shu
 * tranzaksiyada yangilanadi.
 */
async function normaniYangilash(
  tx: Prisma.TransactionClient,
  foydalanuvchiId: string,
): Promise<NormaOzgarishi> {
  const eski = await tx.reja.findFirst({
    where: { foydalanuvchiId },
    orderBy: { hisoblangan: "desc" },
    select: REJA_MAYDONLARI,
  });
  const yangi = await rejaniYangilash(foydalanuvchiId, tx);
  const ozgardi =
    yangi !== null &&
    (!eski ||
      eski.kaloriya !== yangi.kaloriya ||
      eski.oqsil !== yangi.oqsil ||
      eski.yog !== yangi.yog ||
      eski.uglevod !== yangi.uglevod);
  if (ozgardi) await xulosaniYangilash(tx, foydalanuvchiId, bugunSana());
  return { eski: eski?.kaloriya ?? null, yangi: yangi?.kaloriya ?? eski?.kaloriya ?? null };
}

/** Hisob bo'yicha qulf (rejalar.ts dagi bilan bitta kalit): parallel o'lchovlar navbat bilan. */
function qulfla(tx: Prisma.TransactionClient, foydalanuvchiId: string) {
  return tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${foydalanuvchiId}))`;
}

/**
 * Bugungi o'lchov (P2). Kuniga bitta yozuv: bugun allaqachon kiritilgan bo'lsa yangi qator
 * yaratilmaydi, mavjudi yangilanadi. O'tgan kunga o'lchov qo'shilmaydi — sana so'rovdan
 * olinmaydi. Maqsad vazn oxirgi o'lchovda turadi, shuning uchun yangi qatorga ko'chiriladi.
 */
export function vaznQoshish(foydalanuvchiId: string, vazn: number): Promise<VaznNatijasi> {
  return db.$transaction(async (tx) => {
    await qulfla(tx, foydalanuvchiId);
    const oxirgi = await tx.vaznYozuvi.findFirst({
      where: { foydalanuvchiId },
      orderBy: { vaqt: "desc" },
      select: { id: true, vaqt: true, maqsad: true },
    });

    const yangilandi = oxirgi !== null && toshkentSanasi(oxirgi.vaqt) === bugunSana();
    const { id } = yangilandi
      ? await tx.vaznYozuvi.update({ where: { id: oxirgi.id }, data: { vazn }, select: { id: true } })
      : await tx.vaznYozuvi.create({
          data: { foydalanuvchiId, vazn, maqsad: oxirgi?.maqsad ?? null },
          select: { id: true },
        });

    return { id, yangilandi, norma: await normaniYangilash(tx, foydalanuvchiId) };
  }, TRANZAKSIYA_VAQTI);
}

/** Mavjud o'lchovning qiymatini o'zgartiradi (P3); sanasi o'zgarmaydi. Topilmasa null. */
export function vaznniTahrirlash(
  foydalanuvchiId: string,
  id: string,
  vazn: number,
): Promise<VaznNatijasi | null> {
  return db.$transaction(async (tx) => {
    await qulfla(tx, foydalanuvchiId);
    const { count } = await tx.vaznYozuvi.updateMany({ where: { id, foydalanuvchiId }, data: { vazn } });
    if (count === 0) return null;
    return { id, yangilandi: true, norma: await normaniYangilash(tx, foydalanuvchiId) };
  }, TRANZAKSIYA_VAQTI);
}

/**
 * O'lchovni o'chiradi (P3). Eng birinchi o'lchov o'chirilmaydi (`BirinchiOlchov`). Oxirgi
 * o'lchov o'chsa, undagi maqsad vazn yangi "oxirgi" qatorga ko'chadi — aks holda profil
 * eski maqsadga qaytib qolardi. Topilmasa null.
 */
export function vaznniOchirish(
  foydalanuvchiId: string,
  id: string,
): Promise<{ norma: NormaOzgarishi } | null> {
  return db.$transaction(async (tx) => {
    await qulfla(tx, foydalanuvchiId);
    const olchovlar = await tx.vaznYozuvi.findMany({
      where: { foydalanuvchiId },
      orderBy: { vaqt: "asc" },
      select: { id: true, maqsad: true },
    });
    const orni = olchovlar.findIndex((olchov) => olchov.id === id);
    if (orni === -1) return null;
    if (orni === 0) throw new BirinchiOlchov();

    await tx.vaznYozuvi.delete({ where: { id } });
    if (orni === olchovlar.length - 1) {
      await tx.vaznYozuvi.update({
        where: { id: olchovlar[orni - 1].id },
        data: { maqsad: olchovlar[orni].maqsad },
      });
    }
    return { norma: await normaniYangilash(tx, foydalanuvchiId) };
  }, TRANZAKSIYA_VAQTI);
}
