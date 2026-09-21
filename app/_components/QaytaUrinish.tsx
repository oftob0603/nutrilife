"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";

/**
 * Yuklanmagan sahifa uchun "Qayta urinish": sahifa serverda qayta so'raladi, manzil va
 * tanlangan kun o'zgarmaydi. So'rov ketayotganda tugma ichida indikator turadi.
 */
export function QaytaUrinish() {
  const router = useRouter();
  const { t } = useTarjima();
  const [kutilmoqda, boshla] = useTransition();

  return (
    <Tugma korinish="ikkilamchi" yuklanmoqda={kutilmoqda} onClick={() => boshla(() => router.refresh())}>
      {t("Qayta urinish")}
    </Tugma>
  );
}
