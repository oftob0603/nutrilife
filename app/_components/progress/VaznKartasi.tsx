import { tarjimon, type Til } from "@/lib/lugat/tarjima";
import { vaznMatni } from "@/lib/services/profil-hisob";
import { farqMatni, vaznQiymati, type Progress } from "@/lib/services/progress-hisob";

/** P1 vazn kartasi: joriy vazn, boshlanishdan beri o'zgarish va yo'lning bosib o'tilgan qismi. */
export function VaznKartasi({ progress, til }: { progress: Progress; til: Til }) {
  const t = tarjimon(til);
  const { vaznBirligi: birlik, ozgarish, maqsadFoizi } = progress;
  const joriy = progress.vaznlar[progress.vaznlar.length - 1];
  const birlikNomi = birlik === "lb" ? "lb" : t.t("kg");

  return (
    <section className="flex flex-col gap-4 rounded-karta border border-karta-chegara bg-karta p-4">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-[48px] leading-none font-semibold tracking-[-0.03em] tabular-nums">
          {vaznMatni(joriy.vazn, birlik, t).replace(/ .*$/, "")}
        </span>
        <span className="text-karta-sarlavha text-matn-2">{birlikNomi}</span>
        {ozgarish !== null && (
          <span className="ml-auto text-karta-sarlavha text-matn-2 tabular-nums">
            {farqMatni(vaznQiymati(ozgarish, birlik), til, birlik === "kg")} {birlikNomi}
          </span>
        )}
      </div>
      {/* Maqsad va qolgan farq grafik kartasidagi xulosa qatorida — bu yerda faqat yo'l chizig'i. */}
      {maqsadFoizi !== null && (
        <div className="flex flex-col gap-2">
          <div className="h-2 overflow-hidden rounded-full bg-chegara">
            <div className="h-full rounded-full bg-aksent" style={{ width: `${maqsadFoizi}%` }} />
          </div>
          <span className="text-belgi text-matn-2 tabular-nums">
            {t.t("Yo'lning {0}% i bosib o'tildi", maqsadFoizi)}
          </span>
        </div>
      )}
    </section>
  );
}
