"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Tugma } from "@/app/_components/Tugma";

declare global {
  interface Window {
    /** Login Widget `data-onauth` chaqiradigan global funksiya. */
    nutriliferAdminKirish?: (malumot: unknown) => void;
  }
}

type Holat = "sessiyasiz" | "ruxsat_yoq" | "xato";

/**
 * A0 — kirish va rad javobi (admin-tz.md). Telegram Login Widget tugmasi, boshqa hech narsa;
 * rad javobida panel tuzilishi va bo'lim nomlari ko'rsatilmaydi. Widget — telegram.org
 * skripti, bot username'i serverdan keladi; BotFather'da sayt domeni (`/setdomain`) bog'langan
 * bo'lishi shart, aks holda tugma chizilmaydi.
 */
export function AdminKirish({ holat: boshlangich, bot }: { holat: Holat; bot: string | null }) {
  const router = useRouter();
  const [holat, setHolat] = useState<Holat | "kirilmoqda">(boshlangich);
  const [kirishXatosi, setKirishXatosi] = useState<string | null>(null);
  const widgetJoyi = useRef<HTMLDivElement>(null);

  const widgetKerak = holat === "sessiyasiz" && bot !== null;

  useEffect(() => {
    if (!widgetKerak || !widgetJoyi.current) return;
    const joy = widgetJoyi.current;

    window.nutriliferAdminKirish = async (malumot: unknown) => {
      setHolat("kirilmoqda");
      setKirishXatosi(null);
      try {
        const javob = await fetch("/api/admin/kirish", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ malumot }),
        });
        if (javob.ok) {
          router.refresh();
          return;
        }
        if (javob.status === 403) {
          setHolat("ruxsat_yoq");
          return;
        }
        setHolat("sessiyasiz");
        setKirishXatosi(
          javob.status === 401
            ? "Telegram orqali kirish tasdiqlanmadi. Qayta urinib ko'ring"
            : "Kirib bo'lmadi. Qayta urinib ko'ring",
        );
      } catch {
        setHolat("sessiyasiz");
        setKirishXatosi("Kirib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring");
      }
    };

    const skript = document.createElement("script");
    skript.src = "https://telegram.org/js/telegram-widget.js?22";
    skript.async = true;
    skript.dataset.telegramLogin = bot;
    skript.dataset.size = "large";
    skript.dataset.radius = "26";
    skript.dataset.onauth = "nutriliferAdminKirish(user)";
    joy.replaceChildren(skript);

    return () => {
      joy.replaceChildren();
      delete window.nutriliferAdminKirish;
    };
  }, [widgetKerak, bot, router]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-fon p-4" data-admin-page="">
      <div className="flex w-full max-w-sm flex-col items-start gap-4 rounded-karta border border-karta-chegara bg-karta p-5">
        <span className="font-display text-sarlavha">NutriLifer</span>

        {holat === "ruxsat_yoq" ? (
          <>
            <p className="text-asosiy">{"Bu sahifaga ruxsatingiz yo'q"}</p>
            <p className="text-izoh text-matn-2">
              Panel faqat admin hisobiga ochiladi. Boshqa hisob bilan kirish uchun avval chiqing.
            </p>
            <Tugma
              korinish="ikkilamchi"
              onClick={() => {
                void fetch("/api/admin/chiqish", { method: "POST" }).finally(() => router.refresh());
              }}
            >
              Chiqish
            </Tugma>
          </>
        ) : holat === "xato" ? (
          <>
            <p className="text-asosiy">{"Kirib bo'lmadi"}</p>
            <p className="text-izoh text-matn-2">{"Internetni tekshirib, qayta urinib ko'ring."}</p>
            <Tugma korinish="siyoh" onClick={() => router.refresh()}>
              Qayta urinish
            </Tugma>
          </>
        ) : (
          <>
            <span className="text-izoh text-matn-2">/admin</span>
            {holat === "kirilmoqda" ? (
              <Tugma korinish="siyoh" yuklanmoqda>
                Kirilmoqda
              </Tugma>
            ) : bot === null ? (
              <p className="text-izoh text-xato">
                Bot sozlanmagan — Telegram orqali kirish hozircha ishlamaydi.
              </p>
            ) : (
              <div ref={widgetJoyi} className="flex min-h-11 w-full justify-center" />
            )}
            {kirishXatosi && (
              <p role="alert" className="text-izoh text-xato">
                {kirishXatosi}
              </p>
            )}
            <span className="text-izoh text-matn-2">
              Telegram orqali kirish · server imzoni tekshiradi va rolni qaraydi
            </span>
          </>
        )}
      </div>
    </main>
  );
}
