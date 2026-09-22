"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PastkiVaraq } from "@/app/_components/PastkiVaraq";
import { ProImkoniyatBelgisi } from "@/app/_components/ProImkoniyatBelgisi";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";
import { useTelegramOrqaga } from "@/app/_components/useTelegramOrqaga";
import { PRO_IMKONIYATLARI } from "@/lib/pro-imkoniyatlar";
import { apiSorov } from "@/lib/services/api-klient";
import { tarifNomi } from "@/lib/services/obuna-hisob";
import { raqam } from "@/lib/services/taom-hisob";
import {
  boshlangichTarif,
  oyiga,
  oylikNarx,
  paywallQaytishi,
  paywallSarlavhasi,
  tejash,
  type PaywallManbai,
} from "@/lib/services/tarif-hisob";
import type { TarifNarxi } from "@/lib/tariflar";

/** "yuklanmoqda" — narxlar kutilmoqda; null — olib bo'lmadi. */
type Holat = TarifNarxi[] | "yuklanmoqda" | null;

type Varaq = "tolov" | "hujjat" | null;

async function tariflarniOl(): Promise<TarifNarxi[] | null> {
  try {
    const javob = await apiSorov("/api/tariflar");
    return javob.ok ? ((await javob.json()) as { tariflar: TarifNarxi[] }).tariflar : null;
  } catch {
    return null;
  }
}

function TarifKartasi({
  tarif,
  oylik,
  tanlangan,
  onTanla,
}: {
  tarif: TarifNarxi;
  oylik: number;
  tanlangan: boolean;
  onTanla: () => void;
}) {
  const { t } = useTarjima();
  const nomi = tarifNomi(tarif.id);
  const foiz = tejash(tarif, oylik);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={tanlangan}
      onClick={onTanla}
      // Chegara ikkala holatda ham 2 px — tanlash joylashuvni siljitmaydi. Tanlanganida chegara
      // PRO gradiyenti: karta foni padding-box, gradiyent border-box qatlamida.
      className={`flex w-full items-center gap-3 rounded-karta border-2 p-4 text-left transition-transform active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 ${
        tanlangan
          ? "border-transparent [background:linear-gradient(var(--karta),var(--karta))_padding-box,var(--pro-gradient)_border-box]"
          : "border-chegara bg-karta"
      } ${
        tanlangan && tarif.tavsiya
          ? "shadow-[0_0_0_4px_color-mix(in_oklch,var(--aksent)_22%,transparent)]"
          : ""
      }`}
    >
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-display text-karta-sarlavha">{nomi ? t(nomi) : tarif.id}</span>
          {tarif.tavsiya && (
            <span className="relative inline-block overflow-hidden rounded-chip bg-(image:--pro-gradient) px-2 py-[2px] text-[11px] font-medium text-(--pro-fg) after:pointer-events-none after:absolute after:inset-0 after:hidden after:bg-[linear-gradient(100deg,transparent_20%,rgba(255,255,255,0.65)_50%,transparent_80%)] motion-safe:after:block motion-safe:after:animate-[yaltirash_1100ms_cubic-bezier(0.2,0,0,1)_420ms_1_both]">
              {t("Tavsiya etiladi")}
            </span>
          )}
        </span>
        <span className="mt-1.5 block text-izoh text-matn-2 tabular-nums">
          {t(tarif.oylar === 1 ? "{0} so'm / oy" : "≈{0} so'm / oy", raqam(oyiga(tarif)))}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="whitespace-nowrap font-display text-karta-sarlavha tabular-nums">
          {t("{0} so'm", raqam(tarif.narx))}
        </span>
        {foiz > 0 && (
          <span className="whitespace-nowrap rounded-full bg-pro-tint px-2 py-[2px] text-[11px] font-medium text-pro-ink tabular-nums">
            {t("{0}% tejash", foiz)}
          </span>
        )}
      </span>
    </button>
  );
}

/**
 * W1 — tariflar (paywall-tz.md; qolip: prototip/ui_kits/paywall/Tariffs.jsx). "Hozir emas"
 * har holatda ishlaydi — ekran hech qachon tupik emas; o'chadigan tugma — "Davom etish".
 * To'lov usuli (W2) to'lov tarmog'ida quriladi — ungacha "Davom etish" buni aytadigan varaqni
 * ochadi. Shartlar va maxfiylik hujjatlari ham hali yo'q — havolalar shunday varaq ochadi.
 */
export function Tariflar({
  manba,
  muddatiTugagan,
}: {
  manba: PaywallManbai;
  muddatiTugagan: boolean;
}) {
  const router = useRouter();
  const { t } = useTarjima();
  const [tariflar, setTariflar] = useState<Holat>("yuklanmoqda");
  const [tanlangan, setTanlangan] = useState<TarifNarxi["id"] | null>(null);
  const [varaq, setVaraq] = useState<Varaq>(null);
  // Har "Qayta urinish" — yangi urinish raqami; yuklash effekti shunga bog'langan.
  const [urinish, setUrinish] = useState(0);

  useEffect(() => {
    let bekor = false;
    void tariflarniOl().then((kelgan) => {
      if (bekor) return;
      setTariflar(kelgan);
      // Qayta urinishda foydalanuvchi tanlovi saqlanadi.
      if (kelgan) setTanlangan((joriy) => joriy ?? boshlangichTarif(kelgan));
    });
    return () => {
      bekor = true;
    };
  }, [urinish]);

  const yopVaraq = useCallback(() => setVaraq(null), []);

  // "Hozir emas" va Telegram orqaga tugmasi — kelgan sahifaga. Onboardingdan `replace` bilan
  // kelinadi (unga qaytish ma'nosiz), ilova tarixi bo'lmasa ham (to'g'ridan-to'g'ri ochilgan)
  // manbaga qarab zaxira sahifa — ekran hech qachon tupik emas. Varaq ochiq bo'lsa, Telegram
  // tugmasi avval varaqni yopadi (PastkiVaraq o'z amalini ustiga qo'yadi).
  const qayt = useCallback(() => {
    if (manba !== "onboarding" && window.history.length > 1) router.back();
    else router.replace(paywallQaytishi(manba));
  }, [manba, router]);
  useTelegramOrqaga(qayt);

  const tayyor = Array.isArray(tariflar) && tariflar.length > 0;

  return (
    <>
      <main className="mx-auto w-full max-w-md px-4 pb-[calc(148px+var(--xavfsiz-past))] pt-6">
        <h1 className="font-display text-[28px] font-semibold leading-[1.12] tracking-[-0.02em]">
          {t(paywallSarlavhasi(manba, muddatiTugagan))}
        </h1>

        <ul
          aria-label={t("PRO imkoniyatlari")}
          className="mt-5 rounded-karta border border-karta-chegara bg-karta px-4 py-1"
        >
          {PRO_IMKONIYATLARI.map(({ id, nomi }) => (
            <li
              key={id}
              className="flex items-center gap-3 border-t border-chegara py-2.5 first:border-t-0"
            >
              <ProImkoniyatBelgisi id={id} />
              <span className="text-asosiy leading-snug">{t(nomi)}</span>
            </li>
          ))}
        </ul>

        <div role="radiogroup" aria-label={t("Tarif tanlang")} className="mt-5 flex flex-col gap-3">
          {tariflar === "yuklanmoqda" ? (
            [0, 1, 2].map((i) => (
              <div
                key={i}
                aria-hidden="true"
                className="h-[84px] rounded-karta border-2 border-chegara bg-karta p-4"
              >
                <div className="h-4 w-24 animate-pulse rounded-full bg-chegara" />
                <div className="mt-3 h-3 w-40 animate-pulse rounded-full bg-chegara" />
              </div>
            ))
          ) : !tayyor ? (
            <div role="alert" className="rounded-karta border-2 border-chegara bg-karta p-4">
              <p className="text-asosiy">{t("Tariflarni yuklab bo'lmadi")}</p>
              <div className="mt-3">
                <Tugma
                  korinish="ikkilamchi"
                  onClick={() => {
                    setTariflar("yuklanmoqda");
                    setUrinish((son) => son + 1);
                  }}
                >
                  {t("Qayta urinish")}
                </Tugma>
              </div>
            </div>
          ) : (
            tariflar.map((tarif) => (
              <TarifKartasi
                key={tarif.id}
                tarif={tarif}
                oylik={oylikNarx(tariflar)}
                tanlangan={tarif.id === tanlangan}
                onTanla={() => setTanlangan(tarif.id)}
              />
            ))
          )}
        </div>

        <p className="mt-4 text-izoh leading-snug text-matn-2">
          {t("Avtomatik yechish yo'q. Muddat tugagach o'zingiz uzaytirasiz.")}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-izoh">
          <button
            type="button"
            onClick={() => setVaraq("hujjat")}
            className="min-h-11 underline-offset-2 active:underline"
          >
            {t("Foydalanish shartlari")}
          </button>
          <span className="text-matn-3">·</span>
          <button
            type="button"
            onClick={() => setVaraq("hujjat")}
            className="min-h-11 underline-offset-2 active:underline"
          >
            {t("Maxfiylik siyosati")}
          </button>
        </div>
      </main>

      {/* Pastki tugmalar to'g'ridan-to'g'ri sahifa ustida — karta, chegara va soyasiz (prototip). */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[5] mx-auto w-full max-w-md px-4 pb-[calc(12px+var(--xavfsiz-past))]">
        <div className="pointer-events-auto">
          <Tugma
            korinish="pro"
            yorugOtish
            disabled={!tayyor || !tanlangan}
            onClick={() => setVaraq("tolov")}
          >
            {t("Davom etish")}
          </Tugma>
        </div>
        <button
          type="button"
          onClick={qayt}
          className="pointer-events-auto mt-2 min-h-11 w-full text-asosiy font-medium text-matn-2"
        >
          {t("Hozir emas")}
        </button>
      </div>

      {varaq && (
        <PastkiVaraq
          sarlavha={varaq === "tolov" ? t("To'lov tez orada") : t("Hujjat tayyorlanmoqda")}
          onYop={yopVaraq}
        >
          <div className="flex flex-col gap-4">
            <p className="text-asosiy">
              {varaq === "tolov"
                ? t("To'lov tez orada ishga tushadi. Hozircha ilovadan bepul foydalanishingiz mumkin.")
                : t("Hujjat matni tez orada shu yerda paydo bo'ladi.")}
            </p>
            <Tugma onClick={yopVaraq}>{t("Tushunarli")}</Tugma>
          </div>
        </PastkiVaraq>
      )}
    </>
  );
}
