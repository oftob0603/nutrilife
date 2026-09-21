"use client";

import { useTarjima } from "@/app/_components/TilTaminoti";

/** "AI taxmini" belgisi — AI chiqargan har qanday raqam yonida turadi (DESIGN.md, 6-bo'lim). */
export function AiBelgisi() {
  const { t } = useTarjima();
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-aksent px-2 py-[3px] text-[11px] font-medium leading-none text-aksent-matn">
      {t("AI taxmini")}
    </span>
  );
}
