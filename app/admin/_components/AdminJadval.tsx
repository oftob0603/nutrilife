import Link from "next/link";

export type Ustun = {
  kalit: string;
  nomi: string;
  /** CSS grid ustun eni; berilmasa `minmax(0,1fr)`. */
  eni?: string;
  /** `--matn-2` rangda (sana, ID kabi ikkilamchi ma'lumot). */
  xira?: boolean;
  raqam?: boolean;
  /** O'ngga tekislangan (sonlar ustuni). */
  ong?: boolean;
};

export type Qator = { id: string; href?: string } & Record<string, React.ReactNode>;

const SKELET_QATORLAR = 10;

/**
 * Admin jadvali (prototip `DataTable`): ustunlar grid bilan, qator chegarasi 1px, bo'sh
 * holat matni o'rtada. `href` berilgan qator butunicha havola, ustida `--fon`. `yuklanmoqda`
 * — 10 qator skelet (admin-tz.md §4). `pastki` — sahifalash qatori. Tor ekranda yonlama
 * aylanadi (DESIGN.md 11-bo'lim).
 */
export function AdminJadval({
  ustunlar,
  qatorlar,
  bosh,
  yuklanmoqda = false,
  pastki,
}: {
  ustunlar: readonly Ustun[];
  qatorlar: readonly Qator[];
  bosh: React.ReactNode;
  yuklanmoqda?: boolean;
  pastki?: React.ReactNode;
}) {
  const grid = ustunlar.map((u) => u.eni ?? "minmax(0,1fr)").join(" ");
  const katak = (u: Ustun) =>
    `flex min-w-0 items-center truncate px-4 py-3${u.ong ? " justify-end" : ""}`;
  const qatorSinfi = "grid border-b border-chegara text-asosiy last:border-b-0";

  function kataklar(qator: Qator) {
    return ustunlar.map((u) => (
      <span
        key={u.kalit}
        className={`${katak(u)}${u.xira ? " text-matn-2" : ""}${u.raqam ? " tabular-nums" : ""}`}
      >
        <span className="truncate">{qator[u.kalit]}</span>
      </span>
    ));
  }

  return (
    <div className="overflow-x-auto rounded-karta border border-karta-chegara bg-karta">
      <div className="max-lg:min-w-[720px]">
        <div
          className="grid border-b border-chegara text-izoh font-medium text-matn-2"
          style={{ gridTemplateColumns: grid }}
        >
          {ustunlar.map((u) => (
            <span key={u.kalit} className={katak(u)}>
              {u.nomi}
            </span>
          ))}
        </div>
        {yuklanmoqda ? (
          Array.from({ length: SKELET_QATORLAR }, (_, i) => (
            <div key={i} aria-hidden="true" className={qatorSinfi} style={{ gridTemplateColumns: grid }}>
              {ustunlar.map((u) => (
                <span key={u.kalit} className={katak(u)}>
                  <span
                    className="block h-3 animate-pulse rounded-full bg-chegara"
                    style={{ width: `${40 + ((i + u.kalit.length) % 4) * 15}%` }}
                  />
                </span>
              ))}
            </div>
          ))
        ) : qatorlar.length === 0 ? (
          <div className="px-4 py-12 text-center text-asosiy text-matn-2">{bosh}</div>
        ) : (
          qatorlar.map((qator) =>
            qator.href ? (
              <Link
                key={qator.id}
                href={qator.href}
                className={`${qatorSinfi} hover:bg-fon`}
                style={{ gridTemplateColumns: grid }}
              >
                {kataklar(qator)}
              </Link>
            ) : (
              <div key={qator.id} className={qatorSinfi} style={{ gridTemplateColumns: grid }}>
                {kataklar(qator)}
              </div>
            ),
          )
        )}
      </div>
      {pastki && (
        <div className="flex items-center justify-between gap-2 border-t border-chegara px-4 py-3 text-izoh text-matn-2">
          {pastki}
        </div>
      )}
    </div>
  );
}
