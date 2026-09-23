"use client";

import { OrqagaTugma } from "@/app/_components/OrqagaTugma";
import { useState } from "react";
import { SkanLimitiQatori } from "@/app/_components/SkanLimitiQatori";
import { Tahlil } from "@/app/_components/Tahlil";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";
import { useSkanLimiti } from "@/app/_components/useSkanLimiti";
import { limitKorinishi, MATN_CHEGARASI } from "@/lib/services/skan-hisob";

function ChapStrelka() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/**
 * Matn bilan tasvirlash — E2'dagi "Qo'lda qo'shish" ochadigan ekran (DECISIONS 2026-09-22:
 * taom bazasi emas, matn maydoni) va E4 "topilmadi" holatidan chiqish yo'li. Yuborilgach rasm
 * oqimi bilan bir xil tahlil ekrani (E6) ochiladi; bekor qilinsa yozilgan matn joyida qoladi.
 * Matnli tasvir ham AI skan — rasm bilan bitta limit; tugagan bo'lsa tugma o'chadi.
 */
export function Tasvirlash({ boshlangich }: { boshlangich: string }) {
  const { t } = useTarjima();
  const [matn, setMatn] = useState(boshlangich);
  const [yuborilgan, setYuborilgan] = useState<string | null>(null);
  // Tahlildan qaytilganda son yangilansin — forma ko'ringan har safar qayta so'raladi.
  const limit = useSkanLimiti(yuborilgan === null);
  const skanYopiq = typeof limit === "object" && limit !== null && limitKorinishi(limit).tugagan;

  if (yuborilgan) {
    return <Tahlil matn={yuborilgan} onBekor={() => setYuborilgan(null)} />;
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-8">
      <header className="flex items-center gap-3 py-4">
        <OrqagaTugma
          nomi={t("Orqaga")}
          href="/"
          className="-ml-3 flex size-11 items-center justify-center rounded-chip text-siyoh"
        >
          <ChapStrelka />
        </OrqagaTugma>
        <h1 className="min-w-0 truncate text-sarlavha">{t("Matn bilan tasvirlash")}</h1>
      </header>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-izoh text-matn-2">
            {t("Nima yedingiz? Taom nomi va og'irligini (grammda) yozing.")}
          </span>
          <textarea
            value={matn}
            onChange={(hodisa) => setMatn(hodisa.target.value)}
            maxLength={MATN_CHEGARASI}
            rows={4}
            placeholder={t("Masalan: mastava 400 g va yarimta non (100 g)")}
            className="w-full resize-none rounded-karta border border-chegara bg-karta p-4 text-asosiy outline-none placeholder:text-matn-3"
          />
        </label>

        <Tugma onClick={() => setYuborilgan(matn.trim())} disabled={!matn.trim() || skanYopiq}>
          {t("Tahlil qilish")}
        </Tugma>
        <SkanLimitiQatori limit={limit} />
      </div>
    </main>
  );
}
