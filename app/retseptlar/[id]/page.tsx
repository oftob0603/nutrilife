import Link from "next/link";
import { MakroChizigi } from "@/app/_components/MakroChizigi";
import { OrqagaTugma } from "@/app/_components/OrqagaTugma";
import { ProBelgisi } from "@/app/_components/ProBelgisi";
import { QaytaUrinish } from "@/app/_components/QaytaUrinish";
import { Ikona, type IkonaNomi } from "@/app/_components/retseptlar/Ikona";
import { RetseptRasmi } from "@/app/_components/retseptlar/RetseptRasmi";
import { SevimliTugmasi } from "@/app/_components/retseptlar/SevimliTugmasi";
import { sinf } from "@/app/_components/Tugma";
import { XatoKartasi } from "@/app/_components/XatoKartasi";
import { serverTarjimoni } from "@/lib/lugat/server";
import type { Tarjimon } from "@/lib/lugat/tarjima";
import type { Reja } from "@/lib/services/norma-hisob";
import { murakkablikKaliti, type RetseptOchiq, type RetseptYopiq } from "@/lib/services/retsept-hisob";
import { rejaniYukla, retseptniYukla } from "../yukla";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "Retsept — NutriLifer" };

const PRO_HAVOLA = "/pro?manba=imkoniyat";

function ChapStrelka() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/** Neytral belgi (prototip `Badge tone="neutral"`). */
function Belgi({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-chegara bg-fon px-2 py-[3px] text-belgi text-matn-2 tabular-nums whitespace-nowrap">
      {children}
    </span>
  );
}

function Bolim({ sarlavha, children }: { sarlavha: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-karta-sarlavha">{sarlavha}</h2>
      {children}
    </section>
  );
}

const KARTA = "flex flex-col gap-3 rounded-karta border border-karta-chegara bg-karta p-4";

/** Sarlavha qatori (prototip `ScreenHeader`): orqaga, nomi va kategoriya, o'ngda yurak. */
function Sarlavha({ nomi, kategoriya, ong, t }: { nomi: string; kategoriya: string | null; ong?: React.ReactNode; t: Tarjimon["t"] }) {
  return (
    <header className="flex items-center gap-3 py-4">
      <OrqagaTugma nomi={t("Orqaga")} href="/retseptlar" className="-ml-3 flex size-11 shrink-0 items-center justify-center rounded-chip text-siyoh">
        <ChapStrelka />
      </OrqagaTugma>
      <div className="flex min-w-0 flex-1 flex-col">
        {kategoriya && <span className="truncate text-izoh text-matn-2">{kategoriya}</span>}
        <h1 className="truncate text-sarlavha">{nomi}</h1>
      </div>
      {ong}
    </header>
  );
}

/** R2 — FREE foydalanuvchi PRO retseptni bosganda (prototip `RecipePaywallScreen`). */
function Paywall({ r, t }: { r: RetseptYopiq; t: Tarjimon["t"] }) {
  const qatorlar: [IkonaNomi, string][] = [
    ["flame", `${r.kaloriya === null ? "—" : t("{0} kkal", Math.round(r.kaloriya))}${r.porsiya ? ` · ${r.porsiya}` : ""}`],
    ["list", t("{0} ta masalliq", r.masalliqSoni)],
    ...(r.qadamSoni > 0 ? ([["chef-hat", t("{0} ta tayyorlash qadami", r.qadamSoni)]] as [IkonaNomi, string][]) : []),
    ["book-open", t("Barcha retseptlar ochiladi")],
  ];
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-12">
      <Sarlavha nomi={r.nomi} kategoriya={r.kategoriya} t={t} />
      <div className="flex flex-col gap-6">
        <div className="overflow-hidden rounded-karta">
          <RetseptRasmi
            rasm={r.rasm}
            balandlik="h-[200px]"
            xira
            ustiga={
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-siyoh text-on-siyoh">
                  <Ikona nomi="lock" olcham={24} />
                </span>
              </span>
            }
          />
        </div>
        <div className={`${KARTA} items-start`}>
          <ProBelgisi href={PRO_HAVOLA} />
          <span className="text-sarlavha">{t("Bu retsept PRO obunada")}</span>
          <span className="text-asosiy text-matn-2">{t("To'liq retseptni ko'rish uchun PRO obuna kerak.")}</span>
          <ul className="flex w-full flex-col gap-2">
            {qatorlar.map(([ikona, matn]) => (
              <li key={matn} className="flex items-center gap-3 text-asosiy">
                <span className="text-matn-2">
                  <Ikona nomi={ikona} olcham={18} />
                </span>
                {matn}
              </li>
            ))}
          </ul>
          <Link href={PRO_HAVOLA} className={sinf("pro")}>
            {t("PRO ni ochish")}
          </Link>
          <Link href="/retseptlar" className={sinf("uchinchi")}>
            {t("Hozir emas")}
          </Link>
        </div>
      </div>
    </main>
  );
}

/** R3 — to'liq retsept (prototip `RecipeScreen`). Qadamlar bo'sh bo'lsa "Tayyorlash" bo'limi chiqmaydi. */
function Detal({ r, reja, qulfSevimli, til, t }: { r: RetseptOchiq; reja: Reja | null; qulfSevimli: boolean; til: Tarjimon["til"]; t: Tarjimon["t"] }) {
  const murakkablik = murakkablikKaliti(r.murakkablik);
  const makrolar: [Parameters<typeof MakroChizigi>[0]["nomi"], number | null, keyof Reja][] = [
    ["Oqsil", r.oqsil, "oqsil"],
    ["Yog'", r.yog, "yog"],
    ["Uglevod", r.uglevod, "uglevod"],
  ];
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-12">
      <Sarlavha
        nomi={r.nomi}
        kategoriya={r.kategoriya}
        t={t}
        ong={<SevimliTugmasi id={r.id} sevimli={r.sevimli} yopiq={qulfSevimli} olcham={44} />}
      />
      <div className="flex flex-col gap-6">
        <div className="overflow-hidden rounded-karta">
          <RetseptRasmi rasm={r.rasm} balandlik="h-[200px]" />
        </div>

        <Bolim sarlavha={t("Bir porsiyada")}>
          <div className={KARTA}>
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] leading-none font-semibold tabular-nums">{r.kaloriya === null ? "—" : Math.round(r.kaloriya)}</span>
              <span className="text-izoh text-matn-2">{`${t("kkal")}${r.porsiya ? ` · ${r.porsiya}` : ""}`}</span>
            </div>
            {reja ? (
              <div className="flex flex-col gap-3">
                {makrolar.map(([nomi, qiymat, kalit]) => (
                  <MakroChizigi key={nomi} til={til} nomi={nomi} qiymat={qiymat ?? 0} maqsad={reja[kalit]} />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {makrolar.map(([nomi, qiymat]) => (
                  <Belgi key={nomi}>{`${t(nomi)} ${qiymat === null ? "—" : t("{0} g", Math.round(qiymat))}`}</Belgi>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {r.kaloriya !== null && <Belgi>{t("{0} kkal", Math.round(r.kaloriya))}</Belgi>}
              {r.vaqtDaqiqa !== null && <Belgi>{t("{0} daq", r.vaqtDaqiqa)}</Belgi>}
              {murakkablik && <Belgi>{t(murakkablik)}</Belgi>}
            </div>
          </div>
        </Bolim>

        <Bolim sarlavha={t("Masalliqlar")}>
          <ul className={KARTA}>
            {r.masalliqlar.map((m, i) => (
              <li key={i} className="flex gap-3 text-asosiy">
                <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-matn-3" />
                <span className="min-w-0 flex-1">{m}</span>
              </li>
            ))}
          </ul>
        </Bolim>

        {r.qadamlar.length > 0 && (
          <Bolim sarlavha={t("Tayyorlash")}>
            <ol className="flex flex-col gap-3">
              {r.qadamlar.map((q, i) => (
                <li key={i} className="flex gap-3 rounded-karta border border-karta-chegara bg-karta p-4">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-siyoh text-belgi font-medium text-on-siyoh tabular-nums">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-asosiy">{q}</span>
                </li>
              ))}
            </ol>
          </Bolim>
        )}
      </div>
    </main>
  );
}

export default async function RetseptSahifasi({ params }: PageProps<"/retseptlar/[id]">) {
  const { t, til } = await serverTarjimoni();
  const { id } = await params;
  const [javob, reja] = await Promise.all([retseptniYukla(id), rejaniYukla()]);
  if (javob === "sessiyasiz") return null;

  if (javob === "topilmadi" || javob === null) {
    return (
      <main className="mx-auto w-full max-w-md px-4 pb-12">
        <Sarlavha nomi={t("Retseptlar")} kategoriya={null} t={t} />
        {javob === null ? (
          <XatoKartasi sarlavha={t("Retseptlarni yuklab bo'lmadi")}>
            <QaytaUrinish />
          </XatoKartasi>
        ) : (
          <XatoKartasi sarlavha={t("Retsept topilmadi")}>
            <Link href="/retseptlar" className={sinf("ikkilamchi")}>
              {t("Retseptlarga qaytish")}
            </Link>
          </XatoKartasi>
        )}
      </main>
    );
  }

  const { retsept, qulf } = javob;
  return retsept.yopiq ? <Paywall r={retsept} t={t} /> : <Detal r={retsept} reja={reja} qulfSevimli={qulf.sevimli} til={til} t={t} />;
}
