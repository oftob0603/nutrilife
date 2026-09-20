import { TaomRasmi } from "@/app/_components/TaomRasmi";
import { raqam } from "@/lib/services/taom-hisob";
import { vaqtMatni, type Yozuv } from "@/lib/services/yozuv-hisob";

/** Jurnaldagi bitta yozuv (prototipdagi LogEntry). */
export function YozuvQatori({ yozuv }: { yozuv: Yozuv }) {
  return (
    <li className="flex items-center gap-3 rounded-karta border border-chegara bg-karta p-4">
      <TaomRasmi rasm={yozuv.rasm} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-karta-sarlavha">{yozuv.taomNomi}</p>
        <p className="mt-1 text-izoh text-matn-2 tabular-nums">
          {yozuv.porsiya} · {vaqtMatni(yozuv.vaqt)}
        </p>
      </div>
      <p className="shrink-0 text-karta-sarlavha tabular-nums">
        {raqam(yozuv.kaloriya)}
        <span className="text-izoh font-normal text-matn-2"> kkal</span>
      </p>
    </li>
  );
}
