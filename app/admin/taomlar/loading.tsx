import { TAOM_FILTR_NOMLARI, TAOM_FILTRLARI } from "@/lib/services/taom-admin-hisob";
import { AdminJadval } from "../_components/AdminJadval";
import { AdminSahifa } from "../_components/AdminSahifa";
import { USTUNLAR } from "./ustunlar";

/** A6 yuklanmoqda holati — 10 qator skelet (admin-tz.md), sahifa tuzilishi sakramaydi. */
export default function TaomlarYuklanmoqda() {
  return (
    <AdminSahifa sarlavha="Taomlar bazasi">
      <div aria-hidden="true" className="flex flex-wrap items-center gap-2">
        <span className="min-h-11 min-w-[280px] flex-1 rounded-karta border border-chegara bg-karta" />
        {TAOM_FILTRLARI.map((f) => (
          <span
            key={f}
            className="min-h-11 rounded-chip border border-chegara bg-karta px-4 leading-11 text-asosiy font-medium text-matn-3"
          >
            {TAOM_FILTR_NOMLARI[f]}
          </span>
        ))}
      </div>
      <AdminJadval ustunlar={USTUNLAR} qatorlar={[]} bosh="" yuklanmoqda />
    </AdminSahifa>
  );
}
