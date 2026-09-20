"use client";

import Link from "next/link";
import { useState } from "react";
import { Tahlil } from "@/app/_components/Tahlil";
import { Tugma } from "@/app/_components/Tugma";
import { MATN_CHEGARASI } from "@/lib/services/skan-hisob";

function ChapStrelka() {
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
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/**
 * Matn bilan tasvirlash — E4 "topilmadi" holatidan chiqish yo'li. Yuborilgach rasm oqimi
 * bilan bir xil tahlil ekrani (E6) ochiladi; bekor qilinsa yozilgan matn joyida qoladi.
 */
export function Tasvirlash({ boshlangich }: { boshlangich: string }) {
  const [matn, setMatn] = useState(boshlangich);
  const [yuborilgan, setYuborilgan] = useState<string | null>(null);

  if (yuborilgan) {
    return <Tahlil matn={yuborilgan} onBekor={() => setYuborilgan(null)} />;
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-8">
      <header className="flex items-center gap-2 py-4">
        <Link
          href="/taomlar"
          aria-label="Orqaga"
          className="-ml-3 flex size-11 items-center justify-center rounded-chip text-siyoh"
        >
          <ChapStrelka />
        </Link>
        <h1 className="min-w-0 truncate text-sarlavha">Matn bilan tasvirlash</h1>
      </header>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-izoh text-matn-2">
            Nima yedingiz? Taom nomi va taxminiy miqdorini yozing.
          </span>
          <textarea
            value={matn}
            onChange={(hodisa) => setMatn(hodisa.target.value)}
            maxLength={MATN_CHEGARASI}
            rows={4}
            placeholder="Masalan: bir kosa mastava va yarimta non"
            className="w-full resize-none rounded-karta border border-chegara bg-karta p-4 text-asosiy outline-none placeholder:text-matn-3"
          />
        </label>

        <Tugma onClick={() => setYuborilgan(matn.trim())} disabled={!matn.trim()}>
          Tahlil qilish
        </Tugma>
      </div>
    </main>
  );
}
