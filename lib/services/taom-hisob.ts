// Taom bilan bog'liq sof hisob — bazaga bog'liq emas, shuning uchun klient
// komponentlar ham shu yerdan import qiladi (lib/services/taomlar.ts baza ochadi).

export type Taom = {
  id: string;
  nomi: string;
  olchovMiqdori: number;
  olchovBirligi: string;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
  porsiyalar: number[];
};

/** Karta ostidagi izoh: "100 g · 186 kkal" yoki "1 dona · 310 kkal". */
export function olchovIzohi(taom: Taom): string {
  return `${taom.olchovMiqdori} ${taom.olchovBirligi} · ${taom.kaloriya} kkal`;
}

export type PorsiyaHisobi = {
  belgisi: string;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
};

/**
 * Tanlangan miqdorga qarab kaloriya va makrolar. Baza qiymatlari bitta o'lchov
 * birligiga (100 g yoki 1 dona) berilgani uchun ko'paytuvchi — miqdor / o'lchov.
 */
export function porsiyaHisobi(taom: Taom, miqdor: number): PorsiyaHisobi {
  const kopaytuvchi = taom.olchovMiqdori > 0 ? miqdor / taom.olchovMiqdori : 0;
  return {
    belgisi: `${miqdor} ${taom.olchovBirligi}`,
    kaloriya: Math.round(taom.kaloriya * kopaytuvchi),
    oqsil: Math.round(taom.oqsil * kopaytuvchi),
    yog: Math.round(taom.yog * kopaytuvchi),
    uglevod: Math.round(taom.uglevod * kopaytuvchi),
  };
}

/** Katta raqamlar uchun minglik ajratgich: 1085 -> "1,085". */
export function raqam(son: number): string {
  return Math.round(son).toLocaleString("en-US");
}

/** Ochilganda tanlangan porsiya — prototipdagidek o'rtacha variant. */
export function birlamchiPorsiya(taom: Taom): number {
  return taom.porsiyalar[1] ?? taom.porsiyalar[0] ?? taom.olchovMiqdori;
}
