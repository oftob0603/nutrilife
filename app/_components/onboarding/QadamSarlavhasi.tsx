"use client";

import { OrqagaTugma } from "@/app/_components/OrqagaTugma";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { QADAMLAR_SONI } from "@/lib/services/onboarding-hisob";

/**
 * Prototipdagi StepProgress: orqaga · "12 dan 3" · (o'tkazib yuborish), ostida progress chizig'i.
 * `onOrqaga` berilmasa tugma chiqmaydi — "Reja tayyorlanmoqda"dan orqaga qaytilmaydi.
 */
export function QadamSarlavhasi({
  qadam,
  onOrqaga,
  onOtkazish,
}: {
  qadam: number;
  onOrqaga?: () => void;
  onOtkazish?: () => void;
}) {
  const { t } = useTarjima();

  return (
    <header className="flex flex-col gap-2 px-4 pb-3 pt-2">
      <div className="flex min-h-11 items-center gap-2">
        {/* Prototip `StepProgress`: tugma bo'lmasa o'rnida 4 px bo'shliq qoladi. */}
        {!onOrqaga && <span aria-hidden="true" className="w-1 shrink-0" />}
        {onOrqaga && (
          <OrqagaTugma
            nomi={t("Orqaga")}
            onOrqaga={onOrqaga}
            className="-ml-3 flex size-11 shrink-0 items-center justify-center text-siyoh active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </OrqagaTugma>
        )}
        <span className="flex-1 text-izoh tabular-nums text-matn-2">
          {t("{0} dan {1}", QADAMLAR_SONI, qadam)}
        </span>
        {onOtkazish && (
          <button
            type="button"
            onClick={onOtkazish}
            className="-mr-2 min-h-11 px-2 text-izoh text-matn-2 active:scale-[0.98]"
          >
            {t("O'tkazib yuborish")}
          </button>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={QADAMLAR_SONI}
        aria-valuenow={qadam}
        aria-label={t("Onboarding bosqichi")}
        className="h-1 overflow-hidden rounded-full bg-chegara"
      >
        <div
          className="h-full rounded-full bg-siyoh transition-[width] duration-[250ms]"
          style={{ width: `${(qadam / QADAMLAR_SONI) * 100}%` }}
        />
      </div>
    </header>
  );
}
