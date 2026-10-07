"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SkanLimitiQatori } from "@/app/_components/SkanLimitiQatori";
import { RasmYuklash } from "@/app/_components/Tahlil";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";
import { useSkanLimiti } from "@/app/_components/useSkanLimiti";
import { useTelegramOrqaga } from "@/app/_components/useTelegramOrqaga";
import { rasmniYukla } from "@/lib/services/rasm-yuklash";
import { limitKorinishi } from "@/lib/services/skan-hisob";

const PANELNI_OCH = "qoshish-panelini-och";

/** Bo'sh holatdagi tugma — shu sahifadagi `QoshishPaneli` ni (E2) ochadi. */
export function QoshishTugmasi({
  korinish,
  children,
}: {
  korinish?: "asosiy" | "ikkilamchi" | "uchinchi";
  children?: React.ReactNode;
}) {
  const { t } = useTarjima();
  return (
    <Tugma korinish={korinish} onClick={() => window.dispatchEvent(new Event(PANELNI_OCH))}>
      {children ?? t("Ovqat qo'shish")}
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
    // lucide `pencil` — prototip E2 "Qo'lda qo'shish".
    qolda: (
      <>
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        <path d="m15 5 4 4" />
      </>
    ),
  };

  // Prototip `ActionRow`: ikona 24 px, lucide chizig'i 1.75.
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
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
  onYopiq,
}: {
  ikona: "kamera" | "galereya" | "qolda";
  nomi: string;
  izoh: string;
  ochiq: boolean;
  onClick?: () => void;
  /** Berilsa, o'chiq ko'rinishdagi qator ham bosiladi — limit tugaganda tariflar ekranini ochadi. */
  onYopiq?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!ochiq && !onYopiq}
      onClick={ochiq ? onClick : onYopiq}
      // Prototip `ActionRow`: o'chiq qator butunicha 0.4 shaffoflikda, oxirida "›".
      className={`flex min-h-11 w-full items-center gap-3 rounded-karta border border-chegara bg-karta p-4 text-left text-siyoh transition-transform active:scale-[0.98] ${
        ochiq ? "" : "opacity-40"
      }`}
    >
      <Ikona nomi={ikona} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-karta-sarlavha">{nomi}</span>
        <span className="text-izoh text-matn-2">{izoh}</span>
      </span>
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0 text-matn-3"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  );
}

/**
 * Pastki paneldagi bitta bo'lim: nishon va ostida yozuv. Faol bo'lim ostida --fon rangli joy.
 * `href` berilmasa bo'lim o'chiq — sahifasi hali qurilmagan.
 */
function Bolim({
  href,
  nomi,
  faol = false,
  children,
}: {
  href?: string;
  nomi: string;
  faol?: boolean;
  children: React.ReactNode;
}) {
  const ASOS = "flex min-h-11 min-w-0 flex-1 flex-col items-center gap-0.5 rounded-full py-2";
  const ichi = (
    <>
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
      >
        {children}
      </svg>
      {/* Eng uzun yorliq — ruscha "Статистика": 360 px ekranda ham qirqilmasin. */}
      <span
        className={`max-w-full truncate text-[11px] leading-none tracking-tight ${faol ? "font-medium" : ""}`}
      >
        {nomi}
      </span>
    </>
  );

  if (!href) {
    return (
      <span aria-disabled="true" className={`${ASOS} text-matn-3`}>
        {ichi}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-current={faol ? "page" : undefined}
      className={`${ASOS} ${faol ? "bg-fon text-siyoh" : "text-matn-2"}`}
    >
      {ichi}
    </Link>
  );
}

/**
 * Suzuvchi pastki panel (prototip `BottomBar`: Asosiy · Retseptlar · [+] · Statistika · Profil;
 * jurnal panelda emas — Home'dagi "Hammasi" orqali ochiladi) va "+" ochadigan
 * E2 — ovqat qo'shish manbasini tanlash paneli. Kamera E3 ekranini ochadi; galereya tizim
 * rasm tanlagichini ochadi — rasm tanlanishi bilan to'liq ekranli yuklash (E6 ko'rinishida)
 * chiqadi, yuklangach tahlil sahifasiga o'tiladi.
 * Ostida skan hisoblagichi; limit kelguncha va tugaganda uchala yo'l ham o'chiq (bitta AI limiti).
 * `faol` berilmasa pastki panel chizilmaydi, faqat E2 varag'i `QoshishTugmasi` bilan ochiladi —
 * E8'dagi "Yana qo'shish" shunday ishlaydi (prototip `openSheet`).
 */
export function QoshishPaneli({ faol }: { faol?: "asosiy" | "retseptlar" | "statistika" | "profil" }) {
  const router = useRouter();
  const { t, erkin } = useTarjima();
  const [ochiq, setOchiq] = useState(false);
  // Galereyadan tanlangan rasm: `manzil` — telefondagi nusxa (darhol ko'rinadi), `rasmId` —
  // serverga yuklandi va tahlil sahifasi ochilmoqda.
  const [yuklash, setYuklash] = useState<{
    manzil: string;
    rasmId: string | null;
    xato: string | null;
  } | null>(null);
  const yuklanmoqda = yuklash !== null;
  const tanlagich = useRef<HTMLInputElement>(null);
  // Xatodan keyin "Qayta urinish" rasmni qayta tanlatmasdan yuboradi.
  const oxirgiRasm = useRef<Blob | null>(null);
  // Har yuborishning tartib raqami: bekor qilingan yuklashning kech kelgan javobi e'tiborsiz qoladi.
  const navbat = useRef(0);
  const nusxaManzili = useRef<string | null>(null);
  const limit = useSkanLimiti(ochiq);
  const korinish = typeof limit === "object" && limit !== null ? limitKorinishi(limit) : null;
  const skanYopiq = korinish?.tugagan ?? false;
  // Limit kelguncha yo'llar vaqtincha yopiq — tez bosilganda tugagan limit bilan kamera yoki
  // tahlil ochilib ketmasin. Olib bo'lmasa (null) ochiq: limitni baribir server ushlaydi.
  const yollarOchiq = !yuklanmoqda && limit !== "yuklanmoqda" && !skanYopiq;
  // Bepul skanlar tugagan: o'chiq qator bosilsa tariflar ekrani ochiladi (paywall-tz.md, 1-bo'lim).
  const tariflargaOt =
    korinish?.paywall && !yuklanmoqda ? () => router.push("/pro?manba=limit") : undefined;

  function nusxaniBoshat() {
    if (nusxaManzili.current) URL.revokeObjectURL(nusxaManzili.current);
    nusxaManzili.current = null;
  }

  async function yubor(rasm: Blob) {
    const bu = ++navbat.current;
    oxirgiRasm.current = rasm;
    if (!nusxaManzili.current) nusxaManzili.current = URL.createObjectURL(rasm);
    const manzil = nusxaManzili.current;
    setYuklash({ manzil, rasmId: null, xato: null });
    try {
      const rasmId = await rasmniYukla(rasm);
      if (bu !== navbat.current) {
        rasmniOchir(rasmId);
        return;
      }
      setYuklash({ manzil, rasmId, xato: null });
      router.push(`/tahlil/${rasmId}`);
    } catch (sabab) {
      if (bu !== navbat.current) return;
      // Xabar — lug'at kaliti yoki serverdan kelgan matn (rasm-yuklash.ts).
      const xato = sabab instanceof Error ? erkin(sabab.message) : t("Yuklanmadi");
      setYuklash({ manzil, rasmId: null, xato });
    }
  }

  /** Foydalanuvchi kutmay bekor qildi — yuklangan rasm egasiz qolmasin. */
  function rasmniOchir(rasmId: string) {
    void fetch(`/api/rasmlar/${rasmId}`, { method: "DELETE", keepalive: true }).catch(() => {});
  }

  /** Yuklash ekranidan E2 panelga qaytish; ketayotgan yuklash natijasi tashlanadi. */
  function yuklashniBekorQil() {
    navbat.current++;
    if (yuklash?.rasmId) {
      // Tahlil sahifasiga o'tish boshlangan — joriy sahifaga qayta o'tish uni bekor qiladi.
      rasmniOchir(yuklash.rasmId);
      router.replace(window.location.pathname + window.location.search);
    }
    oxirgiRasm.current = null;
    nusxaniBoshat();
    setYuklash(null);
  }

  function yop() {
    if (yuklanmoqda) return;
    setOchiq(false);
  }

  useTelegramOrqaga(yuklanmoqda ? yuklashniBekorQil : ochiq ? yop : undefined);

  // Sahifadan chiqilganda (tahlilga o'tish) telefondagi nusxa xotirada qolmasin.
  useEffect(() => nusxaniBoshat, []);

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
      {/* E2 ochiq bo'lganda panel yashiriladi — foydalanuvchi oqimdan tasodifan chiqib ketmasin. */}
      {faol !== undefined && !ochiq && (
        <nav
          aria-label={t("Asosiy navigatsiya")}
          className="fixed inset-x-4 bottom-[max(1.5rem,var(--xavfsiz-past))] mx-auto flex max-w-sm items-center gap-1 rounded-full border border-chegara bg-karta px-2 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
        >
          <Bolim href="/" nomi={t("Asosiy")} faol={faol === "asosiy"}>
            <path d="M15.6 2.7a10 10 0 1 0 5.7 5.7" />
            <circle cx="12" cy="12" r="2" />
            <path d="M13.4 10.6 19 5" />
          </Bolim>
          <Bolim href="/retseptlar" nomi={t("Retseptlar")} faol={faol === "retseptlar"}>
            <path d="M12 7v14" />
            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
          </Bolim>
          <button
            type="button"
            onClick={() => setOchiq(true)}
            aria-label={t("Ovqat qo'shish")}
            // Prototip BottomBar: bosilganda 0.92 ga prujina bilan kichrayadi, soya yo'qoladi.
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-siyoh text-on-siyoh shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-[transform,box-shadow] duration-[250ms,120ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.92] active:shadow-none motion-reduce:active:scale-100"
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
          <Bolim href="/progress" nomi={t("Statistika")} faol={faol === "statistika"}>
            <path d="M16 7h6v6" />
            <path d="m22 7-8.5 8.5-5-5L2 17" />
          </Bolim>
          <Bolim href="/profil" nomi={t("Profil")} faol={faol === "profil"}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </Bolim>
        </nav>
      )}

      {ochiq && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("Ovqat qo'shish")}
          className="fixed inset-0 z-10 flex flex-col justify-end"
        >
          <button
            type="button"
            aria-label={t("Yopish")}
            onClick={yop}
            className="absolute inset-0 bg-parda"
          />

          <div className="relative mx-auto w-full max-w-md rounded-t-panel bg-karta px-4 pt-3 pb-[calc(1.5rem+var(--xavfsiz-past))] motion-safe:animate-[panel_250ms_cubic-bezier(0.2,0,0,1)]">
            <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-chegara" />
            {/* Prototip `BottomSheet title` — sarlavha ko'rinadi, faqat aria-label emas. */}
            <h2 className="mb-4 text-sarlavha">{t("Ovqat qo'shish")}</h2>
            <div className="flex flex-col gap-3">
              <Qator
                ikona="kamera"
                nomi={t("Kamera")}
                izoh={t("Ovqatni rasmga oling")}
                ochiq={yollarOchiq}
                onClick={() => router.push("/kamera")}
                onYopiq={tariflargaOt}
              />
              <Qator
                ikona="galereya"
                nomi={t("Galereya")}
                izoh={t("Tayyor rasmni tanlang")}
                ochiq={yollarOchiq}
                onClick={() => tanlagich.current?.click()}
                onYopiq={tariflargaOt}
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
              {/* Foydalanuvchi qarori (DECISIONS 2026-09-22): qo'lda qo'shish — matn maydoni
                  (AI tahlil), taom bazasi emas; shuning uchun u ham skan limitiga bo'ysunadi. */}
              <Qator
                ikona="qolda"
                nomi={t("Qo'lda qo'shish")}
                izoh={t("Nima yeganingizni yozing — AI hisoblaydi")}
                ochiq={yollarOchiq}
                onClick={() => router.push("/tasvirlash")}
                onYopiq={tariflargaOt}
              />

              <SkanLimitiQatori limit={limit} />

              <button
                type="button"
                onClick={yop}
                disabled={yuklanmoqda}
                className="min-h-11 text-asosiy font-medium text-siyoh transition-transform active:scale-[0.98] disabled:opacity-40"
              >
                {t("Bekor qilish")}
              </button>
            </div>
          </div>
        </div>
      )}

      {yuklash && (
        <div className="fixed inset-0 z-20 overflow-y-auto bg-fon pt-[var(--xavfsiz-tepa)]">
          <RasmYuklash
            manzil={yuklash.manzil}
            tayyor={yuklash.rasmId !== null}
            xato={yuklash.xato}
            onQayta={() => oxirgiRasm.current && void yubor(oxirgiRasm.current)}
            onBekor={yuklashniBekorQil}
          />
        </div>
      )}
    </>
  );
}
