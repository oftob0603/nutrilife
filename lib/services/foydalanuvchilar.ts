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
import { tilniOqi, type Til } from "../lugat/tarjima.ts";
import { ombordanOchir } from "./ombor.ts";
import type { Sozlamalar } from "./sozlamalar-hisob.ts";

const FOYDALANUVCHI_MAYDONLARI = {
  id: true,
  til: true,
  mavzu: true,
  vaznBirligi: true,
  boyBirligi: true,
  avatarUrl: true,
  rol: true,
  obunalar: { select: { boshlanish: true, tugash: true } },
  profil: { select: { onboardingTugadi: true } },
} as const;

export type Foydalanuvchi = {
  id: string;
  til: string;
  mavzu: string;
  vaznBirligi: string;
  boyBirligi: string;
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

/** Hisobning Telegram ID'si; hisob yo'q yoki Telegram'siz (dev) bo'lsa null. */
export async function telegramIdniOl(foydalanuvchiId: string): Promise<bigint | null> {
  const topildi = await db.foydalanuvchi.findUnique({
    where: { id: foydalanuvchiId },
    select: { telegramId: true },
  });
  return topildi?.telegramId ?? null;
}

/** Telegram ID bo'yicha saqlangan til; hisob hali yo'q bo'lsa null. */
export async function telegramTili(telegramId: bigint): Promise<string | null> {
  const topildi = await db.foydalanuvchi.findUnique({ where: { telegramId }, select: { til: true } });
  return topildi?.til ?? null;
}

/**
 * Botda tanlangan til. Hisob bo'lsa faqat `til` yangilanadi; bo'lmasa shu til va ism bilan
 * yaratiladi — Mini App keyin ochilganda `telegramBoyichaTopYokiYarat` shu hisobni topadi va
 * ilova botda tanlangan tilda ochiladi (DECISIONS 2026-09-20). Avatar bu yerda yozilmaydi:
 * bot yangilanishida rasm yo'q, u Mini App kirishida to'ldiriladi.
 */
export async function botTiliniSaqlash(telegramId: bigint, til: Til, ism: string | null): Promise<void> {
  const yangila = () => db.foydalanuvchi.update({ where: { telegramId }, data: { til } });
  const mavjud = await db.foydalanuvchi.findUnique({ where: { telegramId }, select: { id: true } });
  if (mavjud) {
    await yangila();
    return;
  }
  try {
    await db.foydalanuvchi.create({ data: { telegramId, til, profil: { create: { ism } } } });
  } catch (xato) {
    if (!takroriyKalitmi(xato)) throw xato;
    await yangila();
  }
}

/** Sozlama qatorlaridagi o'zgarish (til, mavzu, birliklar); hisob topilmasa false. */
export async function sozlamalarniSaqlash(
  id: string,
  ozgarish: Partial<Sozlamalar>,
): Promise<boolean> {
  const { count } = await db.foydalanuvchi.updateMany({ where: { id }, data: ozgarish });
  return count > 0;
}

/** O'chirilgan hisobdan bot xabari uchun qolgan izi — Telegram'siz (dev) hisobda `telegramId` null. */
export type OchirilganHisob = { telegramId: bigint | null; til: Til };

/**
 * Hisobni butunlay o'chiradi (profil-tz.md, F5): qator o'chganda profil, jurnal, vazn tarixi,
 * rejalar, skan hisobi va obunalar kaskad bilan ketadi. Rasm fayllari omborda turadi —
 * ular bazadan keyin o'chiriladi: ombor o'chira olmasa fayl egasiz qoladi, lekin hisob
 * yarim o'chgan holatda qolmaydi. Hisob topilmasa null; topilsa — bot xabari uchun
 * Telegram ID va til (qator o'chgach ularni olib bo'lmaydi).
 */
export async function hisobniOchirish(id: string): Promise<OchirilganHisob | null> {
  const hisob = await db.foydalanuvchi.findUnique({
    where: { id },
    select: { telegramId: true, til: true, rasmlar: { select: { kalit: true } } },
  });
  if (!hisob) return null;
  const { count } = await db.foydalanuvchi.deleteMany({ where: { id } });
  if (count === 0) return null;

  await Promise.allSettled(hisob.rasmlar.map((rasm) => ombordanOchir(rasm.kalit)));
  return { telegramId: hisob.telegramId, til: tilniOqi(hisob.til) };
}
