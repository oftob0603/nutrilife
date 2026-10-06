import Link from "next/link";
import { sinf } from "@/app/_components/Tugma";
import {
  faollikMatni,
  filtrniOqi,
  qidiruvniOqi,
  sahifalarSoni,
  sahifaMatni,
  sahifaniOqi,
  sanaMatni,
  son,
  tarifMatni,
  telegramIdMatni,
  tugashKuni,
  type FoydalanuvchiFiltri,
} from "@/lib/services/admin-hisob";
import { bugunSana } from "@/lib/services/yozuv-hisob";
import { AdminJadval, type Qator } from "../_components/AdminJadval";
import { AdminSahifa } from "../_components/AdminSahifa";
import { Belgi } from "../_components/Belgi";
import { QidiruvPaneli } from "../_components/QidiruvPaneli";
import { XatoHolati } from "../_components/XatoHolati";
import { HolatYorligi, Yorliq } from "../_components/Yorliq";
import { foydalanuvchilarniYukla } from "../yukla";
import { USTUNLAR } from "./ustunlar";

export const dynamic = "force-dynamic";

export const metadata = { title: "Foydalanuvchilar — Admin" };

/** Sahifalash havolasi: joriy qidiruv va filtr saqlanadi. */
function sahifaManzili(q: string | null, filtr: FoydalanuvchiFiltri, sahifa: number): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (filtr !== "hammasi") params.set("filtr", filtr);
  if (sahifa > 1) params.set("sahifa", String(sahifa));
  const satr = params.toString();
  return satr ? `/admin/foydalanuvchilar?${satr}` : "/admin/foydalanuvchilar";
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

/**
 * A2 — foydalanuvchilar ro'yxati (admin-tz.md). Qidiruv, filtr va sahifa manzilda; sahifa
 * bazaga emas, o'z API yo'liga murojaat qiladi. Qator bosilsa A3 kartasi ochiladi.
 */
export default async function FoydalanuvchilarSahifasi({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = qidiruvniOqi(params.q);
  const filtr = filtrniOqi(params.filtr);
  const sahifa = sahifaniOqi(params.sahifa);
  const royxat = await foydalanuvchilarniYukla(q, filtr, sahifa);
  const bugun = bugunSana();

  const qatorlar: Qator[] = (royxat?.qatorlar ?? []).map((f) => ({
    id: f.id,
    href: `/admin/foydalanuvchilar/${f.id}`,
    ism: (
      <>
        {f.ism ?? <span className="text-matn-2">Ismsiz</span>}
        {f.username && <span className="text-matn-2"> · @{f.username}</span>}
      </>
    ),
    telegramId: telegramIdMatni(f.telegramId),
    rol: (
      <span className="flex items-center gap-1">
        <HolatYorligi holat={f.holat} />
        {f.admin && <Yorliq>admin</Yorliq>}
      </span>
    ),
    obuna: f.obuna ? `${tarifMatni(f.obuna.tarif)} · ${tugashKuni(f.obuna.tugash)}` : "—",
    royxat: sanaMatni(f.royxat),
    faollik: faollikMatni(f.oxirgiFaollik, bugun),
    skanlar: son(f.skanlar),
  }));

  const jami = royxat?.jami ?? 0;
  const oxirgiSahifa = sahifalarSoni(jami);

  return (
    <AdminSahifa sarlavha="Foydalanuvchilar">
      <QidiruvPaneli q={q ?? ""} filtr={filtr} />
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
                {q ? `«${q}» bo'yicha foydalanuvchi topilmadi` : "Foydalanuvchi yo'q"}
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
