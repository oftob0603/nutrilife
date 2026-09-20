import { db } from "../db.ts";
import type { Til } from "./telegram-initdata.ts";

const FOYDALANUVCHI_MAYDONLARI = {
  id: true,
  til: true,
  mavzu: true,
  birliklar: true,
  profil: { select: { onboardingTugadi: true } },
} as const;

export type Foydalanuvchi = {
  id: string;
  til: string;
  mavzu: string;
  birliklar: string;
  /** Yolg'on bo'lsa ilova Home o'rniga onboardingni ochadi. */
  onboardingTugadi: boolean;
};

type BazaFoydalanuvchisi = Omit<Foydalanuvchi, "onboardingTugadi"> & {
  profil: { onboardingTugadi: Date | null } | null;
};

function korinishgaOtkaz({ profil, ...foydalanuvchi }: BazaFoydalanuvchisi): Foydalanuvchi {
  return { ...foydalanuvchi, onboardingTugadi: Boolean(profil?.onboardingTugadi) };
}

/** Prisma'ning "unique constraint" xatosi — parallel so'rov yozuvni bizdan oldin yaratgan. */
function takroriyKalitmi(xato: unknown): boolean {
  return typeof xato === "object" && xato !== null && "code" in xato && xato.code === "P2002";
}

/** Hisob sozlamalari; hisob topilmasa (masalan, o'chirilgan) null. */
export async function foydalanuvchiniOl(id: string): Promise<Foydalanuvchi | null> {
  const foydalanuvchi = await db.foydalanuvchi.findUnique({
    where: { id },
    select: FOYDALANUVCHI_MAYDONLARI,
  });
  return foydalanuvchi ? korinishgaOtkaz(foydalanuvchi) : null;
}

/**
 * Telegram ID bo'yicha hisobni topadi, bo'lmasa yaratadi. `til` va `ism` faqat yangi
 * hisobga yoziladi — mavjud foydalanuvchining o'z tanlovi ustidan yozilmaydi. Ism
 * profilga tushadi: onboardingdagi ism maydoni shu bilan oldindan to'ldirilgan bo'ladi.
 */
export async function telegramBoyichaTopYokiYarat(
  telegramId: bigint,
  til: Til,
  ism: string | null,
): Promise<{ foydalanuvchi: Foydalanuvchi; yangi: boolean }> {
  const mavjud = await db.foydalanuvchi.findUnique({
    where: { telegramId },
    select: FOYDALANUVCHI_MAYDONLARI,
  });
  if (mavjud) return { foydalanuvchi: korinishgaOtkaz(mavjud), yangi: false };

  try {
    const foydalanuvchi = await db.foydalanuvchi.create({
      data: { telegramId, til, profil: { create: { ism } } },
      select: FOYDALANUVCHI_MAYDONLARI,
    });
    return { foydalanuvchi: korinishgaOtkaz(foydalanuvchi), yangi: true };
  } catch (xato) {
    if (!takroriyKalitmi(xato)) throw xato;
    const foydalanuvchi = await db.foydalanuvchi.findUniqueOrThrow({
      where: { telegramId },
      select: FOYDALANUVCHI_MAYDONLARI,
    });
    return { foydalanuvchi: korinishgaOtkaz(foydalanuvchi), yangi: false };
  }
}
