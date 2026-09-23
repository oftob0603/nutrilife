import Link from "next/link";
import { ProQulfi } from "@/app/_components/ProQulfi";
import { TaomRasmi } from "@/app/_components/TaomRasmi";
import { tarjimon, type Til } from "@/lib/lugat/tarjima";
import { raqam, taomNomi } from "@/lib/services/taom-hisob";
import type { TaklifJavobi } from "@/lib/services/taklif-hisob";

const KARTA = "rounded-karta border border-karta-chegara bg-karta p-4";

function OngStrelka() {
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
      className="shrink-0 text-matn-3"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/**
 * E1 — "Qolgan kaloriyaga mos" bo'limi (prototip `screens-home.jsx`). PRO'da qolgan
 * kaloriyaga sig'adigan taom kartasi (bosilsa E5), mos taom yo'q bo'lsa izoh; PRO
 * bo'lmaganlarga qulf kartasi. Taklif "hozir nima yeysiz" haqida — faqat bugun chiqadi,
 * o'tgan kunda bo'lim ko'rsatilmaydi (chaqiruvchi hal qiladi).
 */
export function TaklifKartasi({
  til,
  qoldi,
  taklif,
}: {
  til: Til;
  qoldi: number;
  taklif: TaklifJavobi;
}) {
  const { t, miqdor } = tarjimon(til);

  let mazmun: React.ReactNode;
  if (taklif.yopiq) {
    mazmun = (
      <ProQulfi
        sarlavha={t("Qolgan kaloriyaga mos taom takliflari")}
        izoh={t("Qolgan kaloriyangizga sig'adigan taomlar tanlanadi.")}
        tugma={t("PRO ni ochish")}
      />
    );
  } else if (!taklif.taklif) {
    mazmun = (
      <p className={`${KARTA} text-izoh text-matn-2 tabular-nums`}>
        {qoldi <= 0
          ? t("Kunlik norma to'ldi — bugunga taklif yo'q.")
          : t("Qolgan {0} kkal uchun mos taom topilmadi.", raqam(qoldi))}
      </p>
    );
  } else {
    const { taom, porsiya } = taklif.taklif;
    mazmun = (
      <Link
        href={`/taomlar/${taom.id}`}
        className={`${KARTA} flex items-center gap-3 transition-transform active:scale-[0.98]`}
      >
        <TaomRasmi rasm={taom.rasm} olcham="orta" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-karta-sarlavha">{taomNomi(taom, til)}</p>
          <p className="mt-1 text-izoh text-matn-2 tabular-nums">
            {t(
              "{0} · {1} kkal · qolgan {2} kkal ichida",
              miqdor(taklif.taklif.miqdor, taom.olchovBirligi),
              raqam(porsiya.kaloriya),
              raqam(qoldi),
            )}
          </p>
        </div>
        <OngStrelka />
      </Link>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-karta-sarlavha">{t("Qolgan kaloriyaga mos")}</h2>
      {mazmun}
    </section>
  );
}
