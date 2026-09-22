import { headers } from "next/headers";

/**
 * Sahifalar API'ga murojaat qilganda ishlatiladigan asos manzil.
 * Production'da localhost ishlatilmaydi (CLAUDE.md): Vercel'da BACKEND_URL (Railway'dagi
 * backend) — server sahifalari API'ni to'g'ridan-to'g'ri chaqiradi, Vercel orqali aylanmaydi.
 * U berilmagan muhitda — APP_URL yoki platformaning o'z VERCEL_URL o'zgaruvchisi.
 */
export function apiAsos(): string {
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL.replace(/\/+$/, "");
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/**
 * Sahifadan (server tomonda) o'z API'siga so'rov — foydalanuvchiga tegishli ma'lumot uchun.
 * Server ichidagi `fetch` brauzer cookie'sini o'zi olib o'tmaydi, shuning uchun kelgan
 * so'rovdagi cookie (sessiya) shu yerda uzatiladi. Faqat server komponentlarda ishlaydi.
 */
export async function serverdanApi(
  yol: string,
  sozlama: Pick<RequestInit, "redirect"> = {},
): Promise<Response> {
  const cookie = (await headers()).get("cookie");
  return fetch(`${apiAsos()}${yol}`, {
    ...sozlama,
    cache: "no-store",
    headers: cookie ? { cookie } : undefined,
  });
}
