import { Avatar } from "@/app/_components/Avatar";
import { QoshishPaneli } from "@/app/_components/QoshishPaneli";
import { TugmaHavola } from "@/app/_components/Tugma";
import { serverdanApi } from "@/lib/api-asos";
import { serverTarjimoni } from "@/lib/lugat/server";
import type { Tarjimon } from "@/lib/lugat/tarjima";
import {
  maqsadNomi,
  obunaSarlavhasi,
  vaznMatni,
  type Profil,
} from "@/lib/services/profil-hisob";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "Profil — Nutrilife" };

async function profilniYukla(): Promise<Profil | "sessiyasiz" | null> {
  try {
    const javob = await serverdanApi("/api/profil");
    if (javob.status === 401) return "sessiyasiz";
    if (!javob.ok) return null;
    return ((await javob.json()) as { profil: Profil }).profil;
  } catch {
    return null;
  }
}

function YuklanmadiKartasi({ t }: Pick<Tarjimon, "t">) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-6 text-center"
    >
      <p className="text-karta-sarlavha">{t("Profilni yuklab bo'lmadi")}</p>
      <p className="text-izoh text-matn-2">
        {t("Serverga ulanolmadik. Internetni tekshirib, qayta urinib ko'ring.")}
      </p>
      <TugmaHavola korinish="ikkilamchi" href="/profil">
        {t("Qayta urinish")}
      </TugmaHavola>
    </div>
  );
}

/** PRO belgisi — prototipdagi `Badge tone="pro"`: PRO gradiyenti (DESIGN.md, "PRO ranglari"). */
function ProBelgisi() {
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-(image:--pro-gradient) px-2 py-[3px] text-[11px] font-medium leading-none text-(--pro-fg)">
      PRO
    </span>
  );
}

/** Obuna kartasi: FREE, faol PRO yoki muddati tugagan PRO (profil-tz.md, F1). */
function ObunaKartasi({ obuna, tarjimon }: { obuna: Profil["obuna"]; tarjimon: Tarjimon }) {
  const { t } = tarjimon;

  return (
    <section className="flex flex-col items-start gap-3 rounded-karta border border-karta-chegara bg-karta p-4">
      {obuna.holat !== "free" && <ProBelgisi />}
      <p className="text-karta-sarlavha">{obunaSarlavhasi(obuna, tarjimon)}</p>
      {obuna.holat === "tugagan" && (
        <p className="text-izoh text-matn-2">
          {t(
            "Jurnal, tarix va progress o'qish uchun ochiq. Faqat yangi AI skan va retseptlarning to'liq matni yopildi.",
          )}
        </p>
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

/** F1 — profil bosh ekrani. Sozlama qatorlari shu sahifaga 10-taskda qo'shiladi. */
export default async function ProfilSahifasi() {
  const tarjimon = await serverTarjimoni();
  const { t } = tarjimon;
  const profil = await profilniYukla();
  // Sessiyasiz ochilgan havola: sahifa kirish pardasi ostida bo'sh turadi, kirgach
  // `KirishDarvozasi` uni sessiya bilan qayta so'raydi.
  if (profil === "sessiyasiz") return null;

  const maqsad = profil ? maqsadNomi(profil.maqsad) : null;

  return (
    <>
      <main className="mx-auto w-full max-w-md px-4 pb-32">
        <header className="py-4">
          <h1 className="text-sarlavha">{t("Profil")}</h1>
        </header>

        {profil === null ? (
          <YuklanmadiKartasi t={t} />
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

            <ObunaKartasi obuna={profil.obuna} tarjimon={tarjimon} />

            {(maqsad || profil.joriyVazn !== null) && (
              <section className="flex flex-col gap-2">
                <h2 className="text-karta-sarlavha">{t("Qisqacha")}</h2>
                <dl className="overflow-hidden rounded-karta border border-karta-chegara bg-karta">
                  {maqsad && <Qator nomi={t("Asosiy maqsad")} qiymat={t(maqsad)} />}
                  {profil.joriyVazn !== null && (
                    <Qator
                      nomi={t("Joriy vazn")}
                      qiymat={vaznMatni(profil.joriyVazn, profil.birliklar, tarjimon)}
                    />
                  )}
                  {profil.maqsadVazn !== null && (
                    <Qator
                      nomi={t("Maqsad vazn")}
                      qiymat={vaznMatni(profil.maqsadVazn, profil.birliklar, tarjimon)}
                    />
                  )}
                </dl>
              </section>
            )}
          </div>
        )}
      </main>

      <QoshishPaneli faol="profil" />
    </>
  );
}
