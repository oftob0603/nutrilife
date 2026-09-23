import { serverTarjimoni } from "@/lib/lugat/server";

/** P1 yuklanish holati (prototip): sarlavha haqiqiy, ostida vazn kartasi, tugma, grafik va streak skeleti. */
export default async function Yuklanmoqda() {
  const { t } = await serverTarjimoni();
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-32">
      <header className="py-4">
        <h1 className="text-sarlavha">{t("Statistika")}</h1>
      </header>
      <div className="flex flex-col gap-6">
        <div className="h-[132px] animate-pulse rounded-karta bg-chegara" />
        <div className="h-13 animate-pulse rounded-full bg-chegara" />
        <div className="h-40 animate-pulse rounded-karta bg-chegara" />
        <div className="h-24 animate-pulse rounded-karta bg-chegara" />
      </div>
    </main>
  );
}
