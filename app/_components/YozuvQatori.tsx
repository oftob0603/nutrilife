import Link from "next/link";
import { AiBelgisi } from "@/app/_components/AiBelgisi";
import { TaomRasmi } from "@/app/_components/TaomRasmi";
import { tarjimon, type Til } from "@/lib/lugat/tarjima";
import { raqam } from "@/lib/services/raqam";
import { vaqtMatni, type Yozuv } from "@/lib/services/yozuv-hisob";

/**
 * Jurnaldagi bitta yozuv (prototipdagi LogEntry). AI orqali kirgan yozuvda "AI taxmini"
 * belgisi har joyda turadi (DESIGN.md: AI raqami belgisiz ko'rinmaydi); `batafsil` — jurnal
 * sahifasi (E9) uchun makrolar qatorini qo'shadi.
 * Qator bosilsa yozuv tahriri (E10) ochiladi; `qaytish` — u yerdan qaytiladigan ekran.
 */
export function YozuvQatori({
  yozuv,
  til,
  batafsil = false,
  qaytish = "/",
}: {
  yozuv: Yozuv;
  til: Til;
  batafsil?: boolean;
  qaytish?: string;
}) {
  const { t, porsiya } = tarjimon(til);
  const makrolar = [Math.round(yozuv.oqsil), Math.round(yozuv.yog), Math.round(yozuv.uglevod)];

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
            {yozuv.manba === "ai" && <AiBelgisi />}
          </div>
          <p className="mt-1 text-izoh text-matn-2 tabular-nums">
            {porsiya(yozuv.porsiya)} · {vaqtMatni(yozuv.vaqt)}
          </p>
          {batafsil && (
            <p
              className="mt-1 truncate text-izoh text-matn-2 tabular-nums"
              aria-label={t("Oqsil {0} g, yog' {1} g, uglevod {2} g", ...makrolar)}
            >
              {t("O {0} g · Y {1} g · U {2} g", ...makrolar)}
            </p>
          )}
        </div>
        <p className="shrink-0 text-karta-sarlavha tabular-nums">
          {raqam(yozuv.kaloriya)}
          <span className="text-izoh font-normal text-matn-2"> {t("kkal")}</span>
        </p>
      </Link>
    </li>
  );
}
