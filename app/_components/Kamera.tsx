"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { OrqagaTugma } from "@/app/_components/OrqagaTugma";
import { useRouter } from "next/navigation";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { rasmniYukla } from "@/lib/services/rasm-yuklash";

type Holat = "yuklanmoqda" | "jonli" | "korish" | "xato";
type Surat = { rasm: Blob; manzil: string };

function Aylanma() {
  return (
    <span
      aria-hidden="true"
      className="size-8 animate-spin rounded-full border-2 border-[#f2f2f3] border-t-transparent"
    />
  );
}

// Prototip: orqaga 24 px, galereya 20 px.
function Ikona({ nomi }: { nomi: "orqaga" | "galereya" }) {
  const olcham = nomi === "orqaga" ? 24 : 20;
  return (
    <svg
      viewBox="0 0 24 24"
      width={olcham}
      height={olcham}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
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
  const { t, erkin } = useTarjima();
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
      // Xabar — lug'at kaliti yoki serverdan kelgan matn (rasm-yuklash.ts).
      setXato(sabab instanceof Error ? erkin(sabab.message) : t("Yuklanmadi"));
      setYuborilmoqda(false);
    }
  }

  return (
    // Prototip `CameraScreen` (data-theme="dark"): qorong'i fon, ko'rinish maydoni chetdan
    // 16 px ichkarida yumaloq karta, ichida 260 px ramka va pastida ko'rsatma.
    <main className="fixed inset-0 flex flex-col bg-[#0b0b0c] pt-[var(--xavfsiz-tepa)] text-[#f2f2f3]">
      <header className="flex items-center justify-between px-4 py-4">
        <OrqagaTugma
          nomi={t("Orqaga")}
          href="/"
          className="-ml-3 flex size-11 items-center justify-center"
          joyTutsin
        >
          <Ikona nomi="orqaga" />
        </OrqagaTugma>
        <span className="text-izoh opacity-70">
          {holat === "korish" ? t("Rasmni ko'rib chiqing") : t("Kamera")}
        </span>
        <span aria-hidden="true" className="size-11" />
      </header>

      <div className="relative mx-4 min-h-0 flex-1 overflow-hidden rounded-karta bg-[#161618]">
        <video
          ref={video}
          playsInline
          muted
          className={`absolute inset-0 size-full object-cover ${holat === "jonli" ? "" : "invisible"}`}
        />

        {holat === "korish" && surat && (
          <Image
            src={surat.manzil}
            alt={t("Olingan rasm")}
            fill
            unoptimized
            className="object-contain"
          />
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          {holat === "yuklanmoqda" && <Aylanma />}

          {holat === "jonli" && (
            <div className="aspect-square w-full max-w-[260px] rounded-karta border border-[rgba(242,242,243,0.35)]" />
          )}

          {holat === "xato" && (
            <>
              <p className="text-karta-sarlavha">{t("Kamerani ocholmadik")}</p>
              <p className="text-izoh opacity-70">
                {t("Brauzer sozlamalarida kameraga ruxsat bering yoki tayyor rasmni tanlang.")}
              </p>
            </>
          )}
        </div>

        {holat === "jonli" && (
          <p className="absolute inset-x-6 bottom-6 text-center text-izoh text-[rgba(242,242,243,0.7)]">
            {t("Taomni tepadan, to'liq ko'rinishda oling")}
          </p>
        )}
      </div>

      <footer className="flex flex-col gap-3 px-4 pt-6 pb-[max(2rem,var(--xavfsiz-past))]">
        {xato && (
          <p role="alert" className="rounded-chip bg-[#161618] px-3 py-2 text-center text-izoh">
            {xato}
          </p>
        )}

        {holat === "jonli" && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => tanlagich.current?.click()}
              aria-label={t("Galereyadan tanlash")}
              className="flex size-11 items-center justify-center rounded-chip border border-[rgba(242,242,243,0.25)]"
            >
              <Ikona nomi="galereya" />
            </button>
            <button
              type="button"
              onClick={suratgaOl}
              aria-label={t("Rasmga olish")}
              className="size-18 rounded-full border-4 border-[rgba(242,242,243,0.35)] bg-[#f2f2f3] bg-clip-padding transition-transform active:scale-[0.98]"
            />
            <span aria-hidden="true" className="size-11" />
          </div>
        )}

        {holat === "korish" && (
          // Prototipdagidek ustma-ust: tasdiq tugmasi lime (ekrandagi yagona to'ldirilgan
          // element), ostida fonsiz "Qayta olish".
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={tahlilga}
              disabled={yuborilmoqda}
              className={`${TUGMA} bg-aksent text-aksent-matn`}
            >
              {yuborilmoqda && (
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
              )}
              {yuborilmoqda ? t("Yuklanmoqda…") : xato ? t("Qayta urinish") : t("Tahlil qilish")}
            </button>
            <button
              type="button"
              onClick={qaytaOl}
              disabled={yuborilmoqda}
              className={`${TUGMA} bg-transparent text-[#f2f2f3]`}
            >
              {t("Qayta olish")}
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
              className={`${TUGMA} bg-[#f2f2f3] text-[#0b0b0c]`}
            >
              {t("Qayta urinish")}
            </button>
            <button
              type="button"
              onClick={() => tanlagich.current?.click()}
              className={`${TUGMA} border border-[rgba(242,242,243,0.25)] text-[#f2f2f3]`}
            >
              {t("Galereyadan tanlash")}
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
