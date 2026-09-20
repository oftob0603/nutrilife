import {
  yozuvniOchirish,
  yozuvniOl,
  yozuvniYangilash,
} from "@/lib/services/ovqat-yozuvlari";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";
import { yozuvKirishiniTekshir } from "@/lib/services/yozuv-kirish";

const UUID_QOLIPI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Kontekst = RouteContext<"/api/ovqat-yozuvlari/[id]">;

function topilmadi() {
  return Response.json({ xato: "Yozuv topilmadi" }, { status: 404 });
}

/** Bitta yozuv — tahrir ekrani (E10) uchun. */
export async function GET(sorov: Request, kontekst: Kontekst) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();

  const { id } = await kontekst.params;
  const yozuv = UUID_QOLIPI.test(id) ? await yozuvniOl(foydalanuvchiId, id) : null;
  return yozuv ? Response.json({ yozuv }) : topilmadi();
}

/** Yozuvni tahrirlaydi: nom, porsiya, kaloriya, makrolar, ovqat turi va (ixtiyoriy) vaqt. */
export async function PATCH(sorov: Request, kontekst: Kontekst) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();

  const { id } = await kontekst.params;
  if (!UUID_QOLIPI.test(id)) return topilmadi();

  let tana: Record<string, unknown>;
  try {
    tana = (await sorov.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }

  const tekshiruv = yozuvKirishiniTekshir(tana);
  if ("xato" in tekshiruv) {
    return Response.json({ xato: tekshiruv.xato }, { status: 400 });
  }

  let vaqt: Date | undefined;
  if (tana.vaqt !== undefined) {
    vaqt = typeof tana.vaqt === "string" ? new Date(tana.vaqt) : new Date(NaN);
    // Kelajakdagi vaqt bilan yozuv bo'lmaydi — hali yeyilmagan ovqat jurnalga tushmaydi.
    if (Number.isNaN(vaqt.getTime()) || vaqt.getTime() > Date.now() + 60_000) {
      return Response.json({ xato: "Vaqt noto'g'ri" }, { status: 400 });
    }
  }

  const yozuv = await yozuvniYangilash(foydalanuvchiId, id, { ...tekshiruv.kirish, vaqt });
  return yozuv ? Response.json({ yozuv }) : topilmadi();
}

/** Yozuvni bog'langan rasmi bilan birga o'chiradi. */
export async function DELETE(sorov: Request, kontekst: Kontekst) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();

  const { id } = await kontekst.params;
  const ochirildi = UUID_QOLIPI.test(id) ? await yozuvniOchirish(foydalanuvchiId, id) : false;
  return ochirildi ? new Response(null, { status: 204 }) : topilmadi();
}
