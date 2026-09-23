import { bugunSana, sanaToliq } from "@/lib/services/yozuv-hisob";

/**
 * E1 yuklanish holati (prototip): sana haqiqiy, salom (ism hali yo'q) va kun tanlagich skelet,
 * doira va ostidagi "qoldi" chizig'i skelet ko'rinishida.
 */
export default function Yuklanmoqda() {
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-32">
      <div className="flex flex-col gap-1 py-4">
        <p className="text-izoh text-matn-2">{sanaToliq(bugunSana())}</p>
        <div className="h-7 w-40 animate-pulse rounded-chip bg-chegara" />
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="flex w-full gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-13 flex-1 animate-pulse rounded-chip bg-chegara" />
          ))}
        </div>
        <div className="flex w-full flex-col items-center gap-3">
          <div className="size-[202px] animate-pulse rounded-full bg-chegara" />
          <div className="h-3 w-2/5 animate-pulse rounded-chip bg-chegara" />
        </div>
      </div>
    </main>
  );
}
