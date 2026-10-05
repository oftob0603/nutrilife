import type { Metadata } from "next";
import { AdminKirish } from "./_components/AdminKirish";
import { AdminQobiq } from "./_components/AdminQobiq";
import { adminHolatiniYukla, botniYukla } from "./yukla";

export const metadata: Metadata = {
  title: "Admin — NutriLifer",
  robots: { index: false, follow: false },
};

/**
 * Admin paneli darvozasi (A0, admin-tz.md): sessiya yo'q — Login Widget; sessiya bor-u
 * admin emas — rad javobi, panel tuzilishi ko'rsatilmaydi; admin — qobiq va bo'lim.
 * Har `/api/admin/*` so'rovi rolni qaytadan tekshiradi — bu darvoza faqat ko'rinish uchun.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const holat = await adminHolatiniYukla();

  if (holat.holat !== "admin") {
    const bot = holat.holat === "sessiyasiz" ? await botniYukla() : null;
    return <AdminKirish holat={holat.holat} bot={bot} />;
  }

  return <AdminQobiq ism={holat.ism}>{children}</AdminQobiq>;
}
