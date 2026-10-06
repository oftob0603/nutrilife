import Link from "next/link";
import { sinf } from "@/app/_components/Tugma";
import { sahifalarSoni, sahifaMatni, sahifaniOqi, sanaMatni } from "@/lib/services/admin-hisob";
import { HOLAT_MATNLARI, taklifFiltriniOqi, zichlikMatni } from "@/lib/services/taom-taklif-hisob";
import { AdminJadval, type Qator } from "../_components/AdminJadval";
import { AdminSahifa } from "../_components/AdminSahifa";
import { Belgi } from "../_components/Belgi";
import { TaklifFiltri, takliflarManzili } from "../_components/TaklifFiltri";
import { TaklifRasmi } from "../_components/TaklifRasmi";
import { XatoHolati } from "../_components/XatoHolati";
import { Yorliq } from "../_components/Yorliq";
import { takliflarniYukla } from "../yukla";
import { USTUNLAR } from "./ustunlar";

export const dynamic = "force-dynamic";

export const metadata = { title: "Takliflar navbati — Admin" };

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
 * A4 — taom takliflari navbati (admin-tz.md): foydalanuvchi tuzatgan AI natijalari, eng eskisi
 * birinchi. Filtr va sahifa manzilda; qator bosilsa A5 kartasi ochiladi. Bo'sh navbat — yaxshi
 * xabar, xato emas.
 */
export default async function TakliflarSahifasi({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const holat = taklifFiltriniOqi(params.holat);
  const sahifa = sahifaniOqi(params.sahifa);
  const royxat = await takliflarniYukla(holat, sahifa);

  const qatorlar: Qator[] = (royxat?.qatorlar ?? []).map((t) => ({
    id: t.id,
    href: `/admin/takliflar/${t.id}`,
    rasm: <TaklifRasmi manzil={t.rasm} />,
    ai: zichlikMatni(t.ai.taomNomi, t.ai.kaloriya100),
    tuzatish: zichlikMatni(t.tuzatish.taomNomi, t.tuzatish.kaloriya100),
    kim: t.kim ? (t.kim.ism ?? "Ismsiz") : "O'chirilgan foydalanuvchi",
    sana: sanaMatni(t.yaratilgan),
    holat: <Yorliq>{HOLAT_MATNLARI[t.holat]}</Yorliq>,
  }));

  const jami = royxat?.jami ?? 0;
  const oxirgiSahifa = sahifalarSoni(jami);

  return (
    <AdminSahifa sarlavha="Takliflar navbati" izoh="Eng eskisi birinchi">
      <TaklifFiltri holat={holat} />
      {royxat ? (
        <AdminJadval
          ustunlar={USTUNLAR}
          qatorlar={qatorlar}
          bosh={
            <span className="flex flex-col items-center gap-2">
              <span className="text-matn-3">
                <Belgi nomi="inbox" olcham={24} />
              </span>
              <span className="text-karta-sarlavha text-siyoh">{"Navbat bo'sh"}</span>
              <span>{"Yangi tuzatishlar shu yerda paydo bo'ladi"}</span>
            </span>
          }
          pastki={
            <>
              <span>{sahifaMatni(sahifa, jami)}</span>
              <span className="flex gap-2">
                <SahifaTugmasi href={sahifa > 1 ? takliflarManzili(holat, sahifa - 1) : null}>
                  Oldingi
                </SahifaTugmasi>
                <SahifaTugmasi href={sahifa < oxirgiSahifa ? takliflarManzili(holat, sahifa + 1) : null}>
                  Keyingi
                </SahifaTugmasi>
              </span>
            </>
          }
        />
      ) : (
        <XatoHolati xabar="Navbatni yuklab bo'lmadi" />
      )}
    </AdminSahifa>
  );
}
