import { filtrniOqi, qidiruvniOqi, sahifaniOqi } from "@/lib/services/admin-hisob";
import { adminTekshiruvi, foydalanuvchilarRoyxati } from "@/lib/services/admin";

/** A2 foydalanuvchilar ro'yxati: `?q=&filtr=&sahifa=` — faqat admin. */
export async function GET(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  const params = new URL(sorov.url).searchParams;
  const royxat = await foydalanuvchilarRoyxati(
    qidiruvniOqi(params.get("q")),
    filtrniOqi(params.get("filtr")),
    sahifaniOqi(params.get("sahifa")),
  );
  return Response.json(royxat);
}
