"use client";

import { useEffect, useState } from "react";
import { apiSorov } from "@/lib/services/api-klient";
import type { SkanQoldigi } from "@/lib/services/huquqlar";

/** "yuklanmoqda" — javob kutilmoqda; null — olib bo'lmadi (limitni baribir server ushlaydi). */
export type SkanLimitiHolati = SkanQoldigi | "yuklanmoqda" | null;

/**
 * Skan limiti va undan qolgani (`GET /api/skan`). `faol` har rost bo'lganda qayta so'raladi —
 * skandan keyin ochilgan panel eski sonni ko'rsatmasin.
 */
export function useSkanLimiti(faol = true): SkanLimitiHolati {
  const [limit, setLimit] = useState<SkanLimitiHolati>("yuklanmoqda");

  useEffect(() => {
    if (!faol) return;
    let bekor = false;
    apiSorov("/api/skan")
      .then(async (javob) => (javob.ok ? ((await javob.json()) as { limit: SkanQoldigi }).limit : null))
      .catch(() => null)
      .then((natija) => {
        if (!bekor) setLimit(natija);
      });
    return () => {
      bekor = true;
      // Keyingi safar eski son emas, skelet ko'rinsin.
      setLimit("yuklanmoqda");
    };
  }, [faol]);

  return limit;
}
