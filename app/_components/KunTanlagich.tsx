import Link from "next/link";
import { haftaKunlari } from "@/lib/services/yozuv-hisob";

const KATAK =
  "flex min-h-11 flex-1 flex-col items-center gap-1 rounded-chip border py-2 tabular-nums";

/**
 * Haftalik kun tanlagich (dizayn-tz E1, prototipdagi DayPicker): tanlangan kun joylashgan
 * hafta, Du–Ya. Tanlangan kun to'ldirilgan, bugun chegara bilan ajratilgan, kelajak kunlar
 * bosilmaydi. Kataklar havola — tanlangan kun `?sana=` orqali yuklanadi.
 */
export function KunTanlagich({ sana, bugun }: { sana: string; bugun: string }) {
  return (
    <nav aria-label="Hafta kunlari" className="flex gap-2">
      {haftaKunlari(sana).map((kun) => {
        const mazmun = (
          <>
            <span className="text-[11px] leading-none">{kun.nomi}</span>
            <span className="text-izoh font-medium">{kun.kun}</span>
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

        const tanlangan = kun.sana === sana;
        const rang = tanlangan
          ? "border-siyoh bg-siyoh text-fon"
          : kun.sana === bugun
            ? "border-siyoh bg-karta text-siyoh"
            : "border-karta-chegara bg-karta text-siyoh";

        return (
          <Link
            key={kun.sana}
            href={kun.sana === bugun ? "/" : `/?sana=${kun.sana}`}
            aria-current={tanlangan ? "date" : undefined}
            aria-label={`${kun.nomi}, ${kun.kun}${kun.sana === bugun ? " (bugun)" : ""}`}
            className={`${KATAK} ${rang}`}
          >
            {mazmun}
          </Link>
        );
      })}
    </nav>
  );
}
