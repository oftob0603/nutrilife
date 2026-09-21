// Shaxsiy ma'lumot (profil-tz.md, F3): onboarding javoblarini tahrirlash. Tekshiruv qoidalari
// onboardingdagi bilan bir xil — shu sababli `qadamniTekshir` ning o'zi ishlatiladi.
// Sof modul — bazaga bog'liq emas, klient ham, server ham ishlatadi.

import { k, type Kalit } from "../lugat/tarjima.ts";
import { normaHisobi } from "./norma-hisob.ts";
import {
  BOY,
  ISM_CHEGARASI,
  VAZN,
  YOSH,
  ftdanSm,
  kgdanLb,
  lbdanKg,
  maqsadVaznKerakmi,
  oraliqdami,
  qadamniTekshir,
  smdanFt,
  yonalishXatosi,
  type Faollik,
  type Jins,
  type Maqsad,
  type OvqatlanishOdati,
  type QadamJavobi,
} from "./onboarding-hisob.ts";
import type { Profil } from "./profil-hisob.ts";
import type { BoyBirligi, VaznBirligi } from "./sozlamalar-hisob.ts";

/** Tekshirilgan ma'lumot — servis shuni bazaga yozadi. Bo'y sm, vazn kg da. */
export type ShaxsiyMalumot = {
  ism: string;
  jins: Jins;
  yosh: number;
  boyi: number;
  maqsad: Maqsad;
  faollik: Faollik;
  /** "Vaznni saqlash"da null. */
  maqsadVazn: number | null;
  /** null — javob berilmagan, bazadagi qiymat o'zgarmaydi. */
  ovqatAfzalliklari: string[] | null;
  ovqatlanishOdati: OvqatlanishOdati | null;
};

const NOTOGRI = { xato: k("Javob noto'g'ri") } as const;

function qadam<N extends QadamJavobi["qadam"]>(
  raqam: N,
  tana: Record<string, unknown>,
): Extract<QadamJavobi, { qadam: N }> | { xato: string } {
  const natija = qadamniTekshir({ ...tana, qadam: raqam }, null);
  return "xato" in natija ? natija : (natija.javob as Extract<QadamJavobi, { qadam: N }>);
}

/**
 * `PATCH /api/profil` tanasini tekshiradi. `joriyVazn` — bazadagi oxirgi o'lchov: maqsad
 * vazn yo'nalishi shunga nisbatan tekshiriladi (joriy vazn bu ekranda o'zgartirilmaydi).
 */
export function shaxsiyniTekshir(
  tana: Record<string, unknown>,
  joriyVazn: number | null,
): { malumot: ShaxsiyMalumot } | { xato: string } {
  const ism = qadam(2, tana);
  if ("xato" in ism) return ism;
  const maqsad = qadam(3, tana);
  if ("xato" in maqsad) return maqsad;
  const jinsYosh = qadam(4, tana);
  if ("xato" in jinsYosh) return jinsYosh;
  const faollik = qadam(6, tana);
  if ("xato" in faollik) return faollik;

  if (!oraliqdami(tana.boyi, BOY) || !Number.isInteger(tana.boyi)) return NOTOGRI;

  let maqsadVazn: number | null = null;
  if (maqsadVaznKerakmi(maqsad.maqsad)) {
    if (!oraliqdami(tana.maqsadVazn, VAZN)) return NOTOGRI;
    const yonalish =
      joriyVazn === null ? null : yonalishXatosi(maqsad.maqsad, joriyVazn, tana.maqsadVazn);
    if (yonalish) return { xato: yonalish };
    maqsadVazn = tana.maqsadVazn;
  }

  // Afzallik va odat majburiy emas (onboardingda o'tkazib yuborish mumkin edi).
  const afzalliklar = qadam(
    7,
    Array.isArray(tana.ovqatAfzalliklari) && tana.ovqatAfzalliklari.length > 0
      ? tana
      : { otkazildi: true },
  );
  if ("xato" in afzalliklar) return afzalliklar;
  const odat = qadam(8, tana.mahal || tana.joy ? tana : { otkazildi: true });
  if ("xato" in odat) return odat;

  return {
    malumot: {
      ism: ism.ism,
      jins: jinsYosh.jins,
      yosh: jinsYosh.yosh,
      boyi: tana.boyi,
      maqsad: maqsad.maqsad,
      faollik: faollik.faollik,
      maqsadVazn,
      ovqatAfzalliklari: afzalliklar.ovqatAfzalliklari,
      ovqatlanishOdati: odat.ovqatlanishOdati,
    },
  };
}

// ---------- Forma (klient) ----------

/**
 * Ekrandagi holat. Yosh, bo'y va maqsad vazn — foydalanuvchi yozgan matn, tanlangan birlikda.
 * `asl*` — ochilishdagi matn: maydonga tegilmagan bo'lsa bazadagi aniq qiymat qaytadi,
 * aks holda 175 sm -> 5,7 ft -> 174 sm bo'lib, tegilmagan bo'y o'zgarib qolardi.
 */
export type ShaxsiyForma = {
  ism: string;
  jins: string | null;
  yosh: string;
  boyi: string;
  maqsad: string | null;
  maqsadVazn: string;
  faollik: string | null;
  ovqatAfzalliklari: string[];
  mahal: string | null;
  joy: string | null;
};

function sonMatni(son: number | null): string {
  return son === null ? "" : String(son);
}

function boyMatni(sm: number | null, birlik: BoyBirligi): string {
  return sonMatni(sm === null || birlik === "sm" ? sm : smdanFt(sm));
}

function vaznMatni(kg: number | null, birlik: VaznBirligi): string {
  return sonMatni(kg === null || birlik === "kg" ? kg : kgdanLb(kg));
}

export function shaxsiyFormaYarat(profil: Profil): ShaxsiyForma {
  return {
    ism: profil.ism ?? "",
    jins: profil.jins,
    yosh: sonMatni(profil.yosh),
    boyi: boyMatni(profil.boyi, profil.sozlamalar.boyBirligi),
    maqsad: profil.maqsad,
    maqsadVazn: vaznMatni(profil.maqsadVazn, profil.sozlamalar.vaznBirligi),
    faollik: profil.faollik,
    ovqatAfzalliklari: profil.ovqatAfzalliklari,
    mahal: profil.ovqatlanishOdati?.mahal ?? null,
    joy: profil.ovqatlanishOdati?.joy ?? null,
  };
}

/** Vergul ham, nuqta ham qabul qilinadi; son bo'lmasa null. */
function sonniOqi(matn: string): number | null {
  const toza = matn.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(toza)) return null;
  return Number(toza);
}

/** Maydon ostidagi xato: lug'at kaliti va `{0}`, `{1}`, `{2}` qiymatlari. */
export type MaydonXatosi = { kalit: Kalit; qiymatlar: (string | number)[] };

export type ShaxsiyTekshiruvi = {
  /** Yuborishga tayyor tana; forma to'liq yoki to'g'ri bo'lmasa null. */
  tana: Record<string, unknown> | null;
  /**
   * Shu javoblar bilan chiqadigan kunlik norma, kkal — server ham aynan shu formuladan
   * hisoblaydi (`rejaniYangilash`). Forma tayyor bo'lmasa yoki vazn yo'q bo'lsa null.
   */
  yangiNorma: number | null;
  ismUzun: boolean;
  yosh: MaydonXatosi | null;
  boyi: MaydonXatosi | null;
  maqsadVazn: MaydonXatosi | null;
};

/** Formani tekshiradi va API tanasini tayyorlaydi. Bo'sh maydon xato emas — tugma o'chiq turadi. */
export function shaxsiyniTayyorla(forma: ShaxsiyForma, profil: Profil): ShaxsiyTekshiruvi {
  const { vaznBirligi, boyBirligi } = profil.sozlamalar;
  const asl = shaxsiyFormaYarat(profil);
  const natija: ShaxsiyTekshiruvi = {
    tana: null,
    yangiNorma: null,
    ismUzun: forma.ism.trim().length > ISM_CHEGARASI,
    yosh: null,
    boyi: null,
    maqsadVazn: null,
  };

  const yosh = sonniOqi(forma.yosh);
  if (forma.yosh.trim() && (yosh === null || !Number.isInteger(yosh) || !oraliqdami(yosh, YOSH))) {
    natija.yosh = { kalit: "Yosh {0}–{1} oralig'ida bo'lsin", qiymatlar: [YOSH.min, YOSH.max] };
  }

  // Oraliq foydalanuvchi ko'rib turgan birlikda tekshiriladi; saqlashga esa sm va kg ketadi.
  let boyi: number | null = null;
  const boyKiritilgan = sonniOqi(forma.boyi);
  if (forma.boyi.trim()) {
    const chegara = boyBirligi === "sm" ? BOY : { min: smdanFt(BOY.min), max: smdanFt(BOY.max) };
    if (boyKiritilgan === null || !oraliqdami(boyKiritilgan, chegara)) {
      natija.boyi = {
        kalit: "Bo'y {0}–{1} {2} oralig'ida bo'lsin",
        qiymatlar: [chegara.min, chegara.max, boyBirligi],
      };
    } else if (forma.boyi === asl.boyi) boyi = profil.boyi;
    else boyi = boyBirligi === "sm" ? Math.round(boyKiritilgan) : ftdanSm(boyKiritilgan);
  }

  const maqsadKerak = maqsadVaznKerakmi(forma.maqsad);
  let maqsadVazn: number | null = null;
  if (maqsadKerak && forma.maqsadVazn.trim()) {
    const kiritilgan = sonniOqi(forma.maqsadVazn);
    const chegara =
      vaznBirligi === "kg" ? VAZN : { min: kgdanLb(VAZN.min), max: kgdanLb(VAZN.max) };
    if (kiritilgan === null || !oraliqdami(kiritilgan, chegara)) {
      natija.maqsadVazn = {
        kalit: "Maqsad vazn {0}–{1} {2} oralig'ida bo'lsin",
        qiymatlar: [chegara.min, chegara.max, vaznBirligi],
      };
    } else {
      if (forma.maqsadVazn === asl.maqsadVazn) maqsadVazn = profil.maqsadVazn;
      else maqsadVazn = vaznBirligi === "kg" ? Math.round(kiritilgan * 10) / 10 : lbdanKg(kiritilgan);

      const yonalish =
        maqsadVazn === null || profil.joriyVazn === null
          ? null
          : yonalishXatosi(forma.maqsad, profil.joriyVazn, maqsadVazn);
      if (yonalish) natija.maqsadVazn = { kalit: yonalish, qiymatlar: [] };
    }
  }

  const ism = forma.ism.trim();
  const tolgan =
    ism !== "" &&
    forma.jins !== null &&
    yosh !== null &&
    boyi !== null &&
    forma.maqsad !== null &&
    forma.faollik !== null &&
    (!maqsadKerak || maqsadVazn !== null);
  const xatosiz = !natija.ismUzun && !natija.yosh && !natija.boyi && !natija.maqsadVazn;

  if (tolgan && xatosiz) {
    natija.tana = {
      ism,
      jins: forma.jins,
      yosh,
      boyi,
      maqsad: forma.maqsad,
      faollik: forma.faollik,
      maqsadVazn: maqsadKerak ? maqsadVazn : null,
      ovqatAfzalliklari: forma.ovqatAfzalliklari,
      // Odat — juft javob: bittasi tanlangan bo'lsa yuborilmaydi, bazadagisi o'zgarmaydi.
      mahal: forma.mahal && forma.joy ? forma.mahal : null,
      joy: forma.mahal && forma.joy ? forma.joy : null,
    };
    natija.yangiNorma =
      normaHisobi({
        jins: forma.jins,
        yosh,
        boyi,
        vazn: profil.joriyVazn,
        faollik: forma.faollik,
        maqsad: forma.maqsad,
      })?.kaloriya ?? null;
  }
  return natija;
}
