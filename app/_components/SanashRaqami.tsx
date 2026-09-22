"use client";

import { useEffect, useRef, useState } from "react";

const DAVOMIYLIK = 700;

/**
 * Sanab to'ladigan raqam (prototip `CountUp`): qiymat o'zgarganda eskisidan yangisiga
 * yumshoq o'tadi, `boshlangich` berilsa birinchi chizilishda ham shundan boshlaydi.
 * Kam harakat sozlamasida darhol yakuniy qiymat. Matnni `format` beradi — bu yerda faqat son.
 */
export function SanashRaqami({
  qiymat,
  boshlangich,
  format,
  className,
}: {
  qiymat: number;
  boshlangich?: number;
  format: (son: number) => string;
  className?: string;
}) {
  const [korinadigan, setKorinadigan] = useState(boshlangich ?? qiymat);
  const oldingi = useRef(boshlangich ?? qiymat);

  useEffect(() => {
    const kamHarakat = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

  return <span className={`tabular-nums ${className ?? ""}`}>{format(Math.round(korinadigan))}</span>;
}
