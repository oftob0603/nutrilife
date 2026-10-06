// Taom takliflari navbati (S6 4-task, admin-tz.md A4/A5) uchun sof hisob — bazaga bog'lanmagan,
// klient komponentlar ham shu yerdan import qiladi. "Taklif" — foydalanuvchi E7'da AI natijasini
// tuzatib tasdiqlagani; umumiy baza faqat admin qarori bilan o'zgaradi (DECISIONS 2026-09-13).

import { sanaMatni } from "./admin-hisob.ts";
import type { SkanNatija } from "./skan-hisob.ts";
import { tekisla } from "./taom-hisob.ts";
import { KALORIYA_CHEGARASI, MAKRO_CHEGARASI } from "./yozuv-chegaralari.ts";

// ——— Holatlar (PRD.md 8-bo'lim zanjiri, prototip nomlari) ———

export const TAKLIF_HOLATLARI = ["yangi", "korilmoqda", "tasdiqlandi", "rad_etildi"] as const;
export type TaklifHolati = (typeof TAKLIF_HOLATLARI)[number];

/** Navbatda kutayotganlar — qobiqdagi son va A1 kartasi shu ikkisini sanaydi. */
export const KUTAYOTGAN_HOLATLAR: readonly TaklifHolati[] = ["yangi", "korilmoqda"];

export const HOLAT_MATNLARI: Record<TaklifHolati, string> = {
  yangi: "Yangi",
  korilmoqda: "Ko'rib chiqilmoqda",
  tasdiqlandi: "Tasdiqlangan",
  rad_etildi: "Rad etilgan",
};

/** A4 filtr chiplari (prototip: Hammasi · Yangi · Ko'rib chiqilmoqda · Tasdiqlangan · Rad etilgan). */
export const TAKLIF_FILTRLARI = ["hammasi", ...TAKLIF_HOLATLARI] as const;
export type TaklifFiltri = (typeof TAKLIF_FILTRLARI)[number];

/** So'rovdagi noma'lum qiymat — "yangi" (prototipdagi standart filtr). */
export function taklifFiltriniOqi(qiymat: unknown): TaklifFiltri {
  return TAKLIF_FILTRLARI.find((f) => f === qiymat) ?? "yangi";
}

export const FILTR_MATNLARI: Record<TaklifFiltri, string> = { hammasi: "Hammasi", ...HOLAT_MATNLARI };

// ——— Tuzatish bor-yo'qligi (E7 tasdig'ida, serverda) ———

/**
 * Zichlik farqi shundan katta bo'lsa tuzatish deb olinadi. Foydalanuvchi faqat porsiyani
 * o'zgartirsa qiymatlar asosdan qayta hisoblanadi — yaxlitlash 1–2 % shovqin beradi, u taklif emas.
 */
export const ZICHLIK_FARQI = 0.03;

export type Zichlik = { kaloriya100: number; oqsil100: number; yog100: number; uglevod100: number };

/** Foydalanuvchi tasdiqlagan qiymatlar — kiritilgan porsiya uchun. */
export type TasdiqlanganQiymatlar = {
  taomNomi: string;
  porsiyaGramm: number;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
};

function yaxlit(qiymat: number): number {
  return Math.round(qiymat * 10) / 10;
}

/** Porsiya qiymatlaridan 100 g zichligi; porsiya nol bo'lsa hammasi nol. */
export function zichlik(q: Pick<TasdiqlanganQiymatlar, "porsiyaGramm" | "kaloriya" | "oqsil" | "yog" | "uglevod">): Zichlik {
  const ulush = q.porsiyaGramm > 0 ? 100 / q.porsiyaGramm : 0;
  return {
    kaloriya100: yaxlit(q.kaloriya * ulush),
    oqsil100: yaxlit(q.oqsil * ulush),
    yog100: yaxlit(q.yog * ulush),
    uglevod100: yaxlit(q.uglevod * ulush),
  };
}

/** Ikki qiymat sezilarli farq qiladimi: nisbiy farq chegaradan katta va mutlaq farq 1 dan katta. */
function farqBormi(eski: number, yangi: number): boolean {
  const mutlaq = Math.abs(eski - yangi);
  if (mutlaq <= 1) return false;
  return mutlaq / Math.max(Math.abs(eski), 1) > ZICHLIK_FARQI;
}

/**
 * Foydalanuvchi AI natijasini tuzatganmi: taom nomi o'zgargan (tekislab solishtiriladi) yoki
 * 100 g zichligining birortasi sezilarli farq qiladi. Porsiya o'zgarishi hisobga olinmaydi —
 * u taomni emas, miqdorni tuzatadi.
 */
export function tuzatishBormi(ai: SkanNatija, tasdiq: TasdiqlanganQiymatlar): boolean {
  if (tekisla(ai.taomNomi) !== tekisla(tasdiq.taomNomi)) return true;
  const z = zichlik(tasdiq);
  return (
    farqBormi(ai.kaloriya100, z.kaloriya100) ||
    farqBormi(ai.oqsil100, z.oqsil100) ||
    farqBormi(ai.yog100, z.yog100) ||
    farqBormi(ai.uglevod100, z.uglevod100)
  );
}

function musbatSon(qiymat: unknown, chegara: number): number | null {
  return typeof qiymat === "number" && Number.isFinite(qiymat) && qiymat >= 0 && qiymat <= chegara
    ? qiymat
    : null;
}

/**
 * `POST /api/ovqat-yozuvlari` tanasidagi `aiNatija` — klient E7'da olgan AI javobi. Yaroqsiz yoki
 * yo'q bo'lsa null: yozuv baribir saqlanadi, faqat taklif tushmaydi. Chegaralar skan tekshiruvi
 * bilan bir xil (skan-hisob.ts).
 */
export function aiNatijaniOqi(xom: unknown): SkanNatija | null {
  if (typeof xom !== "object" || xom === null) return null;
  const j = xom as Record<string, unknown>;
  const taomNomi = typeof j.taomNomi === "string" ? j.taomNomi.trim().slice(0, 80) : "";
  const porsiyaGramm = musbatSon(j.porsiyaGramm, 5000);
  const kaloriya100 = musbatSon(j.kaloriya100, 900);
  const oqsil100 = musbatSon(j.oqsil100, 100);
  const yog100 = musbatSon(j.yog100, 100);
  const uglevod100 = musbatSon(j.uglevod100, 100);
  if (
    !taomNomi ||
    !porsiyaGramm ||
    kaloriya100 === null ||
    oqsil100 === null ||
    yog100 === null ||
    uglevod100 === null
  ) {
    return null;
  }
  return {
    taomNomi,
    porsiyaGramm: Math.round(porsiyaGramm),
    kaloriya100,
    oqsil100,
    yog100,
    uglevod100,
    vaznFoydalanuvchidan: j.vaznFoydalanuvchidan === true,
  };
}

/** Yozuvdagi porsiya matnidan ("350 g") gramm; grammda bo'lmasa null — taklif faqat grammli yozuvdan. */
export function porsiyaGrammi(porsiya: string): number | null {
  const mos = /^\s*(\d+(?:[.,]\d+)?)\s*g\s*$/i.exec(porsiya);
  if (!mos) return null;
  const gramm = Math.round(Number(mos[1].replace(",", ".")));
  return gramm > 0 ? gramm : null;
}

// ——— Ko'rinish matnlari (A4 jadvali, A5 ustunlari) ———

/** "Palov, 420 kkal / 100 g" — prototip A4 ustuni. */
export function zichlikMatni(nomi: string, kaloriya100: number): string {
  return `${nomi}, ${Math.round(kaloriya100)} kkal / 100 g`;
}

/** A5 ustunidagi makro qatori: "O 8 · Y 11 · U 22 g / 100 g". */
export function makroMatni(z: Zichlik): string {
  return `O ${yaxlit(z.oqsil100)} · Y ${yaxlit(z.yog100)} · U ${yaxlit(z.uglevod100)} g / 100 g`;
}

/** A5 sarlavha izohi: "t-104 · 2026-09-02 · Dilnoza Yusupova". */
export function taklifIzohi(id: string, yaratilgan: string, kim: string | null): string {
  return `${id.slice(0, 8)} · ${sanaMatni(yaratilgan)} · ${kim ?? "Ismsiz"}`;
}

// ——— Admin qarori ———

export const RAD_SABABLARI = [
  "Noto'g'ri ma'lumot",
  "Rasm tushunarsiz",
  "Takroriy taklif",
  "Spam",
] as const;

/** Sabab maydoni chegarasi (obuna amallari bilan bir xil). */
export const SABAB_CHEGARASI = 200;
export const NOM_CHEGARASI = 80;

export type Nomlar = { nomi: string; nomiRu: string; nomiEn: string };

export type TaklifQarori =
  | { qaror: "yangi"; nomlar: Nomlar }
  | { qaror: "birlashtirish"; taomId: string; nomlar: Nomlar }
  | { qaror: "rad"; sabab: string };

const TAOM_ID_QOLIPI = /^[a-z0-9-]{1,64}$/;

function nomniOqi(qiymat: unknown): string | null {
  if (typeof qiymat !== "string") return null;
  const nom = qiymat.trim();
  return nom.length >= 1 && nom.length <= NOM_CHEGARASI ? nom : null;
}

/** Uch til nomi — hammasi majburiy (admin-tz.md A5: "uch til ham to'ldirilishi shart"). */
function nomlarniOqi(tana: Record<string, unknown>): Nomlar | null {
  const nomi = nomniOqi(tana.nomi);
  const nomiRu = nomniOqi(tana.nomiRu);
  const nomiEn = nomniOqi(tana.nomiEn);
  return nomi && nomiRu && nomiEn ? { nomi, nomiRu, nomiEn } : null;
}

/** `POST /api/admin/takliflar/[id]/qaror` tanasi. */
export function qarorniTekshir(xom: unknown): { qaror: TaklifQarori } | { xato: string } {
  const tana = (typeof xom === "object" && xom !== null ? xom : {}) as Record<string, unknown>;
  switch (tana.qaror) {
    case "yangi": {
      const nomlar = nomlarniOqi(tana);
      return nomlar ? { qaror: { qaror: "yangi", nomlar } } : { xato: "Taom nomini uch tilda yozing" };
    }
    case "birlashtirish": {
      const taomId = typeof tana.taomId === "string" && TAOM_ID_QOLIPI.test(tana.taomId) ? tana.taomId : null;
      if (!taomId) return { xato: "Birlashtiriladigan taom tanlanmagan" };
      const nomlar = nomlarniOqi(tana);
      return nomlar
        ? { qaror: { qaror: "birlashtirish", taomId, nomlar } }
        : { xato: "Taom nomini uch tilda yozing" };
    }
    case "rad": {
      const sabab = typeof tana.sabab === "string" ? tana.sabab.trim() : "";
      if (!sabab || sabab.length > SABAB_CHEGARASI) return { xato: "Rad etish sababini tanlang" };
      return { qaror: { qaror: "rad", sabab } };
    }
    default:
      return { xato: "Qaror noma'lum" };
  }
}

/**
 * O'zbekcha nomdan taom identifikatori (seed uslubi: `achchiq-chuchuk`, `tovuq-shorva`):
 * kichik lotin harf, raqam va chiziqcha; tutuq belgisi tushib qoladi, kirill va boshqa
 * belgilar — chiziqcha. Bo'sh chiqsa "taom".
 */
export function taomSlugi(nomi: string): string {
  const slug = nomi
    .toLowerCase()
    .replace(/['’ʻʼ`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "taom";
}

/** Band bo'lgan slugga raqam qo'shadi: `osh`, `osh-2`, `osh-3`… */
export function bandBolmaganSlug(slug: string, bandlar: ReadonlySet<string>): string {
  if (!bandlar.has(slug)) return slug;
  for (let n = 2; ; n += 1) {
    const nomzod = `${slug}-${n}`;
    if (!bandlar.has(nomzod)) return nomzod;
  }
}

/** Yangi taom uchun porsiya variantlari: foydalanuvchi porsiyasi atrofida, 50 g ga yaxlitlab. */
export function porsiyaVariantlari(porsiyaGramm: number): number[] {
  const orta = Math.max(50, Math.round(porsiyaGramm / 50) * 50);
  return [...new Set([Math.max(50, orta - 100), orta, orta + 100])].sort((a, b) => a - b);
}

/** Baza chegaralaridan oshgan zichlik — yozuvga sig'maydi; A5 tugmasini o'chiradi. */
export function zichlikYaroqli(z: Zichlik): boolean {
  return (
    z.kaloriya100 <= KALORIYA_CHEGARASI &&
    z.oqsil100 <= MAKRO_CHEGARASI &&
    z.yog100 <= MAKRO_CHEGARASI &&
    z.uglevod100 <= MAKRO_CHEGARASI
  );
}

/** Jurnal tafsiloti: "Toshkent oshi → yangi taom «toshkent-oshi»". */
export function qarorTafsiloti(qaror: TaklifQarori, taomNomi: string, taomId?: string): string {
  switch (qaror.qaror) {
    case "yangi":
      return `${taomNomi} → yangi taom «${taomId ?? ""}»`;
    case "birlashtirish":
      return `${taomNomi} → «${qaror.taomId}» ga birlashtirildi`;
    default:
      return `${taomNomi} — rad etildi`;
  }
}

/** Jurnaldagi amal turlari (admin-hisob.ts `AMAL_NOMLARI` ga qo'shiladi). */
export const QAROR_AMAL_TURI: Record<TaklifQarori["qaror"], string> = {
  yangi: "taklif_yangi_taom",
  birlashtirish: "taklif_birlashtirish",
  rad: "taklif_rad",
};
