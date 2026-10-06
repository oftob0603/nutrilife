import { AdminJadval } from "../_components/AdminJadval";
import { AdminSahifa } from "../_components/AdminSahifa";
import { USTUNLAR } from "./ustunlar";

/** A2 yuklanmoqda holati — 10 qator skelet (admin-tz.md), sahifa tuzilishi sakramaydi. */
export default function FoydalanuvchilarYuklanmoqda() {
  return (
    <AdminSahifa sarlavha="Foydalanuvchilar">
      <div aria-hidden="true" className="flex flex-wrap items-center gap-2">
        <span className="min-h-11 min-w-[280px] flex-1 rounded-karta border border-chegara bg-karta" />
        {["Hammasi", "FREE", "PRO", "Bloklangan"].map((nomi) => (
          <span
            key={nomi}
            className="min-h-11 rounded-chip border border-chegara bg-karta px-4 leading-11 text-asosiy font-medium text-matn-3"
          >
            {nomi}
          </span>
        ))}
      </div>
      <AdminJadval ustunlar={USTUNLAR} qatorlar={[]} bosh="" yuklanmoqda />
    </AdminSahifa>
  );
}
