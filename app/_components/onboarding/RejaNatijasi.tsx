"use client";

import { useState } from "react";
import { QadamSarlavhasi } from "@/app/_components/onboarding/QadamSarlavhasi";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";
import type { Kalit } from "@/lib/lugat/tarjima";
import { normaHisobi } from "@/lib/services/norma-hisob";
import type { Forma } from "@/lib/services/onboarding-forma";
import { NATIJA_QADAMI } from "@/lib/services/onboarding-hisob";
import { raqam } from "@/lib/services/taom-hisob";

const KARTA = "w-full rounded-karta border border-karta-chegara bg-karta p-4";

const MAKROLAR: readonly { kalit: "oqsil" | "yog" | "uglevod"; nomi: Kalit }[] = [
  { kalit: "oqsil", nomi: "Oqsil" },
  { kalit: "yog", nomi: "Yog'" },
  { kalit: "uglevod", nomi: "Uglevod" },
];

/** Prototipdagi Note: karta ichidagi izoh; `sarlavha` berilsa bosib ochiladi. */
function Izoh({ sarlavha, children }: { sarlavha?: string; children: React.ReactNode }) {
  const [ochiq, setOchiq] = useState(false);
  const matn = <p className="text-izoh text-matn-2">{children}</p>;
  if (!sarlavha) return <div className={KARTA}>{matn}</div>;

  return (
    <div className={`${KARTA} flex flex-col gap-2`}>
      <button
        type="button"
        onClick={() => setOchiq(!ochiq)}
        aria-expanded={ochiq}
        className="-my-2 flex min-h-11 w-full items-center gap-2 text-left text-karta-sarlavha"
      >
        <span className="min-w-0 flex-1">{sarlavha}</span>
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
          className={`shrink-0 text-matn-2 transition-transform duration-[250ms] ${ochiq ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {ochiq && matn}
    </div>
  );
}

function Pastki({ children }: { children: React.ReactNode }) {
  return (
    <footer className="sticky bottom-0 border-t border-chegara bg-fon px-4 pb-[max(24px,var(--xavfsiz-past))] pt-3">
      {children}
    </footer>
  );
}

/**
 * 11-qadam (prototip O12) — natija, ikki qismda: kunlik norma, keyin makrolar. Sonlar forma
 * javoblaridan `normaHisobi` bilan hisoblanadi — bazaga reja ham shu funksiyadan yozilgan.
 * Har qismda "taxminiy" so'zi turadi. Muddat prognozi ataylab yo'q: va'da bo'lib qolmasin,
 * o'rniga intizom haqidagi matn.
 */
export function RejaNatijasi({
  forma,
  onOrqaga,
  onBoshlash,
}: {
  forma: Forma;
  onOrqaga: () => void;
  onBoshlash: () => void;
}) {
  const { t } = useTarjima();
  const [qism, setQism] = useState<1 | 2>(1);
  const norma = normaHisobi(forma);

  // Savollar to'liq javob berilmaguncha bu yerga yetib kelinmaydi — baribir bo'sh son ko'rsatilmaydi.
  if (!norma) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <QadamSarlavhasi qadam={NATIJA_QADAMI} onOrqaga={onOrqaga} />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
          <p className="text-karta-sarlavha">{t("Ma'lumotni yuklab bo'lmadi")}</p>
        </div>
      </main>
    );
  }

  if (qism === 1) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <QadamSarlavhasi qadam={NATIJA_QADAMI} onOrqaga={onOrqaga} />
        <div className="flex flex-1 flex-col items-center gap-6 px-4 pb-6 pt-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="font-display text-raqam tabular-nums">{raqam(norma.kaloriya)}</h1>
            <p className="text-izoh text-matn-2">{t("kunlik taxminiy maqsadingiz, kkal")}</p>
          </div>
          <Izoh sarlavha={t("Nega shunday?")}>
            {t(
              "Bo'y, vazn, yosh, jins va faollikdan kunlik sarf hisoblandi, keyin maqsadingizga qarab tuzatildi. Raqam taxminiy va profil o'zgarsa qayta hisoblanadi.",
            )}
          </Izoh>
          {norma.chegaralandi && (
            <Izoh>
              {t("Hisob pastki chegaradan past chiqdi — xavfsiz chegara qiymati berildi.")}
            </Izoh>
          )}
          {norma.jinsAytilmagan && (
            <Izoh>{t("Jins ko'rsatilmagani uchun taxmin kengroq.")}</Izoh>
          )}
        </div>
        <Pastki>
          <Tugma
            onClick={() => {
              setQism(2);
              window.scrollTo(0, 0);
            }}
          >
            {t("Davom etish")}
          </Tugma>
        </Pastki>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <QadamSarlavhasi qadam={NATIJA_QADAMI} onOrqaga={() => setQism(1)} />
      <div className="flex flex-1 flex-col gap-6 px-4 pb-6 pt-2">
        <h1 className="font-display text-sarlavha">{t("Makrolar taqsimlandi")}</h1>
        <ul className="flex flex-col gap-3">
          {MAKROLAR.map(({ kalit, nomi }) => (
            <li key={kalit} className={`${KARTA} flex items-center gap-3`}>
              <span className="min-w-0 flex-1 text-karta-sarlavha">{t(nomi)}</span>
              <span className="text-karta-sarlavha tabular-nums">
                {t("{0} g", norma.makrolar[kalit])}
              </span>
              <span className="w-10 text-right text-izoh tabular-nums text-matn-2">
                {norma.foizlar[kalit]}%
              </span>
            </li>
          ))}
        </ul>
        <p className="text-asosiy">
          {t(
            "Natijaning sabablaridan biri — har kungi intizom. Bugungi kichik qadam — ertangi katta o'zgarish.",
          )}
        </p>
        <p className="text-izoh text-matn-2">{t("Bu tibbiy tavsiya emas. Qiymatlar taxminiy.")}</p>
      </div>
      <Pastki>
        <Tugma onClick={onBoshlash}>{t("Boshlaymiz")}</Tugma>
      </Pastki>
    </main>
  );
}
