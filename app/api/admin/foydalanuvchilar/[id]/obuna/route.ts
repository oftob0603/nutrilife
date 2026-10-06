import { adminTekshiruvi } from "@/lib/services/admin";
import { muddatUzaytirish, proBerish, proOlish, type AmalNatijasi } from "@/lib/services/obuna-admin";
import { berishniTekshir, olishniTekshir, uzaytirishniTekshir } from "@/lib/services/obuna-admin-hisob";

type Kontekst = { params: Promise<{ id: string }> };

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

/** Servis natijasi → javob: topilmadi 404, PRO emas 409, bo'ldi 204. */
function natijaJavobi(natija: AmalNatijasi): Response {
  if (natija === "topilmadi") return xato("Foydalanuvchi topilmadi", 404);
  if (natija === "pro_emas") return xato("Foydalanuvchida faol PRO yo'q", 409);
  return new Response(null, { status: 204 });
}

/** PRO berish — `{ tarif, kunlar?, sabab }`. */
export async function POST(sorov: Request, { params }: Kontekst) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const { id } = await params;

  const sorovTekshiruvi = berishniTekshir(await tanaOqi(sorov));
  if ("xato" in sorovTekshiruvi) return xato(sorovTekshiruvi.xato);
  return natijaJavobi(await proBerish(tekshiruv.admin.id, id, sorovTekshiruvi.sorov));
}

/** Muddatni uzaytirish — `{ muddat, kunlar?, sabab }`. */
export async function PATCH(sorov: Request, { params }: Kontekst) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const { id } = await params;

  const sorovTekshiruvi = uzaytirishniTekshir(await tanaOqi(sorov));
  if ("xato" in sorovTekshiruvi) return xato(sorovTekshiruvi.xato);
  return natijaJavobi(await muddatUzaytirish(tekshiruv.admin.id, id, sorovTekshiruvi.sorov));
}

/** PRO ni olib qo'yish — `{ sabab }`. */
export async function DELETE(sorov: Request, { params }: Kontekst) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const { id } = await params;

  const sorovTekshiruvi = olishniTekshir(await tanaOqi(sorov));
  if ("xato" in sorovTekshiruvi) return xato(sorovTekshiruvi.xato);
  return natijaJavobi(await proOlish(tekshiruv.admin.id, id, sorovTekshiruvi.sorov.sabab));
}
