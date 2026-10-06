import { FILTR_MATNLARI, TAKLIF_FILTRLARI } from "@/lib/services/taom-taklif-hisob";
import { AdminJadval } from "../_components/AdminJadval";
import { AdminSahifa } from "../_components/AdminSahifa";
import { USTUNLAR } from "./ustunlar";

/** A4 yuklanmoqda holati — 10 qator skelet (admin-tz.md §4), sahifa tuzilishi sakramaydi. */
export default function TakliflarYuklanmoqda() {
  return (
    <AdminSahifa sarlavha="Takliflar navbati" izoh="Eng eskisi birinchi">
      <div aria-hidden="true" className="flex flex-wrap items-center gap-2">
        {TAKLIF_FILTRLARI.map((f) => (
          <span
            key={f}
            className="min-h-11 rounded-chip border border-chegara bg-karta px-4 leading-11 text-asosiy font-medium text-matn-3"
          >
            {FILTR_MATNLARI[f]}
          </span>
        ))}
      </div>
      <AdminJadval ustunlar={USTUNLAR} qatorlar={[]} bosh="" yuklanmoqda />
    </AdminSahifa>
  );
}
