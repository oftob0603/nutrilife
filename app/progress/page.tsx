import Link from "next/link";
import { OflaynChizigi } from "@/app/_components/OflaynChizigi";
import { Ikona } from "@/app/_components/progress/Ikona";
import { KunKataklari } from "@/app/_components/progress/KunKataklari";
import { StreakKartasi } from "@/app/_components/progress/StreakKartasi";
import { VaznGrafigi } from "@/app/_components/progress/VaznGrafigi";
import { VaznKartasi } from "@/app/_components/progress/VaznKartasi";
import { VaznPaneli } from "@/app/_components/progress/VaznPaneli";
import { VaznQaydi } from "@/app/_components/progress/VaznQaydi";
import { QaytaUrinish } from "@/app/_components/QaytaUrinish";
import { QoshishPaneli } from "@/app/_components/QoshishPaneli";
import { XatoKartasi } from "@/app/_components/XatoKartasi";
import { serverTarjimoni } from "@/lib/lugat/server";
import { farqMatni, vaznQiymati, type Progress } from "@/lib/services/progress-hisob";
import { progressniYukla } from "./yukla";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "Statistika — Nutrilife" };

/**
 * P1 — Progress (panelda "Statistika"). Sahifa foydalanuvchining o'z raqamlarini ko'rsatadi,
 * ularni izohlamaydi: BMI, "sog'lom oraliq", prognoz yo'q (progress-tz.md). Prototipdagi
 * "Batafsil statistika" va "Haftalik hisobot" bo'limlari V1'da yo'q (PRD, 10-bo'lim).
 */
export default async function ProgressSahifasi() {
  const tarjimon = await serverTarjimoni();
  const { t, til } = tarjimon;
  const progress = await progressniYukla();
  // Sessiyasiz ochilgan havola: sahifa kirish pardasi ostida bo'sh turadi (profil bilan bir xil).
  if (progress === "sessiyasiz") return null;

  return (
    <>
      <OflaynChizigi />
      <main className="mx-auto w-full max-w-md px-4 pb-32">
        <header className="py-4">
          <h1 className="text-sarlavha">{t("Statistika")}</h1>
        </header>

        {progress === null ? (
          <XatoKartasi
            sarlavha={t("Ma'lumotni yuklab bo'lmadi")}
            izoh={t("Serverga ulanolmadik. Internetni tekshirib, qayta urinib ko'ring.")}
          >
            <QaytaUrinish />
          </XatoKartasi>
        ) : (
          <div className="flex flex-col gap-6">
            <VaznKartasi progress={progress} til={til} />
            <VaznQaydi />
            <VaznGrafigi progress={progress} />
            <StreakKartasi streak={progress.streak} kuzatilganJami={progress.kuzatilganJami} til={til} />
            <KunKataklari kunlar={progress.oxirgi30} bugun={progress.bugun} til={til} />
            {progress.haftalikOzgarish !== null && (
              <HaftalikOzgarish ozgarish={progress.haftalikOzgarish} birlik={progress.vaznBirligi} />
            )}
            <Link
              href="/progress/tarix"
              className="flex min-h-11 items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-4 transition-transform active:scale-[0.98]"
            >
              <Ikona nomi="royxat" olcham={24} />
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-karta-sarlavha">{t("Vazn tarixi")}</span>
                <span className="text-izoh text-matn-2 tabular-nums">
                  {t("{0} ta o'lchov", progress.vaznlar.length)}
                </span>
              </span>
              <Ikona nomi="ong" className="text-matn-3" />
            </Link>
            <VaznPaneli progress={progress} />
          </div>
        )}
      </main>

      <QoshishPaneli faol="statistika" />
    </>
  );
}

/** Haftalik o'rtacha o'zgarish — oraliqdagi jami o'zgarishdan farqli, bu SUR'AT (prototip). */
async function HaftalikOzgarish({ ozgarish, birlik }: { ozgarish: number; birlik: Progress["vaznBirligi"] }) {
  const { t, til } = await serverTarjimoni();
  const birlikNomi = birlik === "lb" ? "lb" : t("kg");

  return (
    <section className="flex items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-4">
      <Ikona nomi={ozgarish <= 0 ? "pasaymoqda" : "osmoqda"} className="text-matn-2" />
      <span className="min-w-0 flex-1 text-izoh text-matn-2">{t("Haftalik o'zgarish")}</span>
      <span className="text-karta-sarlavha tabular-nums">
        {t("{0} / hafta", `${farqMatni(vaznQiymati(ozgarish, birlik), til)} ${birlikNomi}`)}
      </span>
    </section>
  );
}
