import { redirect } from "next/navigation";
import { OrqagaSarlavha } from "@/app/_components/profil/OrqagaSarlavha";
import { TugmaHavola } from "@/app/_components/Tugma";
import { serverdanApi } from "@/lib/api-asos";
import { serverTarjimoni } from "@/lib/lugat/server";
import {
  nuqtaliSana,
  tarifNomi,
  tugashSanasi,
  type ObunaTafsiloti,
} from "@/lib/services/obuna-hisob";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "Obuna — NutriLifer" };

/** "sessiyasiz" — havola sessiyasiz ochilgan; null — yuklab bo'lmadi. */
async function obunaniYukla(): Promise<ObunaTafsiloti | "sessiyasiz" | null> {
  try {
    const javob = await serverdanApi("/api/obuna");
    if (javob.status === 401) return "sessiyasiz";
    if (!javob.ok) return null;
    return ((await javob.json()) as { obuna: ObunaTafsiloti }).obuna;
  } catch {
    return null;
  }
}

function Qator({ nomi, qiymat }: { nomi: string; qiymat: string }) {
  return (
    <div className="flex min-h-11 items-center gap-3 border-t border-chegara px-4 py-3 first:border-t-0">
      <dt className="shrink-0 text-asosiy">{nomi}</dt>
      <dd className="min-w-0 flex-1 text-right text-izoh text-matn-2 tabular-nums">{qiymat}</dd>
    </div>
  );
}

/**
 * F4 — obuna ekrani: joriy holat, tarif va muddat. Bu yerga faqat faol PRO'dan kiriladi
 * (F1'dagi "Obunani boshqarish"); FREE va muddati tugagan hisob profilga qaytariladi.
 * To'lovlar tarixi va "Obunani bekor qilish" S5'da to'lov va eslatmalar bilan keladi.
 */
export default async function ObunaSahifasi() {
  const { t } = await serverTarjimoni();
  const obuna = await obunaniYukla();
  if (obuna === "sessiyasiz") return null;
  if (obuna && !obuna.muddat) redirect("/profil");

  const muddat = obuna?.muddat ?? null;
  const tarif = muddat && tarifNomi(muddat.tarif);

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-12">
      <OrqagaSarlavha sarlavha={t("Obuna")} orqagaNomi={t("Orqaga")} href="/profil" />

      {muddat === null ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-6 text-center"
        >
          <p className="text-karta-sarlavha">{t("Obunani yuklab bo'lmadi")}</p>
          <p className="text-izoh text-matn-2">
            {t("Serverga ulanolmadik. Internetni tekshirib, qayta urinib ko'ring.")}
          </p>
          <TugmaHavola korinish="ikkilamchi" href="/profil/obuna">
            {t("Qayta urinish")}
          </TugmaHavola>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <dl className="overflow-hidden rounded-karta border border-karta-chegara bg-karta">
            <Qator nomi={t("Holat")} qiymat={t("Faol")} />
            {tarif && <Qator nomi={t("Tarif")} qiymat={t(tarif)} />}
            <Qator nomi={t("Boshlangan")} qiymat={nuqtaliSana(muddat.boshlanish)} />
            <Qator nomi={t("Tugaydi")} qiymat={tugashSanasi(muddat.tugash)} />
            {!tarif && <Qator nomi={t("Manba")} qiymat={t("Administrator tomonidan berilgan")} />}
          </dl>

          <section className="flex flex-col gap-2">
            <h2 className="text-karta-sarlavha">{t("To'lovlar tarixi")}</h2>
            <p className="rounded-karta border border-karta-chegara bg-karta p-4 text-izoh text-matn-2">
              {tarif
                ? t("Hozircha to'lov yo'q")
                : t("Administrator tomonidan berilgan obuna — to'lov yozuvi yo'q.")}
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
