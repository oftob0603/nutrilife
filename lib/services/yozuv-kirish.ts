// API'ga kelgan yozuv tanasini tekshirish — yaratish (POST) va tahrirlash (PATCH) uchun umumiy.
// Sof qoida: bazaga bog'liq emas.

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

/** Berilmagan qiymat — 0; berilgani esa manfiy bo'lmagan son bo'lishi shart, aks holda null. */
function son(qiymat: unknown): number | null {
  if (qiymat === undefined || qiymat === null) return 0;
  return typeof qiymat === "number" && Number.isFinite(qiymat) && qiymat >= 0 ? qiymat : null;
}

export function yozuvKirishiniTekshir(
  tana: Record<string, unknown>,
): { kirish: YozuvKirishi } | { xato: string } {
  const taomNomi = typeof tana.taomNomi === "string" ? tana.taomNomi.trim().slice(0, 80) : "";
  const ovqatTuri = OVQAT_TURLARI.find((turi) => turi === tana.ovqatTuri);
  if (!taomNomi || !ovqatTuri) return { xato: "Taom nomi va ovqat turi kerak" };

  const kaloriya = son(tana.kaloriya);
  const oqsil = son(tana.oqsil);
  const yog = son(tana.yog);
  const uglevod = son(tana.uglevod);
  if (kaloriya === null || oqsil === null || yog === null || uglevod === null) {
    return { xato: "Kaloriya va makrolar 0 dan kichik bo'lmagan son bo'lishi kerak" };
  }

  return {
    kirish: {
      taomNomi,
      porsiya: typeof tana.porsiya === "string" ? tana.porsiya.trim().slice(0, 40) : "",
      kaloriya,
      oqsil,
      yog,
      uglevod,
      ovqatTuri,
    },
  };
}
