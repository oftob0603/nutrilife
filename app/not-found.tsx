import { TugmaHavola } from "@/app/_components/Tugma";
import { serverTarjimoni } from "@/lib/lugat/server";

/** Next'ning inglizcha standart 404 ekrani o'rniga — foydalanuvchi tilida. */
export default async function TopilmadiSahifasi() {
  const { t } = await serverTarjimoni();

  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-4 py-8 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-sarlavha">{t("Sahifa topilmadi")}</h1>
        <p className="text-asosiy text-matn-2">
          {t("Bu havola eskirgan yoki noto'g'ri yozilgan. Asosiy sahifadan davom eting.")}
        </p>
      </div>
      <TugmaHavola href="/">{t("Asosiyga qaytish")}</TugmaHavola>
    </main>
  );
}
