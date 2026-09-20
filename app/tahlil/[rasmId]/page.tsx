import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TugmaHavola } from "@/app/_components/Tugma";
import { apiAsos } from "@/lib/api-asos";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

/** Rasm bormi — API topilgan rasm uchun omborga yo'naltiradi (302), aks holda 404. */
async function rasmBormi(id: string): Promise<boolean> {
  const javob = await fetch(`${apiAsos()}/api/rasmlar/${id}`, {
    cache: "no-store",
    redirect: "manual",
  });
  return javob.status === 302;
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

/**
 * E6 o'rni. Hozircha faqat yuklangan rasmni ko'rsatadi — yuklash, ombor va o'qish
 * zanjiri ishlashini tasdiqlaydi. AI tahlil holati va natijasi shu sahifaga keyingi
 * tasklarda (POST /api/skan, E6) yoziladi.
 */
export default async function TahlilSahifasi({
  params,
}: PageProps<"/tahlil/[rasmId]">) {
  const { rasmId } = await params;
  if (!(await rasmBormi(rasmId))) notFound();

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-8">
      <header className="flex items-center gap-2 py-4">
        <Link
          href="/"
          aria-label="Orqaga"
          className="-ml-3 flex size-11 items-center justify-center rounded-chip text-siyoh"
        >
          <ChapStrelka />
        </Link>
        <h1 className="min-w-0 truncate text-sarlavha">Rasm yuklandi</h1>
      </header>

      <div className="flex flex-col gap-6">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-chip bg-chegara">
          <Image
            src={`/api/rasmlar/${rasmId}`}
            alt="Yuklangan ovqat rasmi"
            fill
            unoptimized
            priority
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-1 rounded-karta border border-chegara bg-karta p-4">
          <p className="text-karta-sarlavha">Rasm saqlandi</p>
          <p className="text-izoh text-matn-2">
            AI tahlili tez orada shu yerda ochiladi. Hozircha ovqatni qo&apos;lda
            qo&apos;shishingiz mumkin.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <TugmaHavola href="/taomlar">Qo&apos;lda qo&apos;shish</TugmaHavola>
          <TugmaHavola korinish="uchinchi" href="/">
            Home&apos;ga qaytish
          </TugmaHavola>
        </div>
      </div>
    </main>
  );
}
