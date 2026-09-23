import { serverTarjimoni } from "@/lib/lugat/server";

/** F1 yuklanish holati (prototip): sarlavha haqiqiy, ostida avatar qatori, obuna kartasi va "Qisqacha" skeleti. */
export default async function Yuklanmoqda() {
  const { t } = await serverTarjimoni();
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-32">
      <header className="py-4">
        <h1 className="text-sarlavha">{t("Profil")}</h1>
      </header>
      <div className="flex flex-col gap-6">
        <div className="h-[72px] animate-pulse rounded-karta bg-chegara" />
        <div className="h-[104px] animate-pulse rounded-karta bg-chegara" />
        <div className="h-[140px] animate-pulse rounded-karta bg-chegara" />
      </div>
    </main>
  );
}
