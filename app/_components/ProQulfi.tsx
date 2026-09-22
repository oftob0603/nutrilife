import Link from "next/link";
import { ProBelgisi } from "@/app/_components/ProBelgisi";
import { TugmaHavola } from "@/app/_components/Tugma";

const PRO_HAVOLA = "/pro?manba=imkoniyat";

function QulfIkonasi() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-matn-3"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/**
 * Yopiq PRO imkoniyati o'rnidagi karta (prototip `ProLock`): nima yopiqligi, qisqa izoh va
 * tariflar ekraniga (W1) yo'l. Matnlar tarjima qilingan holda beriladi.
 *
 * `zich` — prototip `ProLock compact`: bitta qatorli karta (qulf ikonasi, sarlavha, PRO
 * belgisi), butun qator W1'ga havola; izoh va tugma bo'lmaydi.
 */
export function ProQulfi({
  sarlavha,
  izoh,
  tugma,
  zich = false,
}: {
  sarlavha: string;
  izoh?: string;
  tugma?: string;
  zich?: boolean;
}) {
  if (zich) {
    return (
      <Link
        href={PRO_HAVOLA}
        className="flex min-h-11 items-center gap-3 rounded-karta border border-chegara bg-karta p-4 text-left"
      >
        <QulfIkonasi />
        <span className="min-w-0 flex-1 text-izoh text-matn-2">{sarlavha}</span>
        <ProBelgisi />
      </Link>
    );
  }

  return (
    <div className="flex flex-col items-start gap-3 rounded-karta border border-chegara bg-karta p-4">
      <ProBelgisi />
      <p className="text-karta-sarlavha">{sarlavha}</p>
      {izoh && <p className="text-izoh text-matn-2">{izoh}</p>}
      {tugma && (
        <TugmaHavola korinish="pro" href={PRO_HAVOLA}>
          {tugma}
        </TugmaHavola>
      )}
    </div>
  );
}
