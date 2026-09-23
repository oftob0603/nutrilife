import Link from "next/link";
import { tarjimon, type Til } from "@/lib/lugat/tarjima";
import { haftaKunlari } from "@/lib/services/yozuv-hisob";

const KATAK =
  "flex min-h-11 flex-1 flex-col items-center gap-1 rounded-chip border py-2 tabular-nums";

/**
 * Haftalik kun tanlagich (dizayn-tz E1, prototipdagi DayPicker): tanlangan kun joylashgan
 * hafta, Du–Ya. Tanlangan kun to'ldirilgan, bugun chegara bilan ajratilgan, kelajak kunlar
 * bosilmaydi. Kataklar havola — tanlangan kun `?sana=` orqali yuklanadi.
 */
export function KunTanlagich({ sana, bugun, til }: { sana: string; bugun: string; til: Til }) {
  const { t } = tarjimon(til);

  return (
    <nav aria-label={t("Hafta kunlari")} className="flex gap-2">
      {haftaKunlari(sana, til).map((kun) => {
        const tanlangan = kun.sana === sana;
        // Prototip `DayPicker`: kun nomi --type-badge, tanlanganda 0.7 shaffof, aks holda --matn-2.
        const mazmun = (
          <>
            <span className={`text-belgi ${tanlangan ? "opacity-70" : "text-matn-2"}`}>{kun.nomi}</span>
            <span className="text-izoh font-medium tabular-nums">{kun.kun}</span>
          </>
        );

        // "YYYY-MM-DD" matnlari alifbo tartibida solishtiriladi.
        if (kun.sana > bugun) {
          return (
            <span
              key={kun.sana}
              aria-disabled="true"
              className={`${KATAK} border-transparent text-matn-3`}
            >
              {mazmun}
            </span>
          );
        }

        const rang = tanlangan
          ? "border-siyoh bg-siyoh text-on-siyoh"
          : kun.sana === bugun
            ? "border-siyoh bg-karta text-siyoh"
            : "border-karta-chegara bg-karta text-siyoh";

        return (
          <Link
            key={kun.sana}
            href={kun.sana === bugun ? "/" : `/?sana=${kun.sana}`}
            aria-current={tanlangan ? "date" : undefined}
            aria-label={
              kun.sana === bugun
                ? t("{0}, {1} (bugun)", kun.nomi, kun.kun)
                : `${kun.nomi}, ${kun.kun}`
            }
            className={`${KATAK} ${rang}`}
          >
            {mazmun}
          </Link>
        );
      })}
    </nav>
  );
}
