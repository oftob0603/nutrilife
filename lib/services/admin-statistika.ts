// A10 statistika (admin-tz.md): 5 metrikaning kunlik seriyasi va daromad — hammasi mavjud
// jadvallardan, Toshkent kuni bo'yicha. Kunga guruhlash SQL'da (Prisma groupBy sanani
// mintaqaga ko'chira olmaydi), qolgan hisob statistika-hisob.ts'da.

import { db } from "../db.ts";
import { Prisma } from "../generated/prisma/client.ts";
import {
  daromadHisobi,
  davrBoshi,
  davrKunlari,
  kartaRaqami,
  kogortaYetilgan,
  kunlargaYoy,
  METRIKALAR,
  NARXLI_TARIFLAR,
  retentionFoizi,
  type Daromad,
  type DaromadQatori,
  type Davr,
  type MetrikaKaliti,
  type Nuqta,
} from "./admin-statistika-hisob.ts";
import { bugunSana, sanaOraligi } from "./yozuv-hisob.ts";

export type MetrikaSeriyasi = {
  kalit: MetrikaKaliti;
  nuqtalar: Nuqta[];
  /** Karta raqami: yig'indi, oxirgi kun yoki davr nisbati; hisoblab bo'lmasa null. */
  jami: number | null;
};

export type Statistika = {
  davr: Davr;
  bugun: string;
  metrikalar: MetrikaSeriyasi[];
  daromad: Daromad;
};

/** DATE ustuni Prisma'da UTC yarim tun bo'lib keladi — "YYYY-MM-DD" ga qaytariladi. */
function sanaMatni(sana: Date): string {
  return sana.toISOString().slice(0, 10);
}

function xarita(qatorlar: { sana: Date; soni: number }[]): Map<string, number> {
  return new Map(qatorlar.map((q) => [sanaMatni(q.sana), Number(q.soni)]));
}

/** Yangi hisoblar — `foydalanuvchilar.yaratilgan` Toshkent kuniga (UTC+5) o'tkazib guruhlanadi. */
async function yangiHisoblar(boshi: Date, oxiri: Date): Promise<Map<string, number>> {
  const qatorlar = await db.$queryRaw<{ sana: Date; soni: number }[]>`
    SELECT (yaratilgan + interval '5 hours')::date AS sana, count(*)::int AS soni
    FROM foydalanuvchilar
    WHERE yaratilgan >= ${boshi} AND yaratilgan < ${oxiri}
    GROUP BY 1`;
  return xarita(qatorlar);
}

/** Kunlik faol — `hodisalar.kunlik_faollik`, kuniga bitta qator, shuning uchun count. */
async function kunlikFaollar(boshiSana: Date, bugunSana: Date): Promise<Map<string, number>> {
  const guruhlar = await db.hodisa.groupBy({
    by: ["sana"],
    where: { tur: "kunlik_faollik", sana: { gte: boshiSana, lte: bugunSana } },
    _count: { _all: true },
  });
  return new Map(guruhlar.map((g) => [sanaMatni(g.sana), g._count._all]));
}

/** Skanlar — `skan_hisobi.soni` (limitdan yeyilganlar) kun bo'yicha yig'indi. */
async function skanlar(boshiSana: Date, bugunSana: Date): Promise<Map<string, number>> {
  const guruhlar = await db.skanHisobi.groupBy({
    by: ["sana"],
    where: { sana: { gte: boshiSana, lte: bugunSana } },
    _sum: { soni: true },
  });
  return new Map(guruhlar.map((g) => [sanaMatni(g.sana), g._sum.soni ?? 0]));
}

/**
 * PRO obunachilar — har kun uchun o'sha kunning istalgan lahzasida faol obunasi bo'lgan
 * alohida foydalanuvchilar. Kun chegaralari Toshkent (UTC+5): kun boshi = sana − 5 soat.
 */
async function proObunachilar(boshi: string, bugun: string): Promise<Map<string, number>> {
  const qatorlar = await db.$queryRaw<{ sana: Date; soni: number }[]>`
    SELECT k.sana::date AS sana, count(DISTINCT o.foydalanuvchi_id)::int AS soni
    FROM generate_series(${boshi}::date, ${bugun}::date, interval '1 day') AS k(sana)
    LEFT JOIN obunalar o
      ON o.boshlanish < (k.sana + interval '1 day' - interval '5 hours')
     AND o.tugash > (k.sana - interval '5 hours')
    GROUP BY 1`;
  return xarita(qatorlar);
}

type Kogorta = { sana: Date; royxat: number; qaytgan: number };

/**
 * 7-kun retention kogortalari (lib/services/hodisalar.ts so'rovi): D kuni `royxat` yozilganlar
 * va ulardan D+7 kuni `kunlik_faollik` bo'lganlar. Adminlar kogortaga kirmaydi; hisobi o'chgan
 * (egasi bo'sh qator) kogortada qoladi va qaytmagan sanaladi.
 */
async function retentionKogortalari(boshi: string, bugun: string): Promise<Kogorta[]> {
  return db.$queryRaw<Kogorta[]>`
    SELECT r.sana AS sana, count(*)::int AS royxat, count(f.id)::int AS qaytgan
    FROM hodisalar r
    LEFT JOIN foydalanuvchilar u ON u.id = r.foydalanuvchi_id
    LEFT JOIN hodisalar f
      ON f.foydalanuvchi_id = r.foydalanuvchi_id
     AND f.tur = 'kunlik_faollik'
     AND f.sana = r.sana + 7
    WHERE r.tur = 'royxat'
      AND r.sana >= ${boshi}::date
      AND r.sana <= ${bugun}::date - 7
      AND (u.rol IS NULL OR u.rol <> 'admin')
    GROUP BY r.sana`;
}

/** Daromad qatorlari: obuna yaratilgan Toshkent kuni · tarif · soni, faqat narxli tariflar. */
async function daromadQatorlari(): Promise<DaromadQatori[]> {
  const qatorlar = await db.$queryRaw<{ sana: Date; tarif: string; soni: number }[]>`
    SELECT (yaratilgan + interval '5 hours')::date AS sana, tarif, count(*)::int AS soni
    FROM obunalar
    WHERE tarif IN (${Prisma.join([...NARXLI_TARIFLAR])})
    GROUP BY 1, 2`;
  return qatorlar.map((q) => ({ sana: sanaMatni(q.sana), tarif: q.tarif, soni: Number(q.soni) }));
}

/** A10 — davr bo'yicha metrikalar va daromad, bitta so'rov to'plamida. */
export async function statistika(davr: Davr): Promise<Statistika> {
  const bugun = bugunSana();
  const boshi = davrBoshi(bugun, davr);
  const kunlar = davrKunlari(bugun, davr);
  const boshiSana = new Date(`${boshi}T00:00:00.000Z`);
  const bugunSanaDate = new Date(`${bugun}T00:00:00.000Z`);
  const { boshi: boshiLahza } = sanaOraligi(boshi);
  const { oxiri: oxiriLahza } = sanaOraligi(bugun);

  const [yangi, faol, skan, pro, kogortalar, daromad] = await Promise.all([
    yangiHisoblar(boshiLahza, oxiriLahza),
    kunlikFaollar(boshiSana, bugunSanaDate),
    skanlar(boshiSana, bugunSanaDate),
    proObunachilar(boshi, bugun),
    retentionKogortalari(boshi, bugun),
    daromadQatorlari(),
  ]);

  // Retention: yetilmagan (oxirgi 7 kun) va ro'yxatsiz kunlar — null; davr nisbati jami kogortadan.
  const kogorta = new Map(kogortalar.map((k) => [sanaMatni(k.sana), k]));
  let royxatJami = 0;
  let qaytganJami = 0;
  const retentionNuqtalari: Nuqta[] = kunlar.map((sana) => {
    const k = kogorta.get(sana);
    if (!k || !kogortaYetilgan(sana, bugun)) return { sana, qiymat: null };
    royxatJami += Number(k.royxat);
    qaytganJami += Number(k.qaytgan);
    return { sana, qiymat: retentionFoizi(Number(k.royxat), Number(k.qaytgan)) };
  });

  const seriyalar: Record<MetrikaKaliti, Nuqta[]> = {
    yangi: kunlargaYoy(kunlar, yangi),
    faol: kunlargaYoy(kunlar, faol),
    skan: kunlargaYoy(kunlar, skan),
    pro: kunlargaYoy(kunlar, pro),
    retention: retentionNuqtalari,
  };

  return {
    davr,
    bugun,
    metrikalar: METRIKALAR.map((m) => ({
      kalit: m.kalit,
      nuqtalar: seriyalar[m.kalit],
      jami: kartaRaqami(m, seriyalar[m.kalit], retentionFoizi(royxatJami, qaytganJami)),
    })),
    daromad: daromadHisobi(daromad, bugun),
  };
}
