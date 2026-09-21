import { db } from "../db.ts";
import { faolMuddat, obunaHolati } from "./huquqlar.ts";
import type { ObunaTafsiloti } from "./obuna-hisob.ts";

/** Obuna ekrani (F4) uchun joriy holat va faol muddat; hisob topilmasa null. */
export async function obunaTafsiloti(foydalanuvchiId: string): Promise<ObunaTafsiloti | null> {
  const foydalanuvchi = await db.foydalanuvchi.findUnique({
    where: { id: foydalanuvchiId },
    select: { obunalar: { select: { tarif: true, boshlanish: true, tugash: true } } },
  });
  if (!foydalanuvchi) return null;

  // Holat va muddat bitta lahzaga nisbatan hisoblanadi — tugash chegarasida ikkalasi zid chiqmasin.
  const hozir = new Date();
  const muddat = faolMuddat(foydalanuvchi.obunalar, hozir);
  return {
    holat: obunaHolati(foydalanuvchi.obunalar, hozir).holat,
    muddat: muddat && {
      tarif: muddat.tarif,
      boshlanish: muddat.boshlanish.toISOString(),
      tugash: muddat.tugash.toISOString(),
    },
  };
}
