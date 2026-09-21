// API'ga kelgan yozuv tanasini tekshirish — yaratish (POST) va tahrirlash (PATCH) uchun umumiy.
// Sof qoida: bazaga bog'liq emas.

import { KALORIYA_CHEGARASI, MAKRO_CHEGARASI, porsiyaMatniYaroqli } from "./yozuv-chegaralari.ts";
import { OVQAT_TURLARI, type OvqatTuri } from "./yozuv-hisob.ts";

export type YozuvKirishi = {
  taomNomi: string;
  porsiya: string;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
  ovqatTuri: OvqatTuri;
};

/** Berilmagan qiymat — 0; berilgani esa 0 dan `chegara` gacha son bo'lishi shart, aks holda null. */
function son(qiymat: unknown, chegara: number): number | null {
  if (qiymat === undefined || qiymat === null) return 0;
  return typeof qiymat === "number" && Number.isFinite(qiymat) && qiymat >= 0 && qiymat <= chegara
    ? qiymat
    : null;
}

export function yozuvKirishiniTekshir(
  tana: Record<string, unknown>,
): { kirish: YozuvKirishi } | { xato: string } {
  const taomNomi = typeof tana.taomNomi === "string" ? tana.taomNomi.trim().slice(0, 80) : "";
  const ovqatTuri = OVQAT_TURLARI.find((turi) => turi === tana.ovqatTuri);
  if (!taomNomi || !ovqatTuri) return { xato: "Taom nomi va ovqat turi kerak" };

  const kaloriya = son(tana.kaloriya, KALORIYA_CHEGARASI);
  if (kaloriya === null) {
    return { xato: `Kaloriya 0 dan ${KALORIYA_CHEGARASI} kkal gacha son bo'lishi kerak` };
  }
  const oqsil = son(tana.oqsil, MAKRO_CHEGARASI);
  const yog = son(tana.yog, MAKRO_CHEGARASI);
  const uglevod = son(tana.uglevod, MAKRO_CHEGARASI);
  if (oqsil === null || yog === null || uglevod === null) {
    return { xato: `Oqsil, yog' va uglevod 0 dan ${MAKRO_CHEGARASI} g gacha son bo'lishi kerak` };
  }

  const porsiya = typeof tana.porsiya === "string" ? tana.porsiya.trim().slice(0, 40) : "";
  if (!porsiyaMatniYaroqli(porsiya)) return { xato: "Porsiya miqdori noto'g'ri" };

  return {
    kirish: {
      taomNomi,
      porsiya,
      kaloriya,
      oqsil,
      yog,
      uglevod,
      ovqatTuri,
    },
  };
}
