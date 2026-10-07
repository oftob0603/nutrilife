import { adminTekshiruvi } from "@/lib/services/admin";
import { retseptKartasi, retseptYangilash } from "@/lib/services/retsept-admin";
import { natijaXatosi, shaklniOqi } from "../shakl";

type Kontekst = { params: Promise<{ id: string }> };

const ID_QOLIPI = /^[a-z0-9-]{1,64}$/;

/** A9 kartasi. */
export async function GET(sorov: Request, { params }: Kontekst) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const { id } = await params;

  const karta = ID_QOLIPI.test(id) ? await retseptKartasi(id) : null;
  if (!karta) return Response.json({ xato: "Retsept topilmadi" }, { status: 404 });
  return Response.json({ karta });
}

/** A9 saqlash yoki chop etish (multipart: maydonlar + `amal` + ixtiyoriy `rasm`); id o'zgarmaydi. Bo'ldi — 204. */
export async function PATCH(sorov: Request, { params }: Kontekst) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const { id } = await params;
  if (!ID_QOLIPI.test(id)) return Response.json({ xato: "Retsept topilmadi" }, { status: 404 });

  const shakl = await shaklniOqi(sorov);
  if ("xato" in shakl) return Response.json({ xato: shakl.xato }, { status: shakl.status });

  try {
    const natija = await retseptYangilash(tekshiruv.admin.id, id, shakl.kirish, shakl.rasm);
    return natijaXatosi(natija) ?? new Response(null, { status: 204 });
  } catch (xato) {
    console.error("Retsept yangilanmadi:", xato instanceof Error ? xato.message : xato);
    return Response.json({ xato: "Saqlab bo'lmadi. Qayta urinib ko'ring" }, { status: 502 });
  }
}
