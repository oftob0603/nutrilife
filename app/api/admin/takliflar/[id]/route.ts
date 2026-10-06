import { adminTekshiruvi } from "@/lib/services/admin";
import { taklifKartasi } from "@/lib/services/taom-takliflari";

const UUID_QOLIPI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A5 — bitta taklif; ochilganda "yangi" → "ko'rib chiqilmoqda". Topilmasa 404. */
export async function GET(sorov: Request, { params }: { params: Promise<{ id: string }> }) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  const { id } = await params;
  const karta = UUID_QOLIPI.test(id) ? await taklifKartasi(id) : null;
  if (!karta) return Response.json({ xato: "Taklif topilmadi" }, { status: 404 });
  return Response.json({ karta });
}
