import { redirect } from "next/navigation";
import { OnboardingOqimi } from "@/app/_components/onboarding/OnboardingOqimi";
import { serverdanApi } from "@/lib/api-asos";
import { serverTarjimoni } from "@/lib/lugat/server";
import type { OnboardingHolati } from "@/lib/services/onboarding-hisob";

// Sahifa bazaga to'g'ridan-to'g'ri emas, o'z API yo'li orqali murojaat qiladi (STACK.md).
export const dynamic = "force-dynamic";

export const metadata = { title: "Tanishuv — Nutrilife" };

async function holatniYukla(): Promise<OnboardingHolati | null> {
  try {
    const javob = await serverdanApi("/api/onboarding");
    if (!javob.ok) return null;
    return (await javob.json()) as OnboardingHolati;
  } catch {
    return null;
  }
}

/** O1–O10 — birinchi kirish savollari. Tugatgan foydalanuvchi bu yerga qaytmaydi. */
export default async function OnboardingSahifasi() {
  const holat = await holatniYukla();
  if (holat?.tugadi) redirect("/");

  // Sessiyasiz birinchi ochilishda holat bo'lmaydi — kirish darvozasi kirgach sahifani qayta so'raydi.
  if (!holat) {
    const { t } = await serverTarjimoni();
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-karta-sarlavha">{t("Ma'lumotni yuklab bo'lmadi")}</p>
        <p className="text-izoh text-matn-2">
          {t("Internetni tekshirib, ilovani qayta ochib ko'ring.")}
        </p>
      </main>
    );
  }

  return <OnboardingOqimi boshlangich={holat} />;
}
