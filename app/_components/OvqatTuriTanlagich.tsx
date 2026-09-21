"use client";

import { useTarjima } from "@/app/_components/TilTaminoti";
import { OVQAT_TURLARI, type OvqatTuri } from "@/lib/services/yozuv-hisob";

/** Prototipdagi SegmentedControl: fon ustida, tanlangani karta rangida. */
export function OvqatTuriTanlagich({
  qiymat,
  onChange,
}: {
  qiymat: OvqatTuri;
  onChange: (turi: OvqatTuri) => void;
}) {
  const { t } = useTarjima();

  return (
    <div
      role="tablist"
      aria-label={t("Ovqat turi")}
      className="flex gap-1 rounded-chip border border-chegara bg-fon p-1"
    >
      {OVQAT_TURLARI.map((turi) => {
        const faol = turi === qiymat;
        return (
          <button
            key={turi}
            type="button"
            role="tab"
            aria-selected={faol}
            onClick={() => onChange(turi)}
            className={`min-h-9 flex-1 rounded-chip px-2 text-izoh transition-colors ${
              faol
                ? "bg-karta font-medium text-siyoh shadow-[inset_0_0_0_1px_var(--chegara)]"
                : "text-matn-2"
            }`}
          >
            {t(turi)}
          </button>
        );
      })}
    </div>
  );
}
