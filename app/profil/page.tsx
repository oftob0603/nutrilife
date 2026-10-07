import { Avatar } from "@/app/_components/Avatar";
import { OflaynChizigi } from "@/app/_components/OflaynChizigi";
import { ProBelgisi } from "@/app/_components/ProBelgisi";
import { QaytaUrinish } from "@/app/_components/QaytaUrinish";
import { Sozlamalar } from "@/app/_components/profil/Sozlamalar";
import { QoshishPaneli } from "@/app/_components/QoshishPaneli";
import { TugmaHavola } from "@/app/_components/Tugma";
import { XatoKartasi } from "@/app/_components/XatoKartasi";
import { serverTarjimoni } from "@/lib/lugat/server";
import type { Tarjimon } from "@/lib/lugat/tarjima";
import type { SkanQoldigi } from "@/lib/services/huquqlar";
import {
  maqsadNomi,
  obunaSarlavhasi,
  vaznMatni,
  type Profil,
} from "@/lib/services/profil-hisob";
import { raqam } from "@/lib/services/raqam";
import { adminniYukla, profilniYukla, skanLimitiniYukla } from "./yukla";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "Profil — NutriLifer" };

/** Obuna kartasi: FREE, faol PRO yoki muddati tugagan PRO (profil-tz.md, F1). */
function ObunaKartasi({
  obuna,
  skan,
  tarjimon,
}: {
  obuna: Profil["obuna"];
  skan: SkanQoldigi | null;
  tarjimon: Tarjimon;
}) {
  const { t } = tarjimon;

  return (
    <section className="flex flex-col items-start gap-3 rounded-karta border border-karta-chegara bg-karta p-4">
      {/* Prototip F1: belgi uch rolda ham; PRO bo'lmaganda bosilsa tariflar ochiladi. */}
      {obuna.holat === "pro" ? <ProBelgisi /> : <ProBelgisi href="/pro?manba=profil" />}
      <p className="text-karta-sarlavha">{obunaSarlavhasi(obuna, tarjimon)}</p>
      {skan && (
        <p className="text-izoh text-matn-2 tabular-nums">
          {t("{0} tadan {1} ta skan qoldi", skan.soni, skan.qoldi)}
        </p>
      )}
      {obuna.holat === "tugagan" && (
        <p className="text-izoh text-matn-2">
          {t(
            "Jurnal, tarix va progress o'qish uchun ochiq. Yangi AI skan va boshqa PRO imkoniyatlari yopildi.",
          )}
        </p>
      )}
      {obuna.holat === "pro" ? (
        <TugmaHavola korinish="ikkilamchi" href="/profil/obuna">
          {t("Obunani boshqarish")}
        </TugmaHavola>
      ) : (
        <TugmaHavola korinish="pro" href="/pro?manba=profil">
          {obuna.holat === "tugagan" ? t("Yangilash") : t("PRO haqida")}
        </TugmaHavola>
      )}
    </section>
  );
}

function Qator({ nomi, qiymat }: { nomi: string; qiymat: string }) {
  return (
    <div className="flex min-h-11 items-center gap-3 border-t border-chegara px-4 py-3 first:border-t-0">
      <dt className="min-w-0 flex-1 truncate text-asosiy">{nomi}</dt>
      <dd className="whitespace-nowrap text-izoh text-matn-2 tabular-nums">{qiymat}</dd>
    </div>
  );
}

/** F1 — profil bosh ekrani; sozlama qatorlari ham shu yerda (alohida sozlamalar sahifasi yo'q). */
export default async function ProfilSahifasi() {
  const tarjimon = await serverTarjimoni();
  const { t } = tarjimon;
  // Parallel: skan hisoblagichi profil ochilishini sekinlashtirmasin.
  const [profil, skan, admin] = await Promise.all([
    profilniYukla(),
    skanLimitiniYukla(),
    adminniYukla(),
  ]);
  // Sessiyasiz ochilgan havola: sahifa kirish pardasi ostida bo'sh turadi, kirgach
  // `KirishDarvozasi` uni sessiya bilan qayta so'raydi.
  if (profil === "sessiyasiz") return null;

  const maqsad = profil ? maqsadNomi(profil.maqsad) : null;

  return (
    <>
      <OflaynChizigi />
      <main className="mx-auto w-full max-w-md px-4 pb-32">
        <header className="py-4">
          <h1 className="text-sarlavha">{t("Profil")}</h1>
        </header>

        {profil === null ? (
          <XatoKartasi sarlavha={t("Profilni yuklab bo'lmadi")}>
            <QaytaUrinish />
          </XatoKartasi>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Avatar manzil={profil.avatarUrl} ism={profil.ism} />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="truncate text-sarlavha">{profil.ism ?? t("Ism kiritilmagan")}</p>
                <p className="text-izoh text-matn-2 tabular-nums">
                  {t("Ilovada {0} kun", profil.ilovadaKun)}
                </p>
              </div>
            </div>

            <ObunaKartasi obuna={profil.obuna} skan={skan} tarjimon={tarjimon} />

            {(maqsad || profil.joriyVazn !== null) && (
              <section className="flex flex-col gap-2">
                <h2 className="text-karta-sarlavha">{t("Qisqacha")}</h2>
                <dl className="overflow-hidden rounded-karta border border-karta-chegara bg-karta">
                  {maqsad && <Qator nomi={t("Asosiy maqsad")} qiymat={t(maqsad)} />}
                  {profil.joriyVazn !== null && (
                    <Qator
                      nomi={t("Joriy vazn")}
                      qiymat={vaznMatni(profil.joriyVazn, profil.sozlamalar.vaznBirligi, tarjimon)}
                    />
                  )}
                  {profil.maqsadVazn !== null && (
                    <Qator
                      nomi={t("Maqsad vazn")}
                      qiymat={vaznMatni(profil.maqsadVazn, profil.sozlamalar.vaznBirligi, tarjimon)}
                    />
                  )}
                  {profil.norma !== null && (
                    <Qator nomi={t("Kunlik norma")} qiymat={t("{0} kkal", raqam(profil.norma))} />
                  )}
                </dl>
              </section>
            )}

            <Sozlamalar boshlangich={profil.sozlamalar} admin={admin} />
          </div>
        )}
      </main>

      <QoshishPaneli faol="profil" />
    </>
  );
}
