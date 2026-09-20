"use client";

type Variant = { qiymat: string; nomi: string; tavsif?: string };

function Belgi() {
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
      className="shrink-0"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * Onboarding savolining variantlari (prototipdagi OptionRow): tanlangan karta to'liq
 * `--siyoh` fonga o'tadi va o'ngida belgi chiqadi. `kop` bo'lsa bir nechta variant tanlanadi.
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
    <div role={kop ? "group" : "radiogroup"} aria-label={nomi} className="flex flex-col gap-3">
      {variantlar.map((variant) => {
        const faol = tanlangan.includes(variant.qiymat);
        return (
          <button
            key={variant.qiymat}
            type="button"
            role={kop ? "checkbox" : "radio"}
            aria-checked={faol}
            onClick={() => onTanla(variant.qiymat)}
            className={`flex min-h-11 w-full items-center gap-3 rounded-karta border p-4 text-left transition-[transform,background-color,color] duration-150 active:scale-[0.98] ${
              faol ? "border-siyoh bg-siyoh text-fon" : "border-chegara bg-karta text-siyoh"
            }`}
          >
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-karta-sarlavha">{variant.nomi}</span>
              {variant.tavsif && (
                <span className={`text-izoh ${faol ? "opacity-70" : "text-matn-2"}`}>
                  {variant.tavsif}
                </span>
              )}
            </span>
            {faol && <Belgi />}
          </button>
        );
      })}
    </div>
  );
}

/** Qisqa variantlar uchun segmentli boshqaruv: fon ustida, tanlangani karta rangida. */
export function SegmentTanlagich({
  nomi,
  variantlar,
  tanlangan,
  onTanla,
}: {
  nomi: string;
  variantlar: readonly Variant[];
  tanlangan: string | null;
  onTanla: (qiymat: string) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={nomi}
      className="flex gap-1 rounded-chip border border-chegara bg-fon p-1"
    >
      {variantlar.map((variant) => {
        const faol = variant.qiymat === tanlangan;
        return (
          <button
            key={variant.qiymat}
            type="button"
            role="radio"
            aria-checked={faol}
            onClick={() => onTanla(variant.qiymat)}
            className={`min-h-11 flex-1 rounded-chip px-2 text-izoh transition-colors ${
              faol
                ? "bg-karta font-medium text-siyoh shadow-[inset_0_0_0_1px_var(--chegara)]"
                : "text-matn-2"
            }`}
          >
            {variant.nomi}
          </button>
        );
      })}
    </div>
  );
}
