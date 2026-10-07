import { AdminSahifa } from "../../_components/AdminSahifa";
import { TaomShakli } from "../../_components/TaomShakli";
import { XatoHolati } from "../../_components/XatoHolati";
import { kategoriyalarniYukla } from "../../yukla";

export const dynamic = "force-dynamic";

export const metadata = { title: "Yangi taom — Admin" };

/** A7 — yangi taom. Kategoriyalar API'dan; olinmasa shakl ochilmaydi (kategoriya tanlovi kerak). */
export default async function YangiTaomSahifasi() {
  const kategoriyalar = await kategoriyalarniYukla();
  if (!kategoriyalar) {
    return (
      <AdminSahifa sarlavha="Yangi taom">
        <XatoHolati xabar="Shaklni yuklab bo'lmadi" />
      </AdminSahifa>
    );
  }
  return <TaomShakli taom={null} kategoriyalar={kategoriyalar} />;
}
