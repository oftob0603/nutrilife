// Taom bilan bog'liq sof hisob — bazaga bog'liq emas, shuning uchun klient
// komponentlar ham shu yerdan import qiladi (lib/services/taomlar.ts baza ochadi).

export type Taom = {
  id: string;
  /** O'zbekcha nom — interfeysda shu ko'rinadi; ru/en nomlar qidiruv uchun. */
  nomi: string;
  nomiRu: string;
  nomiEn: string;
  /** `public/` ichidagi rasm yo'li; rasm yo'q bo'lsa null. */
  rasm: string | null;
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

/**
 * Qidiruv uchun matnni tekislaydi: kichik harf, tutuq belgisi va tinish belgilarisiz.
 * Shunda "lagmon" so'rovi "Lag'mon" ni, "shorva" esa "Sho'rva" ni topadi.
 */
function tekisla(matn: string): string {
  return matn.toLowerCase().replace(/['’ʻʼ`\-\s]/g, "");
}

/** Taom nomi so'rovga uch tilning birida mos keladimi. Bo'sh so'rov hammasiga mos. */
export function taomMosmi(taom: Taom, sorov: string): boolean {
  const izlangan = tekisla(sorov);
  if (!izlangan) return true;
  return [taom.nomi, taom.nomiRu, taom.nomiEn].some((nom) =>
    tekisla(nom).includes(izlangan),
  );
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
