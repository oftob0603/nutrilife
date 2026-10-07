import { adminTekshiruvi } from "@/lib/services/admin";
import { tariflarniOl } from "@/lib/services/narxlar";
import { narxlarniOzgartirish } from "@/lib/services/narxlar-admin";
import { narxlarniTekshir } from "@/lib/services/narxlar-admin-hisob";

async function tanaOqi(sorov: Request): Promise<unknown> {
  try {
    return await sorov.json();
  } catch {
    return null;
  }
}

function xato(matn: string, status = 400): Response {
  return Response.json({ xato: matn }, { status });
}

/** A12 — joriy tariflar va narxlar, faqat admin. */
export async function GET(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  return Response.json({ tariflar: await tariflarniOl() });
}

/** Narxlarni o'zgartirish — `{ oylik, yarim_yillik, yillik }` so'mda; hech biri o'zgarmagan bo'lsa 409. */
export async function PATCH(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  const sorovTekshiruvi = narxlarniTekshir(await tanaOqi(sorov));
  if ("xato" in sorovTekshiruvi) return xato(sorovTekshiruvi.xato);

  const natija = await narxlarniOzgartirish(tekshiruv.admin.id, sorovTekshiruvi.sorov);
  if (natija === "ozgarish_yoq") return xato("Narxlar o'zgarmadi", 409);
  return new Response(null, { status: 204 });
}
