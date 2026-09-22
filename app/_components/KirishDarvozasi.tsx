"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
  initDataBilanKirish,
  initDataniOl,
  SESSIYA_TUGADI_HODISASI,
} from "@/lib/services/api-klient";
import { tilniOqi, type Til } from "@/lib/lugat/tarjima";
import { MAVZULAR, mavzuniOqi, mavzuniTanla, type Mavzu } from "@/lib/mavzu";
import { useTarjima, useTilniOrnat } from "./TilTaminoti";
import { Tugma } from "./Tugma";

type Holat = "kirilmoqda" | "tayyor" | "xato" | "qayta_oching" | "telegram_emas";

/** true — sahifa shu hisob sessiyasi bilan chizilgan, qayta yuklash shart emas. */
type KirishNatijasi =
  | { holat: "tayyor"; sessiyaBorEdi: boolean; onboardingTugadi: boolean; til: Til; mavzu: Mavzu }
  | { holat: "xato" | "qayta_oching" | "telegram_emas" };

type KirishJavobi = {
  foydalanuvchi: { onboardingTugadi: boolean; til: string; mavzu: string };
  sessiyaBorEdi?: boolean;
};

const ONBOARDING_MANZILI = "/onboarding";

function mavzuniAniqla(qiymat: string): Mavzu {
  return MAVZULAR.find((mavzu) => mavzu === qiymat) ?? "tizim";
}

async function kirish(): Promise<KirishNatijasi> {
  const initData = initDataniOl();
  try {
    if (initData) {
      const javob = await initDataBilanKirish(initData);
      if (javob.ok) {
        const { foydalanuvchi, sessiyaBorEdi } = (await javob.json()) as KirishJavobi;
        return {
          holat: "tayyor",
          sessiyaBorEdi: sessiyaBorEdi === true,
          onboardingTugadi: foydalanuvchi.onboardingTugadi,
          til: tilniOqi(foydalanuvchi.til),
          mavzu: mavzuniAniqla(foydalanuvchi.mavzu),
        };
      }
      if (javob.status !== 401) return { holat: "xato" };
      // initData eskirgan (ilova uzoq ochiq turgan) — avvalgi sessiya hali yaroqlidir.
    }

    const sessiya = await fetch("/api/auth/telegram", { cache: "no-store" });
    if (sessiya.ok) {
      const { foydalanuvchi } = (await sessiya.json()) as KirishJavobi;
      return {
        holat: "tayyor",
        sessiyaBorEdi: true,
        onboardingTugadi: foydalanuvchi.onboardingTugadi,
        til: tilniOqi(foydalanuvchi.til),
        mavzu: mavzuniAniqla(foydalanuvchi.mavzu),
      };
    }
    if (sessiya.status !== 401) return { holat: "xato" };
    // initData bor, lekin rad etildi va sessiya ham yo'q — yangi initData faqat qayta ochganda keladi.
    return { holat: initData ? "qayta_oching" : "telegram_emas" };
  } catch {
    return { holat: "xato" };
  }
}

function Parda({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-fon px-6 text-center">
      {children}
    </div>
  );
}

/**
 * Ilova ochilganda Telegram initData bilan kiradi va sessiya cookie'sini oladi; ungacha
 * sahifa kutish pardasi ostida turadi. Birinchi kirishda sahifa sessiyasiz chizilgan
 * bo'ladi — kirgach server ma'lumoti qayta so'raladi.
 */
export function KirishDarvozasi({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t } = useTarjima();
  const tilniOrnat = useTilniOrnat();
  const [holat, setHolat] = useState<Holat>("kirilmoqda");
  const [yangilanmoqda, yangila] = useTransition();

  const natijaniQolla = useCallback(
    (natija: KirishNatijasi) => {
      if (natija.holat === "tayyor") {
        // Sahifa boshqa tilda chizilgan (birinchi ochilish yoki til boshqa qurilmada
        // o'zgargan): klient matnlari darhol, server matnlari yangilangach almashadi.
        const tilBoshqa = natija.til !== tilniOqi(document.documentElement.lang);
        if (tilBoshqa) tilniOrnat(natija.til);

        // Mavzu manbai — baza; brauzer xotirasi faqat tez ochilish uchun kesh (lib/mavzu.ts).
        // Yangi qurilmada yoki boshqa qurilmada o'zgartirilgan tanlov shu yerda tenglashadi.
        if (natija.mavzu !== mavzuniOqi()) mavzuniTanla(natija.mavzu);

        // Onboarding tugamaguncha Home ochilmaydi (onboarding-tz.md, 1-bo'lim). Yangi
        // manzilga o'tish sahifani sessiya bilan qayta so'raydi; ildiz qolip (<html lang>)
        // esa faqat `refresh` bilan qayta chiziladi.
        const onboardingga =
          !natija.onboardingTugadi && window.location.pathname !== ONBOARDING_MANZILI;
        if (onboardingga || !natija.sessiyaBorEdi || tilBoshqa) {
          yangila(() => {
            if (onboardingga) router.replace(ONBOARDING_MANZILI);
            if (!onboardingga || tilBoshqa) router.refresh();
          });
        }
      }
      setHolat(natija.holat);
    },
    [router, tilniOrnat],
  );

  useEffect(() => {
    let bekor = false;
    void kirish().then((natija) => {
      if (!bekor) natijaniQolla(natija);
    });
    return () => {
      bekor = true;
    };
  }, [natijaniQolla]);

  // Ish o'rtasida sessiya tugab, jimgina qayta kirish ham o'tmadi (`apiSorov`).
  useEffect(() => {
    const sessiyaTugadi = () => setHolat("qayta_oching");
    window.addEventListener(SESSIYA_TUGADI_HODISASI, sessiyaTugadi);
    return () => window.removeEventListener(SESSIYA_TUGADI_HODISASI, sessiyaTugadi);
  }, []);

  const ochiq = holat === "tayyor" && !yangilanmoqda;

  return (
    <>
      <div className="contents" inert={!ochiq}>
        {children}
      </div>

      {!ochiq && (
        <Parda>
          {holat === "xato" ? (
            <>
              <div className="flex flex-col gap-2">
                <h1 className="text-sarlavha">{t("Kirib bo'lmadi")}</h1>
                <p className="text-asosiy text-matn-2">
                  {t("Internetni tekshirib, qayta urinib ko'ring.")}
                </p>
              </div>
              <div className="w-full max-w-xs">
                <Tugma
                  onClick={() => {
                    setHolat("kirilmoqda");
                    void kirish().then(natijaniQolla);
                  }}
                >
                  {t("Qayta urinish")}
                </Tugma>
              </div>
            </>
          ) : holat === "qayta_oching" ? (
            <div className="flex flex-col gap-2">
              <h1 className="text-sarlavha">{t("Ilovani qayta oching")}</h1>
              <p className="text-asosiy text-matn-2">
                {t("Kirish muddati tugadi. Ilovani yopib, Telegram'dan qaytadan oching.")}
              </p>
            </div>
          ) : holat === "telegram_emas" ? (
            <div className="flex flex-col gap-2">
              <h1 className="text-sarlavha">{t("Ilovani Telegram orqali oching")}</h1>
              <p className="text-asosiy text-matn-2">
                {t(
                  "NutriLifer faqat Telegram ichida ishlaydi. Botni ochib, ilovani o'sha yerdan ishga tushiring.",
                )}
              </p>
            </div>
          ) : (
            <>
              <p className="font-display text-sarlavha">NutriLifer</p>
              <span
                role="status"
                aria-label={t("Kirilmoqda")}
                className="size-6 animate-spin rounded-full border-2 border-matn-3 border-t-transparent"
              />
            </>
          )}
        </Parda>
      )}
    </>
  );
}
