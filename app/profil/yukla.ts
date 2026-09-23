import { serverdanApi } from "@/lib/api-asos";
import type { SkanQoldigi } from "@/lib/services/huquqlar";
import type { Profil } from "@/lib/services/profil-hisob";

/**
 * Profil bo'limi sahifalari (F1, F3, F5) uchun hisob egasining ma'lumoti — sahifa bazaga
 * emas, o'z API yo'liga murojaat qiladi (STACK.md). "sessiyasiz" — havola sessiyasiz
 * ochilgan; null — yuklab bo'lmadi.
 */
export async function profilniYukla(): Promise<Profil | "sessiyasiz" | null> {
  try {
    const javob = await serverdanApi("/api/profil");
    if (javob.status === 401) return "sessiyasiz";
    if (!javob.ok) return null;
    return ((await javob.json()) as { profil: Profil }).profil;
  } catch {
    return null;
  }
}

/** F1 obuna kartasidagi skan hisoblagichi uchun; olib bo'lmasa null — karta usiz chiziladi. */
export async function skanLimitiniYukla(): Promise<SkanQoldigi | null> {
  try {
    const javob = await serverdanApi("/api/skan");
    return javob.ok ? ((await javob.json()) as { limit: SkanQoldigi }).limit : null;
  } catch {
    return null;
  }
}

/**
 * "Yordam" qatori uchun admin Telegram username'i (`ADMIN_TELEGRAM` backend'da). Alohida F6
 * ekrani qurilmaydi — Yordam admin bilan Telegram chatini ochadi (DECISIONS 2026-09-23).
 * Username W1 bilan bitta manbadan — `/api/tariflar`; olib bo'lmasa null, qator chizilmaydi.
 */
export async function adminniYukla(): Promise<string | null> {
  try {
    const javob = await serverdanApi("/api/tariflar");
    return javob.ok ? ((await javob.json()) as { admin: string | null }).admin : null;
  } catch {
    return null;
  }
}
