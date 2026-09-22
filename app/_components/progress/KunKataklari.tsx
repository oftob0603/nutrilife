import Link from "next/link";
import { tarjimon, type Til } from "@/lib/lugat/tarjima";
import { KATAKLAR_SONI, type KunKatagi } from "@/lib/services/progress-hisob";
import { kunOyMatni } from "@/lib/services/yozuv-hisob";

/**
 * P1 kuzatilgan kunlar (prototip `DayGrid`): oxirgi 30 kun, 10 ustun, eskidan yangiga.
 * Kuzatilgan kun — `--aksent`, bo'sh kun — `--chegara`; kuzatilgan katak o'sha kunning jurnalini ochadi.
 */
export function KunKataklari({
  kunlar,
  bugun,
  til,
}: {
  kunlar: KunKatagi[];
  bugun: string;
  til: Til;
}) {
  const { t } = tarjimon(til);
  const kuzatilgan = kunlar.filter((kun) => kun.kuzatilgan).length;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-karta-sarlavha">{t("Kuzatilgan kunlar")}</h2>
      <div className="flex flex-col gap-4 rounded-karta border border-karta-chegara bg-karta p-4">
        <p className="text-karta-sarlavha tabular-nums">{t("{0} / {1} kun", kuzatilgan, KATAKLAR_SONI)}</p>
        <ul className="grid grid-cols-10 gap-2">
          {kunlar.map((kun) => {
            const nomi = kunOyMatni(kun.sana, til);
            return (
              <li key={kun.sana} className="aspect-square min-w-0">
                {kun.kuzatilgan ? (
                  <Link
                    href={kun.sana === bugun ? "/jurnal" : `/jurnal?sana=${kun.sana}`}
                    aria-label={nomi}
                    className="block size-full rounded-chip bg-aksent transition-transform active:scale-[0.98]"
                  />
                ) : (
                  <span aria-label={nomi} className="block size-full rounded-chip bg-chegara" />
                )}
              </li>
            );
          })}
        </ul>
        <p className="text-izoh text-matn-2">
          {t("Oxirgi 30 kun. Kuzatilgan kunni bosing — o'sha kundagi jurnal ochiladi.")}
        </p>
      </div>
    </section>
  );
}
