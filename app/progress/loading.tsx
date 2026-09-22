/** P1 yuklanish holati: vazn kartasi, tugma, grafik va streak skeleti (prototip). */
export default function Yuklanmoqda() {
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-32">
      <div className="py-4">
        <div className="h-7 w-28 animate-pulse rounded-chip bg-chegara" />
      </div>
      <div className="flex flex-col gap-6">
        <div className="h-[132px] animate-pulse rounded-karta bg-chegara" />
        <div className="h-13 animate-pulse rounded-full bg-chegara" />
        <div className="h-[300px] animate-pulse rounded-karta bg-chegara" />
        <div className="h-[72px] animate-pulse rounded-karta bg-chegara" />
      </div>
    </main>
  );
}
