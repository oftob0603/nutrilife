"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrqagaSarlavha } from "@/app/_components/profil/OrqagaSarlavha";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { useTelegramOrqaga } from "@/app/_components/useTelegramOrqaga";
import { havolalargaBol, hujjatniOqi, type Bolak } from "@/lib/services/hujjat-hisob";

/** Havola yonidagi kichik ↗ belgisi — boshqa hujjatga o'tishini bildiradi. */
function BurchakStrelka() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="ml-0.5 inline-block align-[-1px]"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

/** Qator matni; boshqa hujjat nomi havola rangida, tagi chizilgan va ↗ belgili havola. */
function Matn({ matn, ozi }: { matn: string; ozi: string }) {
  return havolalargaBol(matn, ozi).map(({ matn: qism, href }, i) =>
    href ? (
      <Link
        key={i}
        href={href}
        className="text-havola underline underline-offset-2 active:opacity-70"
      >
        {qism}
        <BurchakStrelka />
      </Link>
    ) : (
      qism
    ),
  );
}

function Bolaklar({ bolaklar, ozi }: { bolaklar: Bolak[]; ozi: string }) {
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
                <span className="min-w-0 flex-1">
                  <Matn matn={qator} ozi={ozi} />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="text-asosiy leading-relaxed">
            <Matn matn={bolak.matn} ozi={ozi} />
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
  manzil,
  sarlavha,
  matn,
  tarjimasiz,
}: {
  /** Shu hujjat sahifasining manzili — matndagi havolalar o'ziga qo'yilmaydi. */
  manzil: string;
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

        <Bolaklar bolaklar={hujjat.bolaklar} ozi={manzil} />
      </article>
    </main>
  );
}
