import { adminTekshiruvi } from "@/lib/services/admin";
import { kutayotganTakliflarSoni } from "@/lib/services/taom-takliflari";

/**
 * Panel qobig'i uchun: kim kirgan va navbatlardagi sonlar (bo'lim yonidagi belgi, admin-tz.md §2).
 * Sessiya yo'q — 401, admin emas — 403. Navbat soni olinmasa qobiq baribir ochiladi (0).
 */
export async function GET(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const takliflar = await kutayotganTakliflarSoni().catch(() => 0);
  return Response.json({ admin: { ism: tekshiruv.admin.ism }, navbatlar: { takliflar } });
}
