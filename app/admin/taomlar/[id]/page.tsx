import Link from "next/link";
import { sinf } from "@/app/_components/Tugma";
import { AdminSahifa } from "../../_components/AdminSahifa";
import { TaomShakli } from "../../_components/TaomShakli";
import { XatoHolati } from "../../_components/XatoHolati";
import { kategoriyalarniYukla, taomniYukla } from "../../yukla";

export const dynamic = "force-dynamic";

export const metadata = { title: "Taom — Admin" };

/** A7 — mavjud taomni tahrirlash. Karta va kategoriyalar API'dan, id o'zgarmaydi. */
export default async function TaomSahifasi({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [natija, kategoriyalar] = await Promise.all([taomniYukla(id), kategoriyalarniYukla()]);
  const qaytish = (
    <Link href="/admin/taomlar" className={sinf("uchinchi", true)}>
      {"Ro'yxatga qaytish"}
    </Link>
  );

  if ("holat" in natija || !kategoriyalar) {
    const topilmadi = "holat" in natija && natija.holat === "topilmadi";
    return (
      <AdminSahifa sarlavha="Taom" amallar={qaytish}>
        {topilmadi ? (
          <p className="text-asosiy text-matn-2">{"Bunday taom yo'q"}</p>
        ) : (
          <XatoHolati xabar="Kartani yuklab bo'lmadi" />
        )}
      </AdminSahifa>
    );
  }
  return <TaomShakli taom={natija.karta} kategoriyalar={kategoriyalar} />;
}
