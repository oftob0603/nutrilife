import { tarjimon, type Kalit, type Til } from "@/lib/lugat/tarjima";

/** Bitta makro: nomi, hozirgi / maqsad va to'lish chizig'i (DESIGN.md, 6-bo'lim). */
export function MakroChizigi({
  til,
  nomi,
  qiymat,
  maqsad,
  birliksiz = false,
}: {
  til: Til;
  nomi: Kalit;
  qiymat: number;
  maqsad: number;
  /** Gramm emas, ball (Nutrition Score qismlari): "82 / 100". */
  birliksiz?: boolean;
}) {
  const { t } = tarjimon(til);
  const ulush = maqsad > 0 ? Math.min(100, (qiymat / maqsad) * 100) : 0;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="truncate text-izoh text-matn-2">{t(nomi)}</span>
      <span className="text-izoh tabular-nums">
        {t(birliksiz ? "{0} / {1}" : "{0} / {1} g", Math.round(qiymat), maqsad)}
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
