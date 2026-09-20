"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Tugma } from "@/app/_components/Tugma";
import { rasmniYukla } from "@/lib/services/rasm-yuklash";

const PANELNI_OCH = "qoshish-panelini-och";

/** Bo'sh holatdagi "Ovqat qo'shish" — shu sahifadagi `QoshishPaneli` ni (E2) ochadi. */
export function QoshishTugmasi() {
  return (
    <Tugma onClick={() => window.dispatchEvent(new Event(PANELNI_OCH))}>
      Ovqat qo&apos;shish
    </Tugma>
  );
}

function Ikona({ nomi }: { nomi: "kamera" | "galereya" | "qolda" }) {
  const yollar = {
    kamera: (
      <>
        <path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
    galereya: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m21 16-5-5-5 5-2-2-6 6" />
      </>
    ),
    qolda: (
      <>
        <path d="M12 3v18M3 12h18" />
      </>
    ),
  };

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
      className="shrink-0"
    >
      {yollar[nomi]}
    </svg>
  );
}

function Qator({
  ikona,
  nomi,
  izoh,
  ochiq,
  onClick,
}: {
  ikona: "kamera" | "galereya" | "qolda";
  nomi: string;
  izoh: string;
  ochiq: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!ochiq}
      onClick={onClick}
      className={`flex min-h-16 w-full items-center gap-3 rounded-karta border border-chegara p-4 text-left ${
        ochiq ? "bg-karta text-siyoh" : "bg-transparent text-matn-3"
      }`}
    >
      <Ikona nomi={ikona} />
      <span className="min-w-0 flex-1">
        <span className="block text-karta-sarlavha">{nomi}</span>
        <span className="mt-1 block text-izoh text-matn-2">{izoh}</span>
      </span>
    </button>
  );
}

/**
 * E2 — ovqat qo'shish manbasini tanlash paneli (dizayn-tz E2). Kamera E3 ekranini
 * ochadi; galereya tizim rasm tanlagichini ochadi va tanlangan rasm yuklangach
 * tahlil sahifasiga o'tadi.
 */
export function QoshishPaneli() {
  const router = useRouter();
  const [ochiq, setOchiq] = useState(false);
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [xato, setXato] = useState<string | null>(null);
  const tanlagich = useRef<HTMLInputElement>(null);
  // Xatodan keyin "Qayta urinish" rasmni qayta tanlatmasdan yuboradi.
  const oxirgiRasm = useRef<Blob | null>(null);

  async function yubor(rasm: Blob) {
    oxirgiRasm.current = rasm;
    setXato(null);
    setYuklanmoqda(true);
    try {
      router.push(`/tahlil/${await rasmniYukla(rasm)}`);
    } catch (sabab) {
      setXato(sabab instanceof Error ? sabab.message : "Yuklanmadi");
      setYuklanmoqda(false);
    }
  }

  function yop() {
    if (yuklanmoqda) return;
    setOchiq(false);
    setXato(null);
  }

  // Panelni sahifadagi boshqa tugma ham ochadi (jurnalning bo'sh holati) — `QoshishTugmasi`.
  useEffect(() => {
    const och = () => setOchiq(true);
    window.addEventListener(PANELNI_OCH, och);
    return () => window.removeEventListener(PANELNI_OCH, och);
  }, []);

  useEffect(() => {
    if (!ochiq) return;
    const bosildi = (hodisa: KeyboardEvent) => {
      if (hodisa.key === "Escape") setOchiq(false);
    };
    window.addEventListener("keydown", bosildi);
    return () => window.removeEventListener("keydown", bosildi);
  }, [ochiq]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOchiq(true)}
        aria-label="Ovqat qo'shish"
        aria-expanded={ochiq}
        className="fixed bottom-6 right-[max(1rem,calc(50%-14rem))] flex size-14 items-center justify-center rounded-full bg-siyoh text-fon shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-transform active:scale-[0.98]"
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {ochiq && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ovqat qo'shish"
          className="fixed inset-0 z-10 flex flex-col justify-end"
        >
          <button
            type="button"
            aria-label="Yopish"
            onClick={yop}
            className="absolute inset-0 bg-parda"
          />

          <div className="relative mx-auto w-full max-w-md rounded-t-panel border border-karta-chegara bg-karta p-4 pb-8 motion-safe:animate-[panel_250ms_cubic-bezier(0.2,0,0,1)]">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-chegara" />
            <div className="flex flex-col gap-3">
              <Qator
                ikona="kamera"
                nomi="Kamera"
                izoh="Ovqatni rasmga oling"
                ochiq={!yuklanmoqda}
                onClick={() => router.push("/kamera")}
              />
              <Qator
                ikona="galereya"
                nomi="Galereya"
                izoh={yuklanmoqda ? "Rasm yuklanmoqda…" : "Tayyor rasmni tanlang"}
                ochiq={!yuklanmoqda}
                onClick={() => tanlagich.current?.click()}
              />
              <input
                ref={tanlagich}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(hodisa) => {
                  const rasm = hodisa.target.files?.[0];
                  // Xuddi shu rasm qayta tanlansa ham onChange ishlashi uchun.
                  hodisa.target.value = "";
                  if (rasm) void yubor(rasm);
                }}
              />
              <Qator
                ikona="qolda"
                nomi="Qo'lda qo'shish"
                izoh="Taom bazasidan tanlang"
                ochiq={!yuklanmoqda}
                onClick={() => router.push("/taomlar")}
              />

              {xato && (
                <div role="alert" className="flex items-center justify-between gap-3 px-1">
                  <p className="text-izoh text-xato">{xato}</p>
                  <button
                    type="button"
                    onClick={() => oxirgiRasm.current && void yubor(oxirgiRasm.current)}
                    className="min-h-11 shrink-0 text-izoh font-medium text-siyoh"
                  >
                    Qayta urinish
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={yop}
                disabled={yuklanmoqda}
                className="min-h-11 text-asosiy text-matn-2 disabled:opacity-40"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
