// Admin paneldan taom bazasini tahrirlash (S6 4-task, admin-tz.md A6/A7): ro'yxat, karta,
// yaratish, yangilash, kategoriyalar. Har saqlash `admin_amallari` ga shu tranzaksiyada yoziladi
// (admin-tz.md §4); sabab so'ralmaydi — u faqat PRO, bloklash va o'chirishda majburiy.

import { db } from "../db.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import { SAHIFA_HAJMI } from "./admin-hisob.ts";
import { ombordanOchir, omborgaYoz, oqishHavolasi } from "./ombor.ts";
import { rasmKengaytmasi, type RasmTuri } from "./rasm-hisob.ts";
import { slugYasa, type TaomFiltri, type TaomKirishi } from "./taom-admin-hisob.ts";

// Uzoqdagi bazaga har so'rov ~0,4 s — standart tranzaksiya chegarasi yetmaydi (obuna-admin.ts kabi).
const TRANZAKSIYA_VAQTI = { maxWait: 10_000, timeout: 20_000 };

export type Kategoriya = { id: string; nomi: string };

/** Kategoriyalar nomi bo'yicha — A7 tanlovi va A6 ustuni uchun. */
export async function kategoriyalarRoyxati(): Promise<Kategoriya[]> {
  return db.kategoriya.findMany({ orderBy: { nomi: "asc" }, select: { id: true, nomi: true } });
}

/** Yangi kategoriya; nomi band bo'lsa (katta-kichik harf farqsiz) "band". */
export async function kategoriyaQoshish(nomi: string): Promise<Kategoriya | "band"> {
  const bor = await db.kategoriya.findFirst({
    where: { nomi: { equals: nomi, mode: "insensitive" } },
    select: { id: true },
  });
  if (bor) return "band";
  return db.kategoriya.create({ data: { nomi }, select: { id: true, nomi: true } });
}

/** A6 jadval qatori. */
export type TaomQatori = {
  id: string;
  nomi: string;
  nomiRu: string;
  nomiEn: string;
  olchovMiqdori: number;
  olchovBirligi: string;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
  rasmBor: boolean;
  kategoriya: string | null;
  yaratilgan: string;
};

export type TaomlarSahifasi = { qatorlar: TaomQatori[]; jami: number; sahifa: number };

function qidiruvSharti(q: string | null): Prisma.TaomWhereInput {
  if (!q) return {};
  const mos = { contains: q, mode: "insensitive" as const };
  return { OR: [{ nomi: mos }, { nomiRu: mos }, { nomiEn: mos }] };
}

function filtrSharti(filtr: TaomFiltri): Prisma.TaomWhereInput {
  switch (filtr) {
    case "tarjimasiz":
      return { OR: [{ nomiRu: "" }, { nomiEn: "" }] };
    case "rasmsiz":
      return { rasm: null };
    default:
      return {};
  }
}

const QATOR_MAYDONLARI = {
  id: true,
  nomi: true,
  nomiRu: true,
  nomiEn: true,
  olchovMiqdori: true,
  olchovBirligi: true,
  kaloriya: true,
  oqsil: true,
  yog: true,
  uglevod: true,
  rasm: true,
  yaratilgan: true,
  kategoriya: { select: { nomi: true } },
} as const;

/** A6 ro'yxati: qidiruv uch tilda, filtr, 50 tadan sahifa; o'zbekcha nom bo'yicha tartib. */
export async function taomlarRoyxati(
  q: string | null,
  filtr: TaomFiltri,
  sahifa: number,
): Promise<TaomlarSahifasi> {
  const where: Prisma.TaomWhereInput = { AND: [qidiruvSharti(q), filtrSharti(filtr)] };
  const [jami, taomlar] = await Promise.all([
    db.taom.count({ where }),
    db.taom.findMany({
      where,
      orderBy: { nomi: "asc" },
      skip: (sahifa - 1) * SAHIFA_HAJMI,
      take: SAHIFA_HAJMI,
      select: QATOR_MAYDONLARI,
    }),
  ]);
  const qatorlar = taomlar.map(
    (t): TaomQatori => ({
      id: t.id,
      nomi: t.nomi,
      nomiRu: t.nomiRu,
      nomiEn: t.nomiEn,
      olchovMiqdori: t.olchovMiqdori,
      olchovBirligi: t.olchovBirligi,
      kaloriya: t.kaloriya,
      oqsil: t.oqsil,
      yog: t.yog,
      uglevod: t.uglevod,
      rasmBor: t.rasm !== null,
      kategoriya: t.kategoriya?.nomi ?? null,
      yaratilgan: t.yaratilgan.toISOString(),
    }),
  );
  return { qatorlar, jami, sahifa };
}

/** A7 kartasi — shakl boshlang'ich qiymatlari. */
export type TaomKartasi = {
  id: string;
  nomi: string;
  nomiRu: string;
  nomiEn: string;
  rasm: string | null;
  olchovMiqdori: number;
  olchovBirligi: string;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
  porsiyalar: number[];
  kategoriyaId: string | null;
  yaratilgan: string;
};

const KARTA_MAYDONLARI = {
  id: true,
  nomi: true,
  nomiRu: true,
  nomiEn: true,
  rasm: true,
  olchovMiqdori: true,
  olchovBirligi: true,
  kaloriya: true,
  oqsil: true,
  yog: true,
  uglevod: true,
  porsiyalar: true,
  kategoriyaId: true,
  yaratilgan: true,
} as const;

export async function taomKartasi(id: string): Promise<TaomKartasi | null> {
  const taom = await db.taom.findUnique({ where: { id }, select: KARTA_MAYDONLARI });
  return taom ? { ...taom, yaratilgan: taom.yaratilgan.toISOString() } : null;
}

/** A7'dan kelgan rasm: baytlar va mazmunidan aniqlangan turi. */
export type YangiRasm = { baytlar: Uint8Array<ArrayBuffer>; tur: RasmTuri };

/** Taom rasmi hamma uchun ochiq yo'l (app/api/taom-rasmlari); `v` — brauzer keshini yangilash uchun. */
function rasmYoli(id: string, vaqt: number): string {
  return `/api/taom-rasmlari/${id}?v=${vaqt}`;
}

function rasmKaliti(id: string, vaqt: number, tur: RasmTuri): string {
  return `taomlar/${id}/${vaqt}.${rasmKengaytmasi(tur)}`;
}

/** Bo'sh slug: band bo'lsa `-2`, `-3`... qo'shiladi. */
async function boshSlug(tx: Prisma.TransactionClient, nomi: string): Promise<string> {
  const asos = slugYasa(nomi);
  for (let n = 1; n < 100; n++) {
    const id = n === 1 ? asos : `${asos}-${n}`;
    if (!(await tx.taom.findUnique({ where: { id }, select: { id: true } }))) return id;
  }
  throw new Error(`Bo'sh slug topilmadi: ${asos}`);
}

/** Jurnal uchun taomning qisqa surati. */
function surat(k: TaomKirishi): Prisma.InputJsonObject {
  return {
    nomi: k.nomi,
    nomiRu: k.nomiRu,
    nomiEn: k.nomiEn,
    olchov: `${k.olchovMiqdori} ${k.olchovBirligi}`,
    kaloriya: k.kaloriya,
    oqsil: k.oqsil,
    yog: k.yog,
    uglevod: k.uglevod,
    porsiyalar: k.porsiyalar,
    kategoriyaId: k.kategoriyaId,
  };
}

/**
 * Yangi taom: id o'zbekcha nomdan slug. Rasm bo'lsa avval omborga yoziladi; baza yozuvi
 * bo'lmasa fayl o'chiriladi — egasiz fayl qolmaydi. Kategoriya id'si yo'q bo'lsa "kategoriya_yoq".
 */
export async function taomYaratish(
  adminId: string,
  kirish: TaomKirishi,
  rasm: YangiRasm | null,
): Promise<{ id: string } | "kategoriya_yoq"> {
  if (!(await kategoriyaBormi(kirish.kategoriyaId))) return "kategoriya_yoq";
  const vaqt = Date.now();
  // Slug tranzaksiyadan tashqarida ham band bo'lishi mumkin — unique xatosi tashqariga chiqadi.
  const id = await db.$transaction((tx) => boshSlug(tx, kirish.nomi));

  const kalit = rasm ? rasmKaliti(id, vaqt, rasm.tur) : null;
  if (rasm && kalit) await omborgaYoz(kalit, rasm.baytlar, rasm.tur);

  try {
    await db.$transaction(async (tx) => {
      await tx.taom.create({
        data: {
          id,
          ...kirish,
          rasm: kalit ? rasmYoli(id, vaqt) : null,
          rasmKaliti: kalit,
        },
      });
      await tx.adminAmali.create({
        data: {
          adminId,
          tur: "taom_qoshish",
          tafsilot: kirish.nomi,
          sabab: "",
          yangi: { id, rasm: kalit !== null, ...surat(kirish) },
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
 * Mavjud taomni yangilash: id o'zgarmaydi. Yangi rasm kelsa eskisi (faqat admin yuklagani,
 * `rasmKaliti` bor bo'lsa) saqlangach ombordan o'chiriladi; `public/` rasmlari tegilmaydi.
 */
export async function taomYangilash(
  adminId: string,
  id: string,
  kirish: TaomKirishi,
  rasm: YangiRasm | null,
): Promise<"ok" | "topilmadi" | "kategoriya_yoq"> {
  const eski = await db.taom.findUnique({ where: { id }, select: KARTA_MAYDONLARI });
  if (!eski) return "topilmadi";
  if (!(await kategoriyaBormi(kirish.kategoriyaId))) return "kategoriya_yoq";

  const vaqt = Date.now();
  const kalit = rasm ? rasmKaliti(id, vaqt, rasm.tur) : null;
  if (rasm && kalit) await omborgaYoz(kalit, rasm.baytlar, rasm.tur);

  const eskiKalit = await db.taom
    .findUnique({ where: { id }, select: { rasmKaliti: true } })
    .then((t) => t?.rasmKaliti ?? null);

  try {
    await db.$transaction(async (tx) => {
      await tx.taom.update({
        where: { id },
        data: {
          ...kirish,
          ...(kalit ? { rasm: rasmYoli(id, vaqt), rasmKaliti: kalit } : {}),
        },
      });
      await tx.adminAmali.create({
        data: {
          adminId,
          tur: "taom_tahrir",
          tafsilot: kirish.nomi,
          sabab: "",
          eski: {
            nomi: eski.nomi,
            nomiRu: eski.nomiRu,
            nomiEn: eski.nomiEn,
            olchov: `${eski.olchovMiqdori} ${eski.olchovBirligi}`,
            kaloriya: eski.kaloriya,
            oqsil: eski.oqsil,
            yog: eski.yog,
            uglevod: eski.uglevod,
            porsiyalar: eski.porsiyalar,
            kategoriyaId: eski.kategoriyaId,
          },
          yangi: { rasm: kalit !== null, ...surat(kirish) },
        },
      });
    }, TRANZAKSIYA_VAQTI);
  } catch (xato) {
    if (kalit) await ombordanOchir(kalit).catch(() => {});
    throw xato;
  }

  if (kalit && eskiKalit && eskiKalit !== kalit) await ombordanOchir(eskiKalit).catch(() => {});
  return "ok";
}

async function kategoriyaBormi(id: string | null): Promise<boolean> {
  if (id === null) return true;
  return (await db.kategoriya.findUnique({ where: { id }, select: { id: true } })) !== null;
}

/** Taom rasmining imzoli havolasi (hamma uchun ochiq yo'l orqali); admin yuklamagan bo'lsa null. */
export async function taomRasmHavolasi(id: string): Promise<string | null> {
  const taom = await db.taom.findUnique({ where: { id }, select: { rasmKaliti: true } });
  return taom?.rasmKaliti ? oqishHavolasi(taom.rasmKaliti) : null;
}
