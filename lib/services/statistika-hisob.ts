// P1 dagi PRO bo'limlari — "Batafsil ovqatlanish statistikasi" va "Haftalik ovqatlanish
// hisoboti" (qolip: prototip/ui_kits/mobile-app/data-nutrition.jsx, `detailedStats` va
// `weekReport`). Sof modul: bazaga tegmaydi, sinovda to'g'ridan-to'g'ri chaqiriladi.
//
// Yozuvsiz kun — ma'lumot yo'qligi, nol kaloriyali kun emas: o'rtachalarga kirmaydi.

import { qoshniSana } from "./yozuv-hisob.ts";

/** Yozuvi bor bitta kun (`kunlik_xulosa` qatori) va o'sha kunda amal qilgan kaloriya normasi. */
export type StatistikaKuni = {
  sana: string;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
  score: number | null;
  normaKaloriya: number;
};

export type Norma = { kaloriya: number; oqsil: number; yog: number; uglevod: number };

export type StatistikaOraligi = 7 | 30;
export const STATISTIKA_ORALIQLARI: readonly StatistikaOraligi[] = [7, 30];

export type KunKaloriyasi = { sana: string; kaloriya: number };

export type BatafsilStatistika = {
  kunlar: number;
  ortachaKaloriya: number;
  ortachaOqsil: number;
  ortachaYog: number;
  ortachaUglevod: number;
  /** Makrolarning kaloriyadagi ulushi, %: oqsil / yog' / uglevod. */
  taqsimot: { oqsil: number; yog: number; uglevod: number };
  normagaMos: number;
  normadanOshgan: number;
  engPast: KunKaloriyasi;
  engBaland: KunKaloriyasi;
  /** Oraliqdagi kunlarning necha foizida yozuv bor. */
  kuzatilganUlush: number;
  ortachaScore: number | null;
};

export type HaftalikHisobot = {
  kunlar: number;
  ortachaKaloriya: number;
  /** Shu hafta − o'tgan hafta o'rtachasi; o'tgan haftada yozuv bo'lmasa null. */
  farq: number | null;
  ortachaOqsil: number;
  normagaMos: number;
  ortachaScore: number | null;
  /** Oxirgi 7 kun, eskidan yangiga; yozuvsiz kunda null — ustun emas, bo'shliq. */
  kunBoyicha: { sana: string; kaloriya: number | null }[];
};

/** Norma ±10% — prototipdagi "normaga mos kun" ta'rifi. */
function normagaMosmi(kun: StatistikaKuni): boolean {
  return Math.abs(kun.kaloriya - kun.normaKaloriya) <= kun.normaKaloriya * 0.1;
}

function ortacha(kunlar: readonly StatistikaKuni[], olish: (kun: StatistikaKuni) => number): number {
  return kunlar.reduce((jami, kun) => jami + olish(kun), 0) / kunlar.length;
}

function ortachaScore(kunlar: readonly StatistikaKuni[]): number | null {
  const ballar = kunlar.flatMap((kun) => (kun.score === null ? [] : [kun.score]));
  return ballar.length ? Math.round(ballar.reduce((jami, ball) => jami + ball, 0) / ballar.length) : null;
}

/** [dan, gacha] oralig'idagi kunlar (sana matni "YYYY-MM-DD" — leksik solishtirish to'g'ri). */
function oraliqda(kunlar: readonly StatistikaKuni[], dan: string, gacha: string): StatistikaKuni[] {
  return kunlar.filter((kun) => kun.sana >= dan && kun.sana <= gacha);
}

/**
 * Oxirgi `oraliq` kun bo'yicha statistika; yozuvi bor kun ikkitadan kam bo'lsa null.
 * `birinchiKun` — hisob ochilgan sana: undan oldingi kunlar "kuzatilmagan" deb sanalmaydi,
 * aks holda uch kunlik foydalanuvchi 30 kunning 10 foizini kuzatgandek ko'rinardi.
 */
export function batafsilStatistika(
  kunlar: readonly StatistikaKuni[],
  bugun: string,
  oraliq: StatistikaOraligi,
  birinchiKun: string,
): BatafsilStatistika | null {
  const boshi = qoshniSana(bugun, -(oraliq - 1));
  const tanlangan = oraliqda(kunlar, boshi, bugun);
  if (tanlangan.length < 2) return null;

  const oqsil = ortacha(tanlangan, (kun) => kun.oqsil);
  const yog = ortacha(tanlangan, (kun) => kun.yog);
  const uglevod = ortacha(tanlangan, (kun) => kun.uglevod);
  const makroKaloriya = oqsil * 4 + yog * 9 + uglevod * 4;
  const ulush = (kaloriya: number) => (makroKaloriya ? Math.round((kaloriya / makroKaloriya) * 100) : 0);

  const tartibda = [...tanlangan].sort((a, b) => a.kaloriya - b.kaloriya);
  const past = tartibda[0];
  const baland = tartibda[tartibda.length - 1];

  const hisobBoshi = birinchiKun > boshi ? birinchiKun : boshi;
  const oraliqKunlari = Math.round((Date.parse(bugun) - Date.parse(hisobBoshi)) / 86_400_000) + 1;

  return {
    kunlar: tanlangan.length,
    ortachaKaloriya: Math.round(ortacha(tanlangan, (kun) => kun.kaloriya)),
    ortachaOqsil: Math.round(oqsil),
    ortachaYog: Math.round(yog),
    ortachaUglevod: Math.round(uglevod),
    taqsimot: { oqsil: ulush(oqsil * 4), yog: ulush(yog * 9), uglevod: ulush(uglevod * 4) },
    normagaMos: tanlangan.filter(normagaMosmi).length,
    normadanOshgan: tanlangan.filter((kun) => kun.kaloriya > kun.normaKaloriya).length,
    engPast: { sana: past.sana, kaloriya: Math.round(past.kaloriya) },
    engBaland: { sana: baland.sana, kaloriya: Math.round(baland.kaloriya) },
    kuzatilganUlush: Math.min(100, Math.round((tanlangan.length / Math.max(1, oraliqKunlari)) * 100)),
    ortachaScore: ortachaScore(tanlangan),
  };
}

/** Oxirgi 7 kun o'zidan oldingi 7 kun bilan; shu haftada yozuvli kun uchtadan kam bo'lsa null. */
export function haftalikHisobot(kunlar: readonly StatistikaKuni[], bugun: string): HaftalikHisobot | null {
  const joriy = oraliqda(kunlar, qoshniSana(bugun, -6), bugun);
  if (joriy.length < 3) return null;
  const oldingi = oraliqda(kunlar, qoshniSana(bugun, -13), qoshniSana(bugun, -7));

  const joriyKaloriya = ortacha(joriy, (kun) => kun.kaloriya);
  const oldingiKaloriya = oldingi.length ? ortacha(oldingi, (kun) => kun.kaloriya) : null;
  const sanaBoyicha = new Map(joriy.map((kun) => [kun.sana, kun]));

  return {
    kunlar: joriy.length,
    ortachaKaloriya: Math.round(joriyKaloriya),
    farq: oldingiKaloriya === null ? null : Math.round(joriyKaloriya - oldingiKaloriya),
    ortachaOqsil: Math.round(ortacha(joriy, (kun) => kun.oqsil)),
    normagaMos: joriy.filter(normagaMosmi).length,
    ortachaScore: ortachaScore(joriy),
    kunBoyicha: Array.from({ length: 7 }, (_, i) => {
      const sana = qoshniSana(bugun, i - 6);
      const kun = sanaBoyicha.get(sana);
      return { sana, kaloriya: kun ? Math.round(kun.kaloriya) : null };
    }),
  };
}
