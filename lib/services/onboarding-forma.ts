// Onboarding formasi: ekrandagi holat <-> API'ga yuboriladigan javob.
// Sof modul — klient komponent ishlatadi, bazaga bog'liq emas.

import {
  CHEKLOV_YOQ,
  ISM_CHEGARASI,
  YOSH,
  YOSH_XATOSI,
  maqsadVaznKerakmi,
  olchovIzohlari,
  type Birliklar,
  type Javoblar,
  type OlchovIzohlari,
} from "./onboarding-hisob.ts";

/** Yosh g'ildiragi doim biror qiymatni ko'rsatib turadi — javob berilmagan bo'lsa shundan boshlanadi. */
export const BOSHLANGICH_YOSH = 25;

/**
 * Ekrandagi holat. Bo'y va vazn HAR DOIM sm va kg da turadi — g'ildirak boshqa birlikni faqat
 * ko'rsatadi. Birlik almashtirilganda saqlangan qiymat qayta yaxlitlanmaydi, shuning uchun
 * kg -> lb -> kg aylanishida raqam siljimaydi.
 */
export type Forma = {
  ism: string;
  maqsad: string | null;
  jins: string | null;
  yosh: number;
  birliklar: Birliklar;
  boyi: number | null;
  vazn: number | null;
  maqsadVazn: number | null;
  faollik: string | null;
  ovqatAfzalliklari: string[];
  mahal: string | null;
  joy: string | null;
  motivatsiya: string | null;
};

export function formaYarat(javoblar: Javoblar): Forma {
  return {
    ism: javoblar.ism ?? "",
    maqsad: javoblar.maqsad,
    jins: javoblar.jins,
    yosh: javoblar.yosh ?? BOSHLANGICH_YOSH,
    birliklar: javoblar.birliklar === "imperial" ? "imperial" : "metrik",
    boyi: javoblar.boyi,
    vazn: javoblar.vazn,
    maqsadVazn: javoblar.maqsadVazn,
    faollik: javoblar.faollik,
    ovqatAfzalliklari: javoblar.ovqatAfzalliklari,
    mahal: javoblar.ovqatlanishOdati?.mahal ?? null,
    joy: javoblar.ovqatlanishOdati?.joy ?? null,
    motivatsiya: javoblar.motivatsiya,
  };
}

/** "Cheklov yo'q" tanlansa qolganlari o'chadi va aksincha. */
export function afzallikBosildi(tanlangan: string[], qiymat: string): string[] {
  if (tanlangan.includes(qiymat)) return tanlangan.filter((t) => t !== qiymat);
  if (qiymat === CHEKLOV_YOQ) return [CHEKLOV_YOQ];
  return [...tanlangan.filter((t) => t !== CHEKLOV_YOQ), qiymat];
}

const IZOHSIZ: OlchovIzohlari = { yonalish: null, vazn: null, maqsadVazn: null, yaqin: false };

export type QadamTekshiruvi = {
  /** Yuborishga tayyor tana; javob hali to'liq yoki to'g'ri bo'lmasa null. */
  tana: Record<string, unknown> | null;
  ismXatosi?: string;
  yoshXatosi?: string;
  /** O'lchovlar ekrani izohlari — har biri o'z maydoni ostida. */
  olchov: OlchovIzohlari;
};

/** Joriy qadam javobini tekshiradi. Bo'sh javob xato emas — tugma shunchaki o'chiq turadi. */
export function qadamniTayyorla(qadam: number, forma: Forma): QadamTekshiruvi {
  const natija: QadamTekshiruvi = { tana: null, olchov: IZOHSIZ };

  switch (qadam) {
    case 1:
      natija.tana = { qadam };
      break;

    case 2: {
      const ism = forma.ism.trim();
      if (ism.length > ISM_CHEGARASI) natija.ismXatosi = `${ISM_CHEGARASI} belgidan oshmasin`;
      else if (ism) natija.tana = { qadam, ism };
      break;
    }

    case 3:
      if (forma.maqsad) natija.tana = { qadam, maqsad: forma.maqsad };
      break;

    case 4:
      if (forma.yosh < YOSH.min) natija.yoshXatosi = YOSH_XATOSI;
      else if (forma.jins) natija.tana = { qadam, jins: forma.jins, yosh: forma.yosh };
      break;

    case 5: {
      const { boyi, vazn, maqsadVazn, maqsad } = forma;
      const maqsadKerak = maqsadVaznKerakmi(maqsad);
      natija.olchov = olchovIzohlari(maqsad, boyi, vazn, maqsadKerak ? maqsadVazn : null);

      const tolgan = boyi !== null && vazn !== null && (!maqsadKerak || maqsadVazn !== null);
      if (tolgan && !natija.olchov.yonalish) {
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

    case 6:
      if (forma.faollik) natija.tana = { qadam, faollik: forma.faollik };
      break;

    case 7:
      if (forma.ovqatAfzalliklari.length > 0) {
        natija.tana = { qadam, ovqatAfzalliklari: forma.ovqatAfzalliklari };
      }
      break;

    case 8:
      if (forma.mahal && forma.joy) natija.tana = { qadam, mahal: forma.mahal, joy: forma.joy };
      break;

    case 9:
      if (forma.motivatsiya) natija.tana = { qadam, motivatsiya: forma.motivatsiya };
      break;
  }

  return natija;
}
