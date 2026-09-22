import { db } from "../db.ts";
import { foydalanuvchiHuquqlari } from "./foydalanuvchilar.ts";
import { kunRejasi } from "./rejalar.ts";
import {
  batafsilStatistika,
  haftalikHisobot,
  type BatafsilStatistika,
  type HaftalikHisobot,
  type Norma,
  type StatistikaKuni,
} from "./statistika-hisob.ts";
import { bugunSana, qoshniSana, sanaOraligi, toshkentSanasi } from "./yozuv-hisob.ts";

export type OvqatStatistikasi =
  | { yopiq: true }
  | {
      yopiq: false;
      /** Joriy norma — makro chiziqlari shunga solishtiriladi. */
      norma: Norma;
      batafsil: { 7: BatafsilStatistika | null; 30: BatafsilStatistika | null };
      haftalik: HaftalikHisobot | null;
    };

/**
 * P1 dagi PRO bo'limlari uchun ma'lumot. FREE va muddati o'tgan PRO faqat `yopiq` oladi —
 * raqamlar serverdan chiqmaydi. Kunlar `kunlik_xulosa` dan (faqat faol yozuvi bor kunlar),
 * har kun o'sha kunda amal qilgan normaga solishtiriladi: vazn o'zgarsa norma ham o'zgaradi,
 * eski kunni yangi normaga o'lchash noto'g'ri bo'lardi. Hisob ochilmagan bo'lsa null.
 */
export async function ovqatStatistikasiniOl(foydalanuvchiId: string): Promise<OvqatStatistikasi | null> {
  const huquq = await foydalanuvchiHuquqlari(foydalanuvchiId);
  if (!huquq) return null;
  if (!huquq.ovqatStatistikasi) return { yopiq: true };

  const bugun = bugunSana();
  // 30 kunlik statistika va 7+7 kunlik hisobot uchun eng uzoq oraliq — 30 kun.
  const boshi = qoshniSana(bugun, -29);
  const [foydalanuvchi, xulosalar, rejalar, norma] = await Promise.all([
    db.foydalanuvchi.findUnique({ where: { id: foydalanuvchiId }, select: { yaratilgan: true } }),
    db.kunlikXulosa.findMany({
      where: { foydalanuvchiId, sana: { gte: new Date(`${boshi}T00:00:00.000Z`) } },
      orderBy: { sana: "asc" },
      select: { sana: true, kaloriya: true, oqsil: true, yog: true, uglevod: true, nutritionScore: true },
    }),
    db.reja.findMany({
      where: { foydalanuvchiId },
      orderBy: { hisoblangan: "asc" },
      select: { kaloriya: true, hisoblangan: true },
    }),
    kunRejasi(foydalanuvchiId, bugun),
  ]);
  if (!foydalanuvchi || !norma) return null;

  // kunRejasi bilan bir xil qoida: shu kun oxirigacha hisoblangan eng so'nggi reja,
  // birinchi rejadan oldingi kunlar — eng birinchisi bilan.
  const kunNormasi = (sana: string): number => {
    const { oxiri } = sanaOraligi(sana);
    const amaldagi = rejalar.findLast((reja) => reja.hisoblangan < oxiri) ?? rejalar[0];
    return amaldagi?.kaloriya ?? norma.kaloriya;
  };

  const kunlar: StatistikaKuni[] = xulosalar.map((xulosa) => {
    // DATE ustuni UTC yarim tuni bo'lib keladi — sana qismi o'sha kunning o'zi.
    const sana = xulosa.sana.toISOString().slice(0, 10);
    return {
      sana,
      kaloriya: xulosa.kaloriya,
      oqsil: xulosa.oqsil,
      yog: xulosa.yog,
      uglevod: xulosa.uglevod,
      score: xulosa.nutritionScore,
      normaKaloriya: kunNormasi(sana),
    };
  });
  const birinchiKun = toshkentSanasi(foydalanuvchi.yaratilgan);

  return {
    yopiq: false,
    norma: {
      kaloriya: Math.round(norma.kaloriya),
      oqsil: Math.round(norma.oqsil),
      yog: Math.round(norma.yog),
      uglevod: Math.round(norma.uglevod),
    },
    batafsil: {
      7: batafsilStatistika(kunlar, bugun, 7, birinchiKun),
      30: batafsilStatistika(kunlar, bugun, 30, birinchiKun),
    },
    haftalik: haftalikHisobot(kunlar, bugun),
  };
}
