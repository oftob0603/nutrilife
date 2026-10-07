import Link from "next/link";
import type { Tarjimon } from "@/lib/lugat/tarjima";
import { murakkablikKaliti, type RetseptKartasi as Karta, type RetseptQulfi } from "@/lib/services/retsept-hisob";
import { Ikona } from "./Ikona";
import { RetseptRasmi } from "./RetseptRasmi";
import { SevimliTugmasi } from "./SevimliTugmasi";

/** Kaloriya qatori (prototip `KcalLine`): rasm ostida alohida, nom bilan bir qatorda emas. */
export function KkalQatori({ kaloriya, t }: { kaloriya: number | null; t: Tarjimon["t"] }) {
  return (
    <span className="flex items-center gap-1 text-belgi text-matn-2 tabular-nums">
      <Ikona nomi="flame" olcham={14} />
      {kaloriya === null ? "—" : t("{0} kkal", Math.round(kaloriya))}
    </span>
  );
}

/**
 * R1 kartasi (prototip `RecipeCard`): rasm (FREE'ga yopiq bo'lsa xira va PRO belgisi), chap
 * yuqorida yurak, ostida kkal qatori, nomi va murakkablik. Butun karta R2/R3 havolasi; yurak
 * havola ustida alohida bosiladi.
 */
export function RetseptKartasi({ retsept, qulf, t }: { retsept: Karta; qulf: RetseptQulfi; t: Tarjimon["t"] }) {
  const murakkablik = murakkablikKaliti(retsept.murakkablik);
  return (
    <article className="relative flex flex-col overflow-hidden rounded-karta border border-karta-chegara bg-karta">
      <Link
        href={`/retseptlar/${retsept.id}`}
        aria-label={retsept.nomi}
        className="absolute inset-0 z-0 rounded-karta transition-transform active:scale-[0.98]"
      />
      <RetseptRasmi
        rasm={retsept.rasm}
        balandlik="h-[104px]"
        xira={qulf.toliqMatn}
        ustiga={
          <>
            <span className="absolute top-2 left-2">
              <SevimliTugmasi id={retsept.id} sevimli={retsept.sevimli} yopiq={qulf.sevimli} />
            </span>
            {qulf.toliqMatn && (
              <span className="pointer-events-none absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-(image:--pro-gradient) px-2 py-[3px] text-belgi font-medium text-(--pro-fg)">
                <Ikona nomi="lock" olcham={12} />
                PRO
              </span>
            )}
          </>
        }
      />
      <div className="pointer-events-none flex flex-col gap-2 p-3">
        <KkalQatori kaloriya={retsept.kaloriya} t={t} />
        <span className="line-clamp-2 text-karta-sarlavha">{retsept.nomi}</span>
        <span className="text-izoh text-matn-2">{murakkablik ? t(murakkablik) : " "}</span>
      </div>
    </article>
  );
}
