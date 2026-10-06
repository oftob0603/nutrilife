// Admin paneldan obunani qo'lda boshqarish (S6 3-task): PRO berish, muddatni uzaytirish, olib
// qo'yish. Har amal `admin_amallari` ga shu tranzaksiyada yoziladi (admin-tz.md §4).

import { db } from "../db.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import { obunaHolati } from "./huquqlar.ts";
import {
  berishTafsiloti,
  muddatOxiri,
  uzaytirishTafsiloti,
  type BerishSorovi,
  type UzaytirishSorovi,
} from "./obuna-admin-hisob.ts";

/** Bot obuna xabarlarining oxirgi bosqichi (obuna-xabar-hisob.ts) — shunga qo'yilsa xabar ketmaydi. */
const XABAR_TUGADI = 5;

// Uzoqdagi bazaga har so'rov ~0,4 s — standart tranzaksiya chegarasi yetmaydi (skan-hisobi.ts kabi).
const TRANZAKSIYA_VAQTI = { maxWait: 10_000, timeout: 20_000 };

export type AmalNatijasi = "ok" | "topilmadi" | "pro_emas";

const OBUNA_MAYDONLARI = { id: true, boshlanish: true, tugash: true } as const;

async function hisobObunalari(tx: Prisma.TransactionClient, foydalanuvchiId: string) {
  return tx.foydalanuvchi.findUnique({
    where: { id: foydalanuvchiId },
    select: { id: true, obunalar: { select: OBUNA_MAYDONLARI } },
  });
}

/**
 * PRO berish: yangi qator `manba = qolda` bilan. Foydalanuvchi allaqachon PRO bo'lsa muddat
 * joriy tugashdan davom etadi — to'langan kunlar yo'qolmaydi.
 */
export async function proBerish(
  adminId: string,
  foydalanuvchiId: string,
  { tarif, muddat, sabab }: BerishSorovi,
  hozir: Date = new Date(),
): Promise<AmalNatijasi> {
  return db.$transaction(async (tx) => {
    const hisob = await hisobObunalari(tx, foydalanuvchiId);
    if (!hisob) return "topilmadi";

    const holat = obunaHolati(hisob.obunalar, hozir);
    const boshlanish = holat.holat === "pro" ? holat.tugash : hozir;
    const tugash = muddatOxiri(boshlanish, muddat);

    await tx.obuna.create({ data: { foydalanuvchiId, tarif, manba: "qolda", boshlanish, tugash } });
    await tx.adminAmali.create({
      data: {
        adminId,
        foydalanuvchiId,
        tur: "pro_berish",
        tafsilot: berishTafsiloti(tarif, muddat, tugash),
        sabab,
        eski: holat.holat === "pro" ? { tugash: holat.tugash.toISOString() } : { holat: holat.holat },
        yangi: { tarif, boshlanish: boshlanish.toISOString(), tugash: tugash.toISOString() },
      },
    });
    return "ok";
  }, TRANZAKSIYA_VAQTI);
}

/** Muddatni uzaytirish: faqat faol PRO'da; yangi tarifsiz qator joriy tugashdan boshlanadi. */
export async function muddatUzaytirish(
  adminId: string,
  foydalanuvchiId: string,
  { muddat, sabab }: UzaytirishSorovi,
  hozir: Date = new Date(),
): Promise<AmalNatijasi> {
  return db.$transaction(async (tx) => {
    const hisob = await hisobObunalari(tx, foydalanuvchiId);
    if (!hisob) return "topilmadi";

    const holat = obunaHolati(hisob.obunalar, hozir);
    if (holat.holat !== "pro") return "pro_emas";
    const tugash = muddatOxiri(holat.tugash, muddat);

    await tx.obuna.create({
      data: { foydalanuvchiId, tarif: "qolda", manba: "qolda", boshlanish: holat.tugash, tugash },
    });
    await tx.adminAmali.create({
      data: {
        adminId,
        foydalanuvchiId,
        tur: "muddat_uzaytirish",
        tafsilot: uzaytirishTafsiloti(muddat, holat.tugash, tugash),
        sabab,
        eski: { tugash: holat.tugash.toISOString() },
        yangi: { tugash: tugash.toISOString() },
      },
    });
    return "ok";
  }, TRANZAKSIYA_VAQTI);
}

/**
 * PRO ni olib qo'yish: faol qatorlar hozir tugaydi, hali boshlanmaganlari nolga qisqaradi
 * (qator o'chirilmaydi — tarix qoladi). Bot "tugadi" xabarini yubormasligi uchun bosqich oxiriga
 * qo'yiladi.
 */
export async function proOlish(
  adminId: string,
  foydalanuvchiId: string,
  sabab: string,
  hozir: Date = new Date(),
): Promise<AmalNatijasi> {
  return db.$transaction(async (tx) => {
    const hisob = await hisobObunalari(tx, foydalanuvchiId);
    if (!hisob) return "topilmadi";

    const holat = obunaHolati(hisob.obunalar, hozir);
    if (holat.holat !== "pro") return "pro_emas";

    const faollar = hisob.obunalar.filter((o) => o.boshlanish <= hozir && o.tugash > hozir);
    const kelajakdagilar = hisob.obunalar.filter((o) => o.boshlanish > hozir);
    await tx.obuna.updateMany({
      where: { id: { in: faollar.map((o) => o.id) } },
      data: { tugash: hozir, xabarBosqichi: XABAR_TUGADI },
    });
    for (const o of kelajakdagilar) {
      await tx.obuna.update({
        where: { id: o.id },
        data: { tugash: o.boshlanish, xabarBosqichi: XABAR_TUGADI },
      });
    }
    await tx.adminAmali.create({
      data: {
        adminId,
        foydalanuvchiId,
        tur: "pro_olish",
        tafsilot: `${holat.tugash.toISOString().slice(0, 10)} gacha edi`,
        sabab,
        eski: { tugash: holat.tugash.toISOString() },
        yangi: { tugash: hozir.toISOString() },
      },
    });
    return "ok";
  }, TRANZAKSIYA_VAQTI);
}
