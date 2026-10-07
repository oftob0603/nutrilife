import Link from "next/link";
import { sinf } from "@/app/_components/Tugma";
import { AdminSahifa } from "../../_components/AdminSahifa";
import { RetseptShakli } from "../../_components/RetseptShakli";
import { XatoHolati } from "../../_components/XatoHolati";
import { kategoriyalarniYukla, retseptniYukla } from "../../yukla";

export const dynamic = "force-dynamic";

export const metadata = { title: "Retsept — Admin" };

/** A9 — mavjud retseptni tahrirlash yoki chop etish. Karta va kategoriyalar API'dan, id o'zgarmaydi. */
export default async function RetseptSahifasi({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [natija, kategoriyalar] = await Promise.all([retseptniYukla(id), kategoriyalarniYukla()]);
  const qaytish = (
    <Link href="/admin/retseptlar" className={sinf("uchinchi", true)}>
      {"Ro'yxatga qaytish"}
    </Link>
  );

  if ("holat" in natija || !kategoriyalar) {
    const topilmadi = "holat" in natija && natija.holat === "topilmadi";
    return (
      <AdminSahifa sarlavha="Retsept" amallar={qaytish}>
        {topilmadi ? (
          <p className="text-asosiy text-matn-2">{"Bunday retsept yo'q"}</p>
        ) : (
          <XatoHolati xabar="Kartani yuklab bo'lmadi" />
        )}
      </AdminSahifa>
    );
  }
  return <RetseptShakli retsept={natija.karta} kategoriyalar={kategoriyalar} />;
}
