import { db } from "../db.ts";
import {
  huquqlar,
  obunaHolati,
  rolniOqi,
  type Huquqlar,
  type ObunaHolati,
  type ObunaMuddati,
  type Rol,
} from "./huquqlar.ts";
import type { Til } from "../lugat/tarjima.ts";

const FOYDALANUVCHI_MAYDONLARI = {
  id: true,
  til: true,
  mavzu: true,
  birliklar: true,
  avatarUrl: true,
  rol: true,
  obunalar: { select: { boshlanish: true, tugash: true } },
  profil: { select: { onboardingTugadi: true } },
} as const;

export type Foydalanuvchi = {
  id: string;
  til: string;
  mavzu: string;
  birliklar: string;
  avatarUrl: string | null;
  rol: Rol;
  /** FREE, faol PRO yoki muddati tugagan PRO — obuna qatorlaridan hisoblanadi. */
  obuna: ObunaHolati;
  /** Yolg'on bo'lsa ilova Home o'rniga onboardingni ochadi. */
  onboardingTugadi: boolean;
};

type BazaFoydalanuvchisi = Omit<Foydalanuvchi, "rol" | "obuna" | "onboardingTugadi"> & {
  rol: string;
  obunalar: ObunaMuddati[];
  profil: { onboardingTugadi: Date | null } | null;
};

function korinishgaOtkaz({ profil, rol, obunalar, ...foydalanuvchi }: BazaFoydalanuvchisi): Foydalanuvchi {
  return {
    ...foydalanuvchi,
    rol: rolniOqi(rol),
    obuna: obunaHolati(obunalar),
    onboardingTugadi: Boolean(profil?.onboardingTugadi),
  };
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

/** Hisobning roli va obunasidan kelib chiqqan huquqlari; hisob topilmasa null. */
export async function foydalanuvchiHuquqlari(id: string): Promise<Huquqlar | null> {
  const foydalanuvchi = await foydalanuvchiniOl(id);
  return foydalanuvchi ? huquqlar(foydalanuvchi.rol, foydalanuvchi.obuna) : null;
}

/**
 * Telegram ID bo'yicha hisobni topadi, bo'lmasa yaratadi. `til` va `ism` faqat yangi
 * hisobga yoziladi — mavjud foydalanuvchining o'z tanlovi ustidan yozilmaydi. Ism
 * profilga tushadi: onboardingdagi ism maydoni shu bilan oldindan to'ldirilgan bo'ladi.
 * `avatarUrl` esa har kirishda Telegram'dagi holatga tenglashtiriladi (rasm almashgan
 * yoki yashirilgan bo'lishi mumkin).
 */
export async function telegramBoyichaTopYokiYarat(
  telegramId: bigint,
  til: Til,
  ism: string | null,
  avatarUrl: string | null,
): Promise<{ foydalanuvchi: Foydalanuvchi; yangi: boolean }> {
  const mavjud = await db.foydalanuvchi.findUnique({
    where: { telegramId },
    select: FOYDALANUVCHI_MAYDONLARI,
  });
  if (mavjud) {
    if (mavjud.avatarUrl !== avatarUrl) {
      await db.foydalanuvchi.update({ where: { id: mavjud.id }, data: { avatarUrl } });
    }
    return { foydalanuvchi: korinishgaOtkaz({ ...mavjud, avatarUrl }), yangi: false };
  }

  try {
    const foydalanuvchi = await db.foydalanuvchi.create({
      data: { telegramId, til, avatarUrl, profil: { create: { ism } } },
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
