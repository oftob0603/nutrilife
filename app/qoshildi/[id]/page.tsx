import { notFound } from "next/navigation";
import { KunlikDoira } from "@/app/_components/KunlikDoira";
import { QaytishTaymeri } from "@/app/_components/QaytishTaymeri";
import { TugmaHavola } from "@/app/_components/Tugma";
import { NORMA } from "@/lib/norma";
import { raqam } from "@/lib/services/taom-hisob";
import type { Jami, Yozuv } from "@/lib/services/yozuv-hisob";
import { apiAsos } from "@/lib/api-asos";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

type Kun = { yozuvlar: Yozuv[]; jami: Jami };

async function kunniYukla(): Promise<Kun | null> {
  try {
    const javob = await fetch(`${apiAsos()}/api/ovqat-yozuvlari`, {
      cache: "no-store",
    });
    if (!javob.ok) return null;
    return (await javob.json()) as Kun;
  } catch {
    return null;
  }
}

function Belgi() {
  return (
    <span className="flex size-6 items-center justify-center rounded-full bg-aksent text-aksent-matn">
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

function RasmOrni() {
  return <div className="size-12 shrink-0 rounded-chip bg-chegara" />;
}

export default async function QoshildiSahifasi({
  params,
}: PageProps<"/qoshildi/[id]">) {
  const { id } = await params;
  const kun = await kunniYukla();
  const yozuv = kun?.yozuvlar.find((qator) => qator.id === id);

  if (!kun || !yozuv) notFound();

  // Doira eski qiymatdan yangisiga to'ladi — E8'dagi asosiy lahza.
  const oldingi = kun.jami.kaloriya - yozuv.kaloriya;

  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-4 py-8">
      <QaytishTaymeri />

      <div className="flex items-center gap-2">
        <Belgi />
        <p className="text-karta-sarlavha">Jurnalga qo&apos;shildi</p>
      </div>

      <KunlikDoira
        qiymat={kun.jami.kaloriya}
        norma={NORMA.kaloriya}
        boshlangich={oldingi}
      />

      <div className="flex w-full items-center gap-3 rounded-karta border border-chegara bg-karta p-4">
        <RasmOrni />
        <div className="min-w-0 flex-1">
          <p className="truncate text-karta-sarlavha">{yozuv.taomNomi}</p>
          <p className="mt-1 text-izoh text-matn-2 tabular-nums">
            {yozuv.porsiya} · {raqam(yozuv.kaloriya)} kkal
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        <TugmaHavola href="/">Home&apos;ga qaytish</TugmaHavola>
        <TugmaHavola korinish="uchinchi" href="/taomlar">
          Yana qo&apos;shish
        </TugmaHavola>
      </div>
    </main>
  );
}
