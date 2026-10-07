import { adminTekshiruvi } from "@/lib/services/admin";
import {
  bloklash,
  blokniYechish,
  type BlokNatijasi,
} from "@/lib/services/foydalanuvchi-admin";
import { blokniTekshir } from "@/lib/services/foydalanuvchi-admin-hisob";

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

/** Servis natijasi → javob: topilmadi 404, admin yoki holat o'zgarmaydi 409, bo'ldi 204. */
function natijaJavobi(natija: BlokNatijasi, allaqachon: string): Response {
  if (natija === "topilmadi") return xato("Foydalanuvchi topilmadi", 404);
  if (natija === "admin") return xato("Admin hisobini bloklab bo'lmaydi", 409);
  if (natija === "allaqachon") return xato(allaqachon, 409);
  return new Response(null, { status: 204 });
}

/** Bloklash — `{ sabab }`. */
export async function POST(sorov: Request, { params }: Kontekst) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const { id } = await params;

  const sorovTekshiruvi = blokniTekshir(await tanaOqi(sorov));
  if ("xato" in sorovTekshiruvi) return xato(sorovTekshiruvi.xato);
  return natijaJavobi(
    await bloklash(tekshiruv.admin.id, id, sorovTekshiruvi.sorov.sabab),
    "Foydalanuvchi allaqachon bloklangan",
  );
}

/** Blokni yechish — `{ sabab }`. */
export async function DELETE(sorov: Request, { params }: Kontekst) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const { id } = await params;

  const sorovTekshiruvi = blokniTekshir(await tanaOqi(sorov));
  if ("xato" in sorovTekshiruvi) return xato(sorovTekshiruvi.xato);
  return natijaJavobi(
    await blokniYechish(tekshiruv.admin.id, id, sorovTekshiruvi.sorov.sabab),
    "Foydalanuvchi bloklanmagan",
  );
}
