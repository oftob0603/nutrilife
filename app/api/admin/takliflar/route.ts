import { adminTekshiruvi } from "@/lib/services/admin";
import { sahifaniOqi } from "@/lib/services/admin-hisob";
import { taklifFiltriniOqi } from "@/lib/services/taom-taklif-hisob";
import { takliflarRoyxati } from "@/lib/services/taom-takliflari";

/** A4 — takliflar navbati: `?holat=yangi&sahifa=1`, eng eskisi birinchi — faqat admin. */
export async function GET(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  const params = new URL(sorov.url).searchParams;
  const royxat = await takliflarRoyxati(taklifFiltriniOqi(params.get("holat")), sahifaniOqi(params.get("sahifa")));
  return Response.json(royxat);
}
