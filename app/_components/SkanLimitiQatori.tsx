"use client";

import Link from "next/link";
import { useTarjima } from "@/app/_components/TilTaminoti";
import type { SkanLimitiHolati } from "@/app/_components/useSkanLimiti";
import { limitKorinishi } from "@/lib/services/skan-hisob";

/**
 * Skan hisoblagichi ("3 tadan 2 ta skan qoldi") yoki limit tugagani haqidagi matn — E2 paneli
 * va "Tasvirlash" ostida. Bepul skanlar tugagan bo'lsa yonida "PRO haqida" havolasi (W1).
 * Limitni olib bo'lmagan bo'lsa hech narsa chizilmaydi.
 */
export function SkanLimitiQatori({ limit }: { limit: SkanLimitiHolati }) {
  const { t } = useTarjima();
  if (limit === null) return null;
  if (limit === "yuklanmoqda") {
    return <div aria-hidden="true" className="mx-1 h-4 w-40 animate-pulse rounded-chip bg-chegara" />;
  }

  const { matn, qiymatlar, paywall } = limitKorinishi(limit);
  return (
    <p className="px-1 text-izoh text-matn-2 tabular-nums">
      {t(matn, ...qiymatlar)}
      {paywall && (
        <>
          {" "}
          <Link href="/pro?manba=limit" className="font-medium text-siyoh underline underline-offset-2">
            {t("PRO haqida")}
          </Link>
        </>
      )}
    </p>
  );
}
