import { serverdanApi } from "@/lib/api-asos";
import type {
  AdminAmaliQatori,
  Boshqaruv,
  FoydalanuvchiKartasi,
  FoydalanuvchilarSahifasi,
} from "@/lib/services/admin";
import type { FoydalanuvchiFiltri } from "@/lib/services/admin-hisob";
import type { Kategoriya, TaomKartasi, TaomlarSahifasi } from "@/lib/services/taom-admin";
import type { RetseptKartasi, RetseptlarSahifasi } from "@/lib/services/retsept-admin";
import type { HolatFiltri } from "@/lib/services/retsept-admin-hisob";
import type { TaomFiltri } from "@/lib/services/taom-admin-hisob";

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

/** A6 ro'yxati; olib bo'lmasa null — sahifa xato holatini ko'rsatadi. */
export async function taomlarniYukla(
  q: string | null,
  filtr: TaomFiltri,
  sahifa: number,
): Promise<TaomlarSahifasi | null> {
  const params = new URLSearchParams({ filtr, sahifa: String(sahifa) });
  if (q) params.set("q", q);
  try {
    const javob = await serverdanApi(`/api/admin/taomlar?${params}`);
    return javob.ok ? ((await javob.json()) as TaomlarSahifasi) : null;
  } catch {
    return null;
  }
}

/** A7 kartasi: topilmasa "topilmadi", olib bo'lmasa "xato". */
export async function taomniYukla(
  id: string,
): Promise<{ karta: TaomKartasi } | { holat: "topilmadi" | "xato" }> {
  try {
    const javob = await serverdanApi(`/api/admin/taomlar/${encodeURIComponent(id)}`);
    if (javob.status === 404) return { holat: "topilmadi" };
    if (!javob.ok) return { holat: "xato" };
    return (await javob.json()) as { karta: TaomKartasi };
  } catch {
    return { holat: "xato" };
  }
}

/** A8 ro'yxati; olib bo'lmasa null — sahifa xato holatini ko'rsatadi. */
export async function retseptlarniYukla(
  kategoriyaId: string | null,
  holat: HolatFiltri,
  sahifa: number,
): Promise<RetseptlarSahifasi | null> {
  const params = new URLSearchParams({ holat, sahifa: String(sahifa) });
  if (kategoriyaId) params.set("kategoriya", kategoriyaId);
  try {
    const javob = await serverdanApi(`/api/admin/retseptlar?${params}`);
    return javob.ok ? ((await javob.json()) as RetseptlarSahifasi) : null;
  } catch {
    return null;
  }
}

/** A9 kartasi: topilmasa "topilmadi", olib bo'lmasa "xato". */
export async function retseptniYukla(
  id: string,
): Promise<{ karta: RetseptKartasi } | { holat: "topilmadi" | "xato" }> {
  try {
    const javob = await serverdanApi(`/api/admin/retseptlar/${encodeURIComponent(id)}`);
    if (javob.status === 404) return { holat: "topilmadi" };
    if (!javob.ok) return { holat: "xato" };
    return (await javob.json()) as { karta: RetseptKartasi };
  } catch {
    return { holat: "xato" };
  }
}

/** A7/A9 kategoriya tanlovi; olib bo'lmasa null. */
export async function kategoriyalarniYukla(): Promise<Kategoriya[] | null> {
  try {
    const javob = await serverdanApi("/api/admin/kategoriyalar");
    return javob.ok ? ((await javob.json()) as { kategoriyalar: Kategoriya[] }).kategoriyalar : null;
  } catch {
    return null;
  }
}

export type BoshqaruvSahifasi = { boshqaruv: Boshqaruv; amallar: AdminAmaliQatori[] };

/** A1 raqamlari va oxirgi amallar; olib bo'lmasa null — sahifa xato holatini ko'rsatadi. */
export async function boshqaruvniYukla(): Promise<BoshqaruvSahifasi | null> {
  try {
    const javob = await serverdanApi("/api/admin/boshqaruv");
    return javob.ok ? ((await javob.json()) as BoshqaruvSahifasi) : null;
  } catch {
    return null;
  }
}
