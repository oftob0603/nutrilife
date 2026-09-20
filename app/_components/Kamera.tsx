"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { rasmniYukla } from "@/lib/services/rasm-yuklash";

type Holat = "yuklanmoqda" | "jonli" | "korish" | "xato";
type Surat = { rasm: Blob; manzil: string };

function Aylanma() {
  return (
    <span
      aria-hidden="true"
      className="size-8 animate-spin rounded-full border-2 border-white border-t-transparent"
    />
  );
}

function Ikona({ nomi }: { nomi: "orqaga" | "galereya" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {nomi === "orqaga" ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="m21 16-5-5-5 5-2-2-6 6" />
        </>
      )}
    </svg>
  );
}

// Tugma komponenti mavzu tokenlariga tayanadi, kamera ekrani esa doim qora —
// shuning uchun bu yerda tugmalar oq/qora bilan alohida chiziladi.
const TUGMA =
  "flex h-13 w-full items-center justify-center gap-2 rounded-full text-asosiy font-medium transition-transform active:scale-[0.98] disabled:opacity-40";

/**
 * E3 — kamera (dizayn-tz E3). Ekran ikkala mavzuda ham qora: kamera ko'rinishi
 * atrofida yorug' fon rasmni ko'rishga xalaqit beradi, shuning uchun bu yerda mavzu
 * tokenlari o'rniga sof qora va oq ishlatiladi.
 */
export function Kamera() {
  const router = useRouter();
  const video = useRef<HTMLVideoElement>(null);
  const tanlagich = useRef<HTMLInputElement>(null);
  const [holat, setHolat] = useState<Holat>("yuklanmoqda");
  const [urinish, setUrinish] = useState(0);
  const [surat, setSurat] = useState<Surat | null>(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);
  const [xato, setXato] = useState<string | null>(null);

  useEffect(() => {
    let bekor = false;
    let oqim: MediaStream | null = null;

    (async () => {
      try {
        oqim = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 } },
          audio: false,
        });
        if (bekor) {
          oqim.getTracks().forEach((yol) => yol.stop());
          return;
        }
        if (video.current) {
          video.current.srcObject = oqim;
          await video.current.play().catch(() => {});
        }
        setHolat((joriy) => (joriy === "yuklanmoqda" ? "jonli" : joriy));
      } catch {
        // Ruxsat berilmadi, kamera yo'q yoki brauzer qo'llamaydi — hammasi bitta holat.
        if (!bekor) setHolat((joriy) => (joriy === "korish" ? joriy : "xato"));
      }
    })();

    return () => {
      bekor = true;
      oqim?.getTracks().forEach((yol) => yol.stop());
    };
  }, [urinish]);

  // Ko'rib chiqish uchun yaratilgan vaqtinchalik manzil xotirada qolib ketmasin.
  useEffect(() => {
    if (!surat) return;
    return () => URL.revokeObjectURL(surat.manzil);
  }, [surat]);

  function korishga(rasm: Blob) {
    setXato(null);
    setSurat({ rasm, manzil: URL.createObjectURL(rasm) });
    setHolat("korish");
  }

  function suratgaOl() {
    const manba = video.current;
    if (!manba || !manba.videoWidth) return;
    const tuval = document.createElement("canvas");
    tuval.width = manba.videoWidth;
    tuval.height = manba.videoHeight;
    tuval.getContext("2d")?.drawImage(manba, 0, 0);
    tuval.toBlob((rasm) => rasm && korishga(rasm), "image/jpeg", 0.92);
  }

  function qaytaOl() {
    setSurat(null);
    setXato(null);
    // Kamera ishlab turgan bo'lsa jonli ko'rinishga, aks holda qayta ochishga.
    if (video.current?.srcObject) {
      setHolat("jonli");
    } else {
      setHolat("yuklanmoqda");
      setUrinish((son) => son + 1);
    }
  }

  async function tahlilga() {
    if (!surat) return;
    setXato(null);
    setYuborilmoqda(true);
    try {
      router.push(`/tahlil/${await rasmniYukla(surat.rasm)}`);
    } catch (sabab) {
      setXato(sabab instanceof Error ? sabab.message : "Yuklanmadi");
      setYuborilmoqda(false);
    }
  }

  return (
    <main className="fixed inset-0 flex flex-col bg-black text-white">
      <video
        ref={video}
        playsInline
        muted
        className={`absolute inset-0 size-full object-cover ${holat === "jonli" ? "" : "invisible"}`}
      />

      {holat === "korish" && surat && (
        <Image
          src={surat.manzil}
          alt="Olingan rasm"
          fill
          unoptimized
          className="object-contain"
        />
      )}

      <header className="relative flex items-center p-2">
        <Link
          href="/"
          aria-label="Orqaga"
          className="flex size-11 items-center justify-center rounded-full bg-black/40"
        >
          <Ikona nomi="orqaga" />
        </Link>
      </header>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        {holat === "yuklanmoqda" && <Aylanma />}

        {holat === "jonli" && (
          <>
            <div className="aspect-square w-full max-w-xs rounded-panel border-2 border-white/50" />
            <p className="rounded-full bg-black/40 px-3 py-1 text-izoh">
              Taomni tepadan, to&apos;liq ko&apos;rinishda oling
            </p>
          </>
        )}

        {holat === "xato" && (
          <>
            <p className="text-karta-sarlavha">Kamerani ocholmadik</p>
            <p className="text-izoh text-white/70">
              Brauzer sozlamalarida kameraga ruxsat bering yoki tayyor rasmni
              tanlang.
            </p>
          </>
        )}
      </div>

      <footer className="relative flex flex-col gap-3 px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {xato && (
          <p role="alert" className="rounded-chip bg-black/60 px-3 py-2 text-center text-izoh">
            {xato}
          </p>
        )}

        {holat === "jonli" && (
          <div className="grid grid-cols-3 items-center">
            <button
              type="button"
              onClick={() => tanlagich.current?.click()}
              aria-label="Galereyadan tanlash"
              className="flex size-11 items-center justify-center justify-self-start rounded-full bg-black/40"
            >
              <Ikona nomi="galereya" />
            </button>
            <button
              type="button"
              onClick={suratgaOl}
              aria-label="Rasmga olish"
              className="size-18 justify-self-center rounded-full border-4 border-white/50 bg-white bg-clip-padding transition-transform active:scale-[0.98]"
            />
          </div>
        )}

        {holat === "korish" && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={qaytaOl}
              disabled={yuborilmoqda}
              className={`${TUGMA} border border-white/40 text-white`}
            >
              Qayta olish
            </button>
            <button
              type="button"
              onClick={tahlilga}
              disabled={yuborilmoqda}
              className={`${TUGMA} bg-white text-black`}
            >
              {yuborilmoqda && (
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
              )}
              {yuborilmoqda ? "Yuklanmoqda…" : xato ? "Qayta urinish" : "Tahlil qilish"}
            </button>
          </div>
        )}

        {holat === "xato" && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setHolat("yuklanmoqda");
                setUrinish((son) => son + 1);
              }}
              className={`${TUGMA} bg-white text-black`}
            >
              Qayta urinish
            </button>
            <button
              type="button"
              onClick={() => tanlagich.current?.click()}
              className={`${TUGMA} border border-white/40 text-white`}
            >
              Galereyadan tanlash
            </button>
          </div>
        )}
      </footer>

      <input
        ref={tanlagich}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(hodisa) => {
          const rasm = hodisa.target.files?.[0];
          hodisa.target.value = "";
          if (rasm) korishga(rasm);
        }}
      />
    </main>
  );
}
