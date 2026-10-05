export type Ustun = {
  kalit: string;
  nomi: string;
  /** CSS grid ustun eni; berilmasa `minmax(0,1fr)`. */
  eni?: string;
  /** `--matn-2` rangda (sana, ID kabi ikkilamchi ma'lumot). */
  xira?: boolean;
  raqam?: boolean;
};

export type Qator = { id: string } & Record<string, React.ReactNode>;

/**
 * Admin jadvali (prototip `DataTable`): ustunlar grid bilan, qator chegarasi 1px, bo'sh
 * holat matni o'rtada. Tor ekranda yonlama aylanadi (DESIGN.md 11-bo'lim).
 */
export function AdminJadval({
  ustunlar,
  qatorlar,
  bosh,
}: {
  ustunlar: readonly Ustun[];
  qatorlar: readonly Qator[];
  bosh: string;
}) {
  const grid = ustunlar.map((u) => u.eni ?? "minmax(0,1fr)").join(" ");
  const katak = "flex min-w-0 items-center truncate px-4 py-3";

  return (
    <div className="overflow-x-auto rounded-karta border border-karta-chegara bg-karta">
      <div className="max-lg:min-w-[720px]">
        <div
          className="grid border-b border-chegara text-izoh font-medium text-matn-2"
          style={{ gridTemplateColumns: grid }}
        >
          {ustunlar.map((u) => (
            <span key={u.kalit} className={katak}>
              {u.nomi}
            </span>
          ))}
        </div>
        {qatorlar.length === 0 ? (
          <p className="px-4 py-12 text-center text-asosiy text-matn-2">{bosh}</p>
        ) : (
          qatorlar.map((qator) => (
            <div
              key={qator.id}
              className="grid border-b border-chegara text-asosiy last:border-b-0"
              style={{ gridTemplateColumns: grid }}
            >
              {ustunlar.map((u) => (
                <span
                  key={u.kalit}
                  className={`${katak}${u.xira ? " text-matn-2" : ""}${u.raqam ? " tabular-nums" : ""}`}
                >
                  <span className="truncate">{qator[u.kalit]}</span>
                </span>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
