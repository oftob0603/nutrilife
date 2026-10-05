"use client";

import { useRouter } from "next/navigation";
import { Tugma } from "@/app/_components/Tugma";

type Holat = "sessiyasiz" | "ruxsat_yoq" | "xato";

/**
 * A0 — rad javobi (admin-tz.md). Panel Telegram ichida ochiladi, kirish Mini App darvozasi
 * orqali initData bilan o'zi bo'ladi (DECISIONS 2026-10-05) — alohida kirish tugmasi yo'q.
 * Rad javobida panel tuzilishi va bo'lim nomlari ko'rsatilmaydi. "sessiyasiz" — sahifa
 * kirishdan oldin chizilgan: darvoza kirgach uni qayta so'raydi, ungacha parda ostida.
 */
export function AdminKirish({ holat }: { holat: Holat }) {
  const router = useRouter();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-fon p-4" data-admin-page="">
      <div className="flex w-full max-w-sm flex-col items-start gap-4 rounded-karta border border-karta-chegara bg-karta p-5">
        <span className="font-display text-sarlavha">NutriLifer</span>

        {holat === "ruxsat_yoq" ? (
          <>
            <p className="text-asosiy">{"Bu sahifaga ruxsatingiz yo'q"}</p>
            <p className="text-izoh text-matn-2">Panel faqat admin hisobiga ochiladi.</p>
          </>
        ) : holat === "xato" ? (
          <>
            <p className="text-asosiy">{"Kirib bo'lmadi"}</p>
            <p className="text-izoh text-matn-2">{"Internetni tekshirib, qayta urinib ko'ring."}</p>
            <Tugma korinish="siyoh" onClick={() => router.refresh()}>
              Qayta urinish
            </Tugma>
          </>
        ) : (
          <span className="text-izoh text-matn-2">Kirilmoqda</span>
        )}
      </div>
    </main>
  );
}
