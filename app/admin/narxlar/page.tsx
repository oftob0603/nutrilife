import { AdminSahifa } from "../_components/AdminSahifa";
import { NarxlarShakli } from "../_components/NarxlarShakli";
import { XatoHolati } from "../_components/XatoHolati";
import { narxlarniYukla } from "../yukla";

export const dynamic = "force-dynamic";

export const metadata = { title: "Narxlar — Admin" };

/** A12 — narxlar (admin-tz.md): joriy tariflar `tariflar` jadvalidan, shakl va tasdiq oynasi klientda. */
export default async function NarxlarSahifasi() {
  const tariflar = await narxlarniYukla();
  if (!tariflar) {
    return (
      <AdminSahifa sarlavha="Narxlar">
        <XatoHolati xabar="Narxlarni yuklab bo'lmadi" />
      </AdminSahifa>
    );
  }
  return <NarxlarShakli tariflar={tariflar} />;
}
