import { TARIF_IDLARI } from "@/lib/tariflar";
import { tarifMatni } from "@/lib/services/admin-hisob";
import { AdminSahifa } from "../_components/AdminSahifa";

/** A12 yuklanmoqda holati — uchta skelet karta, sahifa tuzilishi sakramaydi. */
export default function NarxlarYuklanmoqda() {
  return (
    <AdminSahifa sarlavha="Narxlar">
      <div aria-hidden="true" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {TARIF_IDLARI.map((id) => (
          <div key={id} className="flex flex-col gap-3 rounded-karta border border-karta-chegara bg-karta p-4">
            <span className="text-karta-sarlavha">{tarifMatni(id)}</span>
            <span className="block h-12 animate-pulse rounded-karta bg-chegara" />
            <span className="block h-4 w-2/5 animate-pulse rounded-full bg-chegara opacity-60" />
          </div>
        ))}
      </div>
    </AdminSahifa>
  );
}
