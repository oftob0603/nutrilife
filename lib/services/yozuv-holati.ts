// Ovqat yozuvi holatlari (PRD.md, 8-bo'lim) — sof modul, bazaga bog'liq emas.
// PRD zanjiridagi "tahlil qilinmoqda" va "tasdiq kutilmoqda" bazaga tushmaydi: tasdiqlanmagan
// AI natijasi faqat klient holatida turadi (DECISIONS 2026-09-13, 2026-09-20). Jadvalda zanjirning
// tasdiqdan keyingi qismi saqlanadi.

export const YOZUV_HOLATLARI = ["tasdiqlandi", "tahrirlandi", "ochirildi"] as const;

export type YozuvHolati = (typeof YOZUV_HOLATLARI)[number];

export type YozuvAmali = "tahrirlash" | "ochirish";

const AMAL_NATIJASI: Record<YozuvAmali, YozuvHolati> = {
  tahrirlash: "tahrirlandi",
  ochirish: "ochirildi",
};

/** Ekranlarda va kunlik jamida ko'rinadigan holatlar. */
export const FAOL_HOLATLAR: YozuvHolati[] = YOZUV_HOLATLARI.filter(
  (holat) => holat !== "ochirildi",
);

/** Amaldan keyingi holat; o'tish taqiqlangan bo'lsa null. "ochirildi" — oxirgi holat. */
export function keyingiHolat(joriy: string, amal: YozuvAmali): YozuvHolati | null {
  return (FAOL_HOLATLAR as string[]).includes(joriy) ? AMAL_NATIJASI[amal] : null;
}
