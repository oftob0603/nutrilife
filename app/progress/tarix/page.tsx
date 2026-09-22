import Link from "next/link";
import { OflaynChizigi } from "@/app/_components/OflaynChizigi";
import { VaznPaneli } from "@/app/_components/progress/VaznPaneli";
import { VaznTarixi } from "@/app/_components/progress/VaznTarixi";
import { QaytaUrinish } from "@/app/_components/QaytaUrinish";
import { XatoKartasi } from "@/app/_components/XatoKartasi";
import { serverTarjimoni } from "@/lib/lugat/server";
import { progressniYukla } from "../yukla";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "Vazn tarixi — Nutrilife" };

/** P3 — vazn tarixi. Bo'sh holati bo'lmaydi: onboardingdan kamida bitta o'lchov doim bor. */
export default async function VaznTarixiSahifasi() {
  const { t } = await serverTarjimoni();
  const progress = await progressniYukla();
  if (progress === "sessiyasiz") return null;

  return (
    <>
      <OflaynChizigi />
      <main className="mx-auto w-full max-w-md px-4 pb-12">
        <header className="flex items-center gap-2 py-4">
          <Link
            href="/progress"
            aria-label={t("Orqaga")}
            className="-ml-3 flex size-11 items-center justify-center rounded-chip text-siyoh"
          >
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-sarlavha">{t("Vazn tarixi")}</h1>
        </header>

        {progress === null ? (
          <XatoKartasi
            sarlavha={t("Ma'lumotni yuklab bo'lmadi")}
            izoh={t("Serverga ulanolmadik. Internetni tekshirib, qayta urinib ko'ring.")}
          >
            <QaytaUrinish />
          </XatoKartasi>
        ) : (
          <>
            <VaznTarixi progress={progress} />
            <VaznPaneli progress={progress} />
          </>
        )}
      </main>
    </>
  );
}
