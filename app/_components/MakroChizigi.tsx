/** Bitta makro: nomi, hozirgi / maqsad va to'lish chizig'i (DESIGN.md, 6-bo'lim). */
export function MakroChizigi({
  nomi,
  qiymat,
  maqsad,
}: {
  nomi: string;
  qiymat: number;
  maqsad: number;
}) {
  const ulush = maqsad > 0 ? Math.min(100, (qiymat / maqsad) * 100) : 0;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="truncate text-izoh text-matn-2">{nomi}</span>
      <span className="text-izoh tabular-nums">
        {Math.round(qiymat)} / {maqsad} g
      </span>
      <div className="h-1 overflow-hidden rounded-full bg-chegara">
        <div
          className="h-full rounded-full bg-siyoh"
          style={{ width: `${ulush}%` }}
        />
      </div>
    </div>
  );
}
