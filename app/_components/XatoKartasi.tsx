/**
 * Xato yoki "bajarib bo'lmadi" holati kartasi (prototip `ErrorState`): sarlavha, izoh va
 * ostida chiqish yo'llari. Tugmalar `children` bilan beriladi: birinchisi "ikkilamchi",
 * qolgani "uchinchi" ko'rinishda (ko'rinishni chaqiruvchi qo'yadi).
 */
export function XatoKartasi({
  sarlavha,
  izoh,
  children,
}: {
  sarlavha: string;
  izoh?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      role="alert"
      className="flex flex-col items-center gap-2 rounded-karta border border-karta-chegara bg-karta px-4 py-6 text-center"
    >
      <h2 className="text-karta-sarlavha">{sarlavha}</h2>
      {izoh && <p className="max-w-[300px] text-izoh text-matn-2">{izoh}</p>}
      {children && <div className="mt-4 flex w-full max-w-[280px] flex-col gap-2">{children}</div>}
    </section>
  );
}
