import { TaomlarRoyxati } from "@/app/_components/TaomlarRoyxati";
import type { Taom } from "@/lib/services/taom-hisob";
import { apiAsos } from "@/lib/api-asos";
import { serverTarjimoni } from "@/lib/lugat/server";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

async function taomlarniYukla(): Promise<Taom[]> {
  const javob = await fetch(`${apiAsos()}/api/taomlar`, { cache: "no-store" });
  if (!javob.ok) throw new Error("Taomlarni yuklab bo'lmadi");
  const { taomlar } = (await javob.json()) as { taomlar: Taom[] };
  return taomlar;
}

export default async function TaomlarSahifasi() {
  const { t } = await serverTarjimoni();
  const taomlar = await taomlarniYukla();

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-8">
      <h1 className="py-4 text-sarlavha">{t("Taom qidiruvi")}</h1>
      {taomlar.length === 0 ? (
        <p className="text-asosiy text-matn-2">{t("Baza hozircha bo'sh.")}</p>
      ) : (
        <TaomlarRoyxati taomlar={taomlar} />
      )}
    </main>
  );
}
