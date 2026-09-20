import { TaomKartasi } from "@/app/_components/TaomKartasi";
import type { Taom } from "@/lib/services/taomlar";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

async function taomlarniYukla(): Promise<Taom[]> {
  const asos = process.env.APP_URL ?? "http://localhost:3000";
  const javob = await fetch(`${asos}/api/taomlar`, { cache: "no-store" });
  if (!javob.ok) throw new Error("Taomlarni yuklab bo'lmadi");
  const { taomlar } = (await javob.json()) as { taomlar: Taom[] };
  return taomlar;
}

export default async function TaomlarSahifasi() {
  const taomlar = await taomlarniYukla();

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-8">
      <h1 className="py-4 text-sarlavha">Taomlar</h1>
      {taomlar.length === 0 ? (
        <p className="text-asosiy text-matn-2">Baza hozircha bo&apos;sh.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {taomlar.map((taom) => (
            <TaomKartasi key={taom.id} taom={taom} />
          ))}
        </ul>
      )}
    </main>
  );
}
