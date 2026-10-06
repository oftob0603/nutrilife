/** Karta ichidagi "yorliq — qiymat" juftligi (prototip `Field`): izoh shriftida nom, asosiy shriftda qiymat. */
export function Maydon({ nomi, children }: { nomi: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-izoh text-matn-2">{nomi}</span>
      <span className="min-w-0 truncate text-asosiy">{children}</span>
    </div>
  );
}
