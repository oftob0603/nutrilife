/** P3 yuklanish holati: sarlavha va o'lchov qatorlari skeleti. */
export default function Yuklanmoqda() {
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-12">
      <div className="py-4">
        <div className="h-7 w-32 animate-pulse rounded-chip bg-chegara" />
      </div>
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[76px] animate-pulse rounded-karta bg-chegara" />
        ))}
      </div>
    </main>
  );
}
