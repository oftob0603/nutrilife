"use client";

import { useState } from "react";
import {
  kunMatni,
  oqYorligi,
  qiymatMatni,
  yorliqIndekslari,
  type Davr,
  type MetrikaTavsifi,
  type Nuqta,
} from "@/lib/services/admin-statistika-hisob";

const BALANDLIK = 96;
const CHEKKA = 6;

/**
 * A10 metrika kartasi (prototip `MetricChart`): bitta metrika, o'z seriya rangida, haqiqiy sana
 * o'qi. Hamma nuqta chiziladi, faqat yorliqlar siyraklashadi. Sichqoncha yoki barmoq ustida
 * turgan kunning aniq qiymati raqam o'rnida chiqadi. Null nuqta (retention'da ro'yxatsiz yoki
 * yetilmagan kun) chiziqni uzadi — nol deb chizilmaydi.
 */
export function MetrikaGrafigi({
  tavsif,
  nuqtalar,
  jami,
  davr,
}: {
  tavsif: MetrikaTavsifi;
  nuqtalar: Nuqta[];
  jami: number | null;
  davr: Davr;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const rang = `var(--metrika-${tavsif.seriya})`;

  const qiymatlar = nuqtalar.map((n) => n.qiymat).filter((q): q is number => q !== null);
  const min = qiymatlar.length ? Math.min(...qiymatlar) : 0;
  const max = qiymatlar.length ? Math.max(...qiymatlar) : 0;
  const oraliq = max - min || 1;
  const x = (i: number) => (i / Math.max(1, nuqtalar.length - 1)) * 100;
  const y = (q: number) => CHEKKA + (1 - (q - min) / oraliq) * (BALANDLIK - CHEKKA * 2);

  // Uzluksiz bo'laklar: null'da yangi "M" boshlanadi, soya ham bo'lak-bo'lak.
  const bolaklar: string[] = [];
  const soyalar: string[] = [];
  let joriy: string[] = [];
  const yop = () => {
    if (joriy.length === 0) return;
    const chiziq = joriy.join(" ");
    bolaklar.push(chiziq);
    if (joriy.length > 1) {
      const birinchiX = joriy[0].split(" ")[1];
      const oxirgiX = joriy[joriy.length - 1].split(" ")[1];
      soyalar.push(`${chiziq} L${oxirgiX} ${BALANDLIK} L${birinchiX} ${BALANDLIK} Z`);
    }
    joriy = [];
  };
  nuqtalar.forEach((n, i) => {
    if (n.qiymat === null) return yop();
    joriy.push(`${joriy.length ? "L" : "M"} ${x(i).toFixed(2)} ${y(n.qiymat).toFixed(2)}`);
  });
  yop();

  const tanlangan = hover !== null ? nuqtalar[hover] : null;
  const yorliqlar = yorliqIndekslari(nuqtalar.length, davr);

  const kursor = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const ulush = (e.clientX - r.left) / r.width;
    setHover(Math.max(0, Math.min(nuqtalar.length - 1, Math.round(ulush * (nuqtalar.length - 1)))));
  };

  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-karta border border-karta-chegara bg-karta p-4">
      <span className="flex min-w-0 items-center gap-2 text-izoh text-matn-2">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ background: rang }} />
        <span className="min-w-0 flex-1 truncate">{tavsif.nomi}</span>
      </span>
      <span className="flex min-h-7 items-baseline gap-2">
        <span className="text-stat tabular-nums">
          {tanlangan ? qiymatMatni(tanlangan.qiymat, tavsif.birlik) : qiymatMatni(jami, tavsif.birlik)}
        </span>
        <span className="text-izoh text-matn-2 tabular-nums">{tanlangan ? kunMatni(tanlangan.sana) : `${davr} kun`}</span>
      </span>
      <div className="relative" style={{ height: BALANDLIK }}>
        <svg
          viewBox={`0 0 100 ${BALANDLIK}`}
          preserveAspectRatio="none"
          className="block h-full w-full touch-none overflow-visible"
          onPointerMove={kursor}
          onPointerDown={kursor}
          onPointerLeave={() => setHover(null)}
          aria-hidden="true"
        >
          {soyalar.map((d, i) => (
            <path key={`s${i}`} d={d} fill={rang} opacity="0.1" stroke="none" />
          ))}
          {bolaklar.map((d, i) => (
            <path
              key={`b${i}`}
              d={d}
              fill="none"
              stroke={rang}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {hover !== null && (
            <line
              x1={x(hover)}
              y1="0"
              x2={x(hover)}
              y2={BALANDLIK}
              stroke="var(--chegara)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
        {tanlangan && tanlangan.qiymat !== null && (
          // Nuqta SVG'dan tashqarida: preserveAspectRatio="none" aylanani ellipsga cho'zardi.
          <span
            aria-hidden="true"
            className="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] bg-karta"
            style={{ left: `${x(hover!)}%`, top: `${(y(tanlangan.qiymat) / BALANDLIK) * 100}%`, borderColor: rang }}
          />
        )}
      </div>
      <div className="flex justify-between gap-1">
        {yorliqlar.map((i) => (
          <span key={nuqtalar[i].sana} className="whitespace-nowrap text-belgi text-matn-3 tabular-nums">
            {oqYorligi(nuqtalar[i].sana, davr)}
          </span>
        ))}
      </div>
    </div>
  );
}
