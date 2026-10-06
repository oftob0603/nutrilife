import { serverdanApi } from "@/lib/api-asos";
import type { Boshqaruv, FoydalanuvchiKartasi, FoydalanuvchilarSahifasi } from "@/lib/services/admin";
import type { FoydalanuvchiFiltri } from "@/lib/services/admin-hisob";

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

/** A2 ro'yxati; olib bo'lmasa null — sahifa xato holatini ko'rsatadi. */
export async function foydalanuvchilarniYukla(
  q: string | null,
  filtr: FoydalanuvchiFiltri,
  sahifa: number,
): Promise<FoydalanuvchilarSahifasi | null> {
  const params = new URLSearchParams({ filtr, sahifa: String(sahifa) });
  if (q) params.set("q", q);
  try {
    const javob = await serverdanApi(`/api/admin/foydalanuvchilar?${params}`);
    return javob.ok ? ((await javob.json()) as FoydalanuvchilarSahifasi) : null;
  } catch {
    return null;
  }
}

/** A3 kartasi: topilmasa "topilmadi", olib bo'lmasa "xato". */
export async function foydalanuvchiniYukla(
  id: string,
): Promise<{ karta: FoydalanuvchiKartasi } | { holat: "topilmadi" | "xato" }> {
  try {
    const javob = await serverdanApi(`/api/admin/foydalanuvchilar/${encodeURIComponent(id)}`);
    if (javob.status === 404) return { holat: "topilmadi" };
    if (!javob.ok) return { holat: "xato" };
    return (await javob.json()) as { karta: FoydalanuvchiKartasi };
  } catch {
    return { holat: "xato" };
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
