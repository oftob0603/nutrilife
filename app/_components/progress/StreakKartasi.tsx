import { QoshishTugmasi } from "@/app/_components/QoshishPaneli";
import { tarjimon, type Til } from "@/lib/lugat/tarjima";
import type { Streak } from "@/lib/services/progress-hisob";
import { Ikona } from "./Ikona";

/**
 * P1 streak kartasi. Hali bitta ham kuzatilgan kun bo'lmasa — "boshlanmagan" holati va birinchi
 * ovqatni qo'shish tugmasi (E2 panelini ochadi). "Ertaga uziladi" ogohlantirishi yo'q (progress-tz).
 */
export function StreakKartasi({
  streak,
  kuzatilganJami,
  til,
}: {
  streak: Streak;
  kuzatilganJami: number;
  til: Til;
}) {
  const { t } = tarjimon(til);

  if (kuzatilganJami === 0) {
    return (
      <section className="flex flex-col gap-3 rounded-karta border border-karta-chegara bg-karta p-4">
        <p className="text-karta-sarlavha">{t("Streak hali boshlanmagan")}</p>
        <QoshishTugmasi korinish="ikkilamchi">{t("Birinchi ovqatni qo'shing")}</QoshishTugmasi>
      </section>
    );
  }

  return (
    <section className="flex items-center gap-4 rounded-karta border border-karta-chegara bg-karta p-4">
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <Ikona nomi="olov" className="text-matn-2" />
        <span className="text-karta-sarlavha tabular-nums">{t("{0} kunlik streak", streak.joriy)}</span>
      </span>
      <span className="flex items-center gap-2">
        <Ikona nomi="kubok" olcham={16} className="text-matn-3" />
        <span className="whitespace-nowrap text-izoh text-matn-2 tabular-nums">
          {t("Rekord: {0} kun", streak.engUzun)}
        </span>
      </span>
    </section>
  );
}
