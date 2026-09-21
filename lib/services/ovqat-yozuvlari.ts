import { db } from "../db.ts";
import { ombordanOchir } from "./ombor.ts";
import { sanaOraligi, type Yozuv } from "./yozuv-hisob.ts";
import { FAOL_HOLATLAR, keyingiHolat } from "./yozuv-holati.ts";

export type YangiYozuv = {
  taomId: string | null;
  taomNomi: string;
  porsiya: string;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
  ovqatTuri: string;
  manba: "qolda" | "ai";
  /** Yozuvga bog'lanadigan yuklangan rasm (AI oqimi); bo'lmasa null. */
  rasmId: string | null;
};

/** Rasm topilmadi yoki allaqachon boshqa yozuvga tegishli — yozuv yaratilmaydi. */
export class RasmBoglanmadi extends Error {}

const YOZUV_MAYDONLARI = {
  id: true,
  taomId: true,
  taomNomi: true,
  porsiya: true,
  kaloriya: true,
  oqsil: true,
  yog: true,
  uglevod: true,
  ovqatTuri: true,
  manba: true,
  vaqt: true,
  taom: { select: { rasm: true } },
  rasmlar: { select: { id: true }, orderBy: { yaratilgan: "asc" }, take: 1 },
} as const;

type BazaYozuvi = Omit<Yozuv, "vaqt" | "rasm"> & {
  vaqt: Date;
  taom: { rasm: string | null } | null;
  rasmlar: { id: string }[];
};

/** Yuklangan rasm bazadagi taom rasmidan ustun: foydalanuvchi o'z ovqatini ko'rsin. */
function korinishgaOtkaz({ taom, rasmlar, ...yozuv }: BazaYozuvi): Yozuv {
  const rasm = rasmlar[0] ? `/api/rasmlar/${rasmlar[0].id}` : (taom?.rasm ?? null);
  return { ...yozuv, rasm, vaqt: yozuv.vaqt.toISOString() };
}

/**
 * Jurnalga bitta yozuv qo'shadi. Rasm berilsa shu tranzaksiyada yozuvga bog'lanadi —
 * bog'lanmasa (`RasmBoglanmadi`) yozuv ham yaratilmaydi.
 */
export async function yozuvYaratish(
  foydalanuvchiId: string,
  { rasmId, ...kirish }: YangiYozuv,
): Promise<Yozuv> {
  const yozuv = await db.$transaction(async (tx) => {
    const { id } = await tx.ovqatYozuvi.create({
      data: { ...kirish, foydalanuvchiId },
      select: { id: true },
    });
    if (rasmId) {
      const { count } = await tx.rasm.updateMany({
        where: { id: rasmId, foydalanuvchiId, ovqatYozuviId: null },
        data: { ovqatYozuviId: id },
      });
      if (count === 0) throw new RasmBoglanmadi();
    }
    return tx.ovqatYozuvi.findUniqueOrThrow({ where: { id }, select: YOZUV_MAYDONLARI });
  });
  return korinishgaOtkaz(yozuv);
}

/** Bir kunning yozuvlari, vaqti bo'yicha eskidan yangiga. O'chirilganlar kirmaydi. */
export async function kunlikYozuvlar(foydalanuvchiId: string, sana: string): Promise<Yozuv[]> {
  const { boshi, oxiri } = sanaOraligi(sana);
  const yozuvlar = await db.ovqatYozuvi.findMany({
    where: {
      foydalanuvchiId,
      holat: { in: FAOL_HOLATLAR },
      vaqt: { gte: boshi, lt: oxiri },
    },
    orderBy: { vaqt: "asc" },
    select: YOZUV_MAYDONLARI,
  });
  return yozuvlar.map(korinishgaOtkaz);
}

/** Bitta yozuv; topilmasa yoki o'chirilgan bo'lsa null. */
export async function yozuvniOl(foydalanuvchiId: string, id: string): Promise<Yozuv | null> {
  const yozuv = await db.ovqatYozuvi.findFirst({
    where: { id, foydalanuvchiId, holat: { in: FAOL_HOLATLAR } },
    select: YOZUV_MAYDONLARI,
  });
  return yozuv ? korinishgaOtkaz(yozuv) : null;
}

export type YozuvOzgarishi = Omit<YangiYozuv, "taomId" | "manba" | "rasmId"> & {
  /** Berilmasa yozuv vaqti o'zgarmaydi. */
  vaqt?: Date;
};

/**
 * Yozuvni tahrirlaydi (E10) va holatini "tahrirlandi" qiladi; topilmasa yoki o'chirilgan
 * bo'lsa null. Manba va rasm o'zgarmaydi.
 */
export async function yozuvniYangilash(
  foydalanuvchiId: string,
  id: string,
  ozgarish: YozuvOzgarishi,
): Promise<Yozuv | null> {
  const joriy = await db.ovqatYozuvi.findFirst({
    where: { id, foydalanuvchiId },
    select: { holat: true },
  });
  const holat = joriy && keyingiHolat(joriy.holat, "tahrirlash");
  if (!holat) return null;

  // Holat shartda ham turadi: o'qish va yozish orasida yozuv o'chirilgan bo'lsa tirilmaydi.
  const { count } = await db.ovqatYozuvi.updateMany({
    where: { id, foydalanuvchiId, holat: joriy.holat },
    data: { ...ozgarish, holat },
  });
  return count === 0 ? null : yozuvniOl(foydalanuvchiId, id);
}

/**
 * Yozuvni o'chiradi; topilmasa yoki allaqachon o'chirilgan bo'lsa false. Qator bazada qoladi,
 * holati "ochirildi" bo'ladi — streak va Score tarixi halol qolsin. Bog'langan rasm esa
 * bazadan ham, ombordan ham o'chadi: foydalanuvchi o'chirgan ovqat surati saqlanmaydi.
 */
export async function yozuvniOchirish(foydalanuvchiId: string, id: string): Promise<boolean> {
  const kalitlar = await db.$transaction(async (tx) => {
    const yozuv = await tx.ovqatYozuvi.findFirst({
      where: { id, foydalanuvchiId },
      select: { holat: true, rasmlar: { select: { kalit: true } } },
    });
    const holat = yozuv && keyingiHolat(yozuv.holat, "ochirish");
    if (!holat) return null;

    const { count } = await tx.ovqatYozuvi.updateMany({
      where: { id, foydalanuvchiId, holat: yozuv.holat },
      data: { holat },
    });
    if (count === 0) return null;

    await tx.rasm.deleteMany({ where: { ovqatYozuviId: id, foydalanuvchiId } });
    return yozuv.rasmlar.map((rasm) => rasm.kalit);
  });
  if (!kalitlar) return false;

  // Ombor o'chira olmasa fayl qolib ketadi, lekin baza toza — davriy tozalash yig'ib oladi.
  await Promise.all(kalitlar.map((kalit) => ombordanOchir(kalit).catch(() => {})));
  return true;
}
