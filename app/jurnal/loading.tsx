/** E9 yuklanish holati: jami kartasi va uchta yozuv skeleti. */
export default function Yuklanmoqda() {
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-32">
      <div className="py-4">
        <div className="h-7 w-24 animate-pulse rounded-chip bg-chegara" />
      </div>
      <div className="flex flex-col gap-6">
        <div className="mx-auto h-11 w-48 animate-pulse rounded-chip bg-chegara" />
        <div className="h-28 animate-pulse rounded-karta bg-chegara" />
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-karta bg-chegara" />
          ))}
        </div>
      </div>
    </main>
  );
}
