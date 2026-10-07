// Admin paneli A6/A7 (taom bazasi) uchun sof hisob — bazaga bog'lanmagan, klient shakl ham
// shu yerdan import qiladi. Panel faqat o'zbekcha (admin-tz.md §1).

export const TAOM_FILTRLARI = ["hammasi", "tarjimasiz", "rasmsiz"] as const;
export type TaomFiltri = (typeof TAOM_FILTRLARI)[number];

export function taomFiltriniOqi(qiymat: unknown): TaomFiltri {
  return TAOM_FILTRLARI.find((filtr) => filtr === qiymat) ?? "hammasi";
}

/** Chipdagi nom. Prototipdagi til chiplari hech narsani filtrlamaydi — ular yo'q. */
export const TAOM_FILTR_NOMLARI: Record<TaomFiltri, string> = {
  hammasi: "Hammasi",
  tarjimasiz: "Tarjimasi yo'q",
  rasmsiz: "Rasmsiz",
};

/** O'lchov birliklari — seed va lug'at (lib/lugat/tarjima.ts KOPLIK) biladiganlar. */
export const BIRLIKLAR = ["g", "ml", "dona", "six", "bo'lak"] as const;
export type Birlik = (typeof BIRLIKLAR)[number];

export function birlikniOqi(qiymat: unknown): Birlik | null {
  return BIRLIKLAR.find((b) => b === qiymat) ?? null;
}

/** "100 g" · "1 dona" — jadval va karta ustuni. */
export function olchovMatni(miqdor: number, birlik: string): string {
  return `${miqdor} ${birlik}`;
}

/** Nom maydonlarining eng uzun uzunligi. */
export const NOM_CHEGARASI = 80;
/** Porsiya variantlari soni (prototip: 2–3 ta, A7 ko'pi bilan 5). */
export const PORSIYA_SONI_CHEGARASI = 5;
/** Makrolardan hisoblangan kaloriya kiritilganidan shu ulushdan ko'p farq qilsa ogohlantirish (admin-tz A7). */
export const MAKRO_FARQ_CHEGARASI = 0.2;

/** A7 shakli serverga yuboradigan maydonlar — tekshiruvdan o'tgan ko'rinishi. */
export type TaomKirishi = {
  nomi: string;
  nomiRu: string;
  nomiEn: string;
  olchovMiqdori: number;
  olchovBirligi: Birlik;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
  porsiyalar: number[];
  kategoriyaId: string | null;
};

/** 4×oqsil + 9×yog' + 4×uglevod. */
export function makroKaloriyasi(oqsil: number, yog: number, uglevod: number): number {
  return 4 * oqsil + 9 * yog + 4 * uglevod;
}

/** Kiritilgan kaloriyaga nisbatan farq ulushi (0.25 = 25 %); ikkalasi ham musbat bo'lmasa 0. */
export function makroFarqi(kaloriya: number, hisob: number): number {
  if (!(kaloriya > 0) || !(hisob > 0)) return 0;
  return Math.abs(hisob - kaloriya) / kaloriya;
}

/**
 * Porsiya variantlari matni: "150, 250, 350" → [150, 250, 350]. Butun musbat sonlar,
 * takrorsiz, o'sish tartibida; bo'sh yoki yaroqsiz — null.
 */
export function porsiyalarniOqi(matn: string): number[] | null {
  const bolaklar = matn
    .split(/[,;\s]+/)
    .map((b) => b.trim())
    .filter(Boolean);
  if (bolaklar.length === 0 || bolaklar.length > PORSIYA_SONI_CHEGARASI) return null;
  const sonlar = bolaklar.map(Number);
  if (sonlar.some((s) => !Number.isInteger(s) || s <= 0 || s > 100_000)) return null;
  const takrorsiz = [...new Set(sonlar)].sort((a, b) => a - b);
  return takrorsiz.length === sonlar.length ? takrorsiz : null;
}

/** Porsiyalar ro'yxati shakl maydonida: [150, 250] → "150, 250". */
export function porsiyalarMatni(porsiyalar: readonly number[]): string {
  return porsiyalar.join(", ");
}

function matnOqi(qiymat: unknown): string {
  return typeof qiymat === "string" ? qiymat.trim() : "";
}

/** "12,5" ham, "12.5" ham o'qiladi; son emas — null. */
function sonOqi(qiymat: unknown): number | null {
  if (typeof qiymat === "number") return Number.isFinite(qiymat) ? qiymat : null;
  if (typeof qiymat !== "string") return null;
  const matn = qiymat.trim().replace(",", ".");
  if (matn === "") return null;
  const son = Number(matn);
  return Number.isFinite(son) ? son : null;
}

export type TaomTekshiruvi = { kirish: TaomKirishi } | { xato: string };

/**
 * A7 shakl maydonlarini tekshiradi (multipart yoki JSON — qiymatlar matn bo'lib keladi).
 * Uch nom majburiy (admin-tz A7); o'lchov miqdori butun musbat; kaloriya va makrolar
 * manfiy emas; porsiyalar ro'yxati shu birlikda. Makro farqi xato emas — faqat ogohlantirish.
 */
export function taomKirishiniTekshir(tana: Record<string, unknown>): TaomTekshiruvi {
  const nomi = matnOqi(tana.nomi);
  const nomiRu = matnOqi(tana.nomiRu);
  const nomiEn = matnOqi(tana.nomiEn);
  if (!nomi || !nomiRu || !nomiEn) return { xato: "Nomi uch tilda ham majburiy" };
  if ([nomi, nomiRu, nomiEn].some((n) => n.length > NOM_CHEGARASI)) {
    return { xato: `Nomi ${NOM_CHEGARASI} belgidan oshmasin` };
  }

  const olchovBirligi = birlikniOqi(matnOqi(tana.olchovBirligi));
  if (!olchovBirligi) return { xato: "O'lchov birligi noto'g'ri" };
  const olchovMiqdori = sonOqi(tana.olchovMiqdori);
  if (olchovMiqdori === null || !Number.isInteger(olchovMiqdori) || olchovMiqdori <= 0) {
    return { xato: "O'lchov miqdori butun musbat son bo'lsin" };
  }

  const kaloriya = sonOqi(tana.kaloriya);
  const oqsil = sonOqi(tana.oqsil);
  const yog = sonOqi(tana.yog);
  const uglevod = sonOqi(tana.uglevod);
  if (kaloriya === null || kaloriya < 0 || kaloriya > 10_000) return { xato: "Kaloriya noto'g'ri" };
  if ([oqsil, yog, uglevod].some((m) => m === null || m < 0 || m > 1_000)) {
    return { xato: "Makrolar noto'g'ri" };
  }

  const porsiyalar =
    typeof tana.porsiyalar === "string" ? porsiyalarniOqi(tana.porsiyalar) : null;
  if (!porsiyalar) {
    return { xato: `Porsiya variantlari: 1–${PORSIYA_SONI_CHEGARASI} ta butun son, vergul bilan` };
  }

  const kategoriya = matnOqi(tana.kategoriyaId);
  if (kategoriya.length > 64) return { xato: "Kategoriya noto'g'ri" };

  return {
    kirish: {
      nomi,
      nomiRu,
      nomiEn,
      olchovMiqdori,
      olchovBirligi,
      kaloriya,
      oqsil: oqsil as number,
      yog: yog as number,
      uglevod: uglevod as number,
      porsiyalar,
      kategoriyaId: kategoriya || null,
    },
  };
}

/** Kategoriya nomi: 2–40 belgi, bo'shliqlar tekislanadi; yaroqsiz — null. */
export function kategoriyaNominiOqi(qiymat: unknown): string | null {
  const nomi = matnOqi(qiymat).replace(/\s+/g, " ");
  return nomi.length >= 2 && nomi.length <= 40 ? nomi : null;
}

// Taom id'si slug (seed: `qovurma-lagmon`, `shashlik-tovuq`) — API qolipi `^[a-z0-9-]{1,64}$`.
const TRANSLIT: Record<string, string> = {
  ş: "sh", ç: "ch", ğ: "g", ö: "o", ü: "u", ı: "i", ñ: "n",
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "x", ц: "ts", ч: "ch", ш: "sh", щ: "sh", ъ: "", ы: "i", ь: "", э: "e", ю: "yu", я: "ya",
  ў: "o", қ: "q", ғ: "g", ҳ: "h",
};

/**
 * O'zbekcha nomdan slug: "Qovurma lag'mon" → "qovurma-lagmon". Tutuq belgilari tushadi,
 * kirill harflari lotinga o'giriladi, qolgan belgilar chiziqcha. Bo'sh chiqsa — "taom".
 */
export function slugYasa(nomi: string): string {
  const harflar = nomi
    .toLowerCase()
    .replace(/['’ʻʼ`‘]/g, "")
    .split("")
    .map((h) => TRANSLIT[h] ?? h)
    .join("");
  const slug = harflar
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
    .replace(/-+$/, "");
  return slug || "taom";
}

/** Shakl maydonidagi raqam: butun bo'lsa "186", aks holda "6.4". */
export function sonMatni(son: number): string {
  return Number.isInteger(son) ? String(son) : String(Math.round(son * 10) / 10);
}
