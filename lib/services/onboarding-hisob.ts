// Onboarding qoidalari (onboarding-tz.md; ko'rinish va O5 matnlari — prototip/ui_kits/onboarding):
// variantlar, chegaralar, tekshiruv va o'girish.
// Sof modul — bazaga bog'liq emas, klient ham, server ham ishlatadi.
// Matnlar o'zbekcha — lug'at kalitlari (lib/lugat); ekranda `t()` bilan tarjima qilinadi.

import { k, type Kalit } from "../lugat/tarjima.ts";

/**
 * 1 Intro · 2 Ism · 3 Maqsad · 4 Jins va yosh · 5 O'lchovlar · 6 Faollik · 7 Afzalliklar ·
 * 8 Odatlar · 9 Motivatsiya. Til ekrani yo'q: til Telegram'dan olinadi, keyin Sozlamalardan
 * o'zgartiriladi. "Reja tayyorlanmoqda", norma natijasi va paywall S4'da qo'shiladi.
 */
export const QADAMLAR_SONI = 9;
export const MAQSAD_QADAMI = 3;
export const OLCHOV_QADAMI = 5;
/** Shu qadamlarni javobsiz o'tkazib yuborish mumkin — ular normaga ta'sir qilmaydi. */
export const OTKAZILADIGAN_QADAMLAR: readonly number[] = [7, 8, 9];

/** `nomi` va `tavsif` lug'atda bo'lishi shart — yo'q matn `tsc` xatosini beradi. */
type Variant = { qiymat: string; nomi: Kalit; tavsif?: Kalit };

export const MAQSADLAR = [
  { qiymat: "vazn_tashlash", nomi: "Vazn tashlash", tavsif: "Ortiqcha vazndan xalos bo'ling" },
  { qiymat: "vazn_saqlash", nomi: "Vaznni saqlash", tavsif: "Hozirgi vazningizni ushlab turing" },
  { qiymat: "vazn_ortdirish", nomi: "Vazn ortdirish", tavsif: "Sog'lom yo'l bilan vazn qo'shing" },
  { qiymat: "mushak_yigish", nomi: "Mushak yig'ish", tavsif: "Mushak massasini oshiring" },
] as const satisfies readonly Variant[];

export const JINSLAR = [
  { qiymat: "erkak", nomi: "Erkak" },
  { qiymat: "ayol", nomi: "Ayol" },
  { qiymat: "aytilmagan", nomi: "Aytishni xohlamayman" },
] as const satisfies readonly Variant[];

export const FAOLLIKLAR = [
  { qiymat: "kam", nomi: "Kam harakat", tavsif: "Asosan o'tirib ishlayman" },
  { qiymat: "yengil", nomi: "Yengil faol", tavsif: "Haftada 1–3 kun harakat" },
  { qiymat: "ortacha", nomi: "O'rtacha faol", tavsif: "Haftada 3–5 kun mashq" },
  {
    qiymat: "juda_faol",
    nomi: "Juda faol",
    tavsif: "Haftada 6–7 kun mashq yoki og'ir jismoniy ish",
  },
] as const satisfies readonly Variant[];

export const CHEKLOV_YOQ = "cheklov_yoq";

export const AFZALLIKLAR = [
  { qiymat: CHEKLOV_YOQ, nomi: "Cheklov yo'q" },
  { qiymat: "vegetarian", nomi: "Vegetarian" },
  { qiymat: "gosht_kam", nomi: "Go'shtni kam yeyman" },
  { qiymat: "laktoza_yoq", nomi: "Laktoza yo'q" },
  { qiymat: "glyuten_yoq", nomi: "Glyuten yo'q" },
  { qiymat: "shakar_cheklov", nomi: "Shakarni cheklayman" },
] as const satisfies readonly Variant[];

export const MAHALLAR = [
  { qiymat: "2", nomi: "2" },
  { qiymat: "3", nomi: "3" },
  { qiymat: "4+", nomi: k("4 va undan ko'p") },
] as const;

export const JOYLAR = [
  { qiymat: "uyda", nomi: "Uyda" },
  { qiymat: "tashqarida", nomi: "Ishda yoki tashqarida" },
  { qiymat: "aralash", nomi: "Aralash" },
] as const satisfies readonly Variant[];

export const MOTIVATSIYALAR = [
  { qiymat: "soglik", nomi: "Sog'lig'im" },
  { qiymat: "korinish", nomi: "Tashqi ko'rinishim" },
  { qiymat: "energiya", nomi: "Ko'proq energiya" },
  { qiymat: "shifokor", nomi: "Shifokor tavsiyasi" },
  { qiymat: "sport", nomi: "Sport natijasi" },
] as const satisfies readonly Variant[];

export const BIRLIKLAR = ["metrik", "imperial"] as const;

export type Maqsad = (typeof MAQSADLAR)[number]["qiymat"];
export type Jins = (typeof JINSLAR)[number]["qiymat"];
export type Faollik = (typeof FAOLLIKLAR)[number]["qiymat"];
export type Birliklar = (typeof BIRLIKLAR)[number];
export type OvqatlanishOdati = { mahal: string; joy: string };

export const ISM_CHEGARASI = 40;
export const YOSH = { min: 18, max: 100 };
export const BOY = { min: 120, max: 230 };
export const VAZN = { min: 30, max: 300 };

/** Onboardingda yig'ilgan javoblar; hali berilmagani null. Vazn kg, bo'y sm da. */
export type Javoblar = {
  birliklar: string;
  ism: string | null;
  maqsad: string | null;
  jins: string | null;
  yosh: number | null;
  boyi: number | null;
  vazn: number | null;
  maqsadVazn: number | null;
  faollik: string | null;
  ovqatAfzalliklari: string[];
  ovqatlanishOdati: OvqatlanishOdati | null;
  motivatsiya: string | null;
};

/** Qaysi qadamda to'xtagani va shu paytgacha bergan javoblari. */
export type OnboardingHolati = { qadam: number; tugadi: boolean; javoblar: Javoblar };

// ---------- O'girish ----------
// Bazada va forma holatida har doim sm va kg; boshqa birlik faqat ko'rsatish uchun.

const SM_FT = 30.48;
const LB_KG = 2.20462;

function chegarala(qiymat: number, { min, max }: { min: number; max: number }): number {
  return Math.min(max, Math.max(min, qiymat));
}

export function kgdanLb(kg: number): number {
  return Math.round(kg * LB_KG);
}

/** Natija 0,1 kg gacha yaxlitlanadi va ruxsat etilgan oraliqqa tushiriladi (66 lb = 29,9 kg -> 30). */
export function lbdanKg(lb: number): number {
  return chegarala(Math.round((lb / LB_KG) * 10) / 10, VAZN);
}

export function smdanFt(sm: number): number {
  return Math.round((sm / SM_FT) * 10) / 10;
}

export function ftdanSm(ft: number): number {
  return chegarala(Math.round(ft * SM_FT), BOY);
}

// ---------- O'lchovlar tekshiruvi ----------

function tmi(boyiSm: number, vaznKg: number): number {
  const metr = boyiSm / 100;
  return vaznKg / (metr * metr);
}

/** Maqsad vazn so'raladimi — "Vaznni saqlash"da maydon ko'rsatilmaydi. */
export function maqsadVaznKerakmi(maqsad: string | null): boolean {
  return maqsad !== null && maqsad !== "vazn_saqlash";
}

const ORTDIRISH: readonly (string | null)[] = ["vazn_ortdirish", "mushak_yigish"];

/** To'sadi: maqsad vazn tanlangan maqsad yo'nalishiga mos kelishi shart. */
export function yonalishXatosi(
  maqsad: string | null,
  vazn: number,
  maqsadVazn: number,
): Kalit | null {
  if (maqsad === "vazn_tashlash" && maqsadVazn > vazn) {
    return k("Vazn tashlashni tanlagansiz, lekin maqsad vazn joriysidan katta");
  }
  if (ORTDIRISH.includes(maqsad) && maqsadVazn < vazn) {
    return k("Vazn ortdirishni tanlagansiz, lekin maqsad vazn joriysidan kichik");
  }
  return null;
}

export type OlchovIzohlari = {
  /** To'sadi — maqsad vazn ostida, ikki chiqish yo'li bilan. */
  yonalish: Kalit | null;
  /** To'smaydi — joriy vazn ostida ("Vaznni saqlash"da bo'yga nisbatan eslatma). */
  vazn: Kalit | null;
  /** To'smaydi — maqsad vazn ostida. */
  maqsadVazn: Kalit | null;
  /** `maqsadVazn` izohi "joriy vaznga juda yaqin" — ostida maqsadni o'zgartirish havolasi turadi. */
  yaqin: boolean;
};

/**
 * O'lchovlar ekranidagi izohlar — har biri faqat o'zi tegishli maydon ostida. Bo'y-vazn
 * nisbati hamma joyda bir xil TMI oralig'i (18,5–25) bilan baholanadi; joriy vaznning o'zi
 * foydalanuvchi aytganidek qabul qilinadi.
 */
export function olchovIzohlari(
  maqsad: string | null,
  boyi: number | null,
  vazn: number | null,
  maqsadVazn: number | null,
): OlchovIzohlari {
  const izohlar: OlchovIzohlari = { yonalish: null, vazn: null, maqsadVazn: null, yaqin: false };

  if (maqsad === "vazn_saqlash") {
    if (boyi !== null && vazn !== null) {
      const qiymat = tmi(boyi, vazn);
      if (qiymat < 18.5) {
        izohlar.vazn = "Bu vazn bo'yingizga nisbatan pastroq bo'lishi mumkin. Bu tibbiy maslahat emas.";
      } else if (qiymat > 25) {
        izohlar.vazn = "Bu vazn bo'yingizga nisbatan yuqoriroq bo'lishi mumkin. Bu tibbiy maslahat emas.";
      }
    }
    return izohlar;
  }

  if (vazn === null || maqsadVazn === null) return izohlar;

  izohlar.yonalish = yonalishXatosi(maqsad, vazn, maqsadVazn);
  if (izohlar.yonalish) return izohlar;

  if (Math.abs(vazn - maqsadVazn) < 1) {
    izohlar.yaqin = true;
    izohlar.maqsadVazn =
      "Bu maqsad joriy vaznga juda yaqin — «Vaznni saqlash» to'g'riroq bo'lishi mumkin";
  } else if (boyi !== null) {
    const qiymat = tmi(boyi, maqsadVazn);
    if (maqsad === "vazn_tashlash" && qiymat < 18.5) {
      izohlar.maqsadVazn =
        "Bu maqsad vazni bo'yingizga nisbatan pastroq bo'lishi mumkin. Bu tibbiy maslahat emas.";
    } else if (ORTDIRISH.includes(maqsad) && qiymat > 25) {
      izohlar.maqsadVazn =
        "Bu maqsad vazni bo'yingizga nisbatan yuqoriroq bo'lishi mumkin. Bu tibbiy maslahat emas.";
    }
  }
  return izohlar;
}

// ---------- API tanasini tekshirish ----------

/** Bitta qadamning tekshirilgan javobi — servis shuni bazaga yozadi. */
export type QadamJavobi =
  | { qadam: 1 }
  | { qadam: 2; ism: string }
  | { qadam: 3; maqsad: Maqsad }
  | { qadam: 4; jins: Jins; yosh: number }
  | { qadam: 5; boyi: number; vazn: number; maqsadVazn: number | null; birliklar: Birliklar }
  | { qadam: 6; faollik: Faollik }
  | { qadam: 7; ovqatAfzalliklari: string[] | null }
  | { qadam: 8; ovqatlanishOdati: OvqatlanishOdati | null }
  | { qadam: 9; motivatsiya: string | null };

function variantmi<T extends string>(
  royxat: readonly { qiymat: T }[],
  qiymat: unknown,
): qiymat is T {
  return royxat.some((variant) => variant.qiymat === qiymat);
}

function oraliqdami(qiymat: unknown, { min, max }: { min: number; max: number }): qiymat is number {
  return typeof qiymat === "number" && Number.isFinite(qiymat) && qiymat >= min && qiymat <= max;
}

const NOTOGRI = { xato: k("Javob noto'g'ri") } as const;

export const YOSH_XATOSI = k("Ilovadan 18 yoshdan katta foydalanuvchilar foydalanishi mumkin");

/**
 * `PATCH /api/onboarding` tanasini tekshiradi. `maqsad` — bazadagi 3-qadam javobi:
 * 5-qadamdagi maqsad vazn shunga qarab talab qilinadi va yo'nalishi tekshiriladi.
 */
export function qadamniTekshir(
  tana: Record<string, unknown>,
  maqsad: string | null,
): { javob: QadamJavobi } | { xato: string } {
  const otkazildi = tana.otkazildi === true;

  switch (tana.qadam) {
    case 1:
      return { javob: { qadam: 1 } };

    case 2: {
      const ism = typeof tana.ism === "string" ? tana.ism.trim() : "";
      if (ism.length < 1 || ism.length > ISM_CHEGARASI) {
        return { xato: `Ism 1 dan ${ISM_CHEGARASI} belgigacha bo'lishi kerak` };
      }
      return { javob: { qadam: 2, ism } };
    }

    case 3:
      return variantmi(MAQSADLAR, tana.maqsad)
        ? { javob: { qadam: 3, maqsad: tana.maqsad } }
        : NOTOGRI;

    case 4: {
      if (!variantmi(JINSLAR, tana.jins)) return NOTOGRI;
      if (!oraliqdami(tana.yosh, YOSH) || !Number.isInteger(tana.yosh)) return { xato: YOSH_XATOSI };
      return { javob: { qadam: 4, jins: tana.jins, yosh: tana.yosh } };
    }

    case 5: {
      if (!oraliqdami(tana.boyi, BOY) || !Number.isInteger(tana.boyi)) {
        return { xato: `Bo'y ${BOY.min}–${BOY.max} sm oralig'ida bo'lsin` };
      }
      if (!oraliqdami(tana.vazn, VAZN)) {
        return { xato: `Vazn ${VAZN.min}–${VAZN.max} kg oralig'ida bo'lsin` };
      }
      const birliklar = BIRLIKLAR.find((b) => b === tana.birliklar);
      if (!birliklar) return NOTOGRI;

      let maqsadVazn: number | null = null;
      if (maqsadVaznKerakmi(maqsad)) {
        if (!oraliqdami(tana.maqsadVazn, VAZN)) {
          return { xato: `Maqsad vazn ${VAZN.min}–${VAZN.max} kg oralig'ida bo'lsin` };
        }
        const yonalish = yonalishXatosi(maqsad, tana.vazn, tana.maqsadVazn);
        if (yonalish) return { xato: yonalish };
        maqsadVazn = tana.maqsadVazn;
      }
      return { javob: { qadam: 5, boyi: tana.boyi, vazn: tana.vazn, maqsadVazn, birliklar } };
    }

    case 6:
      return variantmi(FAOLLIKLAR, tana.faollik)
        ? { javob: { qadam: 6, faollik: tana.faollik } }
        : NOTOGRI;

    case 7: {
      if (otkazildi) return { javob: { qadam: 7, ovqatAfzalliklari: null } };
      const tanlangan = Array.isArray(tana.ovqatAfzalliklari) ? tana.ovqatAfzalliklari : null;
      if (!tanlangan || tanlangan.length === 0) return NOTOGRI;
      if (!tanlangan.every((qiymat) => variantmi(AFZALLIKLAR, qiymat))) return NOTOGRI;
      const noyob = [...new Set(tanlangan as string[])];
      // "Cheklov yo'q" boshqa variantlar bilan birga turmaydi.
      return {
        javob: {
          qadam: 7,
          ovqatAfzalliklari: noyob.includes(CHEKLOV_YOQ) ? [CHEKLOV_YOQ] : noyob,
        },
      };
    }

    case 8: {
      if (otkazildi) return { javob: { qadam: 8, ovqatlanishOdati: null } };
      if (!variantmi(MAHALLAR, tana.mahal) || !variantmi(JOYLAR, tana.joy)) return NOTOGRI;
      return { javob: { qadam: 8, ovqatlanishOdati: { mahal: tana.mahal, joy: tana.joy } } };
    }

    case 9: {
      if (otkazildi) return { javob: { qadam: 9, motivatsiya: null } };
      return variantmi(MOTIVATSIYALAR, tana.motivatsiya)
        ? { javob: { qadam: 9, motivatsiya: tana.motivatsiya } }
        : NOTOGRI;
    }

    default:
      return NOTOGRI;
  }
}
