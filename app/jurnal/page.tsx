import Link from "next/link";
import { MakroChizigi } from "@/app/_components/MakroChizigi";
import { QoshishPaneli, QoshishTugmasi } from "@/app/_components/QoshishPaneli";
import { TugmaHavola } from "@/app/_components/Tugma";
import { YozuvQatori } from "@/app/_components/YozuvQatori";
import { serverdanApi } from "@/lib/api-asos";
import { serverTarjimoni } from "@/lib/lugat/server";
import type { Tarjimon } from "@/lib/lugat/tarjima";
import { NORMA } from "@/lib/norma";
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

export const metadata = { title: "Jurnal — Nutrilife" };

type Kun = { yozuvlar: Yozuv[]; jami: Jami };

async function kunniYukla(sana: string): Promise<Kun | null> {
  try {
    const javob = await serverdanApi(`/api/ovqat-yozuvlari?sana=${sana}`);
    if (!javob.ok) return null;
    return (await javob.json()) as Kun;
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

function KunlikJami({ jami, tarjimon: { t, til } }: { jami: Jami; tarjimon: Tarjimon }) {
  return (
    <section
      aria-label={t("Kunlik jami")}
      className="flex flex-col gap-4 rounded-karta border border-karta-chegara bg-karta p-4"
    >
      <p className="flex items-baseline gap-2">
        <span className="font-display text-raqam tabular-nums">{raqam(jami.kaloriya)}</span>
        <span className="text-izoh text-matn-2 tabular-nums">
          {t("/ {0} kkal", raqam(NORMA.kaloriya))}
        </span>
      </p>
      <div className="flex gap-4">
        <MakroChizigi til={til} nomi="Oqsil" qiymat={jami.oqsil} maqsad={NORMA.oqsil} />
        <MakroChizigi til={til} nomi="Yog'" qiymat={jami.yog} maqsad={NORMA.yog} />
        <MakroChizigi til={til} nomi="Uglevod" qiymat={jami.uglevod} maqsad={NORMA.uglevod} />
      </div>
    </section>
  );
}

/** Bo'sh holat: nima yo'q, nega yo'q va (faqat bugun uchun) bitta harakat (dizayn-tz E9). */
function BoshKun({ bugunmi, t }: { bugunmi: boolean } & Pick<Tarjimon, "t">) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-6 text-center">
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
        className="text-matn-3"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
      </svg>
      <p className="text-karta-sarlavha">{t("Bu kunda yozuv yo'q")}</p>
      <p className="text-izoh text-matn-2">
        {bugunmi
          ? t("Bugun hali hech narsa qo'shilmadi. Birinchi ovqatni qo'shing.")
          : t("Bu kuni jurnalga ovqat qo'shilmagan.")}
      </p>
      {bugunmi && <QoshishTugmasi />}
    </div>
  );
}

function YuklanmadiKartasi({ manzil, t }: { manzil: string } & Pick<Tarjimon, "t">) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-6 text-center"
    >
      <p className="text-karta-sarlavha">{t("Jurnalni yuklab bo'lmadi")}</p>
      <p className="text-izoh text-matn-2">
        {t("Serverga ulanolmadik. Internetni tekshirib, qayta urinib ko'ring.")}
      </p>
      <TugmaHavola korinish="ikkilamchi" href={manzil}>
        {t("Qayta urinish")}
      </TugmaHavola>
    </div>
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
          <Link
            href="/"
            aria-label={t("Orqaga")}
            className={`-ml-3 ${STRELKA_QOLIPI} text-siyoh`}
          >
            <Strelka yonalish="chap" />
          </Link>
          <h1 className="text-sarlavha">{t("Jurnal")}</h1>
        </header>

        <div className="flex flex-col gap-6">
          <SanaTanlagich sana={sana} bugun={bugun} tarjimon={tarjimon} />

          {kun === null ? (
            <YuklanmadiKartasi manzil={jurnalManzili(sana, bugun)} t={t} />
          ) : (
            <>
              <KunlikJami jami={kun.jami} tarjimon={tarjimon} />

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
