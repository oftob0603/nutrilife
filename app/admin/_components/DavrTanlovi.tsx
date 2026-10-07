"use client";

import { useRouter } from "next/navigation";
import { DAVRLAR, type Davr } from "@/lib/services/admin-statistika-hisob";

/** Statistika manzili: standart 30 kun yozilmaydi. */
export function statistikaManzili(davr: Davr): string {
  return davr === 30 ? "/admin/statistika" : `/admin/statistika?davr=${davr}`;
}

/**
 * A10 davr tanlagichi (prototip `SegmentedControl`): 7 · 30 · 90 kun. Tanlov manzilda turadi —
 * sahifa serverda qayta so'raladi, A9 til segmenti bilan bir ko'rinishda.
 */
export function DavrTanlovi({ davr }: { davr: Davr }) {
  const router = useRouter();
  return (
    <div role="tablist" aria-label="Vaqt oralig'i" className="flex w-full max-w-[320px] rounded-chip border border-chegara bg-karta p-1">
      {DAVRLAR.map((d) => (
        <button
          key={d}
          type="button"
          role="tab"
          aria-selected={davr === d}
          onClick={() => router.replace(statistikaManzili(d))}
          className={`min-h-10 flex-1 rounded-chip px-3 text-asosiy font-medium tabular-nums transition-colors ${
            davr === d ? "bg-siyoh text-on-siyoh" : "text-siyoh"
          }`}
        >
          {d} kun
        </button>
      ))}
    </div>
  );
}
