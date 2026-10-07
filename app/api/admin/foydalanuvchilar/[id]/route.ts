import { adminTekshiruvi, foydalanuvchiKartasi } from "@/lib/services/admin";
import { hisobOchirildiXabari } from "@/lib/services/bot";
import { hisobniOchirishAdmin } from "@/lib/services/foydalanuvchi-admin";
import { ochirishniTekshir } from "@/lib/services/foydalanuvchi-admin-hisob";

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

/** A3 foydalanuvchi kartasi — faqat admin; hisob topilmasa 404. */
export async function GET(sorov: Request, { params }: Kontekst) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  const { id } = await params;
  const karta = await foydalanuvchiKartasi(id);
  if (!karta) return xato("Foydalanuvchi topilmadi", 404);
  return Response.json({ karta });
}

/**
 * Ma'lumotini o'chirish — `{ tasdiq, sabab }`. `tasdiq` kartadagi ism (ismsiz hisobda Telegram ID)
 * bilan aynan mos kelishi shart. O'chgach foydalanuvchiga bot xabari ketadi — o'zi o'chirgandagi
 * xabarning o'zi; xabar ketmasa ham hisob o'chgan, javob 204 qoladi.
 */
export async function DELETE(sorov: Request, { params }: Kontekst) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const { id } = await params;

  const sorovTekshiruvi = ochirishniTekshir(await tanaOqi(sorov));
  if ("xato" in sorovTekshiruvi) return xato(sorovTekshiruvi.xato);

  const natija = await hisobniOchirishAdmin(tekshiruv.admin.id, id, sorovTekshiruvi.sorov);
  if (natija.natija !== "ok") {
    if (natija.natija === "topilmadi") return xato("Foydalanuvchi topilmadi", 404);
    if (natija.natija === "admin") return xato("Admin hisobini o'chirib bo'lmaydi", 409);
    return xato("Tasdiq matni mos kelmadi");
  }

  await hisobOchirildiXabari(natija.hisob.telegramId, natija.hisob.til);
  return new Response(null, { status: 204 });
}
