import Link from "next/link";
import { sinf } from "@/app/_components/Tugma";
import {
  qidiruvniOqi,
  sahifalarSoni,
  sahifaMatni,
  sahifaniOqi,
  sanaMatni,
  son,
} from "@/lib/services/admin-hisob";
import {
  olchovMatni,
  sonMatni,
  TAOM_FILTR_NOMLARI,
  TAOM_FILTRLARI,
  taomFiltriniOqi,
  type TaomFiltri,
} from "@/lib/services/taom-admin-hisob";
import { AdminJadval, type Qator } from "../_components/AdminJadval";
import { AdminSahifa } from "../_components/AdminSahifa";
import { Belgi } from "../_components/Belgi";
import { QidiruvPaneli } from "../_components/QidiruvPaneli";
import { XatoHolati } from "../_components/XatoHolati";
import { taomlarniYukla } from "../yukla";
import { USTUNLAR } from "./ustunlar";

export const dynamic = "force-dynamic";

export const metadata = { title: "Taomlar bazasi — Admin" };

/** Sahifalash havolasi: joriy qidiruv va filtr saqlanadi. */
function sahifaManzili(q: string | null, filtr: TaomFiltri, sahifa: number): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (filtr !== "hammasi") params.set("filtr", filtr);
  if (sahifa > 1) params.set("sahifa", String(sahifa));
  const satr = params.toString();
  return satr ? `/admin/taomlar?${satr}` : "/admin/taomlar";
}

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

/** Tarjimasi bo'sh ustun — prototipdagidek xato rangida "yo'q". */
function tarjima(nom: string) {
  return nom || <span className="text-xato">{"yo'q"}</span>;
}

/**
 * A6 — taomlar bazasi (admin-tz.md, prototip screens-content.jsx). Qidiruv uch tilda, filtr va
 * sahifa manzilda; sahifa o'z API yo'liga murojaat qiladi. Qator bosilsa A7 muharriri ochiladi.
 */
export default async function TaomlarSahifasi({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = qidiruvniOqi(params.q);
  const filtr = taomFiltriniOqi(params.filtr);
  const sahifa = sahifaniOqi(params.sahifa);
  const royxat = await taomlarniYukla(q, filtr, sahifa);

  const qatorlar: Qator[] = (royxat?.qatorlar ?? []).map((t) => ({
    id: t.id,
    href: `/admin/taomlar/${t.id}`,
    uz: t.nomi,
    ru: tarjima(t.nomiRu),
    en: tarjima(t.nomiEn),
    olchov: olchovMatni(t.olchovMiqdori, t.olchovBirligi),
    kkal: son(Math.round(t.kaloriya)),
    makro: `${sonMatni(t.oqsil)} / ${sonMatni(t.yog)} / ${sonMatni(t.uglevod)}`,
    rasm: t.rasmBor ? (
      <span className="text-siyoh">
        <Belgi nomi="check" olcham={16} />
      </span>
    ) : (
      <span className="text-matn-3">—</span>
    ),
    sana: sanaMatni(t.yaratilgan),
  }));

  const jami = royxat?.jami ?? 0;
  const oxirgiSahifa = sahifalarSoni(jami);

  return (
    <AdminSahifa
      sarlavha="Taomlar bazasi"
      amallar={
        <Link href="/admin/taomlar/yangi" className={sinf("siyoh", true)}>
          Yangi taom
        </Link>
      }
    >
      <QidiruvPaneli
        q={q ?? ""}
        filtr={filtr}
        asos="/admin/taomlar"
        filtrlar={TAOM_FILTRLARI}
        nomlar={TAOM_FILTR_NOMLARI}
        joyMatni="Taom nomi"
        yorliq="Taom qidirish"
      />
      {royxat ? (
        <AdminJadval
          ustunlar={USTUNLAR}
          qatorlar={qatorlar}
          bosh={
            <span className="flex flex-col items-center gap-2">
              <span className="text-matn-3">
                <Belgi nomi="search-x" olcham={24} />
              </span>
              <span className="text-karta-sarlavha text-siyoh">
                {q ? `«${q}» bo'yicha taom topilmadi` : "Taom topilmadi"}
              </span>
            </span>
          }
          pastki={
            <>
              <span>{sahifaMatni(sahifa, jami)}</span>
              <span className="flex gap-2">
                <SahifaTugmasi href={sahifa > 1 ? sahifaManzili(q, filtr, sahifa - 1) : null}>
                  Oldingi
                </SahifaTugmasi>
                <SahifaTugmasi href={sahifa < oxirgiSahifa ? sahifaManzili(q, filtr, sahifa + 1) : null}>
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
