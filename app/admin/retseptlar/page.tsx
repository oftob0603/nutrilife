import Link from "next/link";
import { sinf } from "@/app/_components/Tugma";
import { sahifalarSoni, sahifaMatni, sahifaniOqi, son } from "@/lib/services/admin-hisob";
import {
  HOLAT_NOMLARI,
  holatFiltriniOqi,
  kategoriyaFiltriniOqi,
  mazmunMatni,
  MURAKKABLIK_NOMLARI,
  murakkablikniOqi,
  vaqtMatni,
} from "@/lib/services/retsept-admin-hisob";
import { AdminJadval, type Qator } from "../_components/AdminJadval";
import { AdminSahifa } from "../_components/AdminSahifa";
import { Belgi } from "../_components/Belgi";
import { RetseptFiltri, retseptlarManzili } from "../_components/RetseptFiltri";
import { XatoHolati } from "../_components/XatoHolati";
import { Yorliq } from "../_components/Yorliq";
import { kategoriyalarniYukla, retseptlarniYukla } from "../yukla";
import { USTUNLAR } from "./ustunlar";

export const dynamic = "force-dynamic";

export const metadata = { title: "Retseptlar — Admin" };

function SahifaTugmasi({ href, children }: { href: string | null; children: React.ReactNode }) {
  const tugma = sinf("uchinchi", true);
  return href ? (
    <Link href={href} className={tugma}>
      {children}
    </Link>
  ) : (
    <span aria-disabled="true" className={`${tugma} opacity-40`}>
      {children}
    </span>
  );
}

function tire(matn: string | null) {
  return matn ?? <span className="text-matn-3">—</span>;
}

/**
 * A8 — retseptlar ro'yxati (admin-tz.md, prototip screens-content.jsx). Filtr kategoriya va holat
 * bo'yicha, manzilda; sahifa o'z API yo'liga murojaat qiladi. Qator bosilsa A9 muharriri ochiladi.
 * Qoralama belgisi neytral, chop etilgan — lime (prototip `Badge`).
 */
export default async function RetseptlarSahifasi({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const kategoriya = kategoriyaFiltriniOqi(params.kategoriya);
  const holat = holatFiltriniOqi(params.holat);
  const sahifa = sahifaniOqi(params.sahifa);
  const [royxat, kategoriyalar] = await Promise.all([
    retseptlarniYukla(kategoriya, holat, sahifa),
    kategoriyalarniYukla(),
  ]);

  const qatorlar: Qator[] = (royxat?.qatorlar ?? []).map((r) => {
    const murakkablik = murakkablikniOqi(r.murakkablik);
    return {
      id: r.id,
      href: `/admin/retseptlar/${r.id}`,
      nomi: r.nomi,
      kategoriya: tire(r.kategoriya),
      kkal: r.kaloriya === null ? tire(null) : son(Math.round(r.kaloriya)),
      vaqt: vaqtMatni(r.vaqtDaqiqa),
      murakkablik: tire(murakkablik ? MURAKKABLIK_NOMLARI[murakkablik] : null),
      mazmun: mazmunMatni(r.masalliqlar, r.qadamlar),
      holat: <Yorliq ton={r.holat === "chop_etilgan" ? "ai" : "neytral"}>{HOLAT_NOMLARI[r.holat]}</Yorliq>,
    };
  });

  const jami = royxat?.jami ?? 0;
  const oxirgiSahifa = sahifalarSoni(jami);

  return (
    <AdminSahifa
      sarlavha="Retseptlar"
      amallar={
        <Link href="/admin/retseptlar/yangi" className={sinf("siyoh", true)}>
          Yangi retsept
        </Link>
      }
    >
      <RetseptFiltri kategoriyalar={kategoriyalar ?? []} kategoriya={kategoriya} holat={holat} />
      {royxat ? (
        <AdminJadval
          ustunlar={USTUNLAR}
          qatorlar={qatorlar}
          bosh={
            <span className="flex flex-col items-center gap-2">
              <span className="text-matn-3">
                <Belgi nomi="book-open" olcham={24} />
              </span>
              <span className="text-karta-sarlavha text-siyoh">Retsept topilmadi</span>
            </span>
          }
          pastki={
            <>
              <span>{sahifaMatni(sahifa, jami)}</span>
              <span className="flex gap-2">
                <SahifaTugmasi href={sahifa > 1 ? retseptlarManzili(kategoriya, holat, sahifa - 1) : null}>
                  Oldingi
                </SahifaTugmasi>
                <SahifaTugmasi href={sahifa < oxirgiSahifa ? retseptlarManzili(kategoriya, holat, sahifa + 1) : null}>
                  Keyingi
                </SahifaTugmasi>
              </span>
            </>
          }
        />
      ) : (
        <XatoHolati xabar="Ro'yxatni yuklab bo'lmadi" />
      )}
    </AdminSahifa>
  );
}
