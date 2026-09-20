// Onboarding formasi: ekrandagi matn maydonlari <-> API'ga yuboriladigan javob.
// Sof modul — klient komponent ishlatadi, bazaga bog'liq emas.

import {
  BOY,
  CHEKLOV_YOQ,
  ISM_CHEGARASI,
  VAZN,
  YOSH,
  ftdanSm,
  joriyVaznShubhalimi,
  kgdanLb,
  lbdanKg,
  maqsadJudaPastmi,
  maqsadVaznKerakmi,
  smdanFt,
  yaqinMaqsadmi,
  yonalishXatosi,
  type Birliklar,
  type Javoblar,
} from "./onboarding-hisob.ts";

/** Ekrandagi holat. Raqamlar foydalanuvchi terganidek matn; vazn va bo'y tanlangan birlikda. */
export type Forma = {
  til: string;
  ism: string;
  maqsad: string | null;
  jins: string | null;
  yosh: string;
  birliklar: Birliklar;
  /** Metrikda — sm; imperialda ishlatilmaydi. */
  boyi: string;
  boyiFt: string;
  boyiDyuym: string;
  vazn: string;
  maqsadVazn: string;
  faollik: string | null;
  ovqatAfzalliklari: string[];
  mahal: string | null;
  joy: string | null;
  motivatsiya: string | null;
};

function matn(son: number | null): string {
  return son === null ? "" : String(son);
}

/** "72,5" ham, "72.5" ham qabul qilinadi; son bo'lmasa null. */
function son(qiymat: string): number | null {
  const tozalangan = qiymat.trim().replace(",", ".");
  if (tozalangan === "") return null;
  const natija = Number(tozalangan);
  return Number.isFinite(natija) ? natija : null;
}

function vaznMatni(kg: number | null, birliklar: Birliklar): string {
  if (kg === null) return "";
  return String(birliklar === "imperial" ? kgdanLb(kg) : kg);
}

export function formaYarat(javoblar: Javoblar): Forma {
  const birliklar: Birliklar = javoblar.birliklar === "imperial" ? "imperial" : "metrik";
  const ft = javoblar.boyi === null ? null : smdanFt(javoblar.boyi);
  return {
    til: javoblar.til,
    ism: javoblar.ism ?? "",
    maqsad: javoblar.maqsad,
    jins: javoblar.jins,
    yosh: matn(javoblar.yosh),
    birliklar,
    boyi: matn(javoblar.boyi),
    boyiFt: matn(ft?.ft ?? null),
    boyiDyuym: matn(ft?.dyuym ?? null),
    vazn: vaznMatni(javoblar.vazn, birliklar),
    maqsadVazn: vaznMatni(javoblar.maqsadVazn, birliklar),
    faollik: javoblar.faollik,
    ovqatAfzalliklari: javoblar.ovqatAfzalliklari,
    mahal: javoblar.ovqatlanishOdati?.mahal ?? null,
    joy: javoblar.ovqatlanishOdati?.joy ?? null,
    motivatsiya: javoblar.motivatsiya,
  };
}

/** Bo'y va vaznlarning metrikdagi qiymati (sm, kg); o'qib bo'lmagani null. */
export function olchovlar(forma: Forma): {
  boyi: number | null;
  vazn: number | null;
  maqsadVazn: number | null;
} {
  const vazn = son(forma.vazn);
  const maqsadVazn = son(forma.maqsadVazn);
  if (forma.birliklar === "metrik") return { boyi: son(forma.boyi), vazn, maqsadVazn };

  const ft = son(forma.boyiFt);
  // Dyuym bo'sh qoldirilsa 0 deb olinadi: "5 ft" ham to'g'ri javob.
  const dyuym = forma.boyiDyuym.trim() === "" ? 0 : son(forma.boyiDyuym);
  return {
    boyi: ft === null || dyuym === null ? null : ftdanSm(ft, dyuym),
    vazn: vazn === null ? null : lbdanKg(vazn),
    maqsadVazn: maqsadVazn === null ? null : lbdanKg(maqsadVazn),
  };
}

/** Birlik almashtirilganda kiritilgan qiymatlar yangi birlikka o'giriladi. */
export function birlikOzgardi(forma: Forma, birliklar: Birliklar): Forma {
  if (birliklar === forma.birliklar) return forma;
  const { boyi, vazn, maqsadVazn } = olchovlar(forma);
  const ft = boyi === null ? null : smdanFt(boyi);
  return {
    ...forma,
    birliklar,
    boyi: matn(boyi),
    boyiFt: matn(ft?.ft ?? null),
    boyiDyuym: matn(ft?.dyuym ?? null),
    vazn: vaznMatni(vazn, birliklar),
    maqsadVazn: vaznMatni(maqsadVazn, birliklar),
  };
}

/** "Cheklov yo'q" tanlansa qolganlari o'chadi va aksincha. */
export function afzallikBosildi(tanlangan: string[], qiymat: string): string[] {
  if (tanlangan.includes(qiymat)) return tanlangan.filter((t) => t !== qiymat);
  if (qiymat === CHEKLOV_YOQ) return [CHEKLOV_YOQ];
  return [...tanlangan.filter((t) => t !== CHEKLOV_YOQ), qiymat];
}

export type MaydonXatolari = Partial<Record<"ism" | "yosh" | "boyi" | "vazn" | "maqsadVazn", string>>;

/** To'smaydigan izohlar — har biri o'zi tegishli maydon ostida turadi (onboarding-tz, O6). */
export type Ogohlantirishlar = { vazn?: string; maqsadVazn?: string; yaqin?: boolean };

export type QadamTekshiruvi = {
  /** Yuborishga tayyor tana; javob hali to'liq yoki to'g'ri bo'lmasa null. */
  tana: Record<string, unknown> | null;
  xatolar: MaydonXatolari;
  ogohlantirishlar: Ogohlantirishlar;
  /** O6: maqsad vazn O4'dagi maqsadga zid — ekranda ikki chiqish yo'li ko'rsatiladi. */
  yonalishXatosi: string | null;
};

function oraliqda(qiymat: number, { min, max }: { min: number; max: number }): boolean {
  return qiymat >= min && qiymat <= max;
}

/** Vazn chegarasi tanlangan birlikda ko'rsatiladi. */
function vaznChegarasi(birliklar: Birliklar): string {
  return birliklar === "imperial"
    ? `${Math.ceil(kgdanLb(VAZN.min))} dan ${Math.floor(kgdanLb(VAZN.max))} lb gacha`
    : `${VAZN.min} dan ${VAZN.max} kg gacha`;
}

/** Joriy qadam javobini tekshiradi. Bo'sh maydon xato emas — tugma shunchaki o'chiq turadi. */
export function qadamniTayyorla(qadam: number, forma: Forma): QadamTekshiruvi {
  const natija: QadamTekshiruvi = {
    tana: null,
    xatolar: {},
    ogohlantirishlar: {},
    yonalishXatosi: null,
  };

  switch (qadam) {
    case 1:
      natija.tana = { qadam };
      break;

    case 2:
      natija.tana = { qadam, til: forma.til };
      break;

    case 3: {
      const ism = forma.ism.trim();
      if (ism.length > ISM_CHEGARASI) natija.xatolar.ism = `Ism ${ISM_CHEGARASI} belgidan uzun`;
      else if (ism) natija.tana = { qadam, ism };
      break;
    }

    case 4:
      if (forma.maqsad) natija.tana = { qadam, maqsad: forma.maqsad };
      break;

    case 5: {
      const yosh = son(forma.yosh);
      if (forma.yosh.trim() !== "") {
        if (yosh === null || !Number.isInteger(yosh) || yosh > YOSH.max || yosh < 1) {
          natija.xatolar.yosh = "Yoshni butun son bilan kiriting";
        } else if (yosh < YOSH.min) {
          natija.xatolar.yosh = "Ilovadan 18 yoshdan katta foydalanuvchilar foydalanishi mumkin";
        }
      }
      if (forma.jins && yosh !== null && !natija.xatolar.yosh) {
        natija.tana = { qadam, jins: forma.jins, yosh };
      }
      break;
    }

    case 6: {
      const { boyi, vazn, maqsadVazn } = olchovlar(forma);
      const maqsadKerak = maqsadVaznKerakmi(forma.maqsad);
      const boyiKiritildi =
        forma.birliklar === "metrik" ? forma.boyi.trim() !== "" : forma.boyiFt.trim() !== "";

      if (boyiKiritildi && (boyi === null || !oraliqda(boyi, BOY))) {
        natija.xatolar.boyi =
          forma.birliklar === "metrik"
            ? `Bo'y ${BOY.min} dan ${BOY.max} sm gacha bo'lishi kerak`
            : "Bo'y 3 ft 11 in dan 7 ft 7 in gacha bo'lishi kerak";
      }
      if (forma.vazn.trim() !== "" && (vazn === null || !oraliqda(vazn, VAZN))) {
        natija.xatolar.vazn = `Vazn ${vaznChegarasi(forma.birliklar)} bo'lishi kerak`;
      }
      if (
        maqsadKerak &&
        forma.maqsadVazn.trim() !== "" &&
        (maqsadVazn === null || !oraliqda(maqsadVazn, VAZN))
      ) {
        natija.xatolar.maqsadVazn = `Maqsad vazn ${vaznChegarasi(forma.birliklar)} bo'lishi kerak`;
      }

      const boyiYaroqli = boyi !== null && !natija.xatolar.boyi;
      const vaznYaroqli = vazn !== null && !natija.xatolar.vazn;
      const maqsadYaroqli = maqsadKerak && maqsadVazn !== null && !natija.xatolar.maqsadVazn;

      if (boyiYaroqli && vaznYaroqli && joriyVaznShubhalimi(boyi, vazn)) {
        natija.ogohlantirishlar.vazn = "Bu raqam odatdagidan juda uzoq — tekshirib ko'ring";
      }
      if (vaznYaroqli && maqsadYaroqli) {
        natija.yonalishXatosi = yonalishXatosi(forma.maqsad, vazn, maqsadVazn);
        if (!natija.yonalishXatosi) {
          if (yaqinMaqsadmi(vazn, maqsadVazn)) natija.ogohlantirishlar.yaqin = true;
          else if (boyiYaroqli && maqsadJudaPastmi(boyi, vazn, maqsadVazn)) {
            natija.ogohlantirishlar.maqsadVazn =
              "Bu maqsad juda past ko'rinadi. Ilova tibbiy xizmat emas, shifokor bilan maslahatlashing.";
          }
        }
      }

      if (boyiYaroqli && vaznYaroqli && (!maqsadKerak || maqsadYaroqli) && !natija.yonalishXatosi) {
        natija.tana = {
          qadam,
          boyi,
          vazn,
          maqsadVazn: maqsadKerak ? maqsadVazn : null,
          birliklar: forma.birliklar,
        };
      }
      break;
    }

    case 7:
      if (forma.faollik) natija.tana = { qadam, faollik: forma.faollik };
      break;

    case 8:
      if (forma.ovqatAfzalliklari.length > 0) {
        natija.tana = { qadam, ovqatAfzalliklari: forma.ovqatAfzalliklari };
      }
      break;

    case 9:
      if (forma.mahal && forma.joy) natija.tana = { qadam, mahal: forma.mahal, joy: forma.joy };
      break;

    case 10:
      if (forma.motivatsiya) natija.tana = { qadam, motivatsiya: forma.motivatsiya };
      break;
  }

  return natija;
}
