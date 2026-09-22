/** E4 yuklanish holati: sarlavha, qidiruv maydoni va oltita taom qatori skeleti (prototip). */
export default function Yuklanmoqda() {
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-8">
      <div className="flex items-center gap-2 py-4">
        <div className="size-11 shrink-0" />
        <div className="h-7 w-40 animate-pulse rounded-chip bg-chegara" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-11 animate-pulse rounded-karta bg-chegara" />
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-18 animate-pulse rounded-karta bg-chegara" />
          ))}
        </div>
      </div>
    </main>
  );
}
