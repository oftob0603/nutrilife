"use client";

import Link from "next/link";
import { useTarjima } from "@/app/_components/TilTaminoti";

const ASOS =
  "flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left text-asosiy text-siyoh transition-[transform,background-color] duration-150 active:scale-[0.98] active:bg-fon disabled:opacity-40 disabled:active:scale-100 disabled:active:bg-transparent";

function Strelka() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-matn-3"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Sozlama qatori (prototip `SettingRow`): chapda nom, o'ngda joriy qiymat va strelka.
 * `href` berilsa havola, aks holda tugma. Saqlash holati faqat shu qatorda ko'rinadi —
 * qolgan qatorlar ishlayveradi (profil-tz.md, 2-bo'lim).
 */
export function SozlamaQatori({
  nomi,
  qiymat,
  href,
  holat,
  ochiq = true,
  onClick,
}: {
  nomi: string;
  qiymat?: string;
  href?: string;
  holat?: "saqlanmoqda" | "xato";
  ochiq?: boolean;
  onClick?: () => void;
}) {
  const { t } = useTarjima();

  const ichi = (
    <>
      <span className="min-w-0 flex-1 truncate">{nomi}</span>
      {holat === "saqlanmoqda" ? (
        <span role="status" className="whitespace-nowrap text-izoh text-matn-2">
          {t("saqlanmoqda…")}
        </span>
      ) : (
        qiymat && <span className="max-w-[55%] truncate text-izoh text-matn-2">{qiymat}</span>
      )}
      <Strelka />
    </>
  );

  return (
    <div className="flex flex-col border-t border-chegara first:border-t-0">
      {href ? (
        <Link href={href} className={ASOS}>
          {ichi}
        </Link>
      ) : (
        <button type="button" disabled={!ochiq} onClick={onClick} className={ASOS}>
          {ichi}
        </button>
      )}
      {holat === "xato" && (
        <p role="alert" className="px-4 pb-2 text-izoh text-xato">
          {t("Saqlanmadi. Qayta urinish")}
        </p>
      )}
    </div>
  );
}
