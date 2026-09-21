// AI skan bilan bog'liq sof qoidalar — bazaga va AI xizmatiga bog'liq emas, shuning
// uchun klient komponentlar ham shu yerdan import qiladi.

import { k, type Kalit } from "../lugat/tarjima.ts";
import type { SkanQoldigi } from "./huquqlar.ts";

/** Matn bilan tasvirlashning eng katta uzunligi. */
export const MATN_CHEGARASI = 500;

/** Bitta porsiya uchun oqilona eng katta vazn, grammda. */
export const VAZN_CHEGARASI = 5000;

/**
 * AI taxmini. Qiymatlar 100 g uchun turadi, jami esa `skanJami` bilan koddan
 * hisoblanadi — porsiya o'zgarganda AI qayta chaqirilmaydi.
 */
export type SkanNatija = {
  taomNomi: string;
  porsiyaGramm: number;
  kaloriya100: number;
  oqsil100: number;
  yog100: number;
  uglevod100: number;
  /** Foydalanuvchi vaznni o'zi kiritgan — AI taxminidan ustun (DECISIONS 2026-09-13). */
  vaznFoydalanuvchidan: boolean;
};

export type SkanJavobi =
  | { holat: "tayyor"; natija: SkanNatija }
  | { holat: "tanib_bolmadi" };

export type SkanJami = {
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
};

function yaxlit(qiymat: number): number {
  return Math.round(qiymat * 10) / 10;
}

/** Berilgan vazn uchun jami kaloriya va makrolar. */
export function skanJami(natija: SkanNatija, gramm = natija.porsiyaGramm): SkanJami {
  const ulush = gramm / 100;
  return {
    kaloriya: Math.round(natija.kaloriya100 * ulush),
    oqsil: yaxlit(natija.oqsil100 * ulush),
    yog: yaxlit(natija.yog100 * ulush),
    uglevod: yaxlit(natija.uglevod100 * ulush),
  };
}

function musbatSon(qiymat: unknown, chegara: number): number | null {
  return typeof qiymat === "number" && Number.isFinite(qiymat) && qiymat >= 0 && qiymat <= chegara
    ? qiymat
    : null;
}

/**
 * AI qaytargan xom javobni tekshiradi. Shubhali qiymat tuzatilmaydi va uydirilmaydi —
 * natija "tanib bo'lmadi" deb olinadi (DECISIONS 2026-09-13).
 */
export function skanJavobiniTekshir(xom: unknown, vaznGramm: number | null): SkanJavobi {
  const TANILMADI: SkanJavobi = { holat: "tanib_bolmadi" };
  if (typeof xom !== "object" || xom === null) return TANILMADI;

  const j = xom as Record<string, unknown>;
  if (j.tanildi !== true) return TANILMADI;

  const taomNomi = typeof j.taomNomi === "string" ? j.taomNomi.trim().slice(0, 80) : "";
  const gramm = vaznGramm ?? musbatSon(j.porsiyaGramm, VAZN_CHEGARASI);
  // 100 g sof yog' — 900 kkal; undan yuqori qiymat bo'lishi mumkin emas.
  const kaloriya100 = musbatSon(j.kaloriya100, 900);
  const oqsil100 = musbatSon(j.oqsil100, 100);
  const yog100 = musbatSon(j.yog100, 100);
  const uglevod100 = musbatSon(j.uglevod100, 100);

  if (
    !taomNomi ||
    !gramm ||
    kaloriya100 === null ||
    oqsil100 === null ||
    yog100 === null ||
    uglevod100 === null ||
    oqsil100 + yog100 + uglevod100 > 100
  ) {
    return TANILMADI;
  }

  return {
    holat: "tayyor",
    natija: {
      taomNomi,
      porsiyaGramm: Math.round(gramm),
      kaloriya100,
      oqsil100,
      yog100,
      uglevod100,
      vaznFoydalanuvchidan: vaznGramm !== null,
    },
  };
}

/** Limit qatori: `t(matn, ...qiymatlar)` bilan chiziladi; `tugagan` — AI skan yo'llari o'chadi. */
export type LimitKorinishi = {
  tugagan: boolean;
  matn: Kalit;
  qiymatlar: number[];
  /** Bepul skanlar tugagan — PRO yordam beradi: yonida tariflar ekraniga (W1) yo'l ko'rsatiladi. */
  paywall: boolean;
};

/**
 * Skan limitining ekrandagi ko'rinishi — E2 paneli, F1 kartasi va "Tasvirlash" bittasidan
 * o'qiydi. Tarif limiti tugagan bo'lsa shu aytiladi; u bor-u, bugungi tanilmagan urinishlar
 * tugagan bo'lsa — o'sha (skan baribir yopiq).
 */
export function limitKorinishi({ davr, soni, qoldi, tanilmaganQoldi }: SkanQoldigi): LimitKorinishi {
  if (qoldi <= 0) {
    return davr === "kun"
      ? {
          tugagan: true,
          matn: k("Bugungi {0} ta skan ishlatildi. Ertaga yangilanadi — qo'lda qo'shish cheklovsiz."),
          qiymatlar: [soni],
          paywall: false,
        }
      : {
          tugagan: true,
          matn: k("Bepul skanlar tugadi. Qo'lda qo'shish cheklovsiz."),
          qiymatlar: [],
          paywall: true,
        };
  }
  if (tanilmaganQoldi <= 0) {
    return {
      tugagan: true,
      matn: k(
        "Bugun taom bir necha marta tanilmadi. Ertaga yana urinib ko'ring yoki taomni qo'lda qo'shing",
      ),
      qiymatlar: [],
      paywall: false,
    };
  }
  return {
    tugagan: false,
    matn: k("{0} tadan {1} ta skan qoldi"),
    qiymatlar: [soni, qoldi],
    paywall: false,
  };
}
