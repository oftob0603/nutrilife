import Link from "next/link";
import { KunlikDoira } from "@/app/_components/KunlikDoira";
import { KunTanlagich } from "@/app/_components/KunTanlagich";
import { MakroChizigi } from "@/app/_components/MakroChizigi";
import { YozuvQatori } from "@/app/_components/YozuvQatori";
import { QoshishPaneli, QoshishTugmasi } from "@/app/_components/QoshishPaneli";
import { NORMA } from "@/lib/norma";
import {
  bugunSana,
  qoshniSana,
  sanaMatni,
  sanaYaroqli,
  type Jami,
  type Yozuv,
} from "@/lib/services/yozuv-hisob";
import { serverdanApi } from "@/lib/api-asos";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

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

/** E1 xato holati: doira o'rnida karta, "+" tugmasi faolligicha qoladi. */
function XatoKartasi() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-4 text-center">
      <p className="text-karta-sarlavha">Ma&apos;lumotni yuklab bo&apos;lmadi</p>
      <p className="text-izoh text-matn-2">
        Hisobot serveriga ulanolmadik. Internetni tekshirib, qayta urinib
        ko&apos;ring.
      </p>
    </div>
  );
}

/** E1 bo'sh holati. Yangi yozuv doim bugunga tushadi, shuning uchun tugma faqat bugun chiqadi. */
function BoshHolat({ bugunmi }: { bugunmi: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-4 text-center">
      <p className="text-karta-sarlavha">
        {bugunmi ? "Bugun hali hech narsa qo'shilmadi" : "Bu kunda yozuv yo'q"}
      </p>
      <p className="text-izoh text-matn-2">
        {bugunmi
          ? "Birinchi ovqatni qo'shsangiz, doira to'lishni boshlaydi."
          : "Bu kuni jurnalga ovqat qo'shilmagan."}
      </p>
      {bugunmi && <QoshishTugmasi>Birinchi ovqatni qo&apos;shish</QoshishTugmasi>}
    </div>
  );
}

/** E1 — Home. Kun tanlagichda tanlangan kun `?sana=` orqali keladi (standart — bugun). */
export default async function HomeSahifasi({ searchParams }: PageProps<"/">) {
  const bugun = bugunSana();
  const { sana: berilgan } = await searchParams;
  // Noto'g'ri yoki kelajakdagi sana — bugun ("YYYY-MM-DD" matnlari alifbo tartibida solishtiriladi).
  const sana =
    typeof berilgan === "string" && sanaYaroqli(berilgan) && berilgan <= bugun
      ? berilgan
      : bugun;
  const bugunmi = sana === bugun;
  const manzilQoshimchasi = bugunmi ? "" : `?sana=${sana}`;

  const kun = await kunniYukla(sana);
  const oxirgilar = kun ? kun.yozuvlar.slice(-3).reverse() : [];

  return (
    <>
      <main className="mx-auto w-full max-w-md px-4 pb-32">
        <header className="flex flex-col gap-1 py-4">
          <p className="text-izoh text-matn-2">{sanaMatni(sana)}</p>
          <h1 className="text-sarlavha">
            {bugunmi ? "Bugun" : sana === qoshniSana(bugun, -1) ? "Kecha" : "O'tgan kun"}
          </h1>
        </header>

        <div className="flex flex-col gap-6">
          <KunTanlagich sana={sana} bugun={bugun} />

          {kun === null ? (
            <XatoKartasi />
          ) : (
            <>
              <KunlikDoira qiymat={kun.jami.kaloriya} norma={NORMA.kaloriya} />

              <div className="flex gap-4">
                <MakroChizigi
                  nomi="Oqsil"
                  qiymat={kun.jami.oqsil}
                  maqsad={NORMA.oqsil}
                />
                <MakroChizigi
                  nomi="Yog'"
                  qiymat={kun.jami.yog}
                  maqsad={NORMA.yog}
                />
                <MakroChizigi
                  nomi="Uglevod"
                  qiymat={kun.jami.uglevod}
                  maqsad={NORMA.uglevod}
                />
              </div>

              <section className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-karta-sarlavha">
                    {bugunmi ? "Bugungi ovqatlar" : "Shu kungi ovqatlar"}
                  </h2>
                  <Link
                    href={`/jurnal${manzilQoshimchasi}`}
                    className="-mr-2 flex min-h-11 items-center px-2 text-izoh font-medium text-matn-2"
                  >
                    Hammasi
                  </Link>
                </div>
                {oxirgilar.length === 0 ? (
                  <BoshHolat bugunmi={bugunmi} />
                ) : (
                  <ul className="flex flex-col gap-3">
                    {oxirgilar.map((yozuv) => (
                      <YozuvQatori
                        key={yozuv.id}
                        yozuv={yozuv}
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
