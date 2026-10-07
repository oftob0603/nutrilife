"use client";

import { useState } from "react";
import { som } from "@/lib/services/admin-statistika-hisob";

export type Ustun = {
  kalit: string;
  /** Ustun ostidagi qisqa yorliq: "Okt" yoki "Du". */
  yorliq: string;
  /** Hover'da raqam yonida: "Oktabr" yoki "7-oktabr, seshanba". */
  toliq: string;
  summa: number;
};

/**
 * Daromad ustunlari (prototip `RevenueBars`). Chiziq emas — oy va kun alohida chelaklar, ular
 * orasida o'lchanmagan sur'at yo'q. Eng baland ustun o'lchovni belgilaydi, hover'da tanlangan
 * chelakning summasi chiqadi, qolganlari xiralashadi.
 */
export function DaromadUstunlari({
  nomi,
  seriya,
  ustunlar,
  zich = false,
}: {
  nomi: string;
  seriya: 1 | 2 | 3 | 4 | 5;
  ustunlar: Ustun[];
  zich?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const rang = `var(--metrika-${seriya})`;
  const max = Math.max(1, ...ustunlar.map((u) => u.summa));
  const jami = ustunlar.reduce((s, u) => s + u.summa, 0);
  const tanlangan = hover !== null ? ustunlar[hover] : null;
  const oraliq = zich ? "gap-2" : "gap-1";

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-karta border border-karta-chegara bg-karta p-4">
      <span className="flex min-w-0 items-center gap-2 text-izoh text-matn-2">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ background: rang }} />
        <span className="min-w-0 flex-1 truncate">{nomi}</span>
      </span>
      <span className="flex min-h-7 flex-wrap items-baseline gap-2">
        <span className="text-stat tabular-nums">{som(tanlangan ? tanlangan.summa : jami)}</span>
        <span className="text-izoh text-matn-2 tabular-nums">{tanlangan ? tanlangan.toliq : "jami"}</span>
      </span>
      <div
        className={`flex items-end ${oraliq}`}
        style={{ height: zich ? 96 : 120 }}
        onPointerLeave={() => setHover(null)}
        aria-hidden="true"
      >
        {ustunlar.map((u, i) => (
          <span
            key={u.kalit}
            onPointerEnter={() => setHover(i)}
            onPointerDown={() => setHover(i)}
            className="flex h-full min-w-0 flex-1 items-end"
          >
            <span
              className="w-full rounded-chip transition-opacity"
              style={{
                height: `${Math.max(2, (u.summa / max) * 100)}%`,
                background: rang,
                opacity: hover === null || hover === i ? 1 : 0.35,
              }}
            />
          </span>
        ))}
      </div>
      <div className={`flex ${oraliq}`}>
        {ustunlar.map((u) => (
          <span key={u.kalit} className="min-w-0 flex-1 truncate text-center text-belgi text-matn-3 tabular-nums">
            {u.yorliq}
          </span>
        ))}
      </div>
    </div>
  );
}
