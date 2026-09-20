import { db } from "../db.ts";
import type { Til } from "./telegram-initdata.ts";

const FOYDALANUVCHI_MAYDONLARI = {
  id: true,
  til: true,
  mavzu: true,
  birliklar: true,
} as const;

export type Foydalanuvchi = {
  id: string;
  til: string;
  mavzu: string;
  birliklar: string;
};

/** Prisma'ning "unique constraint" xatosi — parallel so'rov yozuvni bizdan oldin yaratgan. */
function takroriyKalitmi(xato: unknown): boolean {
  return typeof xato === "object" && xato !== null && "code" in xato && xato.code === "P2002";
}

/**
 * Telegram ID bo'yicha hisobni topadi, bo'lmasa yaratadi. `til` faqat yangi hisobga
 * yoziladi — mavjud foydalanuvchining Sozlamalardagi tanlovi ustidan yozilmaydi.
 */
export async function telegramBoyichaTopYokiYarat(
  telegramId: bigint,
  til: Til,
): Promise<{ foydalanuvchi: Foydalanuvchi; yangi: boolean }> {
  const mavjud = await db.foydalanuvchi.findUnique({
    where: { telegramId },
    select: FOYDALANUVCHI_MAYDONLARI,
  });
  if (mavjud) return { foydalanuvchi: mavjud, yangi: false };

  try {
    const foydalanuvchi = await db.foydalanuvchi.create({
      data: { telegramId, til },
      select: FOYDALANUVCHI_MAYDONLARI,
    });
    return { foydalanuvchi, yangi: true };
  } catch (xato) {
    if (!takroriyKalitmi(xato)) throw xato;
    const foydalanuvchi = await db.foydalanuvchi.findUniqueOrThrow({
      where: { telegramId },
      select: FOYDALANUVCHI_MAYDONLARI,
    });
    return { foydalanuvchi, yangi: false };
  }
}
