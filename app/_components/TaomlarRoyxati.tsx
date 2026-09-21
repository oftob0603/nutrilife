"use client";

import { useState } from "react";
import { TaomKartasi } from "@/app/_components/TaomKartasi";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { TugmaHavola } from "@/app/_components/Tugma";
import { nomBoyichaTartibla, taomMosmi, type Taom } from "@/lib/services/taom-hisob";

function QidiruvIkonasi() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-matn-3"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

/** E4 — taom qidiruvi. Baza kichik, shuning uchun filtr klientda ishlaydi. */
export function TaomlarRoyxati({ taomlar }: { taomlar: Taom[] }) {
  const { t, til } = useTarjima();
  const [sorov, setSorov] = useState("");

  const natijalar = nomBoyichaTartibla(taomlar, til).filter((taom) => taomMosmi(taom, sorov));

  return (
    <div className="flex flex-col gap-4">
      <label className="flex min-h-11 items-center gap-2 rounded-karta border border-chegara bg-karta px-4">
        <QidiruvIkonasi />
        <span className="sr-only">{t("Taom qidirish")}</span>
        <input
          type="search"
          value={sorov}
          onChange={(hodisa) => setSorov(hodisa.target.value)}
          placeholder={t("Taom qidirish")}
          className="w-full min-w-0 bg-transparent py-2 text-asosiy outline-none placeholder:text-matn-3"
        />
        {sorov && (
          <button
            type="button"
            onClick={() => setSorov("")}
            className="shrink-0 text-izoh text-matn-2"
          >
            {t("Tozalash")}
          </button>
        )}
      </label>

      {natijalar.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-4 text-center">
          <p className="text-karta-sarlavha">{t("«{0}» topilmadi", sorov.trim())}</p>
          <p className="text-izoh text-matn-2">
            {t("Boshqa nom bilan qidirib ko'ring yoki taomni AI yordamida qo'shing.")}
          </p>
          <div className="flex w-full flex-col gap-2">
            <TugmaHavola
              korinish="ikkilamchi"
              href={`/tasvirlash?matn=${encodeURIComponent(sorov.trim())}`}
            >
              {t("Matn bilan tasvirlash")}
            </TugmaHavola>
            <TugmaHavola korinish="ikkilamchi" href="/kamera">
              {t("Rasmga olish")}
            </TugmaHavola>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {natijalar.map((taom) => (
            <TaomKartasi key={taom.id} taom={taom} />
          ))}
        </ul>
      )}
    </div>
  );
}
