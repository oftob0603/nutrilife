// Onboarding qoidalari (onboarding-tz.md): variantlar, chegaralar, tekshiruv va o'girish.
// Sof modul — bazaga bog'liq emas, klient ham, server ham ishlatadi.

/** O1–O10. O11–O13 (norma natijasi va paywall) S4'da qo'shiladi. */
export const QADAMLAR_SONI = 10;
/** Shu qadamlarni javobsiz o'tkazib yuborish mumkin — ular normaga ta'sir qilmaydi. */
export const OTKAZILADIGAN_QADAMLAR: readonly number[] = [8, 9, 10];

export const TILLAR = [
  { qiymat: "uz", nomi: "O'zbekcha" },
  { qiymat: "ru", nomi: "Русский" },
  { qiymat: "en", nomi: "English" },
] as const;

export const MAQSADLAR = [
  { qiymat: "vazn_tashlash", nomi: "Vazn tashlash" },
  { qiymat: "vazn_saqlash", nomi: "Vaznni saqlash" },
  { qiymat: "vazn_ortdirish", nomi: "Vazn ortdirish" },
  { qiymat: "mushak_yigish", nomi: "Mushak yig'ish" },
] as const;

export const JINSLAR = [
  { qiymat: "erkak", nomi: "Erkak" },
  { qiymat: "ayol", nomi: "Ayol" },
  { qiymat: "aytilmagan", nomi: "Aytishni xohlamayman" },
] as const;

export const FAOLLIKLAR = [
  { qiymat: "kam", nomi: "Kam harakat", tavsif: "Asosan o'tirib ishlayman" },
  { qiymat: "yengil", nomi: "Yengil faol", tavsif: "Haftada 1–3 kun harakat" },
  { qiymat: "ortacha", nomi: "O'rtacha faol", tavsif: "Haftada 3–5 kun mashq" },
  {
    qiymat: "juda_faol",
    nomi: "Juda faol",
    tavsif: "Haftada 6–7 kun mashq yoki og'ir jismoniy ish",
  },
] as const;

export const CHEKLOV_YOQ = "cheklov_yoq";

export const AFZALLIKLAR = [
  { qiymat: CHEKLOV_YOQ, nomi: "Cheklov yo'q" },
  { qiymat: "vegetarian", nomi: "Vegetarian" },
  { qiymat: "gosht_kam", nomi: "Go'shtni kam yeyman" },
  { qiymat: "laktoza_yoq", nomi: "Laktoza yo'q" },
  { qiymat: "glyuten_yoq", nomi: "Glyuten yo'q" },
  { qiymat: "shakar_cheklov", nomi: "Shakarni cheklayman" },
] as const;

export const MAHALLAR = [
  { qiymat: "2", nomi: "2" },
  { qiymat: "3", nomi: "3" },
  { qiymat: "4+", nomi: "4 va undan ko'p" },
] as const;

export const JOYLAR = [
  { qiymat: "uyda", nomi: "Uyda" },
  { qiymat: "tashqarida", nomi: "Ishda yoki tashqarida" },
  { qiymat: "aralash", nomi: "Aralash" },
] as const;

export const MOTIVATSIYALAR = [
  { qiymat: "soglik", nomi: "Sog'lig'im" },
  { qiymat: "korinish", nomi: "Tashqi ko'rinishim" },
  { qiymat: "energiya", nomi: "Ko'proq energiya" },
  { qiymat: "shifokor", nomi: "Shifokor tavsiyasi" },
  { qiymat: "sport", nomi: "Sport natijasi" },
] as const;

export const BIRLIKLAR = ["metrik", "imperial"] as const;

export type Til = (typeof TILLAR)[number]["qiymat"];
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
  til: string;
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

const KG_LB = 0.45359237;
const SM_DYUYM = 2.54;

export function lbdanKg(lb: number): number {
  return Math.round(lb * KG_LB * 10) / 10;
}

export function kgdanLb(kg: number): number {
  return Math.round((kg / KG_LB) * 10) / 10;
}

export function ftdanSm(ft: number, dyuym: number): number {
  return Math.round((ft * 12 + dyuym) * SM_DYUYM);
}

export function smdanFt(sm: number): { ft: number; dyuym: number } {
  const jami = Math.round(sm / SM_DYUYM);
  return { ft: Math.floor(jami / 12), dyuym: jami % 12 };
}

// ---------- O6 tekshiruvlari ----------

function tmi(boyiSm: number, vaznKg: number): number {
  const metr = boyiSm / 100;
  return vaznKg / (metr * metr);
}

/** Maqsad vazn so'raladimi — "Vaznni saqlash"da maydon ko'rsatilmaydi. */
export function maqsadVaznKerakmi(maqsad: string | null): boolean {
  return maqsad !== null && maqsad !== "vazn_saqlash";
}

/** 1-tekshiruv (to'sadi): maqsad vazn O4'da tanlangan maqsad yo'nalishiga mos kelishi shart. */
export function yonalishXatosi(
  maqsad: string | null,
  vazn: number,
  maqsadVazn: number,
): string | null {
  if (maqsad === "vazn_tashlash" && maqsadVazn > vazn) {
    return "Vazn tashlashni tanlagansiz, lekin maqsad vazn joriysidan katta";
  }
  if ((maqsad === "vazn_ortdirish" || maqsad === "mushak_yigish") && maqsadVazn < vazn) {
    return "Vazn ortdirishni tanlagansiz, lekin maqsad vazn joriysidan kichik";
  }
  return null;
}

/** To'smaydi: ikki vazn orasi 1 kg dan kam. */
export function yaqinMaqsadmi(vazn: number, maqsadVazn: number): boolean {
  return Math.abs(vazn - maqsadVazn) < 1;
}

/** 2-tekshiruv (to'smaydi): joriy vazn terish xatosiga o'xshaydi — TMI 16 dan past yoki 50 dan yuqori. */
export function joriyVaznShubhalimi(boyi: number, vazn: number): boolean {
  const qiymat = tmi(boyi, vazn);
  return qiymat < 16 || qiymat > 50;
}

/** 3-tekshiruv (to'smaydi): maqsad juda past — TMI 18,5 dan past yoki joriydan 25% dan ko'p kam. */
export function maqsadJudaPastmi(boyi: number, vazn: number, maqsadVazn: number): boolean {
  return tmi(boyi, maqsadVazn) < 18.5 || maqsadVazn < vazn * 0.75;
}

// ---------- API tanasini tekshirish ----------

/** Bitta qadamning tekshirilgan javobi — servis shuni bazaga yozadi. */
export type QadamJavobi =
  | { qadam: 1 }
  | { qadam: 2; til: Til }
  | { qadam: 3; ism: string }
  | { qadam: 4; maqsad: Maqsad }
  | { qadam: 5; jins: Jins; yosh: number }
  | { qadam: 6; boyi: number; vazn: number; maqsadVazn: number | null; birliklar: Birliklar }
  | { qadam: 7; faollik: Faollik }
  | { qadam: 8; ovqatAfzalliklari: string[] }
  | { qadam: 9; ovqatlanishOdati: OvqatlanishOdati | null }
  | { qadam: 10; motivatsiya: string | null };

function variantmi<T extends string>(
  royxat: readonly { qiymat: T }[],
  qiymat: unknown,
): qiymat is T {
  return royxat.some((variant) => variant.qiymat === qiymat);
}

function oraliqdami(qiymat: unknown, { min, max }: { min: number; max: number }): qiymat is number {
  return typeof qiymat === "number" && Number.isFinite(qiymat) && qiymat >= min && qiymat <= max;
}

const NOTOGRI = { xato: "Javob noto'g'ri" } as const;

/**
 * `PATCH /api/onboarding` tanasini tekshiradi. `maqsad` — bazadagi O4 javobi: O6'dagi
 * maqsad vazn shunga qarab talab qilinadi va yo'nalishi tekshiriladi.
 */
export function qadamniTekshir(
  tana: Record<string, unknown>,
  maqsad: string | null,
): { javob: QadamJavobi } | { xato: string } {
  const otkazildi = tana.otkazildi === true;

  switch (tana.qadam) {
    case 1:
      return { javob: { qadam: 1 } };

    case 2:
      return variantmi(TILLAR, tana.til) ? { javob: { qadam: 2, til: tana.til } } : NOTOGRI;

    case 3: {
      const ism = typeof tana.ism === "string" ? tana.ism.trim() : "";
      if (ism.length < 1 || ism.length > ISM_CHEGARASI) {
        return { xato: `Ism 1 dan ${ISM_CHEGARASI} belgigacha bo'lishi kerak` };
      }
      return { javob: { qadam: 3, ism } };
    }

    case 4:
      return variantmi(MAQSADLAR, tana.maqsad)
        ? { javob: { qadam: 4, maqsad: tana.maqsad } }
        : NOTOGRI;

    case 5: {
      if (!variantmi(JINSLAR, tana.jins)) return NOTOGRI;
      if (!oraliqdami(tana.yosh, YOSH) || !Number.isInteger(tana.yosh)) {
        return { xato: "Ilovadan 18 yoshdan katta foydalanuvchilar foydalanishi mumkin" };
      }
      return { javob: { qadam: 5, jins: tana.jins, yosh: tana.yosh } };
    }

    case 6: {
      if (!oraliqdami(tana.boyi, BOY) || !Number.isInteger(tana.boyi)) {
        return { xato: `Bo'y ${BOY.min} dan ${BOY.max} sm gacha bo'lishi kerak` };
      }
      if (!oraliqdami(tana.vazn, VAZN)) {
        return { xato: `Vazn ${VAZN.min} dan ${VAZN.max} kg gacha bo'lishi kerak` };
      }
      const birliklar = BIRLIKLAR.find((b) => b === tana.birliklar);
      if (!birliklar) return NOTOGRI;

      let maqsadVazn: number | null = null;
      if (maqsadVaznKerakmi(maqsad)) {
        if (!oraliqdami(tana.maqsadVazn, VAZN)) {
          return { xato: `Maqsad vazn ${VAZN.min} dan ${VAZN.max} kg gacha bo'lishi kerak` };
        }
        const yonalish = yonalishXatosi(maqsad, tana.vazn, tana.maqsadVazn);
        if (yonalish) return { xato: yonalish };
        maqsadVazn = tana.maqsadVazn;
      }
      return { javob: { qadam: 6, boyi: tana.boyi, vazn: tana.vazn, maqsadVazn, birliklar } };
    }

    case 7:
      return variantmi(FAOLLIKLAR, tana.faollik)
        ? { javob: { qadam: 7, faollik: tana.faollik } }
        : NOTOGRI;

    case 8: {
      if (otkazildi) return { javob: { qadam: 8, ovqatAfzalliklari: [] } };
      const tanlangan = Array.isArray(tana.ovqatAfzalliklari) ? tana.ovqatAfzalliklari : null;
      if (!tanlangan || tanlangan.length === 0) return NOTOGRI;
      if (!tanlangan.every((qiymat) => variantmi(AFZALLIKLAR, qiymat))) return NOTOGRI;
      const noyob = [...new Set(tanlangan as string[])];
      // "Cheklov yo'q" boshqa variantlar bilan birga turmaydi.
      return {
        javob: {
          qadam: 8,
          ovqatAfzalliklari: noyob.includes(CHEKLOV_YOQ) ? [CHEKLOV_YOQ] : noyob,
        },
      };
    }

    case 9: {
      if (otkazildi) return { javob: { qadam: 9, ovqatlanishOdati: null } };
      if (!variantmi(MAHALLAR, tana.mahal) || !variantmi(JOYLAR, tana.joy)) return NOTOGRI;
      return { javob: { qadam: 9, ovqatlanishOdati: { mahal: tana.mahal, joy: tana.joy } } };
    }

    case 10: {
      if (otkazildi) return { javob: { qadam: 10, motivatsiya: null } };
      return variantmi(MOTIVATSIYALAR, tana.motivatsiya)
        ? { javob: { qadam: 10, motivatsiya: tana.motivatsiya } }
        : NOTOGRI;
    }

    default:
      return NOTOGRI;
  }
}
