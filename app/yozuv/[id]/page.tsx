import Link from "next/link";
import { notFound } from "next/navigation";
import { AiBelgisi } from "@/app/_components/AiBelgisi";
import { TaomRasmi } from "@/app/_components/TaomRasmi";
import { YozuvTahriri } from "@/app/_components/YozuvTahriri";
import { apiAsos } from "@/lib/api-asos";
import type { Yozuv } from "@/lib/services/yozuv-hisob";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "Yozuv tahriri — Nutrilife" };

async function yozuvniYukla(id: string): Promise<Yozuv | null> {
  const javob = await fetch(`${apiAsos()}/api/ovqat-yozuvlari/${id}`, { cache: "no-store" });
  if (javob.status === 404) return null;
  if (!javob.ok) throw new Error("Yozuvni yuklab bo'lmadi");
  const { yozuv } = (await javob.json()) as { yozuv: Yozuv };
  return yozuv;
}

/** Kelingan ekran: faqat Home yoki jurnal (sanasi bilan) — boshqa manzil qabul qilinmaydi. */
function qaytishManzili(qiymat: unknown): string {
  return typeof qiymat === "string" && /^\/jurnal(\?sana=\d{4}-\d{2}-\d{2})?$/.test(qiymat)
    ? qiymat
    : "/";
}

/** E10 — yozuv tahriri. */
export default async function YozuvSahifasi({
  params,
  searchParams,
}: PageProps<"/yozuv/[id]">) {
  const { id } = await params;
  const { qaytish: berilgan } = await searchParams;
  const qaytish = qaytishManzili(berilgan);

  const yozuv = await yozuvniYukla(id);
  if (!yozuv) notFound();

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-8">
      <header className="flex items-center gap-2 py-4">
        <Link
          href={qaytish}
          aria-label="Orqaga"
          className="-ml-3 flex size-11 items-center justify-center rounded-chip text-siyoh"
        >
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
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-sarlavha">Yozuv tahriri</h1>
        {yozuv.manba === "ai" && <AiBelgisi />}
      </header>

      <div className="flex flex-col gap-4">
        {yozuv.rasm && <TaomRasmi rasm={yozuv.rasm} olcham="katta" />}
        <YozuvTahriri yozuv={yozuv} qaytish={qaytish} />
      </div>
    </main>
  );
}
