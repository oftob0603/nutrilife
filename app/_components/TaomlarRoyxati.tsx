"use client";

import { useState } from "react";
import { TaomKartasi } from "@/app/_components/TaomKartasi";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { TugmaHavola } from "@/app/_components/Tugma";
import { nomBoyichaTartibla, taomMosmi, type Taom } from "@/lib/services/taom-hisob";

function Ikona({ nomi }: { nomi: "qidiruv" | "yopish" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={nomi === "qidiruv" ? 20 : 18}
      height={nomi === "qidiruv" ? 20 : 18}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {nomi === "qidiruv" ? (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </>
      ) : (
        <path d="M18 6 6 18M6 6l12 12" />
      )}
    </svg>
  );
}

/**
 * E4 — taom qidiruvi (prototip `SearchScreen`). Baza kichik, shuning uchun filtr klientda
 * ishlaydi. Ro'yxat ostida doim "Matn bilan tasvirlash" turadi — bazada yo'q taomni yozib
 * berish yo'li faqat "topilmadi" holatiga bog'liq emas; u haqiqiy matn maydonini ochadi.
 */
export function TaomlarRoyxati({ taomlar }: { taomlar: Taom[] }) {
  const { t, til } = useTarjima();
  const [sorov, setSorov] = useState("");
  const [fokus, setFokus] = useState(false);

  const natijalar = nomBoyichaTartibla(taomlar, til).filter((taom) => taomMosmi(taom, sorov));
  const tasvirlashManzili = sorov.trim()
    ? `/tasvirlash?matn=${encodeURIComponent(sorov.trim())}`
    : "/tasvirlash";

  return (
    <div className="flex flex-col gap-4">
      <label
        className={`flex min-h-11 items-center gap-2 rounded-karta border bg-karta px-4 text-matn-2 transition-colors ${
          fokus ? "border-siyoh" : "border-chegara"
        }`}
      >
        <Ikona nomi="qidiruv" />
        <span className="sr-only">{t("Taom qidirish")}</span>
        {/* `type="text"`: brauzerning o'z tozalash belgisi chiqmasin — prototipdagi bitta "x" qoladi. */}
        <input
          type="text"
          enterKeyHint="search"
          value={sorov}
          onChange={(hodisa) => setSorov(hodisa.target.value)}
          onFocus={() => setFokus(true)}
          onBlur={() => setFokus(false)}
          placeholder={t("Osh, manti, somsa…")}
          className="w-full min-w-0 bg-transparent py-3 text-asosiy text-siyoh outline-none placeholder:text-matn-3"
        />
        {sorov && (
          <button
            type="button"
            onClick={() => setSorov("")}
            aria-label={t("Tozalash")}
            className="-mr-2 flex size-9 shrink-0 items-center justify-center rounded-chip"
          >
            <Ikona nomi="yopish" />
          </button>
        )}
      </label>

      {natijalar.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-4 text-center">
          <p className="text-karta-sarlavha">{t("«{0}» topilmadi", sorov.trim())}</p>
          <p className="text-izoh text-matn-2">
            {t("Taomni matn bilan tasvirlab bering yoki rasmga oling.")}
          </p>
          <div className="flex w-full flex-col gap-2">
            <TugmaHavola href={tasvirlashManzili}>{t("Matn bilan tasvirlash")}</TugmaHavola>
            <TugmaHavola korinish="uchinchi" href="/kamera">
              {t("Rasmga olish")}
            </TugmaHavola>
          </div>
        </div>
      ) : (
        <section className="flex flex-col gap-2">
          <h2 className="text-karta-sarlavha">
            {sorov.trim() ? t("Natijalar") : t("Oxirgi qo'shilganlar")}
          </h2>
          <ul className="flex flex-col gap-3">
            {natijalar.map((taom) => (
              <TaomKartasi key={taom.id} taom={taom} />
            ))}
          </ul>
        </section>
      )}

      <TugmaHavola korinish="uchinchi" href={tasvirlashManzili}>
        {t("Matn bilan tasvirlash")}
      </TugmaHavola>
    </div>
  );
}
