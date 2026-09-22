import type { NextConfig } from "next";

/**
 * Backend (app/api/*) Railway'da, frontend Vercel'da ishlaydi (DECISIONS 2026-09-16).
 * Vercel'da BACKEND_URL berilgan bo'lsa, brauzerdan kelgan /api/* so'rovlari Railway'ga
 * uzatiladi — brauzer uchun domen bitta qoladi, shuning uchun sessiya cookie'si va CORS
 * o'zgarmaydi. `beforeFiles`: aks holda Vercel'dagi shu nomli API yo'llari ustun keladi.
 * Railway'da va lokalda BACKEND_URL berilmaydi — API o'sha jarayonning o'zida ishlaydi.
 */
const backend = process.env.BACKEND_URL?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!backend) return [];
    return {
      beforeFiles: [{ source: "/api/:yol*", destination: `${backend}/api/:yol*` }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
