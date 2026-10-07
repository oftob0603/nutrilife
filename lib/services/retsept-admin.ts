// Admin paneldan retseptlar kutubxonasi (S6 5-task, admin-tz.md A8/A9): ro'yxat, karta, yaratish,
// yangilash, chop etish. Har saqlash `admin_amallari` ga shu tranzaksiyada yoziladi (admin-tz.md §4);
// sabab so'ralmaydi — u faqat PRO, bloklash va o'chirishda majburiy.

import { db } from "../db.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import { SAHIFA_HAJMI } from "./admin-hisob.ts";
import { ombordanOchir, omborgaYoz, oqishHavolasi } from "./ombor.ts";
import { rasmKengaytmasi, type RasmTuri } from "./rasm-hisob.ts";
import {
  chopEtishKamchiliklari,
  kamchilikXabari,
  type HolatFiltri,
  type RetseptHolati,
  type RetseptKirishi,
  uchTildaOqi,
  type UchTilda,
} from "./retsept-admin-hisob.ts";

// Uzoqdagi bazaga har so'rov ~0,4 s — standart tranzaksiya chegarasi yetmaydi (obuna-admin.ts kabi).
const TRANZAKSIYA_VAQTI = { maxWait: 10_000, timeout: 20_000 };

/** A8 jadval qatori. */
export type RetseptQatori = {
  id: string;
  nomi: string;
  kategoriya: string | null;
  kaloriya: number | null;
  vaqtDaqiqa: number | null;
  murakkablik: string | null;
  masalliqlar: UchTilda;
  qadamlar: UchTilda;
  holat: RetseptHolati;
  rasmBor: boolean;
  yangilangan: string;
};

export type RetseptlarSahifasi = { qatorlar: RetseptQatori[]; jami: number; sahifa: number };

function holatniOqi(holat: string): RetseptHolati {
  return holat === "chop_etilgan" ? "chop_etilgan" : "qoralama";
}

function filtrSharti(kategoriyaId: string | null, holat: HolatFiltri): Prisma.RetseptWhereInput {
  return {
    ...(kategoriyaId ? { kategoriyaId } : {}),
    ...(holat === "hammasi" ? {} : { holat }),
  };
}

/** A8 ro'yxati: kategoriya va holat filtri, 50 tadan sahifa; oxirgi o'zgargani yuqorida. */
export async function retseptlarRoyxati(
  kategoriyaId: string | null,
  holat: HolatFiltri,
  sahifa: number,
): Promise<RetseptlarSahifasi> {
  const where = filtrSharti(kategoriyaId, holat);
  const [jami, retseptlar] = await Promise.all([
    db.retsept.count({ where }),
    db.retsept.findMany({
      where,
      orderBy: { yangilangan: "desc" },
      skip: (sahifa - 1) * SAHIFA_HAJMI,
      take: SAHIFA_HAJMI,
      select: {
        id: true,
        nomi: true,
        kaloriya: true,
        vaqtDaqiqa: true,
        murakkablik: true,
        masalliqlar: true,
        qadamlar: true,
        holat: true,
        rasmKaliti: true,
        yangilangan: true,
        kategoriya: { select: { nomi: true } },
      },
    }),
  ]);
  const qatorlar = retseptlar.map(
    (r): RetseptQatori => ({
      id: r.id,
      nomi: r.nomi,
      kategoriya: r.kategoriya?.nomi ?? null,
      kaloriya: r.kaloriya,
      vaqtDaqiqa: r.vaqtDaqiqa,
      murakkablik: r.murakkablik,
      masalliqlar: uchTildaOqi(r.masalliqlar),
      qadamlar: uchTildaOqi(r.qadamlar),
      holat: holatniOqi(r.holat),
      rasmBor: r.rasmKaliti !== null,
      yangilangan: r.yangilangan.toISOString(),
    }),
  );
  return { qatorlar, jami, sahifa };
}

/** A9 kartasi — shakl boshlang'ich qiymatlari. */
export type RetseptKartasi = {
  id: string;
  nomi: string;
  nomiRu: string;
  nomiEn: string;
  kategoriyaId: string | null;
  kaloriya: number | null;
  oqsil: number | null;
  yog: number | null;
  uglevod: number | null;
  porsiya: string;
  vaqtDaqiqa: number | null;
  murakkablik: string | null;
  masalliqlar: UchTilda;
  qadamlar: UchTilda;
  holat: RetseptHolati;
  /** Admin yuklagan rasmning ochiq yo'li; yo'q bo'lsa null. */
  rasm: string | null;
  chopEtilgan: string | null;
  yaratilgan: string;
};

const KARTA_MAYDONLARI = {
  id: true,
  nomi: true,
  nomiRu: true,
  nomiEn: true,
  kategoriyaId: true,
  kaloriya: true,
  oqsil: true,
  yog: true,
  uglevod: true,
  porsiya: true,
  vaqtDaqiqa: true,
  murakkablik: true,
  masalliqlar: true,
  qadamlar: true,
  holat: true,
  rasmKaliti: true,
  chopEtilgan: true,
  yaratilgan: true,
  yangilangan: true,
} as const;

/** Retsept rasmi hamma uchun ochiq yo'l (app/api/retsept-rasmlari); `v` — brauzer keshini yangilash uchun. */
function rasmYoli(id: string, vaqt: number): string {
  return `/api/retsept-rasmlari/${id}?v=${vaqt}`;
}

function rasmKaliti(id: string, vaqt: number, tur: RasmTuri): string {
  return `retseptlar/${id}/${vaqt}.${rasmKengaytmasi(tur)}`;
}

export async function retseptKartasi(id: string): Promise<RetseptKartasi | null> {
  const r = await db.retsept.findUnique({ where: { id }, select: KARTA_MAYDONLARI });
  if (!r) return null;
  return {
    id: r.id,
    nomi: r.nomi,
    nomiRu: r.nomiRu,
    nomiEn: r.nomiEn,
    kategoriyaId: r.kategoriyaId,
    kaloriya: r.kaloriya,
    oqsil: r.oqsil,
    yog: r.yog,
    uglevod: r.uglevod,
    porsiya: r.porsiya,
    vaqtDaqiqa: r.vaqtDaqiqa,
    murakkablik: r.murakkablik,
    masalliqlar: uchTildaOqi(r.masalliqlar),
    qadamlar: uchTildaOqi(r.qadamlar),
    holat: holatniOqi(r.holat),
    rasm: r.rasmKaliti ? rasmYoli(r.id, r.yangilangan.getTime()) : null,
    chopEtilgan: r.chopEtilgan?.toISOString() ?? null,
    yaratilgan: r.yaratilgan.toISOString(),
  };
}

/** A9'dan kelgan rasm: baytlar va mazmunidan aniqlangan turi. */
export type YangiRasm = { baytlar: Uint8Array<ArrayBuffer>; tur: RasmTuri };

export type SaqlashNatijasi = { id: string } | "topilmadi" | "kategoriya_yoq" | { toliq_emas: string };

/** Jurnal uchun retseptning qisqa surati (matnlar emas — soni). */
function surat(k: RetseptKirishi, holat: RetseptHolati): Prisma.InputJsonObject {
  return {
    nomi: k.nomi,
    nomiRu: k.nomiRu,
    nomiEn: k.nomiEn,
    kategoriyaId: k.kategoriyaId,
    kaloriya: k.kaloriya,
    oqsil: k.oqsil,
    yog: k.yog,
    uglevod: k.uglevod,
    porsiya: k.porsiya,
    vaqtDaqiqa: k.vaqtDaqiqa,
    murakkablik: k.murakkablik,
    masalliqlar: { uz: k.masalliqlar.uz.length, ru: k.masalliqlar.ru.length, en: k.masalliqlar.en.length },
    qadamlar: { uz: k.qadamlar.uz.length, ru: k.qadamlar.ru.length, en: k.qadamlar.en.length },
    holat,
  };
}

/** Bazaga yoziladigan maydonlar (`amal` tashqarida qoladi). */
function yozuvMaydonlari(k: RetseptKirishi) {
  return {
    nomi: k.nomi,
    nomiRu: k.nomiRu,
    nomiEn: k.nomiEn,
    kategoriyaId: k.kategoriyaId,
    kaloriya: k.kaloriya,
    oqsil: k.oqsil,
    yog: k.yog,
    uglevod: k.uglevod,
    porsiya: k.porsiya,
    vaqtDaqiqa: k.vaqtDaqiqa,
    murakkablik: k.murakkablik,
    masalliqlar: k.masalliqlar as unknown as Prisma.InputJsonObject,
    qadamlar: k.qadamlar as unknown as Prisma.InputJsonObject,
  };
}

/**
 * Saqlashdan keyingi holat: "Chop etish" bosilgan yoki retsept allaqachon chop etilgan bo'lsa —
 * chop etilgan, aks holda qoralama. Chop etilgan to'liq bo'lishi shart.
 */
function maqsadHolat(kirish: RetseptKirishi, joriy: RetseptHolati | null): RetseptHolati {
  return kirish.amal === "chop_etish" || joriy === "chop_etilgan" ? "chop_etilgan" : "qoralama";
}

/**
 * Yangi retsept: id uuid. Rasm bo'lsa avval omborga yoziladi; baza yozuvi bo'lmasa fayl
 * o'chiriladi — egasiz fayl qolmaydi. Kategoriya id'si yo'q bo'lsa "kategoriya_yoq"; chop etish
 * so'ralib retsept to'liq bo'lmasa `toliq_emas`.
 */
export async function retseptYaratish(
  adminId: string,
  kirish: RetseptKirishi,
  rasm: YangiRasm | null,
): Promise<SaqlashNatijasi> {
  if (!(await kategoriyaBormi(kirish.kategoriyaId))) return "kategoriya_yoq";
  const holat = maqsadHolat(kirish, null);
  if (holat === "chop_etilgan") {
    const kamchiliklar = chopEtishKamchiliklari(kirish);
    if (kamchiliklar.length > 0) return { toliq_emas: kamchilikXabari(kamchiliklar) };
  }

  const vaqt = Date.now();
  const id = crypto.randomUUID();
  const kalit = rasm ? rasmKaliti(id, vaqt, rasm.tur) : null;
  if (rasm && kalit) await omborgaYoz(kalit, rasm.baytlar, rasm.tur);

  try {
    await db.$transaction(async (tx) => {
      await tx.retsept.create({
        data: {
          id,
          ...yozuvMaydonlari(kirish),
          holat,
          chopEtilgan: holat === "chop_etilgan" ? new Date(vaqt) : null,
          rasmKaliti: kalit,
        },
      });
      await tx.adminAmali.create({
        data: {
          adminId,
          tur: holat === "chop_etilgan" ? "retsept_chop_etish" : "retsept_qoshish",
          tafsilot: kirish.nomi,
          sabab: "",
          yangi: { id, rasm: kalit !== null, ...surat(kirish, holat) },
        },
      });
    }, TRANZAKSIYA_VAQTI);
  } catch (xato) {
    if (kalit) await ombordanOchir(kalit).catch(() => {});
    throw xato;
  }
  return { id };
}

/**
 * Mavjud retseptni yangilash: id o'zgarmaydi. Qoralamadan chop etilganga o'tish jurnalda
 * `retsept_chop_etish`, qolgani `retsept_tahrir`. Yangi rasm kelsa eskisi saqlangach ombordan
 * o'chiriladi.
 */
export async function retseptYangilash(
  adminId: string,
  id: string,
  kirish: RetseptKirishi,
  rasm: YangiRasm | null,
): Promise<SaqlashNatijasi> {
  const eski = await db.retsept.findUnique({ where: { id }, select: KARTA_MAYDONLARI });
  if (!eski) return "topilmadi";
  if (!(await kategoriyaBormi(kirish.kategoriyaId))) return "kategoriya_yoq";

  const eskiHolat = holatniOqi(eski.holat);
  const holat = maqsadHolat(kirish, eskiHolat);
  if (holat === "chop_etilgan") {
    const kamchiliklar = chopEtishKamchiliklari(kirish);
    if (kamchiliklar.length > 0) return { toliq_emas: kamchilikXabari(kamchiliklar) };
  }
  const chopEtilmoqda = holat === "chop_etilgan" && eskiHolat !== "chop_etilgan";

  const vaqt = Date.now();
  const kalit = rasm ? rasmKaliti(id, vaqt, rasm.tur) : null;
  if (rasm && kalit) await omborgaYoz(kalit, rasm.baytlar, rasm.tur);

  try {
    await db.$transaction(async (tx) => {
      await tx.retsept.update({
        where: { id },
        data: {
          ...yozuvMaydonlari(kirish),
          holat,
          ...(chopEtilmoqda ? { chopEtilgan: new Date(vaqt) } : {}),
          ...(kalit ? { rasmKaliti: kalit } : {}),
          yangilangan: new Date(vaqt),
        },
      });
      await tx.adminAmali.create({
        data: {
          adminId,
          tur: chopEtilmoqda ? "retsept_chop_etish" : "retsept_tahrir",
          tafsilot: kirish.nomi,
          sabab: "",
          eski: {
            nomi: eski.nomi,
            nomiRu: eski.nomiRu,
            nomiEn: eski.nomiEn,
            kategoriyaId: eski.kategoriyaId,
            kaloriya: eski.kaloriya,
            oqsil: eski.oqsil,
            yog: eski.yog,
            uglevod: eski.uglevod,
            porsiya: eski.porsiya,
            vaqtDaqiqa: eski.vaqtDaqiqa,
            murakkablik: eski.murakkablik,
            holat: eskiHolat,
          },
          yangi: { rasm: kalit !== null, ...surat(kirish, holat) },
        },
      });
    }, TRANZAKSIYA_VAQTI);
  } catch (xato) {
    if (kalit) await ombordanOchir(kalit).catch(() => {});
    throw xato;
  }

  if (kalit && eski.rasmKaliti && eski.rasmKaliti !== kalit) {
    await ombordanOchir(eski.rasmKaliti).catch(() => {});
  }
  return { id };
}

async function kategoriyaBormi(id: string | null): Promise<boolean> {
  if (id === null) return true;
  return (await db.kategoriya.findUnique({ where: { id }, select: { id: true } })) !== null;
}

/** Retsept rasmining imzoli havolasi (hamma uchun ochiq yo'l orqali); rasm yo'q bo'lsa null. */
export async function retseptRasmHavolasi(id: string): Promise<string | null> {
  const r = await db.retsept.findUnique({ where: { id }, select: { rasmKaliti: true } });
  return r?.rasmKaliti ? oqishHavolasi(r.rasmKaliti) : null;
}
