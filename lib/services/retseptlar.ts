// Foydalanuvchi tomonidagi retseptlar (S6 6-task, R1–R3): faqat chop etilganlar, kontent
// foydalanuvchi tilida, masalliqlar va qadamlar faqat PRO huquqi bilan. Sevimlilar PRO.

import type { Til } from "../lugat/tarjima.ts";
import { db } from "../db.ts";
import type { Huquqlar } from "./huquqlar.ts";
import { uchTildaOqi } from "./retsept-admin-hisob.ts";
import {
  kategoriyalarRoyxati,
  matnTilda,
  type RetseptDetaliJavobi,
  type RetseptKartasi,
  type RetseptlarJavobi,
  type RetseptQulfi,
  retseptRasmYoli,
  royxatTilda,
} from "./retsept-hisob.ts";

const KARTA_MAYDONLARI = {
  id: true,
  nomi: true,
  nomiRu: true,
  nomiEn: true,
  kaloriya: true,
  vaqtDaqiqa: true,
  murakkablik: true,
  rasmKaliti: true,
  yangilangan: true,
  kategoriya: { select: { nomi: true } },
} as const;

type KartaQatori = {
  id: string;
  nomi: string;
  nomiRu: string;
  nomiEn: string;
  kaloriya: number | null;
  vaqtDaqiqa: number | null;
  murakkablik: string | null;
  rasmKaliti: string | null;
  yangilangan: Date;
  kategoriya: { nomi: string } | null;
};

function qulf(huquq: Huquqlar): RetseptQulfi {
  return { toliqMatn: !huquq.retseptToliqMatni, sevimli: !huquq.sevimliRetseptlar };
}

function karta(r: KartaQatori, til: Til, sevimli: boolean): RetseptKartasi {
  return {
    id: r.id,
    nomi: matnTilda(r.nomi, r.nomiRu, r.nomiEn, til),
    kategoriya: r.kategoriya?.nomi ?? null,
    kaloriya: r.kaloriya,
    vaqtDaqiqa: r.vaqtDaqiqa,
    murakkablik: r.murakkablik,
    rasm: r.rasmKaliti ? retseptRasmYoli(r.id, r.yangilangan.getTime()) : null,
    sevimli,
  };
}

/** Foydalanuvchining sevimli retsept id'lari. */
async function sevimliIdlar(foydalanuvchiId: string): Promise<Set<string>> {
  const qatorlar = await db.sevimliRetsept.findMany({
    where: { foydalanuvchiId },
    select: { retseptId: true },
  });
  return new Set(qatorlar.map((q) => q.retseptId));
}

/** R1: chop etilgan retseptlar, yangisi yuqorida; kategoriyalar ro'yxati va qulf bayroqlari. */
export async function chopEtilganRetseptlar(
  foydalanuvchiId: string,
  til: Til,
  huquq: Huquqlar,
): Promise<RetseptlarJavobi> {
  const [qatorlar, sevimlilar] = await Promise.all([
    db.retsept.findMany({
      where: { holat: "chop_etilgan" },
      orderBy: [{ chopEtilgan: "desc" }, { yaratilgan: "desc" }],
      select: KARTA_MAYDONLARI,
    }),
    sevimliIdlar(foydalanuvchiId),
  ]);
  const retseptlar = qatorlar.map((r) => karta(r, til, sevimlilar.has(r.id)));
  return { retseptlar, kategoriyalar: kategoriyalarRoyxati(retseptlar), qulf: qulf(huquq) };
}

/**
 * R2/R3: bitta chop etilgan retsept. PRO'ga masalliqlar va qadamlar foydalanuvchi tilida;
 * FREE'ga faqat ularning soni — matn javobga umuman kirmaydi. Topilmasa yoki qoralama — null.
 */
export async function retseptDetali(
  id: string,
  foydalanuvchiId: string,
  til: Til,
  huquq: Huquqlar,
): Promise<RetseptDetaliJavobi | null> {
  const r = await db.retsept.findFirst({
    where: { id, holat: "chop_etilgan" },
    select: {
      ...KARTA_MAYDONLARI,
      porsiya: true,
      oqsil: true,
      yog: true,
      uglevod: true,
      masalliqlar: true,
      qadamlar: true,
      sevimlilar: { where: { foydalanuvchiId }, select: { retseptId: true } },
    },
  });
  if (!r) return null;

  const asos = karta(r, til, r.sevimlilar.length > 0);
  const masalliqlar = royxatTilda(uchTildaOqi(r.masalliqlar), til);
  const qadamlar = royxatTilda(uchTildaOqi(r.qadamlar), til);

  if (!huquq.retseptToliqMatni) {
    return {
      retsept: { ...asos, yopiq: true, porsiya: r.porsiya, masalliqSoni: masalliqlar.length, qadamSoni: qadamlar.length },
      qulf: qulf(huquq),
    };
  }
  return {
    retsept: {
      ...asos,
      yopiq: false,
      porsiya: r.porsiya,
      oqsil: r.oqsil,
      yog: r.yog,
      uglevod: r.uglevod,
      masalliqlar,
      qadamlar,
    },
    qulf: qulf(huquq),
  };
}

/** Sevimliga qo'shish; retsept chop etilmagan yoki yo'q bo'lsa "topilmadi". Takror qo'shish xato emas. */
export async function sevimligaQosh(foydalanuvchiId: string, retseptId: string): Promise<"ok" | "topilmadi"> {
  const bor = await db.retsept.findFirst({
    where: { id: retseptId, holat: "chop_etilgan" },
    select: { id: true },
  });
  if (!bor) return "topilmadi";
  await db.sevimliRetsept.upsert({
    where: { foydalanuvchiId_retseptId: { foydalanuvchiId, retseptId } },
    create: { foydalanuvchiId, retseptId },
    update: {},
  });
  return "ok";
}

/** Sevimlidan olib tashlash; bo'lmasa ham xato emas. */
export async function sevimlidanOl(foydalanuvchiId: string, retseptId: string): Promise<void> {
  await db.sevimliRetsept.deleteMany({ where: { foydalanuvchiId, retseptId } });
}
