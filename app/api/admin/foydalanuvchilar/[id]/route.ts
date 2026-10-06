import { adminTekshiruvi, foydalanuvchiKartasi } from "@/lib/services/admin";

/** A3 foydalanuvchi kartasi — faqat admin; hisob topilmasa 404. */
export async function GET(sorov: Request, { params }: { params: Promise<{ id: string }> }) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  const { id } = await params;
  const karta = await foydalanuvchiKartasi(id);
  if (!karta) return Response.json({ xato: "Foydalanuvchi topilmadi" }, { status: 404 });
  return Response.json({ karta });
}
