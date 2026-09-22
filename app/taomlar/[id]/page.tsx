import { notFound } from "next/navigation";
import { OrqagaTugma } from "@/app/_components/OrqagaTugma";
import { PorsiyaTanlagich } from "@/app/_components/PorsiyaTanlagich";
import { TaomRasmi } from "@/app/_components/TaomRasmi";
import type { Reja } from "@/lib/services/norma-hisob";
import { taomNomi, type Taom } from "@/lib/services/taom-hisob";
import type { QulfJavobi, TavsiyaAsosi } from "@/lib/services/taklif-hisob";
import { apiAsos, serverdanApi } from "@/lib/api-asos";
import { serverTarjimoni } from "@/lib/lugat/server";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

async function taomniYukla(id: string): Promise<Taom | null> {
  const javob = await fetch(`${apiAsos()}/api/taomlar/${id}`, { cache: "no-store" });
  if (javob.status === 404) return null;
  if (!javob.ok) throw new Error("Taomni yuklab bo'lmadi");
  const { taom } = (await javob.json()) as { taom: Taom };
  return taom;
}

type KunAsosi = { tavsiyaAsosi: TavsiyaAsosi | null; reja: Reja | null };

/**
 * Bugungi kundan E5'ga kerak bo'lgan asos — Home doirasi bilan bir manbadan
 * (`GET /api/ovqat-yozuvlari`): porsiya tavsiyasi uchun qolgan kaloriya va imkoniyat PRO'ga
 * yopiqmi, makro chiziqlari uchun kunlik reja. Yuklanmasa (oflayn, eski API) tavsiya kartasi
 * chiqmaydi, makrolar chiziqsiz ko'rinadi, taom sahifasi esa ishlayveradi.
 */
async function kunAsosiniYukla(): Promise<KunAsosi> {
  try {
    const javob = await serverdanApi("/api/ovqat-yozuvlari");
    if (!javob.ok) return { tavsiyaAsosi: null, reja: null };
    const kun = (await javob.json()) as {
      qoldi?: number | null;
      porsiya?: QulfJavobi;
      reja?: Reja | null;
    };
    return {
      tavsiyaAsosi:
        typeof kun.qoldi === "number" && kun.porsiya
          ? { qoldi: kun.qoldi, yopiq: kun.porsiya.yopiq }
          : null,
      reja: kun.reja ?? null,
    };
  } catch {
    return { tavsiyaAsosi: null, reja: null };
  }
}

function ChapStrelka() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export default async function TaomSahifasi({
  params,
}: PageProps<"/taomlar/[id]">) {
  const { t, til } = await serverTarjimoni();
  const { id } = await params;
  const [taom, { tavsiyaAsosi, reja }] = await Promise.all([taomniYukla(id), kunAsosiniYukla()]);

  if (!taom) notFound();

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-8">
      <header className="flex items-center gap-2 py-4">
        <OrqagaTugma
          nomi={t("Orqaga")}
          href="/taomlar"
          className="-ml-3 flex size-11 items-center justify-center rounded-chip text-siyoh"
        >
          <ChapStrelka />
        </OrqagaTugma>
        <h1 className="min-w-0 truncate text-sarlavha">{taomNomi(taom, til)}</h1>
      </header>

      <div className="flex flex-col gap-6">
        <TaomRasmi rasm={taom.rasm} olcham="katta" />
        <PorsiyaTanlagich taom={taom} tavsiyaAsosi={tavsiyaAsosi} makroMaqsad={reja} />
      </div>
    </main>
  );
}
