// Rollar va huquqlar (PRD.md, 4-bo'lim) — sof hisob, bazaga bog'lanmagan. Skan limiti (S4),
// paywall (S5) va admin paneli (S6) "kim nima qila oladi" degan savolga faqat shu yerdan
// javob oladi.

export const ROLLAR = ["foydalanuvchi", "admin"] as const;
export type Rol = (typeof ROLLAR)[number];

/** Bazadagi qiymatni rolga o'giradi; notanish qiymat — oddiy foydalanuvchi. */
export function rolniOqi(qiymat: string): Rol {
  return qiymat === "admin" ? "admin" : "foydalanuvchi";
}

export const TARIFLAR = ["oylik", "yarim_yillik", "yillik", "qolda"] as const;
export type Tarif = (typeof TARIFLAR)[number];

/** PRD 8-bo'limdagi zanjir: `yo'q (FREE)` -> `faol` -> `muddati tugadi`. */
export type ObunaHolati =
  | { holat: "free"; tugash: null }
  | { holat: "pro"; tugash: Date }
  | { holat: "tugagan"; tugash: Date };

export type ObunaMuddati = { boshlanish: Date; tugash: Date };

/**
 * Obuna qatorlaridan joriy holat. PRO — `boshlanish <= hozir < tugash` bo'lgan qator bor;
 * ketma-ket ulangan muddatlar (oldindan yangilangan obuna) bitta muddat deb sanaladi.
 * Hali boshlanmagan obunaning o'zi hech narsa bermaydi.
 */
export function obunaHolati(obunalar: ObunaMuddati[], hozir: Date = new Date()): ObunaHolati {
  const tartibda = [...obunalar].sort((a, b) => a.boshlanish.getTime() - b.boshlanish.getTime());

  let faolTugash: Date | null = null;
  let otganTugash: Date | null = null;
  for (const { boshlanish, tugash } of tartibda) {
    const chegara = faolTugash ?? hozir;
    if (boshlanish <= chegara && tugash > chegara) faolTugash = tugash;
    else if (tugash <= hozir && (!otganTugash || tugash > otganTugash)) otganTugash = tugash;
  }

  if (faolTugash) return { holat: "pro", tugash: faolTugash };
  if (otganTugash) return { holat: "tugagan", tugash: otganTugash };
  return { holat: "free", tugash: null };
}

export type ObunaQatori = ObunaMuddati & { tarif: string };

export type FaolMuddat = { tarif: Tarif; boshlanish: Date; tugash: Date };

/**
 * Faol PRO'ning joriy muddati (F4): tarif va boshlanish — hozir ishlab turgan qatordan,
 * tugash — ketma-ket ulangan muddatlarning oxiri. PRO faol bo'lmasa null.
 */
export function faolMuddat(obunalar: ObunaQatori[], hozir: Date = new Date()): FaolMuddat | null {
  const obuna = obunaHolati(obunalar, hozir);
  if (obuna.holat !== "pro") return null;

  const joriy = [...obunalar]
    .sort((a, b) => a.boshlanish.getTime() - b.boshlanish.getTime())
    .find(({ boshlanish, tugash }) => boshlanish <= hozir && tugash > hozir);
  if (!joriy) return null;

  const tarif = (TARIFLAR as readonly string[]).includes(joriy.tarif) ? (joriy.tarif as Tarif) : "qolda";
  return { tarif, boshlanish: joriy.boshlanish, tugash: obuna.tugash };
}

export type SkanLimiti = { davr: "umr" | "kun"; soni: number };

export type Huquqlar = {
  /** FREE — umr davomida jami, PRO — kuniga. */
  skanLimiti: SkanLimiti;
  /** AI taomni taniy olmagan urinishlar — kuniga shuncha; limitdan yeyilmaydi. */
  tanilmaganLimiti: number;
  retseptToliqMatni: boolean;
  nutritionScore: boolean;
  taomTakliflari: boolean;
  /** Home va Jurnaldagi kunlik oqsil/yog'/uglevod chiziqlari (prototip `makro`). */
  makroKuzatish: boolean;
  /** E5 va E7'dagi qolgan kaloriyaga sig'adigan porsiya kartasi (prototip `porsiya`). */
  porsiyaTavsiyasi: boolean;
  /** P1'dagi "Batafsil ovqatlanish statistikasi" va "Haftalik ovqatlanish hisoboti". */
  ovqatStatistikasi: boolean;
  adminPaneli: boolean;
};

export const FREE_SKAN_LIMITI = 3;
export const PRO_SKAN_LIMITI = 20;
/** Tanilmagan urinish limitdan yeyilmaydi, lekin kuniga shuncha marta (foydalanuvchi qarori). */
export const FREE_TANILMAGAN_LIMITI = 5;
export const PRO_TANILMAGAN_LIMITI = 20;

/**
 * Admin roli PRO bermaydi (foydalanuvchi qarori): admin PRO imkoniyatlarini o'ziga qo'lda
 * obuna berib ochadi. Muddati tugagan PRO — FREE huquqlari (prototipdagi `readable` yo'q,
 * foydalanuvchi qarori 2026-09-22). To'liq tarix, jurnal va progress FREE'ga ham ochiq
 * (foydalanuvchi qarori), shuning uchun bu yerda huquq sifatida yo'q.
 */
export function huquqlar(rol: Rol, obuna: ObunaHolati): Huquqlar {
  const pro = obuna.holat === "pro";
  return {
    skanLimiti: pro
      ? { davr: "kun", soni: PRO_SKAN_LIMITI }
      : { davr: "umr", soni: FREE_SKAN_LIMITI },
    tanilmaganLimiti: pro ? PRO_TANILMAGAN_LIMITI : FREE_TANILMAGAN_LIMITI,
    retseptToliqMatni: pro,
    nutritionScore: pro,
    taomTakliflari: pro,
    makroKuzatish: pro,
    porsiyaTavsiyasi: pro,
    ovqatStatistikasi: pro,
    adminPaneli: rol === "admin",
  };
}

/** Hisobdagi skanlar: bugungi kun va butun umr bo'yicha (`skan_hisobi`). */
export type SkanSarfi = { bugun: number; jami: number; bugunTanilmagan: number };

export type SkanQoldigi = SkanLimiti & {
  ishlatilgan: number;
  qoldi: number;
  /** Bugun yana necha marta tanilmagan urinish mumkin. */
  tanilmaganQoldi: number;
};

/** Limitdan qancha qolgani: "kun" davrida bugungi skanlar, "umr" davrida hammasi sanaladi. */
export function skanQoldigi(
  { skanLimiti, tanilmaganLimiti }: Pick<Huquqlar, "skanLimiti" | "tanilmaganLimiti">,
  sarf: SkanSarfi,
): SkanQoldigi {
  const ishlatilgan = Math.max(0, skanLimiti.davr === "kun" ? sarf.bugun : sarf.jami);
  return {
    ...skanLimiti,
    ishlatilgan,
    qoldi: Math.max(0, skanLimiti.soni - ishlatilgan),
    tanilmaganQoldi: Math.max(0, tanilmaganLimiti - sarf.bugunTanilmagan),
  };
}
