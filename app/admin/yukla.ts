import { serverdanApi } from "@/lib/api-asos";
import type { Boshqaruv } from "@/lib/services/admin";

export type AdminHolati =
  | { holat: "admin"; ism: string | null }
  | { holat: "sessiyasiz" }
  | { holat: "ruxsat_yoq" }
  | { holat: "xato" };

/** Qobiq uchun: kim kirgan. Sahifa bazaga emas, o'z API yo'liga murojaat qiladi (STACK.md). */
export async function adminHolatiniYukla(): Promise<AdminHolati> {
  try {
    const javob = await serverdanApi("/api/admin/men");
    if (javob.status === 401) return { holat: "sessiyasiz" };
    if (javob.status === 403) return { holat: "ruxsat_yoq" };
    if (!javob.ok) return { holat: "xato" };
    const { admin } = (await javob.json()) as { admin: { ism: string | null } };
    return { holat: "admin", ism: admin.ism };
  } catch {
    return { holat: "xato" };
  }
}

/** A0 Login Widget uchun bot username'i; olib bo'lmasa null — widget chizilmaydi. */
export async function botniYukla(): Promise<string | null> {
  try {
    const javob = await serverdanApi("/api/admin/kirish");
    return javob.ok ? ((await javob.json()) as { bot: string | null }).bot : null;
  } catch {
    return null;
  }
}

/** A1 raqamlari; olib bo'lmasa null — sahifa xato holatini ko'rsatadi. */
export async function boshqaruvniYukla(): Promise<Boshqaruv | null> {
  try {
    const javob = await serverdanApi("/api/admin/boshqaruv");
    return javob.ok ? ((await javob.json()) as { boshqaruv: Boshqaruv }).boshqaruv : null;
  } catch {
    return null;
  }
}
