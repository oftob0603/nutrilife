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

export type Huquqlar = {
  /** FREE — umr davomida jami, PRO — kuniga. */
  skanLimiti: { davr: "umr" | "kun"; soni: number };
  retseptToliqMatni: boolean;
  nutritionScore: boolean;
  taomTakliflari: boolean;
  adminPaneli: boolean;
};

export const FREE_SKAN_LIMITI = 3;
export const PRO_SKAN_LIMITI = 20;

/**
 * Admin roli PRO bermaydi (foydalanuvchi qarori): admin PRO imkoniyatlarini o'ziga qo'lda
 * obuna berib ochadi. Muddati tugagan PRO — FREE huquqlari. To'liq tarix, jurnal va
 * progress FREE'ga ham ochiq (foydalanuvchi qarori), shuning uchun bu yerda huquq sifatida yo'q.
 */
export function huquqlar(rol: Rol, obuna: ObunaHolati): Huquqlar {
  const pro = obuna.holat === "pro";
  return {
    skanLimiti: pro
      ? { davr: "kun", soni: PRO_SKAN_LIMITI }
      : { davr: "umr", soni: FREE_SKAN_LIMITI },
    retseptToliqMatni: pro,
    nutritionScore: pro,
    taomTakliflari: pro,
    adminPaneli: rol === "admin",
  };
}
