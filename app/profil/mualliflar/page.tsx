import { OrqagaSarlavha } from "@/app/_components/profil/OrqagaSarlavha";
import { TaomRasmi } from "@/app/_components/TaomRasmi";
import { serverTarjimoni } from "@/lib/lugat/server";
import { LITSENZIYA_HAVOLALARI, RASM_MUALLIFLARI } from "@/lib/taom-rasm-mualliflari";

export const metadata = { title: "Rasm mualliflari — Nutrilife" };

const HAVOLA = "underline decoration-chegara underline-offset-2 active:text-matn-2";
const TASHQI = { target: "_blank", rel: "noopener noreferrer" } as const;

/**
 * Taom rasmlarining mualliflari va litsenziyalari. CC BY / BY-SA to'rt narsani talab qiladi:
 * asl nom, muallif, manba va litsenziya — har qatorda to'rttasi ham bor; kiritilgan
 * o'zgarish (kesish, WebP) kirish matnida aytiladi. Shaxsiy ma'lumot o'qilmaydi.
 */
export default async function MualliflarSahifasi() {
  const { t } = await serverTarjimoni();

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-12">
      <OrqagaSarlavha sarlavha={t("Rasm mualliflari")} orqagaNomi={t("Orqaga")} href="/profil" />

      <div className="flex flex-col gap-4">
        <p className="text-izoh text-matn-2">
          {t(
            "Taom rasmlari Wikimedia Commons'dan olingan. Har biri kesilgan va WebP formatiga o'girilgan — boshqa o'zgarish kiritilmagan.",
          )}
        </p>

        <ul className="overflow-hidden rounded-karta border border-karta-chegara bg-karta">
          {RASM_MUALLIFLARI.map((rasm) => (
            <li
              key={rasm.fayl}
              className="flex items-start gap-3 border-t border-chegara px-4 py-3 first:border-t-0"
            >
              <TaomRasmi rasm={`/taomlar/${rasm.fayl}`} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <a href={rasm.manba} {...TASHQI} className={`break-words text-asosiy ${HAVOLA}`}>
                  {rasm.nomi}
                </a>
                <p className="break-words text-izoh text-matn-2">
                  {t("Muallif: {0}", rasm.muallif)}
                  {" · "}
                  <a
                    href={LITSENZIYA_HAVOLALARI[rasm.litsenziya]}
                    {...TASHQI}
                    className={`whitespace-nowrap ${HAVOLA}`}
                  >
                    {rasm.litsenziya}
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
