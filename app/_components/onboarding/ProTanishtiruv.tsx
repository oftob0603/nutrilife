"use client";

import { useState } from "react";
import { QadamSarlavhasi } from "@/app/_components/onboarding/QadamSarlavhasi";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";
import { ASOSIY_IMKONIYATLAR_SONI, PRO_IMKONIYATLARI } from "@/lib/pro-imkoniyatlar";
import { PRO_QADAMI } from "@/lib/services/onboarding-hisob";

const KARTA = "w-full rounded-karta border border-karta-chegara bg-karta";

/**
 * 12-qadam (prototip O13) — onboarding oxiri: PRO bilan qisqa tanishtiruv. Bir marta
 * ko'rinadi — onboarding serverda 9-savolda yakunlangan, ilova qayta ochilsa to'g'ri Home chiqadi.
 * Imkoniyatlar umumiy ro'yxatdan o'qiladi (tariflar ekrani hammasini, bu yer asosiylarini
 * ko'rsatadi). "Hozir emas" doim bor: FREE hech narsa yo'qotmaydi.
 */
export function ProTanishtiruv({
  onOrqaga,
  onPro,
  onHozirEmas,
}: {
  onOrqaga: () => void;
  onPro: () => void;
  onHozirEmas: () => void;
}) {
  const { t } = useTarjima();
  // Bosilgan tugma keyingi sahifa ochilguncha band turadi.
  const [otilmoqda, setOtilmoqda] = useState<"pro" | "home" | null>(null);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <QadamSarlavhasi qadam={PRO_QADAMI} onOrqaga={onOrqaga} />
      <div className="flex flex-1 flex-col gap-6 px-4 pb-6 pt-2">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-sarlavha">{t("PRO")}</h1>
          <p className="text-asosiy text-matn-2">
            {t("Ovqatlanishingizni chuqurroq kuzatib, aniqroq natijaga erishing.")}
          </p>
        </div>

        <ul className={`${KARTA} overflow-hidden`}>
          {PRO_IMKONIYATLARI.slice(0, ASOSIY_IMKONIYATLAR_SONI).map(({ id, nomi }) => (
            <li
              key={id}
              className="flex items-center gap-3 border-t border-chegara px-4 py-3 first:border-t-0"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0 text-matn-2"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span className="min-w-0 flex-1 text-asosiy">{t(nomi)}</span>
            </li>
          ))}
        </ul>

        <div className={`${KARTA} flex flex-col gap-2 p-4`}>
          <p className="text-karta-sarlavha">{t("FREE bilan ham ishlaydi")}</p>
          <p className="text-izoh text-matn-2">
            {t("3 ta bepul AI skan · cheksiz qo'lda kiritish · kunlik doira")}
          </p>
        </div>
      </div>

      <footer className="sticky bottom-0 flex flex-col gap-2 border-t border-chegara bg-fon px-4 pb-[max(24px,var(--xavfsiz-past))] pt-3">
        <Tugma
          korinish="pro"
          yuklanmoqda={otilmoqda === "pro"}
          disabled={otilmoqda !== null}
          onClick={() => {
            setOtilmoqda("pro");
            onPro();
          }}
        >
          {t("PRO ni ochish")}
        </Tugma>
        <Tugma
          korinish="uchinchi"
          yuklanmoqda={otilmoqda === "home"}
          disabled={otilmoqda !== null}
          onClick={() => {
            setOtilmoqda("home");
            onHozirEmas();
          }}
        >
          {t("Hozir emas")}
        </Tugma>
      </footer>
    </main>
  );
}
