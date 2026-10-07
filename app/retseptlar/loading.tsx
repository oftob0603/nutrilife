/** R1 yuklanmoqda holati — sarlavha, chiplar va 4 ta karta skeleti; sahifa tuzilishi sakramaydi. */
export default function RetseptlarYuklanmoqda() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-md px-4 pb-32">
      <header className="flex flex-col gap-2 py-4">
        <span className="h-7 w-36 rounded-chip bg-chegara" />
        <span className="h-4 w-24 rounded-chip bg-chegara" />
      </header>
      <div className="flex flex-col gap-6">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-10 w-24 rounded-full border border-chegara bg-karta" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="flex flex-col overflow-hidden rounded-karta border border-karta-chegara bg-karta">
              <span className="h-[104px] bg-chegara" />
              <span className="flex flex-col gap-2 p-3">
                <span className="h-3 w-14 rounded-chip bg-chegara" />
                <span className="h-4 w-28 rounded-chip bg-chegara" />
                <span className="h-3 w-12 rounded-chip bg-chegara" />
              </span>
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
