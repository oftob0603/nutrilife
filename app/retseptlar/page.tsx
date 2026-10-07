import Link from "next/link";
import { BoshHolat } from "@/app/_components/BoshHolat";
import { OflaynChizigi } from "@/app/_components/OflaynChizigi";
import { QaytaUrinish } from "@/app/_components/QaytaUrinish";
import { QoshishPaneli } from "@/app/_components/QoshishPaneli";
import { RetseptKartasi } from "@/app/_components/retseptlar/RetseptKartasi";
import { XatoKartasi } from "@/app/_components/XatoKartasi";
import { serverTarjimoni } from "@/lib/lugat/server";
import {
  chipBoyicha,
  chipniOqi,
  HAMMASI_CHIPI,
  retseptlarManzili,
  SEVIMLI_CHIPI,
} from "@/lib/services/retsept-hisob";
import { retseptlarniYukla } from "./yukla";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "Retseptlar — NutriLifer" };

const PRO_HAVOLA = "/pro?manba=imkoniyat";

/** Kategoriya chipi (prototip `Chip`): tanlangani siyoh to'ldiruvda; PRO chipi gradiyentda. */
function Chip({ href, tanlangan, pro = false, children }: { href: string; tanlangan: boolean; pro?: boolean; children: React.ReactNode }) {
  const korinish = pro
    ? "bg-(image:--pro-gradient) text-(--pro-fg)"
    : tanlangan
      ? "border border-siyoh bg-siyoh text-on-siyoh"
      : "border border-chegara bg-karta text-siyoh";
  return (
    <Link
      href={href}
      replace
      aria-current={tanlangan ? "true" : undefined}
      className={`inline-flex min-h-10 items-center rounded-full px-4 text-izoh font-medium whitespace-nowrap transition-transform active:scale-[0.98] ${korinish}`}
    >
      {children}
    </Link>
  );
}

/**
 * R1 — retseptlar (prototip screens-recipes.jsx `RecipesScreen`). Faqat chop etilganlar; FREE'ga
 * sarlavha, rasm, kaloriya va vaqt ko'rinadi, kartalar PRO belgisi bilan xira. Chiplar: Sevimli
 * (PRO; yopiq bo'lsa "Sevimli · PRO" va W1'ga olib boradi) · Hammasi · mavjud kategoriyalar.
 * Kategoriya qiymatlari bazadagi o'zbekcha nom — tarjima qilinmaydi (admin kiritgan matn).
 */
export default async function RetseptlarSahifasi({ searchParams }: PageProps<"/retseptlar">) {
  const { t } = await serverTarjimoni();
  const [{ kat }, javob] = await Promise.all([searchParams, retseptlarniYukla()]);
  // Sessiyasiz ochilgan havola: sahifa kirish pardasi ostida bo'sh turadi (profil bilan bir xil).
  if (javob === "sessiyasiz") return null;

  const kategoriyalar = javob?.kategoriyalar ?? [];
  const chip = chipniOqi(kat, kategoriyalar);
  const sevimliOchiq = javob ? !javob.qulf.sevimli : false;
  const qatorlar = javob ? chipBoyicha(javob.retseptlar, chip, sevimliOchiq) : [];

  return (
    <>
      <OflaynChizigi />
      <main className="mx-auto w-full max-w-md px-4 pb-32">
        <header className="flex flex-col gap-1 py-4">
          <h1 className="text-sarlavha">{t("Retseptlar")}</h1>
          {javob && <span className="text-izoh text-matn-2">{t("{0} ta retsept", javob.retseptlar.length)}</span>}
        </header>

        {javob === null ? (
          <XatoKartasi sarlavha={t("Retseptlarni yuklab bo'lmadi")}>
            <QaytaUrinish />
          </XatoKartasi>
        ) : (
          <div className="flex flex-col gap-6">
            <nav aria-label={t("Kategoriyalar")} className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
              {sevimliOchiq ? (
                <Chip href={retseptlarManzili(SEVIMLI_CHIPI)} tanlangan={chip === SEVIMLI_CHIPI}>
                  {t("Sevimli")}
                </Chip>
              ) : (
                <Chip href={PRO_HAVOLA} tanlangan={false} pro>
                  {`${t("Sevimli")} · PRO`}
                </Chip>
              )}
              <Chip href={retseptlarManzili(HAMMASI_CHIPI)} tanlangan={chip === HAMMASI_CHIPI}>
                {t("Hammasi")}
              </Chip>
              {kategoriyalar.map((k) => (
                <Chip key={k} href={retseptlarManzili(k)} tanlangan={chip === k}>
                  {k}
                </Chip>
              ))}
            </nav>

            {javob.retseptlar.length === 0 ? (
              <BoshHolat ikona="kitob" sarlavha={t("Hozircha retsept yo'q")} izoh={t("Yangi retseptlar qo'shilgach shu yerda ko'rinadi.")} />
            ) : qatorlar.length === 0 ? (
              chip === SEVIMLI_CHIPI ? (
                <BoshHolat ikona="yurak" sarlavha={t("Sevimli retsept yo'q")} izoh={t("Retsept ustidagi yurakni bossangiz, shu yerda yig'iladi.")} />
              ) : (
                <BoshHolat ikona="qidiruv" sarlavha={t("«{0}» bo'yicha retsept yo'q", chip)} />
              )
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {qatorlar.map((r) => (
                  <RetseptKartasi key={r.id} retsept={r} qulf={javob.qulf} t={t} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <QoshishPaneli faol="retseptlar" />
    </>
  );
}
