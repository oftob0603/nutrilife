import Link from "next/link";
import { KunlikDoira } from "@/app/_components/KunlikDoira";
import { KunTanlagich } from "@/app/_components/KunTanlagich";
import { MakroChizigi } from "@/app/_components/MakroChizigi";
import { YozuvQatori } from "@/app/_components/YozuvQatori";
import { QoshishPaneli, QoshishTugmasi } from "@/app/_components/QoshishPaneli";
import type { Reja } from "@/lib/services/norma-hisob";
import type { Profil } from "@/lib/services/profil-hisob";
import {
  bugunSana,
  qoshniSana,
  sanaMatni,
  sanaYaroqli,
  type Jami,
  type Yozuv,
} from "@/lib/services/yozuv-hisob";
import { serverdanApi } from "@/lib/api-asos";
import { serverTarjimoni } from "@/lib/lugat/server";
import type { Tarjimon } from "@/lib/lugat/tarjima";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

type Kun = { yozuvlar: Yozuv[]; jami: Jami; reja: Reja };

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

/** Salom uchun ism. Yuklanmasa sarlavha ismsiz chiqadi — Home shu sababli buzilmaydi. */
async function ismniYukla(): Promise<string | null> {
  try {
    const javob = await serverdanApi("/api/profil");
    if (!javob.ok) return null;
    return ((await javob.json()) as { profil: Pick<Profil, "ism"> }).profil.ism;
  } catch {
    return null;
  }
}

/** E1 xato holati: doira o'rnida karta, "+" tugmasi faolligicha qoladi. */
function XatoKartasi({ t }: Pick<Tarjimon, "t">) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-4 text-center">
      <p className="text-karta-sarlavha">{t("Ma'lumotni yuklab bo'lmadi")}</p>
      <p className="text-izoh text-matn-2">
        {t("Hisobot serveriga ulanolmadik. Internetni tekshirib, qayta urinib ko'ring.")}
      </p>
    </div>
  );
}

/** E1 bo'sh holati. Yangi yozuv doim bugunga tushadi, shuning uchun tugma faqat bugun chiqadi. */
function BoshHolat({ bugunmi, t }: { bugunmi: boolean } & Pick<Tarjimon, "t">) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-4 text-center">
      <p className="text-karta-sarlavha">
        {bugunmi ? t("Bugun hali hech narsa qo'shilmadi") : t("Bu kunda yozuv yo'q")}
      </p>
      <p className="text-izoh text-matn-2">
        {bugunmi
          ? t("Birinchi ovqatni qo'shsangiz, doira to'lishni boshlaydi.")
          : t("Bu kuni jurnalga ovqat qo'shilmagan.")}
      </p>
      {bugunmi && <QoshishTugmasi>{t("Birinchi ovqatni qo'shish")}</QoshishTugmasi>}
    </div>
  );
}

/** E1 — Home. Kun tanlagichda tanlangan kun `?sana=` orqali keladi (standart — bugun). */
export default async function HomeSahifasi({ searchParams }: PageProps<"/">) {
  const { t, til } = await serverTarjimoni();
  const bugun = bugunSana();
  const { sana: berilgan } = await searchParams;
  // Noto'g'ri yoki kelajakdagi sana — bugun ("YYYY-MM-DD" matnlari alifbo tartibida solishtiriladi).
  const sana =
    typeof berilgan === "string" && sanaYaroqli(berilgan) && berilgan <= bugun
      ? berilgan
      : bugun;
  const bugunmi = sana === bugun;
  const manzilQoshimchasi = bugunmi ? "" : `?sana=${sana}`;

  const [kun, ism] = await Promise.all([kunniYukla(sana), bugunmi ? ismniYukla() : null]);
  const oxirgilar = kun ? kun.yozuvlar.slice(-3).reverse() : [];

  return (
    <>
      <main className="mx-auto w-full max-w-md px-4 pb-32">
        <header className="flex flex-col gap-1 py-4">
          <p className="text-izoh text-matn-2">{sanaMatni(sana, til)}</p>
          <h1 className="text-sarlavha">
            {bugunmi
              ? ism
                ? t("Xush kelibsiz, {0}", ism)
                : t("Xush kelibsiz")
              : sana === qoshniSana(bugun, -1)
                ? t("Kecha")
                : t("O'tgan kun")}
          </h1>
        </header>

        <div className="flex flex-col gap-6">
          <KunTanlagich sana={sana} bugun={bugun} til={til} />

          {kun === null ? (
            <XatoKartasi t={t} />
          ) : (
            <>
              <KunlikDoira qiymat={kun.jami.kaloriya} norma={kun.reja.kaloriya} />

              <div className="flex gap-4">
                <MakroChizigi
                  til={til}
                  nomi="Oqsil"
                  qiymat={kun.jami.oqsil}
                  maqsad={kun.reja.oqsil}
                />
                <MakroChizigi
                  til={til}
                  nomi="Yog'"
                  qiymat={kun.jami.yog}
                  maqsad={kun.reja.yog}
                />
                <MakroChizigi
                  til={til}
                  nomi="Uglevod"
                  qiymat={kun.jami.uglevod}
                  maqsad={kun.reja.uglevod}
                />
              </div>

              <section className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-karta-sarlavha">
                    {bugunmi ? t("Bugungi ovqatlar") : t("Shu kungi ovqatlar")}
                  </h2>
                  <Link
                    href={`/jurnal${manzilQoshimchasi}`}
                    className="-mr-2 flex min-h-11 items-center px-2 text-izoh font-medium text-matn-2"
                  >
                    {t("Hammasi")}
                  </Link>
                </div>
                {oxirgilar.length === 0 ? (
                  <BoshHolat bugunmi={bugunmi} t={t} />
                ) : (
                  <ul className="flex flex-col gap-3">
                    {oxirgilar.map((yozuv) => (
                      <YozuvQatori
                        key={yozuv.id}
                        yozuv={yozuv}
                        til={til}
                        qaytish={`/${manzilQoshimchasi}`}
                      />
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      <QoshishPaneli faol="asosiy" />
    </>
  );
}
