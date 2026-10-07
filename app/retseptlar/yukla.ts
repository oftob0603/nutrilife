import { serverdanApi } from "@/lib/api-asos";
import type { Reja } from "@/lib/services/norma-hisob";
import type { RetseptDetaliJavobi, RetseptlarJavobi } from "@/lib/services/retsept-hisob";

/**
 * Retsept sahifalari (R1–R3) uchun ma'lumot — sahifa bazaga emas, o'z API yo'liga murojaat
 * qiladi (STACK.md). "sessiyasiz" — havola sessiyasiz ochilgan; null — yuklab bo'lmadi.
 */
export async function retseptlarniYukla(): Promise<RetseptlarJavobi | "sessiyasiz" | null> {
  try {
    const javob = await serverdanApi("/api/retseptlar");
    if (javob.status === 401) return "sessiyasiz";
    if (!javob.ok) return null;
    return (await javob.json()) as RetseptlarJavobi;
  } catch {
    return null;
  }
}

export async function retseptniYukla(
  id: string,
): Promise<RetseptDetaliJavobi | "sessiyasiz" | "topilmadi" | null> {
  try {
    const javob = await serverdanApi(`/api/retseptlar/${encodeURIComponent(id)}`);
    if (javob.status === 401) return "sessiyasiz";
    if (javob.status === 404) return "topilmadi";
    if (!javob.ok) return null;
    return (await javob.json()) as RetseptDetaliJavobi;
  } catch {
    return null;
  }
}

/** R3 makro chiziqlari uchun kunlik reja — Home bilan bir manbadan; yuklanmasa null (chiziqsiz ko'rinadi). */
export async function rejaniYukla(): Promise<Reja | null> {
  try {
    const javob = await serverdanApi("/api/ovqat-yozuvlari");
    if (!javob.ok) return null;
    const kun = (await javob.json()) as { reja?: Reja | null };
    return kun.reja ?? null;
  } catch {
    return null;
  }
}
