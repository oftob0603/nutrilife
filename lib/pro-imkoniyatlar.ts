// PRO nima berishi — yagona ro'yxat (qolip: prototip/ui_kits/shared/pro.js). Tariflar ekrani
// (W1) hammasini, onboarding oxiri (O13) birinchi to'rttasini ko'rsatadi — ikki ekran PRO
// tarkibi haqida hech qachon ikki xil gapirmaydi. Tartib — mahsulot egasi bergan tartib.

import { k, type Kalit } from "./lugat/tarjima.ts";

export type ProImkoniyati = {
  id:
    | "skan"
    | "retsept"
    | "score"
    | "taklif"
    | "makro"
    | "porsiya"
    | "statistika"
    | "sevimli"
    | "hisobot";
  nomi: Kalit;
};

export const PRO_IMKONIYATLARI: ProImkoniyati[] = [
  // "Limitsiz" so'zi ishlatilmaydi: ichkarida kuniga 20 ta chegara bor (paywall-tz.md, 3-bo'lim).
  { id: "skan", nomi: k("Kuniga 20 tagacha AI skan") },
  { id: "retsept", nomi: k("Retseptlarni to'liq ko'rish") },
  { id: "score", nomi: k("Nutrition Score") },
  { id: "taklif", nomi: k("Qolgan kaloriyaga mos retsept takliflari") },
  { id: "makro", nomi: k("Oqsil, yog' va uglevodlarni kuzatish") },
  { id: "porsiya", nomi: k("Aqlli porsiya tavsiyalari") },
  { id: "statistika", nomi: k("Batafsil ovqatlanish statistikasi") },
  { id: "sevimli", nomi: k("Sevimli retseptlar") },
  { id: "hisobot", nomi: k("Haftalik ovqatlanish hisoboti") },
];

/** O13 da ko'rsatiladigan asosiy imkoniyatlar soni. */
export const ASOSIY_IMKONIYATLAR_SONI = 4;
