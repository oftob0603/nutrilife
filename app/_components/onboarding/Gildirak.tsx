"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type Yonalish = "tik" | "yotiq";

/** Bitta qiymat egallaydigan joy: tik g'ildirakda qator balandligi, yotiqda ustun kengligi. */
const OLCHAM: Record<Yonalish, number> = { tik: 40, yotiq: 72 };

type KatakHolati = "faol" | "yaqin" | "oddiy";

const KATAK_RANGI: Record<KatakHolati, string> = {
  faol: "text-karta-sarlavha text-siyoh",
  yaqin: "text-asosiy text-matn-2",
  oddiy: "text-asosiy text-matn-3",
};

/** Alohida `memo`: aylantirishda yuzlab katakdan faqat holati o'zgargan 3–4 tasi qayta chiziladi. */
const Katak = memo(function Katak({
  indeks,
  matn,
  holat,
  yonalish,
  onBos,
}: {
  indeks: number;
  matn: string;
  holat: KatakHolati;
  yonalish: Yonalish;
  onBos: (indeks: number) => void;
}) {
  return (
    <div
      onClick={() => onBos(indeks)}
      className={`flex shrink-0 snap-center items-center justify-center tabular-nums transition-colors duration-150 ${
        yonalish === "tik" ? "h-10" : "basis-[72px]"
      } ${KATAK_RANGI[holat]}`}
    >
      {matn}
    </div>
  );
});

/**
 * Aylanuvchi tanlagich (prototipdagi AgeWheel / ValueWheel ko'rinishi): markazdagi qiymat —
 * tanlangani, qo'shnilari xira ko'rinib turadi. Brauzerning o'z scroll-snap'iga tayanadi —
 * inersiya va chekkadagi qaytish tayyor keladi.
 *
 * `tanlangan = -1` — hali tanlanmagan: g'ildirak `boshlangich` qiymatda turadi, lekin hech
 * narsa belgilanmaydi va javob sifatida yuborilmaydi — hech kim tanlamagan bo'y saqlanib
 * qolmasin. Aylantirish yoki qiymat ustiga bosish tanlaydi.
 */
export function Gildirak({
  nomi,
  qiymatlar,
  tanlangan,
  boshlangich,
  yonalish,
  onTanla,
}: {
  /** Ekran o'quvchisi uchun nom. */
  nomi: string;
  qiymatlar: readonly string[];
  tanlangan: number;
  boshlangich: number;
  yonalish: Yonalish;
  onTanla: (indeks: number) => void;
}) {
  const olcham = OLCHAM[yonalish];
  const korinadigan = tanlangan >= 0 ? tanlangan : boshlangich;

  const aylanma = useRef<HTMLDivElement>(null);
  // G'ildirak oxirgi marta o'zi turgan (yoki xabar bergan) indeks. Dastur qo'ygan holatning
  // "aks-sadosi" bo'lgan scroll hodisasi shu bilan taniladi va qayta xabar berilmaydi.
  const joylashgan = useRef<number | null>(null);
  const onTanlaRef = useRef(onTanla);
  const [markaz, setMarkaz] = useState(korinadigan);

  useEffect(() => {
    onTanlaRef.current = onTanla;
  }, [onTanla]);

  // Tashqaridan kelgan qiymatga (boshlang'ich holat, tozalash) g'ildirakni to'g'rilaydi.
  useLayoutEffect(() => {
    const el = aylanma.current;
    if (!el || joylashgan.current === korinadigan) return;
    joylashgan.current = korinadigan;
    if (yonalish === "tik") el.scrollTop = korinadigan * olcham;
    else el.scrollLeft = korinadigan * olcham;
  }, [korinadigan, olcham, yonalish]);

  function aylandi() {
    const el = aylanma.current;
    if (!el) return;
    const joy = yonalish === "tik" ? el.scrollTop : el.scrollLeft;
    const indeks = Math.max(0, Math.min(qiymatlar.length - 1, Math.round(joy / olcham)));
    setMarkaz(indeks);
    if (indeks !== joylashgan.current) {
      joylashgan.current = indeks;
      onTanlaRef.current(indeks);
    }
  }

  const tanla = useCallback(
    (indeks: number) => {
      const el = aylanma.current;
      if (!el || indeks < 0 || indeks >= qiymatlar.length) return;
      joylashgan.current = indeks;
      setMarkaz(indeks);
      onTanlaRef.current(indeks);
      const joy = indeks * olcham;
      el.scrollTo(yonalish === "tik" ? { top: joy, behavior: "smooth" } : { left: joy, behavior: "smooth" });
    },
    [olcham, qiymatlar.length, yonalish],
  );

  function tugmaBosildi(hodisa: React.KeyboardEvent) {
    const qadam =
      hodisa.key === "ArrowUp" || hodisa.key === "ArrowLeft"
        ? -1
        : hodisa.key === "ArrowDown" || hodisa.key === "ArrowRight"
          ? 1
          : 0;
    if (qadam === 0) return;
    hodisa.preventDefault();
    tanla(markaz + qadam);
  }

  const belgilangan = tanlangan >= 0;
  const tik = yonalish === "tik";

  return (
    <div
      className={`relative overflow-hidden rounded-karta border border-chegara bg-karta ${
        tik ? "h-[200px]" : "h-16"
      }`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute rounded-chip bg-fon ${
          tik ? "inset-x-2 top-20 h-10" : "inset-y-2 left-1/2 w-[72px] -translate-x-1/2"
        }`}
      />
      <div
        ref={aylanma}
        role="slider"
        tabIndex={0}
        aria-label={nomi}
        aria-orientation={tik ? "vertical" : "horizontal"}
        aria-valuemin={Number(qiymatlar[0])}
        aria-valuemax={Number(qiymatlar[qiymatlar.length - 1])}
        aria-valuenow={Number(qiymatlar[markaz])}
        aria-valuetext={belgilangan ? qiymatlar[markaz] : "Tanlanmagan"}
        onScroll={aylandi}
        onKeyDown={tugmaBosildi}
        className={`relative h-full outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          tik
            ? "snap-y snap-mandatory overflow-y-auto [mask-image:linear-gradient(transparent,#000_24%,#000_76%,transparent)]"
            : "flex snap-x snap-mandatory overflow-x-auto [mask-image:linear-gradient(90deg,transparent,#000_18%,#000_82%,transparent)]"
        }`}
      >
        {/* Chekka bo'shliq: birinchi va oxirgi qiymat ham markazga yeta olsin. */}
        <div aria-hidden="true" className={tik ? "h-20" : "shrink-0 basis-[calc(50%-36px)]"} />
        {qiymatlar.map((matn, indeks) => (
          <Katak
            key={matn}
            indeks={indeks}
            matn={matn}
            yonalish={yonalish}
            onBos={tanla}
            holat={
              !belgilangan ? "oddiy" : indeks === markaz ? "faol" : Math.abs(indeks - markaz) === 1 ? "yaqin" : "oddiy"
            }
          />
        ))}
        <div aria-hidden="true" className={tik ? "h-20" : "shrink-0 basis-[calc(50%-36px)]"} />
      </div>
    </div>
  );
}

/** G'ildirak maydoni: yorliq va birlik ustida, ostida xato yoki ogohlantirish va (bo'lsa) amallar. */
export function GildirakMaydoni({
  nomi,
  birlik,
  xato,
  ogohlantirish,
  amallar,
  children,
}: {
  nomi: string;
  birlik?: string;
  /** To'sadi — qizil. */
  xato?: string | null;
  /** To'smaydi — kulrang. */
  ogohlantirish?: string | null;
  amallar?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between text-izoh text-matn-2">
        <span>{nomi}</span>
        {birlik && <span>{birlik}</span>}
      </div>
      {children}
      {xato ? (
        <p role="alert" className="text-izoh text-xato">
          {xato}
        </p>
      ) : (
        ogohlantirish && <p className="text-izoh text-matn-2">{ogohlantirish}</p>
      )}
      {amallar}
    </div>
  );
}
