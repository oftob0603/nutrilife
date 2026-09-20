/** E1 yuklanish holati: kun tanlagich, doira va makro chiziqlari skelet ko'rinishida. */
export default function Yuklanmoqda() {
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-32">
      <div className="flex flex-col gap-2 py-4">
        <div className="h-4 w-32 animate-pulse rounded-chip bg-chegara" />
        <div className="h-6 w-24 animate-pulse rounded-chip bg-chegara" />
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="flex w-full gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-13 flex-1 animate-pulse rounded-chip bg-chegara" />
          ))}
        </div>
        <div className="size-56 animate-pulse rounded-full bg-chegara" />
        <div className="flex w-full gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-8 flex-1 animate-pulse rounded-chip bg-chegara"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
