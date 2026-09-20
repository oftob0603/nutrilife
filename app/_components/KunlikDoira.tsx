"use client";

import { useEffect, useRef, useState } from "react";
import { raqam } from "@/lib/services/taom-hisob";

const OLCHAM = 224;
const QALINLIK = 14; // DESIGN.md, 6-bo'lim
const RADIUS = (OLCHAM - QALINLIK) / 2;
const AYLANA = 2 * Math.PI * RADIUS;
const DAVOMIYLIK = 600;

/**
 * Kunlik doira: soat 12 dan boshlanadi, soat yo'nalishi bo'yicha to'ladi.
 * `boshlangich` berilsa, shu qiymatdan `qiymat`gacha to'ladi (E8'dagi asosiy lahza).
 */
export function KunlikDoira({
  qiymat,
  norma,
  boshlangich,
}: {
  qiymat: number;
  norma: number;
  boshlangich?: number;
}) {
  const [korinadigan, setKorinadigan] = useState(boshlangich ?? qiymat);
  const oldingi = useRef(boshlangich ?? qiymat);

  useEffect(() => {
    const kamHarakat = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const boshi = oldingi.current;
    oldingi.current = qiymat;

    if (kamHarakat || boshi === qiymat) {
      setKorinadigan(qiymat);
      return;
    }

    let kadr = 0;
    let vaqt: number | undefined;
    const qadam = (hozir: number) => {
      if (vaqt === undefined) vaqt = hozir;
      const nisbat = Math.min(1, (hozir - vaqt) / DAVOMIYLIK);
      const egri = 1 - Math.pow(1 - nisbat, 3);
      setKorinadigan(boshi + (qiymat - boshi) * egri);
      if (nisbat < 1) kadr = requestAnimationFrame(qadam);
    };
    kadr = requestAnimationFrame(qadam);
    return () => cancelAnimationFrame(kadr);
  }, [qiymat]);

  const ulush = norma > 0 ? Math.min(1, korinadigan / norma) : 0;
  const oshdi = korinadigan > norma;
  const qoldi = Math.max(0, norma - korinadigan);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: OLCHAM, height: OLCHAM }}>
        <svg
          width={OLCHAM}
          height={OLCHAM}
          className="block -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={OLCHAM / 2}
            cy={OLCHAM / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--chegara)"
            strokeWidth={QALINLIK}
          />
          <circle
            cx={OLCHAM / 2}
            cy={OLCHAM / 2}
            r={RADIUS}
            fill="none"
            stroke={oshdi ? "var(--xato)" : "var(--aksent)"}
            strokeWidth={QALINLIK}
            strokeLinecap="round"
            strokeDasharray={AYLANA}
            strokeDashoffset={AYLANA * (1 - ulush)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="font-display text-raqam tabular-nums">
            {raqam(korinadigan)}
          </span>
          <span className="text-izoh text-matn-2 tabular-nums">
            {raqam(norma)} dan
          </span>
        </div>
      </div>
      <span
        className={`text-izoh tabular-nums ${oshdi ? "text-xato" : "text-matn-2"}`}
      >
        {oshdi
          ? `Normadan oshdi — ${raqam(korinadigan - norma)} kkal`
          : `qoldi: ${raqam(qoldi)} kkal`}
      </span>
    </div>
  );
}
