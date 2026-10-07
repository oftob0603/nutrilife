import { DAVRLAR, METRIKALAR } from "@/lib/services/admin-statistika-hisob";
import { AdminSahifa } from "../_components/AdminSahifa";

/** A10 yuklanmoqda holati — tanlagich va beshta skelet karta, sahifa tuzilishi sakramaydi. */
export default function StatistikaYuklanmoqda() {
  return (
    <AdminSahifa sarlavha="Statistika">
      <div aria-hidden="true" className="flex w-full max-w-[320px] rounded-chip border border-chegara bg-karta p-1">
        {DAVRLAR.map((d) => (
          <span key={d} className="min-h-10 flex-1 px-3 text-center text-asosiy font-medium leading-10 text-matn-3 tabular-nums">
            {d} kun
          </span>
        ))}
      </div>
      <div aria-hidden="true" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {METRIKALAR.map((m) => (
          <div key={m.kalit} className="flex flex-col gap-2 rounded-karta border border-karta-chegara bg-karta p-4">
            <span className="text-izoh text-matn-2">{m.nomi}</span>
            <span className="block h-6 w-3/5 animate-pulse rounded-full bg-chegara" />
            <span className="block h-24 animate-pulse rounded-chip bg-chegara opacity-60" />
          </div>
        ))}
      </div>
    </AdminSahifa>
  );
}
