// Kunlik norma formulasi (onboarding-tz.md, 5-bo'lim; koeffitsientlar — prototip/ui_kits/shared/plan.js).
// Sof modul — bazaga bog'liq emas, klient ham, server ham ishlatadi.
// Norma kod ichida hisoblanadi, AI'ga topshirilmaydi (DECISIONS.md, 2026-09-13).

import type { Faollik, Jins, Maqsad } from "./onboarding-hisob.ts";

/** Yangi variant qo'shilib, koeffitsienti unutilsa `tsc` xato beradi. */
const FAOLLIK_KOEFFITSIENTI: Record<Faollik, number> = {
  kam: 1.2,
  yengil: 1.375,
  ortacha: 1.55,
  juda_faol: 1.725,
};

const MAQSAD_TUZATISHI: Record<Maqsad, number> = {
  vazn_tashlash: -0.15,
  vazn_saqlash: 0,
  vazn_ortdirish: 0.12,
  mushak_yigish: 0.1,
};

/**
 * Pastki chegara, kkal. Busiz ilova ochlik rejimini tavsiya qilib qo'yishi mumkin.
 * Jins aytilmagan bo'lsa yuqoriroq chegara olinadi.
 */
const PASTKI_CHEGARA: Record<Jins, number> = { erkak: 1500, ayol: 1200, aytilmagan: 1500 };

type Ulushlar = { oqsil: number; yog: number; uglevod: number };

const ODATIY_ULUSHLAR: Ulushlar = { oqsil: 0.25, yog: 0.3, uglevod: 0.45 };
const MUSHAK_ULUSHLARI: Ulushlar = { oqsil: 0.3, yog: 0.25, uglevod: 0.45 };

/** 1 g makroning kkal qiymati. */
const KKAL_GRAMMDA: Ulushlar = { oqsil: 4, yog: 9, uglevod: 4 };

/** Onboarding javoblari; vazn — `vazn_yozuvlari` dagi oxirgi o'lchov. Bo'y sm, vazn kg da. */
export type NormaKirishi = {
  jins: string | null;
  yosh: number | null;
  boyi: number | null;
  vazn: number | null;
  faollik: string | null;
  maqsad: string | null;
};

export type Norma = {
  /** Taxminiy kunlik maqsad, kkal. */
  kaloriya: number;
  /** Maqsad tuzatishisiz kunlik sarf (BMR × faollik) — "Nega shunday?" izohi uchun. */
  tdee: number;
  /** Hisob pastki chegaradan past chiqdi va chegara qiymati berildi. */
  chegaralandi: boolean;
  /** Jins aytilmagan — BMR erkak va ayol formulalarining o'rtachasi, natija kengroq taxmin. */
  jinsAytilmagan: boolean;
  /** Grammda. */
  makrolar: Ulushlar;
  /** Foizda (25 / 30 / 45). */
  foizlar: Ulushlar;
};

function kalitmi<T extends string>(jadval: Record<T, number>, qiymat: string | null): qiymat is T {
  return qiymat !== null && Object.hasOwn(jadval, qiymat);
}

function musbatmi(qiymat: number | null): qiymat is number {
  return qiymat !== null && Number.isFinite(qiymat) && qiymat > 0;
}

/**
 * Mifflin-St Jeor BMR × faollik × maqsad tuzatishi. Javoblar to'liq bo'lmasa null —
 * jimgina standart qiymat olinsa, to'g'riga o'xshagan noto'g'ri son chiqadi.
 */
export function normaHisobi(kirish: NormaKirishi): Norma | null {
  const { jins, yosh, boyi, vazn, faollik, maqsad } = kirish;
  if (!kalitmi(PASTKI_CHEGARA, jins)) return null;
  if (!kalitmi(FAOLLIK_KOEFFITSIENTI, faollik)) return null;
  if (!kalitmi(MAQSAD_TUZATISHI, maqsad)) return null;
  if (!musbatmi(yosh) || !musbatmi(boyi) || !musbatmi(vazn)) return null;

  const asos = 10 * vazn + 6.25 * boyi - 5 * yosh;
  const erkak = asos + 5;
  const ayol = asos - 161;
  const bmr = jins === "erkak" ? erkak : jins === "ayol" ? ayol : (erkak + ayol) / 2;

  const sarf = bmr * FAOLLIK_KOEFFITSIENTI[faollik];
  const hisob = Math.round(sarf * (1 + MAQSAD_TUZATISHI[maqsad]));
  const chegara = PASTKI_CHEGARA[jins];
  const chegaralandi = hisob < chegara;
  const kaloriya = chegaralandi ? chegara : hisob;

  const ulushlar = maqsad === "mushak_yigish" ? MUSHAK_ULUSHLARI : ODATIY_ULUSHLAR;
  const gramm = (makro: keyof Ulushlar) =>
    Math.round((kaloriya * ulushlar[makro]) / KKAL_GRAMMDA[makro]);
  const foiz = (makro: keyof Ulushlar) => Math.round(ulushlar[makro] * 100);

  return {
    kaloriya,
    tdee: Math.round(sarf),
    chegaralandi,
    jinsAytilmagan: jins === "aytilmagan",
    makrolar: { oqsil: gramm("oqsil"), yog: gramm("yog"), uglevod: gramm("uglevod") },
    foizlar: { oqsil: foiz("oqsil"), yog: foiz("yog"), uglevod: foiz("uglevod") },
  };
}

/** `rejalar` qatoridagi kunlik maqsad: kaloriya kkal da, makrolar grammda. */
export type Reja = { kaloriya: number; oqsil: number; yog: number; uglevod: number };
