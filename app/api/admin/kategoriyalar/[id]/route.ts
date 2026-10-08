import { adminTekshiruvi } from "@/lib/services/admin";
import { kategoriyaOchirish, kategoriyaOqibati } from "@/lib/services/kategoriya-admin";

type Kontekst = { params: Promise<{ id: string }> };

const UUID_QOLIPI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** O'chirish oynasi uchun: `{ kategoriya, retseptlar }` — bog'langan retseptlar soni. */
export async function GET(sorov: Request, { params }: Kontekst) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const { id } = await params;
  const oqibat = UUID_QOLIPI.test(id) ? await kategoriyaOqibati(id) : null;
  if (!oqibat) return Response.json({ xato: "Kategoriya topilmadi" }, { status: 404 });
  return Response.json(oqibat);
}

/** Kategoriyani o'chirish — bog'langan retseptlar kategoriyasiz qoladi; jurnalga yoziladi. */
export async function DELETE(sorov: Request, { params }: Kontekst) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const { id } = await params;
  const natija = UUID_QOLIPI.test(id) ? await kategoriyaOchirish(tekshiruv.admin.id, id) : "topilmadi";
  if (natija === "topilmadi") return Response.json({ xato: "Kategoriya topilmadi" }, { status: 404 });
  return Response.json(natija);
}
