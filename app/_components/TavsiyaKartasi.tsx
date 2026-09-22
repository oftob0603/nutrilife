"use client";

function TaroziIkonasi() {
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
      className="shrink-0 text-matn-2"
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

function OngStrelka() {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/**
 * Porsiya tavsiyasi kartasi (PRO; prototip `FoodScreen` va `ResultScreen`): tarozi ikonasi,
 * "Tavsiya: …" sarlavhasi, qolgan kaloriya izohi; bosilsa chaqiruvchi miqdorni qo'yadi.
 * E5 (taomlar bazasi) va E7 (AI natijasi) bitta kartani ishlatadi.
 */
export function TavsiyaKartasi({
  sarlavha,
  izoh,
  onClick,
}: {
  sarlavha: string;
  izoh: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 w-full items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-4 text-left transition-transform active:scale-[0.98]"
    >
      <TaroziIkonasi />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-karta-sarlavha tabular-nums">{sarlavha}</span>
        <span className="text-izoh text-matn-2 tabular-nums">{izoh}</span>
      </span>
      <OngStrelka />
    </button>
  );
}
