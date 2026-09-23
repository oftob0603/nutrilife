"use client";

import { useState } from "react";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma, TugmaHavola } from "@/app/_components/Tugma";
import type { Kalit } from "@/lib/lugat/tarjima";
import { OrqagaSarlavha } from "./OrqagaSarlavha";

const OCHADIGANLAR: readonly Kalit[] = [
  "Profil va shaxsiy ma'lumot",
  "Butun ovqat jurnali",
  "Barcha rasmlar",
  "Vazn tarixi",
];

function Ogohlantirish() {
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
      className="shrink-0 text-xato"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

/**
 * F5 — hisobni o'chirish, ikki qadam: avval nima o'chishi ko'rsatiladi, keyin tasdiq so'raladi.
 * Tasdiq matn yozdirmaydi — "Ha, o'chirilsin" bosiladi (foydalanuvchi qarori 2026-09-23).
 * O'chirish darhol va qaytarib bo'lmaydi.
 */
export function HisobniOchirish({ faolPro }: { faolPro: boolean }) {
  const { t } = useTarjima();
  const [qadam, setQadam] = useState<1 | 2 | "ochirildi">(1);
  const [ochirilmoqda, setOchirilmoqda] = useState(false);
  const [xato, setXato] = useState(false);

  async function ochir() {
    setXato(false);
    setOchirilmoqda(true);
    try {
      // `apiSorov` emas: 401 da jimgina qayta kirish bu yerda yangi hisob yaratib yuborardi.
      const javob = await fetch("/api/profil", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tasdiq: "ochirish" }),
      });
      if (!javob.ok) throw new Error();
      setQadam("ochirildi");
    } catch {
      setXato(true);
      setOchirilmoqda(false);
    }
  }

  if (qadam === "ochirildi") {
    return (
      <main className="fixed inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-fon px-6 text-center">
        <h1 className="text-sarlavha">{t("Hisobingiz o'chirildi")}</h1>
        <p className="text-asosiy text-matn-2">{t("Ilovani yopishingiz mumkin.")}</p>
      </main>
    );
  }

  if (qadam === 1) {
    return (
      <main className="mx-auto w-full max-w-md px-4 pb-12">
        <OrqagaSarlavha sarlavha={t("Hisobni o'chirish")} orqagaNomi={t("Orqaga")} href="/profil" />

        <div className="flex flex-col gap-6">
          <p className="text-asosiy">{t("Quyidagilar butunlay o'chadi:")}</p>
          <ul className="flex flex-col gap-3 rounded-karta border border-karta-chegara bg-karta p-4">
            {OCHADIGANLAR.map((band) => (
              <li key={band} className="flex gap-3 text-asosiy">
                <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rounded-full bg-matn-3" />
                <span className="min-w-0 flex-1">{t(band)}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 rounded-karta border border-xato bg-karta p-4">
            <p className="flex items-center gap-2 text-karta-sarlavha">
              <Ogohlantirish />
              <span className="min-w-0 flex-1">{t("Bu amalni qaytarib bo'lmaydi")}</span>
            </p>
            <p className="text-izoh">
              {faolPro
                ? t("PRO obunangiz tugaydi, pul qaytarilmaydi.")
                : t("O'chirilgan ma'lumotni tiklash imkoni yo'q.")}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Tugma onClick={() => setQadam(2)}>{t("Davom etish")}</Tugma>
            <TugmaHavola korinish="uchinchi" href="/profil">
              {t("Bekor qilish")}
            </TugmaHavola>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-12">
      <OrqagaSarlavha
        sarlavha={t("Tasdiqlash")}
        orqagaNomi={t("Orqaga")}
        onOrqaga={() => !ochirilmoqda && setQadam(1)}
      />

      <div className="flex flex-col gap-6">
        <p className="text-asosiy">{t("Hisobni o'chirishni tasdiqlaysizmi?")}</p>

        <div className="flex flex-col gap-2">
          {xato && (
            <p role="alert" className="text-izoh text-xato">
              {t("O'chirib bo'lmadi. Qayta urinib ko'ring")}
            </p>
          )}
          {/* Tasdiq — prototipdagidek asosiy tugma (`primary`); qizil "Hisobni o'chirish" profilda qoladi. */}
          <Tugma yuklanmoqda={ochirilmoqda} onClick={() => void ochir()}>
            {t("Ha, o'chirilsin")}
          </Tugma>
          <Tugma
            korinish="uchinchi"
            disabled={ochirilmoqda}
            onClick={() => setQadam(1)}
          >
            {t("Bekor qilish")}
          </Tugma>
        </div>

        <p className="text-izoh text-matn-2">
          {t("Hisob darhol o'chadi. Ilovani qayta ochsangiz, yangi hisob yaratiladi.")}
        </p>
      </div>
    </main>
  );
}
