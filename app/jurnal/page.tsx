import Link from "next/link";
import { OrqagaTugma } from "@/app/_components/OrqagaTugma";
import { BoshHolat } from "@/app/_components/BoshHolat";
import { MakroChizigi } from "@/app/_components/MakroChizigi";
import { ProQulfi } from "@/app/_components/ProQulfi";
import { QoshishPaneli, QoshishTugmasi } from "@/app/_components/QoshishPaneli";
import { QaytaUrinish } from "@/app/_components/QaytaUrinish";
import { XatoKartasi } from "@/app/_components/XatoKartasi";
import { YozuvQatori } from "@/app/_components/YozuvQatori";
import { serverdanApi } from "@/lib/api-asos";
import { serverTarjimoni } from "@/lib/lugat/server";
import type { Tarjimon } from "@/lib/lugat/tarjima";
import type { Reja } from "@/lib/services/norma-hisob";
import type { QulfJavobi } from "@/lib/services/taklif-hisob";
import { raqam } from "@/lib/services/taom-hisob";
import {
  bugunSana,
  qoshniSana,
  sanaMatni,
  sanaYaroqli,
  turBoyichaGuruh,
  type Jami,
  type Yozuv,
} from "@/lib/services/yozuv-hisob";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "Jurnal — NutriLifer" };

// `makro` eski API javobida bo'lmaydi — bayroqsiz makro chiziqlari ochilmaydi (PRO imkoniyati).
type Kun = { yozuvlar: Yozuv[]; jami: Jami; reja: Reja; makro?: QulfJavobi };

async function kunniYukla(sana: string): Promise<Kun | null> {
  try {
    const javob = await serverdanApi(`/api/ovqat-yozuvlari?sana=${sana}`);
    if (!javob.ok) return null;
    const kun = (await javob.json()) as Omit<Kun, "reja"> & { reja: Reja | null };
    // Rejasiz kun chizilmaydi: maxraj o'rniga soxta son ko'rsatgandan ko'ra xato holati to'g'riroq.
    return kun.reja ? { ...kun, reja: kun.reja } : null;
  } catch {
    return null;
  }
}

function jurnalManzili(sana: string, bugun: string): string {
  return sana === bugun ? "/jurnal" : `/jurnal?sana=${sana}`;
}

function Strelka({ yonalish }: { yonalish: "chap" | "ong" }) {
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
    >
      <path d={yonalish === "chap" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

const STRELKA_QOLIPI = "flex size-11 items-center justify-center rounded-chip";

/** Sana tanlagich: bir kun orqaga / oldinga; bugundan nariga o'tilmaydi. */
function SanaTanlagich({
  sana,
  bugun,
  tarjimon: { t, til },
}: {
  sana: string;
  bugun: string;
  tarjimon: Tarjimon;
}) {
  return (
    <nav aria-label={t("Sana")} className="flex items-center justify-between gap-2">
      <Link
        href={jurnalManzili(qoshniSana(sana, -1), bugun)}
        aria-label={t("Oldingi kun")}
        className={`${STRELKA_QOLIPI} text-siyoh`}
      >
        <Strelka yonalish="chap" />
      </Link>
      <p className="flex min-w-0 flex-col items-center text-center">
        <span className="text-karta-sarlavha">{sana === bugun ? t("Bugun") : sanaMatni(sana, til)}</span>
        {sana === bugun && <span className="text-izoh text-matn-2">{sanaMatni(sana, til)}</span>}
      </p>
      {sana === bugun ? (
        <span aria-hidden="true" className={`${STRELKA_QOLIPI} text-matn-3`}>
          <Strelka yonalish="ong" />
        </span>
      ) : (
        <Link
          href={jurnalManzili(qoshniSana(sana, 1), bugun)}
          aria-label={t("Keyingi kun")}
          className={`${STRELKA_QOLIPI} text-siyoh`}
        >
          <Strelka yonalish="ong" />
        </Link>
      )}
    </nav>
  );
}

/** Kunlik jami kartasi; makro chiziqlari — PRO (prototip `DailyTotals`), FREE'da faqat kkal. */
function KunlikJami({
  jami,
  reja,
  makroOchiq,
  tarjimon: { t, til },
}: {
  jami: Jami;
  reja: Reja;
  makroOchiq: boolean;
  tarjimon: Tarjimon;
}) {
  return (
    <section
      aria-label={t("Kunlik jami")}
      className="flex flex-col gap-4 rounded-karta border border-karta-chegara bg-karta p-4"
    >
      <p className="flex items-baseline gap-2">
        <span className="font-display text-raqam tabular-nums">{raqam(jami.kaloriya)}</span>
        <span className="text-izoh text-matn-2 tabular-nums">
          {t("/ {0} kkal", raqam(reja.kaloriya))}
        </span>
      </p>
      {makroOchiq && (
        <div className="flex gap-4">
          <MakroChizigi til={til} nomi="Oqsil" qiymat={jami.oqsil} maqsad={reja.oqsil} />
          <MakroChizigi til={til} nomi="Yog'" qiymat={jami.yog} maqsad={reja.yog} />
          <MakroChizigi til={til} nomi="Uglevod" qiymat={jami.uglevod} maqsad={reja.uglevod} />
        </div>
      )}
    </section>
  );
}

/** Bo'sh holat: nima yo'q, nega yo'q va (faqat bugun uchun) bitta harakat (dizayn-tz E9). */
function BoshKun({ bugunmi, t }: { bugunmi: boolean } & Pick<Tarjimon, "t">) {
  return (
    <BoshHolat
      ikona="daftar"
      sarlavha={t("Bu kunda yozuv yo'q")}
      izoh={
        bugunmi
          ? t("Ovqat qo'shsangiz, u shu yerda ovqat turi bo'yicha guruhlanadi.")
          : t("Bu kuni jurnalga ovqat qo'shilmagan.")
      }
    >
      {bugunmi && <QoshishTugmasi />}
    </BoshHolat>
  );
}

/** E9 — jurnal: bir kunning yozuvlari ovqat turi bo'yicha, tepada kunlik jami. */
export default async function JurnalSahifasi({ searchParams }: PageProps<"/jurnal">) {
  const tarjimon = await serverTarjimoni();
  const { t, erkin, til } = tarjimon;
  const bugun = bugunSana();
  const { sana: berilgan } = await searchParams;
  // Noto'g'ri yoki kelajakdagi sana — bugun ("YYYY-MM-DD" matnlari alifbo tartibida solishtiriladi).
  const sana =
    typeof berilgan === "string" && sanaYaroqli(berilgan) && berilgan <= bugun
      ? berilgan
      : bugun;

  const kun = await kunniYukla(sana);

  return (
    <>
      <main className="mx-auto w-full max-w-md px-4 pb-32">
        <header className="flex items-center gap-2 py-4">
          <OrqagaTugma
            nomi={t("Orqaga")}
            href="/"
            className={`-ml-3 ${STRELKA_QOLIPI} text-siyoh`}
          >
            <Strelka yonalish="chap" />
          </OrqagaTugma>
          <h1 className="text-sarlavha">{t("Jurnal")}</h1>
        </header>

        <div className="flex flex-col gap-6">
          <SanaTanlagich sana={sana} bugun={bugun} tarjimon={tarjimon} />

          {kun === null ? (
            <XatoKartasi
              sarlavha={t("Jurnalni yuklab bo'lmadi")}
              izoh={t("Serverga ulanolmadik. Internetni tekshirib, qayta urinib ko'ring.")}
            >
              <QaytaUrinish />
            </XatoKartasi>
          ) : (
            <>
              <KunlikJami
                jami={kun.jami}
                reja={kun.reja}
                makroOchiq={kun.makro ? !kun.makro.yopiq : false}
                tarjimon={tarjimon}
              />
              {!(kun.makro && !kun.makro.yopiq) && (
                // Prototip `JournalScreen`: qulf jami kartasining ostida.
                <ProQulfi zich sarlavha={t("Oqsil, yog' va uglevodlarni kuzatish — PRO")} />
              )}

              {kun.yozuvlar.length === 0 ? (
                <BoshKun bugunmi={sana === bugun} t={t} />
              ) : (
                turBoyichaGuruh(kun.yozuvlar).map((guruh) => (
                  <section key={guruh.turi} className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="text-karta-sarlavha">{erkin(guruh.turi)}</h2>
                      <p className="text-izoh text-matn-2 tabular-nums">
                        {t("{0} kkal", raqam(guruh.kaloriya))}
                      </p>
                    </div>
                    <ul className="flex flex-col gap-3">
                      {guruh.yozuvlar.map((yozuv) => (
                        <YozuvQatori
                          key={yozuv.id}
                          yozuv={yozuv}
                          til={til}
                          batafsil
                          qaytish={jurnalManzili(sana, bugun)}
                        />
                      ))}
                    </ul>
                  </section>
                ))
              )}
            </>
          )}
        </div>
      </main>

      {/* Jurnal panelda alohida bo'lim emas — u Asosiy ichidan ochiladi (prototip). */}
      <QoshishPaneli faol="asosiy" />
    </>
  );
}
