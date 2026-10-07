import { son } from "@/lib/services/admin-hisob";
import {
  davrniOqi,
  haftaKuniNomiToliq,
  METRIKALAR,
  oyNomi,
  oyQisqa,
  som,
} from "@/lib/services/admin-statistika-hisob";
import { haftaKuniNomi, kunOyMatni } from "@/lib/services/yozuv-hisob";
import { AdminSahifa } from "../_components/AdminSahifa";
import { DaromadUstunlari } from "../_components/DaromadUstunlari";
import { DavrTanlovi } from "../_components/DavrTanlovi";
import { MetrikaGrafigi } from "../_components/MetrikaGrafigi";
import { StatKarta } from "../_components/StatKarta";
import { XatoHolati } from "../_components/XatoHolati";
import { statistikaniYukla } from "../yukla";

export const dynamic = "force-dynamic";

export const metadata = { title: "Statistika — Admin" };

/** Sarlavha izohi — PRD 9-bo'lim 1-savol hal bo'lgan (DECISIONS 2026-09-21). */
const IZOH = "North star — 7-kun retention; kunlik faol va PRO obunachilar yordamchi metrika";

/**
 * A10 — statistika (admin-tz.md, prototip screens-dash.jsx). Davr manzilda; beshta metrika
 * grafigi va daromad bo'limi. Daromad obunalar jadvalidan tarif narxi bo'yicha — hozircha
 * to'lov yo'q, admin bergan PRO ham sanaladi (DECISIONS 2026-10-07). Skan tannarxi kartasi
 * qo'yilmadi — egasi so'ramadi.
 */
export default async function StatistikaSahifasi({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const davr = davrniOqi(params.davr);
  const s = await statistikaniYukla(davr);

  return (
    <AdminSahifa sarlavha="Statistika" izoh={IZOH}>
      <DavrTanlovi davr={davr} />
      {!s ? (
        <XatoHolati xabar="Statistikani yuklab bo'lmadi" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {METRIKALAR.map((m) => {
              const seriya = s.metrikalar.find((x) => x.kalit === m.kalit);
              return (
                <MetrikaGrafigi
                  key={m.kalit}
                  tavsif={m}
                  nuqtalar={seriya?.nuqtalar ?? []}
                  jami={seriya?.jami ?? null}
                  davr={s.davr}
                />
              );
            })}
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="text-karta-sarlavha">Daromad</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatKarta
                seriya={2}
                nomi="Umumiy daromad"
                qiymat={som(s.daromad.jami)}
                izoh={`${son(s.daromad.jamiSoni)} obuna · boshidan bugungacha`}
              />
              <StatKarta
                seriya={1}
                nomi="Bugungi daromad"
                qiymat={som(s.daromad.bugun)}
                izoh={`${son(s.daromad.bugunSoni)} obuna · ${kunOyMatni(s.bugun)}`}
              />
              <StatKarta
                seriya={3}
                nomi="So'nggi 7 kunlik daromad"
                qiymat={som(s.daromad.kunlar.reduce((j, k) => j + k.summa, 0))}
                izoh={`${kunOyMatni(s.daromad.kunlar[0].sana)} — bugun`}
              />
              <StatKarta
                seriya={4}
                nomi={`Joriy oy — ${oyNomi(s.bugun.slice(0, 7))}`}
                qiymat={som(s.daromad.joriyOy)}
                izoh="oy boshidan bugungacha"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <DaromadUstunlari
                nomi="Oylik daromad"
                seriya={4}
                ustunlar={s.daromad.oylar.map((o) => ({
                  kalit: o.oy,
                  yorliq: oyQisqa(o.oy),
                  toliq: oyNomi(o.oy),
                  summa: o.summa,
                }))}
              />
              <DaromadUstunlari
                nomi="So'nggi 7 kun — kunlik daromad"
                seriya={3}
                zich
                ustunlar={s.daromad.kunlar.map((k) => ({
                  kalit: k.sana,
                  yorliq: haftaKuniNomi(k.sana),
                  toliq: `${kunOyMatni(k.sana)}, ${haftaKuniNomiToliq(k.sana)}`,
                  summa: k.summa,
                }))}
              />
            </div>
            <p className="text-izoh text-matn-2">
              {"Summalar obunalar bo'yicha tarif narxidan hisoblanadi. Admin qo'lda bergan PRO ham sanaladi; tarifsiz muddat uzaytirish daromadga kirmaydi."}
            </p>
          </section>
        </>
      )}
    </AdminSahifa>
  );
}
