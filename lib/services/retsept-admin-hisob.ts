// Admin paneli A8/A9 (retseptlar) uchun sof hisob — bazaga bog'lanmagan, klient shakl ham shu
// yerdan import qiladi. Panel faqat o'zbekcha (admin-tz.md §1); kontent uch tilda.

/** Retsept holati: qoralama foydalanuvchiga ko'rinmaydi (admin-tz.md A8). */
export const RETSEPT_HOLATLARI = ["qoralama", "chop_etilgan"] as const;
export type RetseptHolati = (typeof RETSEPT_HOLATLARI)[number];

export const HOLAT_NOMLARI: Record<RetseptHolati, string> = {
  qoralama: "Qoralama",
  chop_etilgan: "Chop etilgan",
};

/** A8 holat chiplari tartibi (prototip: Hammasi · Chop etilgan · Qoralama). */
export const HOLAT_FILTRLARI = ["hammasi", "chop_etilgan", "qoralama"] as const;
export type HolatFiltri = (typeof HOLAT_FILTRLARI)[number];

export function holatFiltriniOqi(qiymat: unknown): HolatFiltri {
  return HOLAT_FILTRLARI.find((f) => f === qiymat) ?? "hammasi";
}

export const HOLAT_FILTR_NOMLARI: Record<HolatFiltri, string> = {
  hammasi: "Hammasi",
  chop_etilgan: "Chop etilgan",
  qoralama: "Qoralama",
};

/** A8 kategoriya tanlovi: "hammasi" yoki kategoriya id'si (uuid). */
export function kategoriyaFiltriniOqi(qiymat: unknown): string | null {
  if (typeof qiymat !== "string") return null;
  const toza = qiymat.trim();
  return /^[a-z0-9-]{1,64}$/.test(toza) && toza !== "hammasi" ? toza : null;
}

/** Murakkablik shkalasi qat'iy — to'rtinchi daraja ilovaga hech narsa anglatmaydi (prototip). */
export const MURAKKABLIKLAR = ["oson", "orta", "qiyin"] as const;
export type Murakkablik = (typeof MURAKKABLIKLAR)[number];

export const MURAKKABLIK_NOMLARI: Record<Murakkablik, string> = {
  oson: "Oson",
  orta: "O'rta",
  qiyin: "Qiyin",
};

export function murakkablikniOqi(qiymat: unknown): Murakkablik | null {
  return MURAKKABLIKLAR.find((m) => m === qiymat) ?? null;
}

/** Kontent tillari (lib/lugat tartibida). */
export const TILLAR = ["uz", "ru", "en"] as const;
export type Til = (typeof TILLAR)[number];

export const TIL_NOMLARI: Record<Til, string> = { uz: "O'zbekcha", ru: "Ruscha", en: "Inglizcha" };
/** Maydon yorlig'ida: "Masalliqlar — o'zbekcha". */
export const TIL_QOSHIMCHASI: Record<Til, string> = { uz: "o'zbekcha", ru: "ruscha", en: "inglizcha" };

/** Masalliqlar yoki qadamlar: har til uchun qatorlar ro'yxati. */
export type UchTilda = Record<Til, string[]>;

export const BOSH_UCH_TILDA: UchTilda = { uz: [], ru: [], en: [] };

export const NOM_CHEGARASI = 80;
export const PORSIYA_CHEGARASI = 40;
/** Bitta masalliq yoki qadam matni uzunligi. */
export const QATOR_CHEGARASI = 300;
/** Bir tildagi masalliqlar yoki qadamlar soni. */
export const QATORLAR_SONI_CHEGARASI = 60;

/** Textarea matni → qatorlar: bo'sh qatorlar tushadi, chetlari tozalanadi. */
export function qatorlargaBol(matn: string): string[] {
  return matn
    .split(/\r?\n/)
    .map((q) => q.trim())
    .filter(Boolean);
}

/** Qatorlar → textarea matni. */
export function qatorlarMatni(qatorlar: readonly string[]): string {
  return qatorlar.join("\n");
}

function qatorlarRoyxatiniOqi(qiymat: unknown): string[] | null {
  if (!Array.isArray(qiymat)) return null;
  const qatorlar: string[] = [];
  for (const q of qiymat) {
    if (typeof q !== "string") return null;
    const toza = q.trim();
    if (toza) qatorlar.push(toza);
  }
  return qatorlar;
}

/** Bazadagi JSON ustunni o'qish: shakli buzilgan bo'lsa bo'sh ro'yxatlar. */
export function uchTildaOqi(qiymat: unknown): UchTilda {
  if (!qiymat || typeof qiymat !== "object" || Array.isArray(qiymat)) return BOSH_UCH_TILDA;
  const obyekt = qiymat as Record<string, unknown>;
  return {
    uz: qatorlarRoyxatiniOqi(obyekt.uz) ?? [],
    ru: qatorlarRoyxatiniOqi(obyekt.ru) ?? [],
    en: qatorlarRoyxatiniOqi(obyekt.en) ?? [],
  };
}

/** Qadam bor-yo'qligi: bo'sh ro'yxat — admin tayyorlashni kiritmagan (prototip `hasSteps`). */
export function qadamBormi(qadamlar: UchTilda, til: Til): boolean {
  return qadamlar[til].length > 0;
}

/** A8 "Mazmuni" ustuni: "7 masalliq · 6 qadam" yoki "7 masalliq · qadam yo'q" (o'zbekcha bo'yicha). */
export function mazmunMatni(masalliqlar: UchTilda, qadamlar: UchTilda): string {
  const m = masalliqlar.uz.length;
  const q = qadamlar.uz.length;
  return `${m} masalliq · ${q ? `${q} qadam` : "qadam yo'q"}`;
}

/** "45 daq" — jadval ustuni; yo'q bo'lsa "—". */
export function vaqtMatni(daqiqa: number | null): string {
  return daqiqa === null ? "—" : `${daqiqa} daq`;
}

/** Saqlash tugmasi: `saqlash` joriy holatni saqlaydi, `chop_etish` chop etilganga o'tkazadi. */
export const AMALLAR = ["saqlash", "chop_etish"] as const;
export type Amal = (typeof AMALLAR)[number];

/** A9 shakli serverga yuboradigan maydonlar — tekshiruvdan o'tgan ko'rinishi. */
export type RetseptKirishi = {
  nomi: string;
  nomiRu: string;
  nomiEn: string;
  kategoriyaId: string | null;
  kaloriya: number | null;
  oqsil: number | null;
  yog: number | null;
  uglevod: number | null;
  porsiya: string;
  vaqtDaqiqa: number | null;
  murakkablik: Murakkablik | null;
  masalliqlar: UchTilda;
  qadamlar: UchTilda;
  amal: Amal;
};

function matnOqi(qiymat: unknown): string {
  return typeof qiymat === "string" ? qiymat.trim() : "";
}

/** "12,5" ham, "12.5" ham o'qiladi; bo'sh — null; son emas — NaN. */
function sonOqi(qiymat: unknown): number | null {
  if (typeof qiymat === "number") return Number.isFinite(qiymat) ? qiymat : NaN;
  if (typeof qiymat !== "string") return null;
  const matn = qiymat.trim().replace(",", ".");
  if (matn === "") return null;
  const son = Number(matn);
  return Number.isFinite(son) ? son : NaN;
}

function uchTildaMaydon(tana: Record<string, unknown>, asos: string): UchTilda {
  return {
    uz: qatorlargaBol(matnOqi(tana[`${asos}Uz`])),
    ru: qatorlargaBol(matnOqi(tana[`${asos}Ru`])),
    en: qatorlargaBol(matnOqi(tana[`${asos}En`])),
  };
}

function uchTildaChegarasi(royxat: UchTilda): string | null {
  for (const til of TILLAR) {
    if (royxat[til].length > QATORLAR_SONI_CHEGARASI) return `Ko'pi bilan ${QATORLAR_SONI_CHEGARASI} ta qator`;
    if (royxat[til].some((q) => q.length > QATOR_CHEGARASI)) return `Har qator ${QATOR_CHEGARASI} belgidan oshmasin`;
  }
  return null;
}

export type RetseptTekshiruvi = { kirish: RetseptKirishi } | { xato: string };

/**
 * A9 shakl maydonlarini tekshiradi (multipart — qiymatlar matn bo'lib keladi). Qoralama uchun
 * faqat o'zbekcha nom majburiy; qolgan maydonlar bo'sh bo'lsa null, to'ldirilgan bo'lsa yaroqli
 * bo'lishi shart. Chop etish talablari alohida — `chopEtishKamchiliklari`.
 */
export function retseptKirishiniTekshir(tana: Record<string, unknown>): RetseptTekshiruvi {
  const nomi = matnOqi(tana.nomi);
  const nomiRu = matnOqi(tana.nomiRu);
  const nomiEn = matnOqi(tana.nomiEn);
  if (!nomi) return { xato: "O'zbekcha nomi majburiy" };
  if ([nomi, nomiRu, nomiEn].some((n) => n.length > NOM_CHEGARASI)) {
    return { xato: `Nomi ${NOM_CHEGARASI} belgidan oshmasin` };
  }

  const kaloriya = sonOqi(tana.kaloriya);
  const oqsil = sonOqi(tana.oqsil);
  const yog = sonOqi(tana.yog);
  const uglevod = sonOqi(tana.uglevod);
  if (kaloriya !== null && !(kaloriya >= 0 && kaloriya <= 10_000)) return { xato: "Kaloriya noto'g'ri" };
  if ([oqsil, yog, uglevod].some((m) => m !== null && !(m >= 0 && m <= 1_000))) {
    return { xato: "Makrolar noto'g'ri" };
  }

  const vaqt = sonOqi(tana.vaqtDaqiqa);
  if (vaqt !== null && !(Number.isInteger(vaqt) && vaqt > 0 && vaqt <= 1_440)) {
    return { xato: "Tayyorlash vaqti — daqiqada butun son" };
  }

  const murakkablikMatni = matnOqi(tana.murakkablik);
  const murakkablik = murakkablikMatni ? murakkablikniOqi(murakkablikMatni) : null;
  if (murakkablikMatni && !murakkablik) return { xato: "Murakkablik noto'g'ri" };

  const porsiya = matnOqi(tana.porsiya);
  if (porsiya.length > PORSIYA_CHEGARASI) return { xato: `Porsiya ${PORSIYA_CHEGARASI} belgidan oshmasin` };

  const kategoriya = matnOqi(tana.kategoriyaId);
  if (kategoriya.length > 64) return { xato: "Kategoriya noto'g'ri" };

  const masalliqlar = uchTildaMaydon(tana, "masalliqlar");
  const qadamlar = uchTildaMaydon(tana, "qadamlar");
  const chegara = uchTildaChegarasi(masalliqlar) ?? uchTildaChegarasi(qadamlar);
  if (chegara) return { xato: chegara };

  const amal = AMALLAR.find((a) => a === tana.amal) ?? "saqlash";

  return {
    kirish: {
      nomi,
      nomiRu,
      nomiEn,
      kategoriyaId: kategoriya || null,
      kaloriya,
      oqsil,
      yog,
      uglevod,
      porsiya,
      vaqtDaqiqa: vaqt,
      murakkablik,
      masalliqlar,
      qadamlar,
      amal,
    },
  };
}

/** Chop etish uchun tekshiriladigan maydonlar — klient shakl ham shu shaklda beradi. */
export type ChopEtishMaydonlari = {
  nomi: string;
  nomiRu: string;
  nomiEn: string;
  kategoriyaId: string | null;
  kaloriya: number | null;
  vaqtDaqiqa: number | null;
  murakkablik: Murakkablik | null;
  masalliqlar: UchTilda;
};

/**
 * Chop etilgan retsept to'liq bo'lishi kerak (admin-tz.md A9): uch nom, kategoriya, kaloriya,
 * tayyorlash vaqti, murakkablik va uch tilda kamida bittadan masalliq. Qadamlar ixtiyoriy —
 * bo'sh bo'lsa ilovada "Tayyorlash" bo'limi chiqmaydi. Bo'sh ro'yxat — chop etsa bo'ladi.
 */
export function chopEtishKamchiliklari(m: ChopEtishMaydonlari): string[] {
  const kamchiliklar: string[] = [];
  if (!m.nomi.trim() || !m.nomiRu.trim() || !m.nomiEn.trim()) kamchiliklar.push("nomi uch tilda");
  if (!m.kategoriyaId) kamchiliklar.push("kategoriya");
  if (m.kaloriya === null || !(m.kaloriya > 0)) kamchiliklar.push("kaloriya");
  if (m.vaqtDaqiqa === null || !(m.vaqtDaqiqa > 0)) kamchiliklar.push("tayyorlash vaqti");
  if (!m.murakkablik) kamchiliklar.push("murakkablik");
  const tilsiz = TILLAR.filter((til) => m.masalliqlar[til].length === 0);
  if (tilsiz.length > 0) {
    kamchiliklar.push(
      tilsiz.length === TILLAR.length
        ? "masalliqlar"
        : `masalliqlar — ${tilsiz.map((t) => TIL_QOSHIMCHASI[t]).join(", ")}`,
    );
  }
  return kamchiliklar;
}

/** Kamchiliklar ro'yxati → bitta xabar: "Chop etish uchun yetishmayapti: kategoriya, kaloriya". */
export function kamchilikXabari(kamchiliklar: readonly string[]): string {
  return `Chop etish uchun yetishmayapti: ${kamchiliklar.join(", ")}`;
}

/** Shakl maydonidagi raqam: butun bo'lsa "186", aks holda "6.4"; null — bo'sh. */
export function sonMatni(son: number | null): string {
  if (son === null) return "";
  return Number.isInteger(son) ? String(son) : String(Math.round(son * 10) / 10);
}

/** A9 "Tarjima qilish" so'rovi: o'zbekcha nom majburiy, ro'yxatlar shakl chegaralarida. */
export type TarjimaSorovi = { nomi: string; masalliqlar: string[]; qadamlar: string[] };

export function tarjimaSoroviniOqi(tana: unknown): TarjimaSorovi | null {
  if (!tana || typeof tana !== "object") return null;
  const obyekt = tana as Record<string, unknown>;
  const nomi = matnOqi(obyekt.nomi);
  if (!nomi || nomi.length > NOM_CHEGARASI) return null;
  const masalliqlar = qatorlarRoyxatiniOqi(obyekt.masalliqlar);
  const qadamlar = qatorlarRoyxatiniOqi(obyekt.qadamlar);
  if (!masalliqlar || !qadamlar) return null;
  for (const royxat of [masalliqlar, qadamlar]) {
    if (royxat.length > QATORLAR_SONI_CHEGARASI) return null;
    if (royxat.some((q) => q.length > QATOR_CHEGARASI)) return null;
  }
  return { nomi, masalliqlar, qadamlar };
}

export type TilTarjimasi = { nomi: string; masalliqlar: string[]; qadamlar: string[] };
export type TarjimaJavobi = { ru: TilTarjimasi; en: TilTarjimasi };

function tilTarjimasiniOqi(qiymat: unknown, manba: TarjimaSorovi): TilTarjimasi | null {
  if (!qiymat || typeof qiymat !== "object") return null;
  const obyekt = qiymat as Record<string, unknown>;
  const nomi = matnOqi(obyekt.nomi);
  if (!nomi) return null;
  const masalliqlar = qatorlarRoyxatiniOqi(obyekt.masalliqlar);
  const qadamlar = qatorlarRoyxatiniOqi(obyekt.qadamlar);
  // Har qator o'z o'rnida tarjima qilinishi shart — soni mos kelmasa javob ishonchsiz.
  if (!masalliqlar || masalliqlar.length !== manba.masalliqlar.length) return null;
  if (!qadamlar || qadamlar.length !== manba.qadamlar.length) return null;
  return { nomi: nomi.slice(0, NOM_CHEGARASI), masalliqlar, qadamlar };
}

/** AI javobini tekshiradi: ikkala til bor, qatorlar soni manbaga mos; buzilgan bo'lsa null. */
export function tarjimaJavobiniTekshir(xom: unknown, manba: TarjimaSorovi): TarjimaJavobi | null {
  if (!xom || typeof xom !== "object") return null;
  const obyekt = xom as Record<string, unknown>;
  const ru = tilTarjimasiniOqi(obyekt.ru, manba);
  const en = tilTarjimasiniOqi(obyekt.en, manba);
  return ru && en ? { ru, en } : null;
}
