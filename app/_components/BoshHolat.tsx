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
  // lucide `book-open` — R1 retseptlar bo'sh holati
  kitob: (
    <>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </>
  ),
  // lucide `heart` — R1 sevimlilar bo'sh holati
  yurak: (
    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
  ),
  // lucide `search-x` — kategoriya bo'yicha topilmadi
  qidiruv: (
    <>
      <path d="m13.5 8.5-5 5" />
      <path d="m8.5 8.5 5 5" />
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
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
