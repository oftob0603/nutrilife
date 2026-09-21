"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
  initDataBilanKirish,
  initDataniOl,
  SESSIYA_TUGADI_HODISASI,
} from "@/lib/services/api-klient";
import { Tugma } from "./Tugma";

type Holat = "kirilmoqda" | "tayyor" | "xato" | "qayta_oching" | "telegram_emas";

/** true — sahifa shu hisob sessiyasi bilan chizilgan, qayta yuklash shart emas. */
type KirishNatijasi =
  | { holat: "tayyor"; sessiyaBorEdi: boolean; onboardingTugadi: boolean }
  | { holat: "xato" | "qayta_oching" | "telegram_emas" };

type KirishJavobi = { foydalanuvchi: { onboardingTugadi: boolean }; sessiyaBorEdi?: boolean };

const ONBOARDING_MANZILI = "/onboarding";

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
  const [holat, setHolat] = useState<Holat>("kirilmoqda");
  const [yangilanmoqda, yangila] = useTransition();

  const natijaniQolla = useCallback(
    (natija: KirishNatijasi) => {
      if (natija.holat === "tayyor") {
        // Onboarding tugamaguncha Home ochilmaydi (onboarding-tz.md, 1-bo'lim). Yangi
        // manzilga o'tish sahifani sessiya bilan qayta so'raydi, alohida yangilash kerak emas.
        if (!natija.onboardingTugadi && window.location.pathname !== ONBOARDING_MANZILI) {
          yangila(() => router.replace(ONBOARDING_MANZILI));
        } else if (!natija.sessiyaBorEdi) {
          yangila(() => router.refresh());
        }
      }
      setHolat(natija.holat);
    },
    [router],
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
                <h1 className="text-sarlavha">Kirib bo&apos;lmadi</h1>
                <p className="text-asosiy text-matn-2">
                  Internetni tekshirib, qayta urinib ko&apos;ring.
                </p>
              </div>
              <div className="w-full max-w-xs">
                <Tugma
                  onClick={() => {
                    setHolat("kirilmoqda");
                    void kirish().then(natijaniQolla);
                  }}
                >
                  Qayta urinish
                </Tugma>
              </div>
            </>
          ) : holat === "qayta_oching" ? (
            <div className="flex flex-col gap-2">
              <h1 className="text-sarlavha">Ilovani qayta oching</h1>
              <p className="text-asosiy text-matn-2">
                Kirish muddati tugadi. Ilovani yopib, Telegram&apos;dan qaytadan oching.
              </p>
            </div>
          ) : holat === "telegram_emas" ? (
            <div className="flex flex-col gap-2">
              <h1 className="text-sarlavha">Ilovani Telegram orqali oching</h1>
              <p className="text-asosiy text-matn-2">
                Nutrilife faqat Telegram ichida ishlaydi. Botni ochib, ilovani o&apos;sha
                yerdan ishga tushiring.
              </p>
            </div>
          ) : (
            <>
              <p className="font-display text-sarlavha">Nutrilife</p>
              <span
                role="status"
                aria-label="Kirilmoqda"
                className="size-6 animate-spin rounded-full border-2 border-matn-3 border-t-transparent"
              />
            </>
          )}
        </Parda>
      )}
    </>
  );
}
