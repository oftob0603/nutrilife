import { HOLAT_FILTR_NOMLARI, HOLAT_FILTRLARI } from "@/lib/services/retsept-admin-hisob";
import { AdminJadval } from "../_components/AdminJadval";
import { AdminSahifa } from "../_components/AdminSahifa";
import { USTUNLAR } from "./ustunlar";

/** A8 yuklanmoqda holati — 10 qator skelet (admin-tz.md), sahifa tuzilishi sakramaydi. */
export default function RetseptlarYuklanmoqda() {
  return (
    <AdminSahifa sarlavha="Retseptlar">
      <div aria-hidden="true" className="flex flex-wrap items-center gap-2">
        <span className="min-h-11 min-w-[220px] rounded-karta border border-chegara bg-karta" />
        {HOLAT_FILTRLARI.map((f) => (
          <span
            key={f}
            className="min-h-11 rounded-chip border border-chegara bg-karta px-4 leading-11 text-asosiy font-medium text-matn-3"
          >
            {HOLAT_FILTR_NOMLARI[f]}
          </span>
        ))}
      </div>
      <AdminJadval ustunlar={USTUNLAR} qatorlar={[]} bosh="" yuklanmoqda />
    </AdminSahifa>
  );
}
