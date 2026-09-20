import { notFound } from "next/navigation";
import { Tahlil } from "@/app/_components/Tahlil";
import { apiAsos } from "@/lib/api-asos";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "Tahlil — Nutrilife" };

/** Rasm bormi — API topilgan rasm uchun omborga yo'naltiradi (302), aks holda 404. */
async function rasmBormi(id: string): Promise<boolean> {
  const javob = await fetch(`${apiAsos()}/api/rasmlar/${id}`, {
    cache: "no-store",
    redirect: "manual",
  });
  return javob.status === 302;
}

/** E6 — yuklangan rasmning AI tahlili. */
export default async function TahlilSahifasi({
  params,
}: PageProps<"/tahlil/[rasmId]">) {
  const { rasmId } = await params;
  if (!(await rasmBormi(rasmId))) notFound();

  return <Tahlil rasmId={rasmId} />;
}
