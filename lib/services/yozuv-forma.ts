// Yozuvni tasdiqlash (E7) va tahrirlash (E10) formasining sof qoidalari — bazaga bog'liq
// emas, shuning uchun klient komponentlar ham shu yerdan import qiladi.

import { OVQAT_TURLARI, type OvqatTuri } from "./yozuv-hisob.ts";

export const QIYMAT_MAYDONLARI = ["kaloriya", "oqsil", "yog", "uglevod"] as const;

export type QiymatMaydoni = (typeof QIYMAT_MAYDONLARI)[number];

/**
 * Maydonlar matn bo'lib turadi — foydalanuvchi yozayotgan oraliq holat ("12," yoki bo'sh)
 * yo'qolmasin. `asos` — bitta o'lchov birligiga (1 g yoki 1 dona) to'g'ri keladigan qiymat:
 * miqdor o'zgarganda qiymatlar shundan qayta hisoblanadi, shuning uchun "2" -> "25" -> "250"
 * deb yozish jarayonida aniqlik yo'qolmaydi.
 */
export type Forma = {
  taomNomi: string;
  miqdor: string;
  kaloriya: string;
  oqsil: string;
  yog: string;
  uglevod: string;
  ovqatTuri: OvqatTuri;
  asos: Record<QiymatMaydoni, number | null>;
};

export type FormaXatolari = Partial<Record<"taomNomi" | "miqdor" | QiymatMaydoni, string>>;

export type FormaQiymatlari = {
  taomNomi: string;
  miqdor: number;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
  ovqatTuri: OvqatTuri;
};

/** Matndan son: vergul ham o'nlik ajratgich. Bo'sh yoki son bo'lmasa null. */
export function sonOqi(matn: string): number | null {
  const toza = matn.trim().replace(",", ".");
  if (!toza) return null;
  const son = Number(toza);
  return Number.isFinite(son) ? son : null;
}

function sonMatni(maydon: QiymatMaydoni, qiymat: number): string {
  return String(maydon === "kaloriya" ? Math.round(qiymat) : Math.round(qiymat * 10) / 10);
}

function asosHisobi(qiymat: number | null, miqdor: number | null): number | null {
  return qiymat !== null && qiymat >= 0 && miqdor !== null && miqdor > 0
    ? qiymat / miqdor
    : null;
}

export function boshForma(ovqatTuri: OvqatTuri = OVQAT_TURLARI[1]): Forma {
  return {
    taomNomi: "",
    miqdor: "",
    kaloriya: "",
    oqsil: "",
    yog: "",
    uglevod: "",
    ovqatTuri,
    asos: { kaloriya: null, oqsil: null, yog: null, uglevod: null },
  };
}

/** Tayyor qiymatlardan forma; asos shu qiymatlar va miqdordan chiqariladi. */
export function formaTuz(kirish: {
  taomNomi: string;
  miqdor: number;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
  ovqatTuri?: OvqatTuri;
}): Forma {
  const forma = boshForma(kirish.ovqatTuri);
  forma.taomNomi = kirish.taomNomi;
  forma.miqdor = String(kirish.miqdor);
  for (const maydon of QIYMAT_MAYDONLARI) {
    forma[maydon] = sonMatni(maydon, kirish[maydon]);
    forma.asos[maydon] = asosHisobi(kirish[maydon], kirish.miqdor);
  }
  return forma;
}

/** Miqdor o'zgardi: asosi ma'lum qiymatlar qayta hisoblanadi, qolgani joyida qoladi. */
export function miqdorOzgardi(forma: Forma, matn: string): Forma {
  const yangi: Forma = { ...forma, miqdor: matn };
  const miqdor = sonOqi(matn);
  if (miqdor === null || miqdor <= 0) return yangi;

  for (const maydon of QIYMAT_MAYDONLARI) {
    const asos = forma.asos[maydon];
    if (asos !== null) yangi[maydon] = sonMatni(maydon, asos * miqdor);
  }
  return yangi;
}

/** Qiymat qo'lda tahrirlandi: uning asosi joriy miqdorga nisbatan yangilanadi. */
export function qiymatOzgardi(forma: Forma, maydon: QiymatMaydoni, matn: string): Forma {
  return {
    ...forma,
    [maydon]: matn,
    asos: { ...forma.asos, [maydon]: asosHisobi(sonOqi(matn), sonOqi(forma.miqdor)) },
  };
}

/** Tekshiruv: xato bo'lsa maydon ostida ko'rsatiladi va tasdiq tugmasi o'chadi (dizayn-tz E7). */
export function formaXatolari(forma: Forma): FormaXatolari {
  const xatolar: FormaXatolari = {};
  if (!forma.taomNomi.trim()) xatolar.taomNomi = "Taom nomini kiriting";

  const miqdor = sonOqi(forma.miqdor);
  if (miqdor === null || miqdor <= 0) xatolar.miqdor = "Porsiyani kiriting";

  const kaloriya = sonOqi(forma.kaloriya);
  if (kaloriya === null) xatolar.kaloriya = "Kaloriyani kiriting";
  else if (kaloriya < 0) xatolar.kaloriya = "Kaloriya 0 dan kichik bo'lmaydi";

  // Makro bo'sh qolsa 0 deb olinadi; yozilgan bo'lsa to'g'ri son bo'lishi kerak.
  for (const maydon of ["oqsil", "yog", "uglevod"] as const) {
    const matn = forma[maydon].trim();
    const son = sonOqi(matn);
    if (matn && (son === null || son < 0)) xatolar[maydon] = "Qiymat noto'g'ri";
  }
  return xatolar;
}

/** Saqlash uchun sonlar. Faqat `formaXatolari` bo'sh qaytgandan keyin chaqiriladi. */
export function formaQiymatlari(forma: Forma): FormaQiymatlari {
  return {
    taomNomi: forma.taomNomi.trim(),
    miqdor: sonOqi(forma.miqdor) ?? 0,
    kaloriya: Math.round(sonOqi(forma.kaloriya) ?? 0),
    oqsil: sonOqi(forma.oqsil) ?? 0,
    yog: sonOqi(forma.yog) ?? 0,
    uglevod: sonOqi(forma.uglevod) ?? 0,
    ovqatTuri: forma.ovqatTuri,
  };
}

/**
 * Yozuvdagi porsiya matnini ("350 g", "2 dona") son va birlikka ajratadi — E10'da porsiya
 * soni o'zgarsa qiymatlar shunga nisbatan qayta hisoblanadi. Son topilmasa 1 porsiya.
 */
export function porsiyaniAjrat(porsiya: string): { miqdor: number; birlik: string } {
  const mos = /^\s*(\d+(?:[.,]\d+)?)\s*(.*)$/.exec(porsiya);
  const miqdor = mos ? sonOqi(mos[1]) : null;
  if (!mos || !miqdor || miqdor <= 0) return { miqdor: 1, birlik: "porsiya" };
  return { miqdor, birlik: mos[2].trim() || "g" };
}
