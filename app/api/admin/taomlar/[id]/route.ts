import { adminTekshiruvi } from "@/lib/services/admin";
import { taomKartasi, taomYangilash } from "@/lib/services/taom-admin";
import { shaklniOqi } from "../shakl";

type Kontekst = { params: Promise<{ id: string }> };

const ID_QOLIPI = /^[a-z0-9-]{1,64}$/;

/** A7 kartasi. */
export async function GET(sorov: Request, { params }: Kontekst) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const { id } = await params;

  const karta = ID_QOLIPI.test(id) ? await taomKartasi(id) : null;
  if (!karta) return Response.json({ xato: "Taom topilmadi" }, { status: 404 });
  return Response.json({ karta });
}

/** A7 saqlash (multipart: maydonlar + ixtiyoriy `rasm`); id o'zgarmaydi. Bo'ldi — 204. */
export async function PATCH(sorov: Request, { params }: Kontekst) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const { id } = await params;
  if (!ID_QOLIPI.test(id)) return Response.json({ xato: "Taom topilmadi" }, { status: 404 });

  const shakl = await shaklniOqi(sorov);
  if ("xato" in shakl) return Response.json({ xato: shakl.xato }, { status: shakl.status });

  try {
    const natija = await taomYangilash(tekshiruv.admin.id, id, shakl.kirish, shakl.rasm);
    if (natija === "topilmadi") return Response.json({ xato: "Taom topilmadi" }, { status: 404 });
    if (natija === "kategoriya_yoq") {
      return Response.json({ xato: "Kategoriya topilmadi" }, { status: 400 });
    }
    return new Response(null, { status: 204 });
  } catch (xato) {
    console.error("Taom yangilanmadi:", xato instanceof Error ? xato.message : xato);
    return Response.json({ xato: "Saqlab bo'lmadi. Qayta urinib ko'ring" }, { status: 502 });
  }
}
