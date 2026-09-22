import { serverdanApi } from "@/lib/api-asos";
import type { Progress } from "@/lib/services/progress-hisob";
import type { OvqatStatistikasi } from "@/lib/services/statistika";

/**
 * Progress sahifalari (P1, P3) uchun ma'lumot — sahifa bazaga emas, o'z API yo'liga murojaat
 * qiladi (STACK.md). "sessiyasiz" — havola sessiyasiz ochilgan; null — yuklab bo'lmadi.
 */
export async function progressniYukla(): Promise<Progress | "sessiyasiz" | null> {
  try {
    const javob = await serverdanApi("/api/progress");
    if (javob.status === 401) return "sessiyasiz";
    if (!javob.ok) return null;
    return ((await javob.json()) as { progress: Progress }).progress;
  } catch {
    return null;
  }
}

/** P1 dagi PRO bo'limlari (`/api/statistika`); yuklab bo'lmasa null — bo'limlar ko'rinmaydi. */
export async function statistikaniYukla(): Promise<OvqatStatistikasi | null> {
  try {
    const javob = await serverdanApi("/api/statistika");
    if (!javob.ok) return null;
    return ((await javob.json()) as { statistika: OvqatStatistikasi }).statistika;
  } catch {
    return null;
  }
}
