import type { Metadata } from "next";
import { AdminKirish } from "./_components/AdminKirish";
import { AdminQobiq } from "./_components/AdminQobiq";
import { adminHolatiniYukla } from "./yukla";

export const metadata: Metadata = {
  title: "Admin — NutriLifer",
  robots: { index: false, follow: false },
};

/**
 * Admin paneli darvozasi (A0, admin-tz.md). Panel Telegram ichida Mini App sifatida ochiladi
 * (bot `/add26` → "Panelni ochish"), kirish ilovadagi darvoza orqali initData bilan bo'ladi
 * (DECISIONS 2026-10-05). Sessiya bor-u admin emas — rad javobi, panel tuzilishi
 * ko'rsatilmaydi; admin — qobiq va bo'lim. Har `/api/admin/*` so'rovi rolni qaytadan
 * tekshiradi — bu darvoza faqat ko'rinish uchun.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const holat = await adminHolatiniYukla();
  if (holat.holat !== "admin") return <AdminKirish holat={holat.holat} />;
  return <AdminQobiq ism={holat.ism}>{children}</AdminQobiq>;
}
