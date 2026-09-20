/**
 * Sahifalar o'z API yo'liga murojaat qilganda ishlatiladigan asos manzil.
 * Production'da localhost ishlatilmaydi (CLAUDE.md): Vercel'da APP_URL yoki
 * platformaning o'z VERCEL_URL o'zgaruvchisi olinadi.
 */
export function apiAsos(): string {
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
