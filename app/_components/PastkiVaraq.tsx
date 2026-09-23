"use client";

import { useEffect } from "react";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { useTelegramOrqaga } from "@/app/_components/useTelegramOrqaga";

/**
 * Pastdan chiqadigan panel (prototip `BottomSheet`): parda, tutqich, sarlavha va mazmun.
 * Parda, Escape yoki Telegram'ning orqaga tugmasi bosilsa yopiladi.
 */
export function PastkiVaraq({
  sarlavha,
  onYop,
  children,
}: {
  sarlavha: string;
  onYop: () => void;
  children: React.ReactNode;
}) {
  const { t } = useTarjima();
  useTelegramOrqaga(onYop);

  useEffect(() => {
    const bosildi = (hodisa: KeyboardEvent) => {
      if (hodisa.key === "Escape") onYop();
    };
    window.addEventListener("keydown", bosildi);
    return () => window.removeEventListener("keydown", bosildi);
  }, [onYop]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={sarlavha}
      className="fixed inset-0 z-10 flex flex-col justify-end"
    >
      <button
        type="button"
        aria-label={t("Yopish")}
        onClick={onYop}
        className="absolute inset-0 bg-parda"
      />

      <section className="relative mx-auto max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-panel bg-karta px-4 pb-[calc(1.5rem+var(--xavfsiz-past))] pt-3 motion-safe:animate-[panel_250ms_cubic-bezier(0.2,0,0,1)]">
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-chegara" />
        <h2 className="mb-4 text-sarlavha">{sarlavha}</h2>
        {children}
      </section>
    </div>
  );
}
