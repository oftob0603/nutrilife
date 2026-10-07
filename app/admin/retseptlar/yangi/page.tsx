import { AdminSahifa } from "../../_components/AdminSahifa";
import { RetseptShakli } from "../../_components/RetseptShakli";
import { XatoHolati } from "../../_components/XatoHolati";
import { kategoriyalarniYukla } from "../../yukla";

export const dynamic = "force-dynamic";

export const metadata = { title: "Yangi retsept — Admin" };

/** A9 — yangi retsept. Kategoriyalar API'dan; olinmasa shakl ochilmaydi (chop etishga kategoriya kerak). */
export default async function YangiRetseptSahifasi() {
  const kategoriyalar = await kategoriyalarniYukla();
  if (!kategoriyalar) {
    return (
      <AdminSahifa sarlavha="Yangi retsept">
        <XatoHolati xabar="Shaklni yuklab bo'lmadi" />
      </AdminSahifa>
    );
  }
  return <RetseptShakli retsept={null} kategoriyalar={kategoriyalar} />;
}
