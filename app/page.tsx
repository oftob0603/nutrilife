import Link from "next/link";
import { KunlikDoira } from "@/app/_components/KunlikDoira";
import { MakroChizigi } from "@/app/_components/MakroChizigi";
import { YozuvQatori } from "@/app/_components/YozuvQatori";
import { QoshishPaneli } from "@/app/_components/QoshishPaneli";
import { NORMA } from "@/lib/norma";
import {
  bugunSana,
  sanaMatni,
  type Jami,
  type Yozuv,
} from "@/lib/services/yozuv-hisob";
import { apiAsos } from "@/lib/api-asos";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

type Kun = { yozuvlar: Yozuv[]; jami: Jami };

async function kunniYukla(): Promise<Kun | null> {
  try {
    const javob = await fetch(`${apiAsos()}/api/ovqat-yozuvlari`, {
      cache: "no-store",
    });
    if (!javob.ok) return null;
    return (await javob.json()) as Kun;
  } catch {
    return null;
  }
}

/** E1 xato holati: doira o'rnida karta, "+" tugmasi faolligicha qoladi. */
function XatoKartasi() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-karta border border-chegara bg-karta p-4 text-center">
      <p className="text-karta-sarlavha">Ma&apos;lumotni yuklab bo&apos;lmadi</p>
      <p className="text-izoh text-matn-2">
        Hisobot serveriga ulanolmadik. Internetni tekshirib, qayta urinib
        ko&apos;ring.
      </p>
    </div>
  );
}

function BoshHolat() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-karta border border-chegara bg-karta p-4 text-center">
      <p className="text-karta-sarlavha">
        Bugun hali hech narsa qo&apos;shilmadi
      </p>
      <p className="text-izoh text-matn-2">
        Birinchi ovqatni qo&apos;shsangiz, doira to&apos;lishni boshlaydi.
      </p>
    </div>
  );
}

export default async function HomeSahifasi() {
  const sana = bugunSana();
  const kun = await kunniYukla();
  const oxirgilar = kun ? kun.yozuvlar.slice(-3).reverse() : [];

  return (
    <>
      <main className="mx-auto w-full max-w-md px-4 pb-32">
        <header className="flex flex-col gap-1 py-4">
          <p className="text-izoh text-matn-2">{sanaMatni(sana)}</p>
          <h1 className="text-sarlavha">Bugun</h1>
        </header>

        <div className="flex flex-col gap-6">
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
                  <h2 className="text-karta-sarlavha">Bugungi ovqatlar</h2>
                  <Link
                    href="/jurnal"
                    className="-mr-2 flex min-h-11 items-center px-2 text-izoh font-medium text-matn-2"
                  >
                    Hammasi
                  </Link>
                </div>
                {oxirgilar.length === 0 ? (
                  <BoshHolat />
                ) : (
                  <ul className="flex flex-col gap-3">
                    {oxirgilar.map((yozuv) => (
                      <YozuvQatori key={yozuv.id} yozuv={yozuv} />
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      <QoshishPaneli />
    </>
  );
}
