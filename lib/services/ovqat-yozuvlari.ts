import { db } from "../db.ts";
import { sanaOraligi, type Yozuv } from "./yozuv-hisob.ts";

/**
 * S1'da foydalanuvchi tizimi yo'q (u S3 sprintida keladi), shuning uchun barcha
 * yozuv shu qotirilgan egaga yoziladi. S3'da real foydalanuvchi ID'si qo'yiladi.
 */
export const S1_FOYDALANUVCHI = "s1-sinov";

export type YangiYozuv = {
  taomId: string | null;
  taomNomi: string;
  porsiya: string;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
  ovqatTuri: string;
};

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
  vaqt: true,
} as const;

type BazaYozuvi = Omit<Yozuv, "vaqt"> & { vaqt: Date };

function korinishgaOtkaz(yozuv: BazaYozuvi): Yozuv {
  return { ...yozuv, vaqt: yozuv.vaqt.toISOString() };
}

/** Jurnalga bitta yozuv qo'shadi. */
export async function yozuvYaratish(kirish: YangiYozuv): Promise<Yozuv> {
  const yozuv = await db.ovqatYozuvi.create({
    data: { ...kirish, foydalanuvchiId: S1_FOYDALANUVCHI },
    select: YOZUV_MAYDONLARI,
  });
  return korinishgaOtkaz(yozuv);
}

/** Bir kunning yozuvlari, vaqti bo'yicha eskidan yangiga. */
export async function kunlikYozuvlar(sana: string): Promise<Yozuv[]> {
  const { boshi, oxiri } = sanaOraligi(sana);
  const yozuvlar = await db.ovqatYozuvi.findMany({
    where: {
      foydalanuvchiId: S1_FOYDALANUVCHI,
      vaqt: { gte: boshi, lt: oxiri },
    },
    orderBy: { vaqt: "asc" },
    select: YOZUV_MAYDONLARI,
  });
  return yozuvlar.map(korinishgaOtkaz);
}
