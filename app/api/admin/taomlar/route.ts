import { qidiruvniOqi, sahifaniOqi } from "@/lib/services/admin-hisob";
import { adminTekshiruvi } from "@/lib/services/admin";
import { taomlarRoyxati, taomYaratish } from "@/lib/services/taom-admin";
import { taomFiltriniOqi } from "@/lib/services/taom-admin-hisob";
import { shaklniOqi } from "./shakl";

/** A6 taomlar ro'yxati: `?q=&filtr=&sahifa=` — faqat admin. */
export async function GET(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  const params = new URL(sorov.url).searchParams;
  const royxat = await taomlarRoyxati(
    qidiruvniOqi(params.get("q")),
    taomFiltriniOqi(params.get("filtr")),
    sahifaniOqi(params.get("sahifa")),
  );
  return Response.json(royxat);
}

/** A7 yangi taom (multipart: maydonlar + ixtiyoriy `rasm`). Javob — `{ id }`, 201. */
export async function POST(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  const shakl = await shaklniOqi(sorov);
  if ("xato" in shakl) return Response.json({ xato: shakl.xato }, { status: shakl.status });

  try {
    const natija = await taomYaratish(tekshiruv.admin.id, shakl.kirish, shakl.rasm);
    if (natija === "kategoriya_yoq") {
      return Response.json({ xato: "Kategoriya topilmadi" }, { status: 400 });
    }
    return Response.json(natija, { status: 201 });
  } catch (xato) {
    console.error("Taom saqlanmadi:", xato instanceof Error ? xato.message : xato);
    return Response.json({ xato: "Saqlab bo'lmadi. Qayta urinib ko'ring" }, { status: 502 });
  }
}
