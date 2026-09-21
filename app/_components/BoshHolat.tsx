const IKONALAR = {
  // lucide `utensils`
  taom: (
    <>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </>
  ),
  // lucide `notebook-pen`
  daftar: (
    <>
      <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
      <path d="M2 6h4" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
    </>
  ),
};

/**
 * Bo'sh holat (prototip `EmptyState`): ikona, nima yo'qligi, nega yo'qligi va bitta harakat.
 * Tugma `children` bilan beriladi; karta ichida ham, ochiq joyda ham ishlatiladi.
 */
export function BoshHolat({
  ikona,
  sarlavha,
  izoh,
  zich = false,
  children,
}: {
  ikona: keyof typeof IKONALAR;
  sarlavha: string;
  izoh?: string;
  /** Karta ichida — karta o'z chetini beradi, shuning uchun vertikal bo'shliq kichikroq. */
  zich?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col items-center gap-2 px-4 text-center ${zich ? "py-4" : "py-8"}`}>
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="mb-2 text-matn-3"
      >
        {IKONALAR[ikona]}
      </svg>
      <p className="text-karta-sarlavha">{sarlavha}</p>
      {izoh && <p className="max-w-[280px] text-izoh text-matn-2">{izoh}</p>}
      {children && <div className="mt-4 flex w-full max-w-[280px] flex-col gap-2">{children}</div>}
    </div>
  );
}
