import Link from "next/link";
import { Tasvirlash } from "@/app/_components/Tasvirlash";
import { MATN_CHEGARASI } from "@/lib/services/skan-hisob";

export const metadata = { title: "Matn bilan tasvirlash — Nutrilife" };

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

/** E4'dan keladi: `?matn=` — qidiruvda topilmagan so'z, maydonga oldindan yoziladi. */
export default async function TasvirlashSahifasi({
  searchParams,
}: PageProps<"/tasvirlash">) {
  const { matn } = await searchParams;
  const boshlangich = typeof matn === "string" ? matn.slice(0, MATN_CHEGARASI) : "";

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-8">
      <header className="flex items-center gap-2 py-4">
        <Link
          href="/taomlar"
          aria-label="Orqaga"
          className="-ml-3 flex size-11 items-center justify-center rounded-chip text-siyoh"
        >
          <ChapStrelka />
        </Link>
        <h1 className="min-w-0 truncate text-sarlavha">Matn bilan tasvirlash</h1>
      </header>
      <Tasvirlash boshlangich={boshlangich} />
    </main>
  );
}
