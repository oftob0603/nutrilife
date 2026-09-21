"use client";

import { useTarjima } from "@/app/_components/TilTaminoti";
import { useOnlayn } from "@/app/_components/useOnlayn";

/**
 * Tepadagi oflayn chizig'i (prototip `OfflineBar`): internet uzilganda ekran yopilmaydi,
 * oxirgi yuklangan ma'lumot ko'rinib turadi — chiziq shuni aytadi.
 */
export function OflaynChizigi() {
  const { t } = useTarjima();
  const onlayn = useOnlayn();
  if (onlayn) return null;

  return (
    <div role="status" className="bg-siyoh px-4 py-2 text-center text-izoh text-fon">
      {t("Internet yo'q — oxirgi ma'lumot ko'rsatilmoqda")}
    </div>
  );
}
