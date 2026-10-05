import { adminTekshiruvi } from "@/lib/services/admin";

/** Panel qobig'i uchun: kim kirgan. Sessiya yo'q — 401, admin emas — 403. */
export async function GET(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  return Response.json({ admin: { ism: tekshiruv.admin.ism } });
}
