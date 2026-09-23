"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { OrqagaSarlavha } from "@/app/_components/profil/OrqagaSarlavha";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { useTelegramOrqaga } from "@/app/_components/useTelegramOrqaga";
import { hujjatniOqi, type Bolak } from "@/lib/services/hujjat-hisob";

function Bolaklar({ bolaklar }: { bolaklar: Bolak[] }) {
  return (
    <>
      {bolaklar.map((bolak, i) =>
        bolak.tur === "sarlavha" ? (
          bolak.daraja === 2 ? (
            <h2 key={i} className="mt-6 font-display text-karta-sarlavha first:mt-0">
              {bolak.matn}
            </h2>
          ) : (
            <h3 key={i} className="mt-4 font-display text-asosiy font-semibold">
              {bolak.matn}
            </h3>
          )
        ) : bolak.tur === "royxat" ? (
          <ul key={i} className="flex flex-col gap-1.5 pl-1">
            {bolak.qatorlar.map((qator) => (
              <li key={qator} className="flex gap-2 text-asosiy leading-relaxed">
                <span aria-hidden="true" className="text-matn-3">
                  •
                </span>
                <span className="min-w-0 flex-1">{qator}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="text-asosiy leading-relaxed">
            {bolak.matn}
          </p>
        ),
      )}
    </>
  );
}

/**
 * Huquqiy hujjat sahifasi (S5 10-task): matn `hujjatlar/*.md` dan keladi, bo'laklarga
 * `hujjat-hisob.ts` ajratadi — bu yerda faqat ko'rinish. Orqaga: kelgan sahifaga (paywall,
 * profil yoki onboardingdan yangi oynada ochilgan bo'lsa — zaxira `/profil`).
 */
export function Hujjat({
  sarlavha,
  matn,
  tarjimasiz,
}: {
  /** Qisqa nom — ekran sarlavhasida; hujjatning rasmiy to'liq nomi matn ichida. */
  sarlavha: string;
  matn: string;
  /** Matn foydalanuvchi tilida emas (o'zbekcha zaxira ko'rsatilmoqda). */
  tarjimasiz: boolean;
}) {
  const router = useRouter();
  const { t } = useTarjima();
  const hujjat = hujjatniOqi(matn);

  const qayt = useCallback(() => {
    if (window.history.length > 1) router.back();
    else router.replace("/profil");
  }, [router]);
  useTelegramOrqaga(qayt);

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-12">
      <OrqagaSarlavha sarlavha={sarlavha} orqagaNomi={t("Orqaga")} onOrqaga={qayt} />

      <article className="flex flex-col gap-3">
        <h2 className="font-display text-sarlavha leading-tight">{hujjat.nomi}</h2>

        {(hujjat.sana || hujjat.versiya) && (
          <p className="text-izoh text-matn-2">
            {[hujjat.sana, hujjat.versiya && t("Versiya: {0}", hujjat.versiya)]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}

        {tarjimasiz && (
          <p className="rounded-karta border border-karta-chegara bg-karta p-3 text-izoh text-matn-2">
            {t("Hujjat hozircha o'zbek tilida.")}
          </p>
        )}

        <Bolaklar bolaklar={hujjat.bolaklar} />
      </article>
    </main>
  );
}
