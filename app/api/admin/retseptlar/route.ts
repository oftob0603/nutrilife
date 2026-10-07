import { sahifaniOqi } from "@/lib/services/admin-hisob";
import { adminTekshiruvi } from "@/lib/services/admin";
import { retseptlarRoyxati, retseptYaratish } from "@/lib/services/retsept-admin";
import { holatFiltriniOqi, kategoriyaFiltriniOqi } from "@/lib/services/retsept-admin-hisob";
import { natijaXatosi, shaklniOqi } from "./shakl";

/** A8 retseptlar ro'yxati: `?kategoriya=&holat=&sahifa=` — faqat admin. */
export async function GET(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  const params = new URL(sorov.url).searchParams;
  const royxat = await retseptlarRoyxati(
    kategoriyaFiltriniOqi(params.get("kategoriya")),
    holatFiltriniOqi(params.get("holat")),
    sahifaniOqi(params.get("sahifa")),
  );
  return Response.json(royxat);
}

/** A9 yangi retsept (multipart: maydonlar + `amal` + ixtiyoriy `rasm`). Javob — `{ id }`, 201. */
export async function POST(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  const shakl = await shaklniOqi(sorov);
  if ("xato" in shakl) return Response.json({ xato: shakl.xato }, { status: shakl.status });

  try {
    const natija = await retseptYaratish(tekshiruv.admin.id, shakl.kirish, shakl.rasm);
    return natijaXatosi(natija) ?? Response.json(natija, { status: 201 });
  } catch (xato) {
    console.error("Retsept saqlanmadi:", xato instanceof Error ? xato.message : xato);
    return Response.json({ xato: "Saqlab bo'lmadi. Qayta urinib ko'ring" }, { status: 502 });
  }
}
