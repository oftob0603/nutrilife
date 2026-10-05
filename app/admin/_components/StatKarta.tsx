import Link from "next/link";
import { Belgi, type BelgiNomi } from "./Belgi";

/**
 * Statistika kartasi (prototip `StatTile`): yorliq, katta raqam, ixtiyoriy izoh. `href`
 * berilsa butun karta havola. `qiymat` null — yuklab bo'lmadi, "—" ko'rsatiladi.
 */
export function StatKarta({
  nomi,
  qiymat,
  izoh,
  belgi,
  href,
  yuklanmoqda = false,
}: {
  nomi: string;
  qiymat?: string | null;
  izoh?: string;
  belgi?: BelgiNomi;
  href?: string;
  yuklanmoqda?: boolean;
}) {
  const ichi = (
    <>
      <span className="flex items-center gap-2 text-izoh text-matn-2">
        {belgi && <Belgi nomi={belgi} olcham={16} />}
        <span className="min-w-0 flex-1 truncate">{nomi}</span>
        {href && (
          <span className="text-matn-3">
            <Belgi nomi="chevron-right" olcham={16} />
          </span>
        )}
      </span>
      {yuklanmoqda ? (
        <span aria-hidden="true" className="block h-6 w-3/5 animate-pulse rounded-full bg-chegara" />
      ) : (
        <span className="text-stat tabular-nums">{qiymat ?? "—"}</span>
      )}
      {izoh && <span className="text-izoh text-matn-2">{izoh}</span>}
    </>
  );
  const sinf = "flex min-w-0 flex-col gap-2 rounded-karta border border-karta-chegara bg-karta p-4";

  return href ? (
    <Link href={href} className={`${sinf} hover:bg-karta-press`}>
      {ichi}
    </Link>
  ) : (
    <div className={sinf}>{ichi}</div>
  );
}
