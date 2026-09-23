import { OrqagaTugma } from "@/app/_components/OrqagaTugma";
import { notFound } from "next/navigation";
import { AiBelgisi } from "@/app/_components/AiBelgisi";
import { TaomRasmi } from "@/app/_components/TaomRasmi";
import { YozuvTahriri } from "@/app/_components/YozuvTahriri";
import { serverdanApi } from "@/lib/api-asos";
import { serverTarjimoni } from "@/lib/lugat/server";
import type { Yozuv } from "@/lib/services/yozuv-hisob";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "Yozuvni tahrirlash — NutriLifer" };

async function yozuvniYukla(id: string): Promise<Yozuv | "sessiyasiz" | null> {
  const javob = await serverdanApi(`/api/ovqat-yozuvlari/${id}`);
  if (javob.status === 401) return "sessiyasiz";
  if (javob.status === 404) return null;
  if (!javob.ok) throw new Error("Yozuvni yuklab bo'lmadi");
  const { yozuv } = (await javob.json()) as { yozuv: Yozuv };
  return yozuv;
}

/** Kelingan ekran: faqat Home yoki jurnal (ikkalasi ham sanasi bilan) — boshqa manzil qabul qilinmaydi. */
function qaytishManzili(qiymat: unknown): string {
  return typeof qiymat === "string" && /^\/(jurnal)?(\?sana=\d{4}-\d{2}-\d{2})?$/.test(qiymat)
    ? qiymat
    : "/";
}

/** E10 — yozuv tahriri. */
export default async function YozuvSahifasi({
  params,
  searchParams,
}: PageProps<"/yozuv/[id]">) {
  const { t } = await serverTarjimoni();
  const { id } = await params;
  const { qaytish: berilgan } = await searchParams;
  const qaytish = qaytishManzili(berilgan);

  const yozuv = await yozuvniYukla(id);
  // Sessiyasiz ochilgan havola: sahifa kirish pardasi ostida bo'sh turadi, kirgach
  // `KirishDarvozasi` uni sessiya bilan qayta so'raydi.
  if (yozuv === "sessiyasiz") return null;
  if (!yozuv) notFound();

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-8">
      <header className="flex items-center gap-3 py-4">
        <OrqagaTugma
          nomi={t("Orqaga")}
          href={qaytish}
          className="-ml-3 flex size-11 items-center justify-center rounded-chip text-siyoh"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </OrqagaTugma>
        <h1 className="min-w-0 flex-1 truncate text-sarlavha">{t("Yozuvni tahrirlash")}</h1>
        {yozuv.manba === "ai" && <AiBelgisi />}
      </header>

      <div className="flex flex-col gap-4">
        {yozuv.rasm && <TaomRasmi rasm={yozuv.rasm} olcham="katta" />}
        <YozuvTahriri yozuv={yozuv} qaytish={qaytish} />
      </div>
    </main>
  );
}
