import { sessiyaniOchirishCookie } from "@/lib/services/sessiya";

/** Paneldan chiqish — sessiya cookie'si o'chiriladi (brauzer umumiy bo'lishi mumkin). */
export async function POST() {
  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": sessiyaniOchirishCookie() },
  });
}
