"use client";

type Variant = { qiymat: string; nomi: string; tavsif?: string };

/** Tanlov belgisi: bitta tanlovda doira, ko'p tanlovda kvadrat. Lime emas — ekranda bitta aksent qoidasi. */
function Belgi({ tanlangan, kop }: { tanlangan: boolean; kop: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-5 shrink-0 items-center justify-center border ${
        kop ? "rounded-md" : "rounded-full"
      } ${tanlangan ? "border-siyoh bg-siyoh text-fon" : "border-matn-3"}`}
    >
      {tanlangan && (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      )}
    </span>
  );
}

/**
 * Onboarding savolining variantlari — karta ko'rinishidagi ro'yxat. `kop` bo'lsa bir
 * nechta variant tanlanadi (O8), aks holda bitta.
 */
export function Variantlar({
  nomi,
  variantlar,
  tanlangan,
  kop = false,
  onTanla,
}: {
  /** Ekran o'quvchisi uchun guruh nomi. */
  nomi: string;
  variantlar: readonly Variant[];
  tanlangan: readonly string[];
  kop?: boolean;
  onTanla: (qiymat: string) => void;
}) {
  return (
    <div
      role={kop ? "group" : "radiogroup"}
      aria-label={nomi}
      className="flex flex-col gap-3"
    >
      {variantlar.map((variant) => {
        const faol = tanlangan.includes(variant.qiymat);
        return (
          <button
            key={variant.qiymat}
            type="button"
            role={kop ? "checkbox" : "radio"}
            aria-checked={faol}
            onClick={() => onTanla(variant.qiymat)}
            className={`flex min-h-13 items-center gap-3 rounded-karta border bg-karta px-4 py-3 text-left transition-transform active:scale-[0.98] ${
              faol ? "border-siyoh shadow-[inset_0_0_0_1px_var(--siyoh)]" : "border-karta-chegara"
            }`}
          >
            <Belgi tanlangan={faol} kop={kop} />
            <span className="flex min-w-0 flex-col gap-1">
              <span className="text-asosiy font-medium">{variant.nomi}</span>
              {variant.tavsif && <span className="text-izoh text-matn-2">{variant.tavsif}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
