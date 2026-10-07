import { foydalanuvchiHuquqlari } from "@/lib/services/foydalanuvchilar";
import { sevimlidanOl, sevimligaQosh } from "@/lib/services/retseptlar";
import { joriyFoydalanuvchiId, kirishKerak, ruxsatYoq } from "@/lib/services/sessiya";

const ID_QOLIPI = /^[a-z0-9-]{1,64}$/;

type Kontekst = { params: Promise<{ id: string }> };

/** Sevimli — PRO imkoniyati (pro-imkoniyatlar `sevimli`); FREE va muddati tugagan PRO'ga 403. */
async function egasi(sorov: Request, { params }: Kontekst) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return { javob: kirishKerak() };
  const huquq = await foydalanuvchiHuquqlari(foydalanuvchiId);
  if (!huquq) return { javob: kirishKerak() };
  if (!huquq.sevimliRetseptlar) return { javob: ruxsatYoq() };
  const { id } = await params;
  if (!ID_QOLIPI.test(id)) return { javob: Response.json({ xato: "Retsept topilmadi" }, { status: 404 }) };
  return { foydalanuvchiId, id };
}

/** Sevimliga qo'shish — 204; chop etilmagan retsept — 404. */
export async function POST(sorov: Request, kontekst: Kontekst) {
  const natija = await egasi(sorov, kontekst);
  if ("javob" in natija) return natija.javob;
  const holat = await sevimligaQosh(natija.foydalanuvchiId, natija.id);
  if (holat === "topilmadi") return Response.json({ xato: "Retsept topilmadi" }, { status: 404 });
  return new Response(null, { status: 204 });
}

/** Sevimlidan olib tashlash — 204 (bo'lmasa ham). */
export async function DELETE(sorov: Request, kontekst: Kontekst) {
  const natija = await egasi(sorov, kontekst);
  if ("javob" in natija) return natija.javob;
  await sevimlidanOl(natija.foydalanuvchiId, natija.id);
  return new Response(null, { status: 204 });
}
