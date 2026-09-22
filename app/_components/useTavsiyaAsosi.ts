"use client";

import { useEffect, useState } from "react";
import { apiSorov } from "@/lib/services/api-klient";
import type { QulfJavobi, TavsiyaAsosi } from "@/lib/services/taklif-hisob";

/**
 * Porsiya tavsiyasi uchun asos (E7): bugun qolgan kaloriya va imkoniyat PRO'ga yopiqmi —
 * Home doirasi bilan bir manbadan (`GET /api/ovqat-yozuvlari`). Kutilayotganda yoki
 * yuklanmasa (oflayn, eski API) null — tavsiya kartasi ham, qulf ham chiqmaydi.
 */
export function useTavsiyaAsosi(): TavsiyaAsosi | null {
  const [asos, setAsos] = useState<TavsiyaAsosi | null>(null);

  useEffect(() => {
    let bekor = false;
    apiSorov("/api/ovqat-yozuvlari")
      .then(async (javob) => {
        if (!javob.ok) return null;
        const kun = (await javob.json()) as { qoldi?: number | null; porsiya?: QulfJavobi };
        if (typeof kun.qoldi !== "number" || !kun.porsiya) return null;
        return { qoldi: kun.qoldi, yopiq: kun.porsiya.yopiq };
      })
      .catch(() => null)
      .then((natija) => {
        if (!bekor) setAsos(natija);
      });
    return () => {
      bekor = true;
    };
  }, []);

  return asos;
}
