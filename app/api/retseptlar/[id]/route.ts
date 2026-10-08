import { after } from "next/server";
import { sorovTili } from "@/lib/lugat/server";
import { faollikniBelgila } from "@/lib/services/faollik";
import { foydalanuvchiHuquqlari } from "@/lib/services/foydalanuvchilar";
import { retseptDetali } from "@/lib/services/retseptlar";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";

const ID_QOLIPI = /^[a-z0-9-]{1,64}$/;

/**
 * R2/R3 — bitta retsept. PRO'ga masalliqlar va qadamlar, FREE'ga faqat soni (`yopiq: true`):
 * to'liq matn FREE javobiga kirmaydi (PRD 4-bo'lim). Qoralama yoki yo'q retsept — 404.
 */
export async function GET(sorov: Request, { params }: { params: Promise<{ id: string }> }) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();
  const huquq = await foydalanuvchiHuquqlari(foydalanuvchiId);
  if (!huquq) return kirishKerak();

  const { id } = await params;
  const javob = ID_QOLIPI.test(id) ? await retseptDetali(id, foydalanuvchiId, sorovTili(sorov), huquq) : null;
  if (!javob) return Response.json({ xato: "Retsept topilmadi" }, { status: 404 });
  after(() => faollikniBelgila(foydalanuvchiId));
  return Response.json(javob);
}
