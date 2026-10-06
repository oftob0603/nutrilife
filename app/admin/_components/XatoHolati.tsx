"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Tugma } from "@/app/_components/Tugma";

/**
 * Bo'lim yuklanmaganda: xabar va "Qayta urinish" (admin-tz.md §4) — sahifa serverda qayta
 * so'raladi, manzil (qidiruv, filtr, sahifa) o'zgarmaydi. Panel o'zbekcha, lug'atsiz.
 */
export function XatoHolati({ xabar }: { xabar: string }) {
  const router = useRouter();
  const [kutilmoqda, boshla] = useTransition();

  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-karta border border-karta-chegara bg-karta p-4"
    >
      <p className="text-asosiy">{xabar}</p>
      <Tugma korinish="siyoh" kichik yuklanmoqda={kutilmoqda} onClick={() => boshla(() => router.refresh())}>
        Qayta urinish
      </Tugma>
    </div>
  );
}
