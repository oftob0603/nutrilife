import Link from "next/link";
import { AiBelgisi } from "@/app/_components/AiBelgisi";
import { TaomRasmi } from "@/app/_components/TaomRasmi";
import { raqam } from "@/lib/services/taom-hisob";
import { vaqtMatni, type Yozuv } from "@/lib/services/yozuv-hisob";

/**
 * Jurnaldagi bitta yozuv (prototipdagi LogEntry). `batafsil` — jurnal sahifasi (E9) uchun:
 * makrolar qatori va AI orqali kirgan yozuvda "AI taxmini" belgisi qo'shiladi.
 * Qator bosilsa yozuv tahriri (E10) ochiladi; `qaytish` — u yerdan qaytiladigan ekran.
 */
export function YozuvQatori({
  yozuv,
  batafsil = false,
  qaytish = "/",
}: {
  yozuv: Yozuv;
  batafsil?: boolean;
  qaytish?: string;
}) {
  return (
    <li>
      <Link
        href={`/yozuv/${yozuv.id}?qaytish=${encodeURIComponent(qaytish)}`}
        className="flex items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-4 transition-transform active:scale-[0.98]"
      >
        <TaomRasmi rasm={yozuv.rasm} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="min-w-0 truncate text-karta-sarlavha">{yozuv.taomNomi}</p>
            {batafsil && yozuv.manba === "ai" && <AiBelgisi />}
          </div>
          <p className="mt-1 text-izoh text-matn-2 tabular-nums">
            {yozuv.porsiya} · {vaqtMatni(yozuv.vaqt)}
          </p>
          {batafsil && (
            <p
              className="mt-1 truncate text-izoh text-matn-2 tabular-nums"
              aria-label={`Oqsil ${Math.round(yozuv.oqsil)} g, yog' ${Math.round(yozuv.yog)} g, uglevod ${Math.round(yozuv.uglevod)} g`}
            >
              O {Math.round(yozuv.oqsil)} g · Y {Math.round(yozuv.yog)} g · U{" "}
              {Math.round(yozuv.uglevod)} g
            </p>
          )}
        </div>
        <p className="shrink-0 text-karta-sarlavha tabular-nums">
          {raqam(yozuv.kaloriya)}
          <span className="text-izoh font-normal text-matn-2"> kkal</span>
        </p>
      </Link>
    </li>
  );
}
