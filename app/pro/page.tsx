import { redirect } from "next/navigation";
import { Tariflar } from "@/app/_components/Tariflar";
import { serverdanApi } from "@/lib/api-asos";
import type { ObunaTafsiloti } from "@/lib/services/obuna-hisob";
import { manbaniOqi } from "@/lib/services/tarif-hisob";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "PRO — NutriLifer" };

/** Obuna holati; sessiyasiz yoki olib bo'lmagan bo'lsa null — ekran baribir ochiladi. */
async function obunaHolati(): Promise<ObunaTafsiloti["holat"] | null> {
  try {
    const javob = await serverdanApi("/api/obuna");
    return javob.ok ? ((await javob.json()) as { obuna: ObunaTafsiloti }).obuna.holat : null;
  } catch {
    return null;
  }
}

/**
 * W1 — tariflar. `?manba=onboarding|profil|limit` sarlavhani va "Hozir emas" qaytadigan joyni
 * belgilaydi. Faol PRO'ga sotadigan narsa yo'q — u obuna ekraniga (F4) o'tkaziladi.
 */
export default async function ProSahifasi({ searchParams }: PageProps<"/pro">) {
  const [{ manba }, holat] = await Promise.all([searchParams, obunaHolati()]);
  if (holat === "pro") redirect("/profil/obuna");

  return <Tariflar manba={manbaniOqi(manba)} muddatiTugagan={holat === "tugagan"} />;
}
