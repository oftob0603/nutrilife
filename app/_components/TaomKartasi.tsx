"use client";

import Link from "next/link";
import { TaomRasmi } from "@/app/_components/TaomRasmi";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { olchovIzohi, taomNomi, type Taom } from "@/lib/services/taom-hisob";

function OngStrelka() {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function TaomKartasi({ taom }: { taom: Taom }) {
  const tarjimon = useTarjima();

  return (
    <li>
      <Link
        href={`/taomlar/${taom.id}`}
        className="flex items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-4"
      >
        <TaomRasmi rasm={taom.rasm} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-karta-sarlavha">{taomNomi(taom, tarjimon.til)}</p>
          <p className="mt-1 text-izoh text-matn-2 tabular-nums">{olchovIzohi(taom, tarjimon)}</p>
        </div>
        <OngStrelka />
      </Link>
    </li>
  );
}
