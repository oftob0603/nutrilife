/** F1 yuklanish holati: avatar qatori, obuna kartasi va "Qisqacha" skeleti. */
export default function Yuklanmoqda() {
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-32">
      <div className="py-4">
        <div className="h-7 w-24 animate-pulse rounded-chip bg-chegara" />
      </div>
      <div className="flex flex-col gap-6">
        <div className="h-[72px] animate-pulse rounded-karta bg-chegara" />
        <div className="h-[104px] animate-pulse rounded-karta bg-chegara" />
        <div className="h-[140px] animate-pulse rounded-karta bg-chegara" />
      </div>
    </main>
  );
}
