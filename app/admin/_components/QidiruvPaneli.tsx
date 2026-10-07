"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Belgi } from "./Belgi";

/** Yozilgandan keyin so'rov ketguncha kutish — har harfda sahifa qayta so'ralmasin. */
const KUTISH_MS = 300;

/** Ro'yxat manzili: bo'sh qidiruv va "hammasi" yozilmaydi, sahifa 1 dan boshlanadi. */
function manzil(asos: string, q: string, filtr: string): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (filtr !== "hammasi") params.set("filtr", filtr);
  const satr = params.toString();
  return satr ? `${asos}?${satr}` : asos;
}

/**
 * Ro'yxat qidiruv maydoni va filtr chiplari (prototip `SearchField` + `Chip`) — A2 va A6 bitta
 * komponent: `asos` ro'yxat manzili, `filtrlar` chiplar tartibi, `nomlar` ularning matni. Holat manzilda
 * turadi — sahifa serverda qayta so'raladi, yangilash va orqaga tugmasi ishlayveradi.
 * `q` — manzildagi tozalangan qidiruv; `yuborilgan` — biz oxirgi marta manzilga yuborgan
 * matn: manzil tashqaridan o'zgarsa (orqaga tugmasi) maydon unga ergashadi, o'zimiz
 * yuborganimiz qaytib kelsa yozilayotgan matn ustidan yozilmaydi.
 */
export function QidiruvPaneli<F extends string>({
  q,
  filtr,
  asos,
  filtrlar,
  nomlar,
  joyMatni,
  yorliq,
}: {
  q: string;
  filtr: F;
  asos: string;
  filtrlar: readonly F[];
  nomlar: Record<F, string>;
  joyMatni: string;
  yorliq: string;
}) {
  const router = useRouter();
  const [matn, setMatn] = useState(q);
  const [yuborilgan, setYuborilgan] = useState(q);
  const [oldingiQ, setOldingiQ] = useState(q);
  if (q !== oldingiQ) {
    setOldingiQ(q);
    if (q !== yuborilgan) {
      setMatn(q);
      setYuborilgan(q);
    }
  }

  useEffect(() => {
    const yangi = matn.trim();
    if (yangi === yuborilgan) return;
    const taymer = setTimeout(() => {
      setYuborilgan(yangi);
      router.replace(manzil(asos, yangi, filtr));
    }, KUTISH_MS);
    return () => clearTimeout(taymer);
  }, [matn, filtr, yuborilgan, router, asos]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex min-h-11 min-w-[280px] flex-1 items-center gap-2 rounded-karta border border-chegara bg-karta px-4 focus-within:border-siyoh">
        <span className="text-matn-2">
          <Belgi nomi="search" olcham={20} />
        </span>
        <input
          type="search"
          value={matn}
          onChange={(e) => setMatn(e.target.value)}
          placeholder={joyMatni}
          aria-label={yorliq}
          className="min-w-0 flex-1 bg-transparent py-3 text-asosiy text-siyoh outline-none placeholder:text-matn-3"
        />
        {matn && (
          <button
            type="button"
            onClick={() => setMatn("")}
            aria-label="Tozalash"
            className="inline-flex p-1 text-matn-2"
          >
            <Belgi nomi="x" />
          </button>
        )}
      </label>
      {filtrlar.map((f) => (
        <button
          key={f}
          type="button"
          aria-pressed={filtr === f}
          onClick={() => router.replace(manzil(asos, matn.trim(), f))}
          className={`min-h-11 rounded-chip border px-4 text-asosiy font-medium tabular-nums transition-colors ${
            filtr === f ? "border-siyoh bg-siyoh text-on-siyoh" : "border-chegara bg-karta text-siyoh"
          }`}
        >
          {nomlar[f]}
        </button>
      ))}
    </div>
  );
}
