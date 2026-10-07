// A10 statistika (admin-tz.md) uchun sof hisob: davr, kunlar ro'yxati, grafik yorliqlari,
// retention foizi va daromad summasi. Bazaga tegmaydi — node bilan alohida sinaladi.

import { TARIF_NARXLARI } from "../tariflar.ts";
import { haftaKuniNomi, kunOyMatni, qoshniSana, sanaQisqa } from "./yozuv-hisob.ts";

export const DAVRLAR = [7, 30, 90] as const;
export type Davr = (typeof DAVRLAR)[number];

/** URL'dagi `davr` qiymati; notanish yoki bo'sh — 30 kun (prototipdagi standart). */
export function davrniOqi(qiymat: unknown): Davr {
  const son = Number(qiymat);
  return (DAVRLAR as readonly number[]).includes(son) ? (son as Davr) : 30;
}

export const METRIKA_KALITLARI = ["yangi", "faol", "skan", "pro", "retention"] as const;
export type MetrikaKaliti = (typeof METRIKA_KALITLARI)[number];

export type MetrikaTavsifi = {
  kalit: MetrikaKaliti;
  nomi: string;
  /** Grafik rangi: `--metrika-1..5` (prototip colors.css, DESIGN.md 11-bo'lim). */
  seriya: 1 | 2 | 3 | 4 | 5;
  birlik: "" | "%";
  /** Karta raqami davr yig'indisi (`yigindi`) yoki oxirgi kun qiymati (`oxirgi`); retention — davr nisbati. */
  jami: "yigindi" | "oxirgi" | "nisbat";
};

/** Prototip `METRIKA` — tartib va ranglar shundan. North star 7-kun retention (DECISIONS 2026-09-21). */
export const METRIKALAR: readonly MetrikaTavsifi[] = [
  { kalit: "yangi", nomi: "Yangi foydalanuvchilar", seriya: 1, birlik: "", jami: "yigindi" },
  { kalit: "faol", nomi: "Kunlik faol", seriya: 2, birlik: "", jami: "oxirgi" },
  { kalit: "skan", nomi: "Skanlar soni", seriya: 3, birlik: "", jami: "yigindi" },
  { kalit: "pro", nomi: "PRO obunachilar", seriya: 4, birlik: "", jami: "oxirgi" },
  { kalit: "retention", nomi: "7-kun retention", seriya: 5, birlik: "%", jami: "nisbat" },
];

/** Davrning kunlari, eskisidan bugungacha: 30 kun — bugun bilan birga 30 ta sana. */
export function davrKunlari(bugun: string, davr: Davr): string[] {
  return Array.from({ length: davr }, (_, i) => qoshniSana(bugun, i - (davr - 1)));
}

/** Davr boshlanadigan sana (kunlar ro'yxatining birinchisi). */
export function davrBoshi(bugun: string, davr: Davr): string {
  return qoshniSana(bugun, -(davr - 1));
}

/**
 * O'q yorliqlari qadamı (prototip MetricChart): 7 kunda har kun, 30 da har 5-kun, 90 da har
 * 15-kun. Ma'lumot siyraklashmaydi, faqat yorliq — 90 ta yozuv kartaga sig'maydi.
 */
export function yorliqQadami(davr: Davr): number {
  return davr <= 7 ? 1 : davr <= 30 ? 5 : 15;
}

/** Qaysi nuqtalar ostida yorliq turadi: har qadamda bittasi va oxirgisi. */
export function yorliqIndekslari(soni: number, davr: Davr): number[] {
  const qadam = yorliqQadami(davr);
  const natija: number[] = [];
  for (let i = 0; i < soni; i++) if (i % qadam === 0 || i === soni - 1) natija.push(i);
  return natija;
}

/** O'q yorlig'i: 7 kunda hafta kuni ("Du"), uzunroq davrda "07.10". */
export function oqYorligi(sana: string, davr: Davr): string {
  return davr <= 7 ? haftaKuniNomi(sana) : sanaQisqa(sana);
}

const HAFTA_KUNLARI_TOLIQ = ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"];

/** Hafta kunining to'liq nomi, kichik harf: "seshanba". */
export function haftaKuniNomiToliq(sana: string): string {
  return HAFTA_KUNLARI_TOLIQ[new Date(`${sana}T00:00:00.000Z`).getUTCDay()];
}

/** Hover'dagi kun: "7-oktabr, seshanba". */
export function kunMatni(sana: string): string {
  return `${kunOyMatni(sana)}, ${haftaKuniNomiToliq(sana)}`;
}

/**
 * 7-kun retention foizi: D kuni ro'yxatdan o'tganlarning D+7 kuni qaytgan ulushi, butun foiz.
 * Ro'yxat bo'lmagan kun — null (grafikda uzilish, nol emas: nol "hech kim qaytmadi" demak).
 */
export function retentionFoizi(royxat: number, qaytgan: number): number | null {
  if (royxat <= 0) return null;
  return Math.round((Math.min(qaytgan, royxat) / royxat) * 100);
}

/** Kogorta yetilganmi: D+7 kuni bugun yoki undan oldin bo'lsa — qaytish allaqachon ma'lum. */
export function kogortaYetilgan(sana: string, bugun: string): boolean {
  return qoshniSana(sana, 7) <= bugun;
}

export type Nuqta = { sana: string; qiymat: number | null };

/** Kunlar ro'yxatini bazadan kelgan qiymatlar bilan to'ldiradi; yo'q kun — `bosh` (odatda 0). */
export function kunlargaYoy(kunlar: string[], qiymatlar: Map<string, number>, bosh: number | null = 0): Nuqta[] {
  return kunlar.map((sana) => ({ sana, qiymat: qiymatlar.get(sana) ?? bosh }));
}

/** Karta raqami: metrika turiga ko'ra yig'indi, oxirgi kun yoki (retention) berilgan nisbat. */
export function kartaRaqami(tavsif: MetrikaTavsifi, nuqtalar: Nuqta[], nisbat: number | null = null): number | null {
  switch (tavsif.jami) {
    case "yigindi":
      return nuqtalar.reduce((s, n) => s + (n.qiymat ?? 0), 0);
    case "oxirgi":
      return nuqtalar.length ? nuqtalar[nuqtalar.length - 1].qiymat : null;
    case "nisbat":
      return nisbat;
  }
}

/**
 * Minglar bo'sh joy bilan: "1 870". Intl emas — server (Node) va brauzer bir xil matn chizsin,
 * aks holda hidratsiya mos kelmaydi (uz-Latn-UZ ikkalasida har xil ajratgich beradi).
 */
export function minglar(qiymat: number): string {
  return String(Math.round(qiymat)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Metrika qiymati matni: "1 870" yoki "38%". */
export function qiymatMatni(qiymat: number | null, birlik: MetrikaTavsifi["birlik"]): string {
  if (qiymat === null) return "—";
  const matn = minglar(qiymat);
  return birlik === "%" ? `${matn}%` : matn;
}

// ——— Daromad ———

/**
 * Obuna qatorining daromadi — tarif narxi (lib/tariflar.ts). Manbadan qat'i nazar: hozircha
 * to'lov yo'q, admin qo'lda bergan PRO ham narxi bilan sanaladi (DECISIONS 2026-10-07).
 * "qolda" tarif (muddat uzaytirish) narxsiz — 0.
 */
export function tarifNarxi(tarif: string): number {
  return TARIF_NARXLARI.find((t) => t.id === tarif)?.narx ?? 0;
}

/** Narxi bor tariflar — daromad so'rovi faqat shularni oladi. */
export const NARXLI_TARIFLAR: readonly string[] = TARIF_NARXLARI.map((t) => t.id);

/** "290 000 so'm" — minglar bo'sh joy bilan, tiyin yo'q. */
export function som(summa: number): string {
  return `${minglar(summa)} so'm`;
}

const OY_NOMLARI = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
// Uch harf kesilmaydi: Iyun va Iyul ikkalasi "Iyu" bo'lib qolardi (prototip OY_QISQA).
const OY_QISQA = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];

/** "2026-10" → "Oktabr". */
export function oyNomi(oy: string): string {
  return OY_NOMLARI[Number(oy.slice(5, 7)) - 1] ?? oy;
}

/** "2026-10" → "Okt". */
export function oyQisqa(oy: string): string {
  return OY_QISQA[Number(oy.slice(5, 7)) - 1] ?? oy;
}

/** Oylar ro'yxati, `boshi` dan `oxiri` gacha ("YYYY-MM"), ikkalasi ham kiradi. */
export function oylarOraligi(boshi: string, oxiri: string): string[] {
  const natija: string[] = [];
  let yil = Number(boshi.slice(0, 4));
  let oy = Number(boshi.slice(5, 7));
  const oxiriYil = Number(oxiri.slice(0, 4));
  const oxiriOy = Number(oxiri.slice(5, 7));
  while (yil < oxiriYil || (yil === oxiriYil && oy <= oxiriOy)) {
    natija.push(`${yil}-${String(oy).padStart(2, "0")}`);
    oy += 1;
    if (oy > 12) {
      oy = 1;
      yil += 1;
    }
  }
  return natija;
}

export type DaromadQatori = { sana: string; tarif: string; soni: number };

export type Daromad = {
  jami: number;
  jamiSoni: number;
  bugun: number;
  bugunSoni: number;
  /** Oxirgi 7 kun, eskisidan bugungacha, bo'sh kun 0. */
  kunlar: { sana: string; summa: number }[];
  /** Birinchi obuna oyidan joriy oygacha (ko'pi bilan 12 oy), bo'sh oy 0. */
  oylar: { oy: string; summa: number }[];
  joriyOy: number;
};

/** Kun · tarif · soni qatorlaridan daromad kartalari va ustunlari. */
export function daromadHisobi(qatorlar: DaromadQatori[], bugun: string): Daromad {
  let jami = 0;
  let jamiSoni = 0;
  let bugunSumma = 0;
  let bugunSoni = 0;
  const kunBoyicha = new Map<string, number>();
  const oyBoyicha = new Map<string, number>();
  let birinchiOy: string | null = null;

  for (const q of qatorlar) {
    const summa = tarifNarxi(q.tarif) * q.soni;
    jami += summa;
    jamiSoni += q.soni;
    if (q.sana === bugun) {
      bugunSumma += summa;
      bugunSoni += q.soni;
    }
    kunBoyicha.set(q.sana, (kunBoyicha.get(q.sana) ?? 0) + summa);
    const oy = q.sana.slice(0, 7);
    oyBoyicha.set(oy, (oyBoyicha.get(oy) ?? 0) + summa);
    if (birinchiOy === null || oy < birinchiOy) birinchiOy = oy;
  }

  const joriyOy = bugun.slice(0, 7);
  const oylarRoyxati = oylarOraligi(birinchiOy ?? joriyOy, joriyOy).slice(-12);

  return {
    jami,
    jamiSoni,
    bugun: bugunSumma,
    bugunSoni,
    kunlar: davrKunlari(bugun, 7).map((sana) => ({ sana, summa: kunBoyicha.get(sana) ?? 0 })),
    oylar: oylarRoyxati.map((oy) => ({ oy, summa: oyBoyicha.get(oy) ?? 0 })),
    joriyOy: oyBoyicha.get(joriyOy) ?? 0,
  };
}
