import { notFound } from "next/navigation";
import { Tahlil } from "@/app/_components/Tahlil";
import { serverdanApi } from "@/lib/api-asos";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "Tahlil — Nutrilife" };

/** Rasm bormi — API topilgan rasm uchun omborga yo'naltiradi (302), aks holda 404. */
async function rasmBormi(id: string): Promise<boolean | "sessiyasiz"> {
  const javob = await serverdanApi(`/api/rasmlar/${id}`, { redirect: "manual" });
  return javob.status === 401 ? "sessiyasiz" : javob.status === 302;
}

/** E6 — yuklangan rasmning AI tahlili. */
export default async function TahlilSahifasi({
  params,
}: PageProps<"/tahlil/[rasmId]">) {
  const { rasmId } = await params;
  const bor = await rasmBormi(rasmId);
  // Sessiyasiz ochilgan havola: sahifa kirish pardasi ostida bo'sh turadi, kirgach
  // `KirishDarvozasi` uni sessiya bilan qayta so'raydi.
  if (bor === "sessiyasiz") return null;
  if (!bor) notFound();

  return <Tahlil rasmId={rasmId} />;
}
