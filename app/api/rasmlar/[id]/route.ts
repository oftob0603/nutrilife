import { HAVOLA_MUDDATI_SONIYA } from "@/lib/services/ombor";
import { rasmHavolasi, rasmOchirish } from "@/lib/services/rasmlar";

const UUID_QOLIPI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Rasmni ko'rsatadi: ombordagi faylning vaqtinchalik imzoli havolasiga yo'naltiradi. */
export async function GET(
  _sorov: Request,
  kontekst: RouteContext<"/api/rasmlar/[id]">,
) {
  const { id } = await kontekst.params;
  const havola = UUID_QOLIPI.test(id) ? await rasmHavolasi(id) : null;

  if (!havola) {
    return Response.json({ xato: "Rasm topilmadi" }, { status: 404 });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: havola,
      // Brauzer yo'naltirishni havola eskirishidan oldinroq unutsin.
      "Cache-Control": `private, max-age=${HAVOLA_MUDDATI_SONIYA - 600}`,
    },
  });
}

/** Tasdiqlanmay qolgan rasmni o'chiradi. Jurnalga tushgan rasm bu yo'l bilan o'chmaydi. */
export async function DELETE(
  _sorov: Request,
  kontekst: RouteContext<"/api/rasmlar/[id]">,
) {
  const { id } = await kontekst.params;
  const natija = UUID_QOLIPI.test(id) ? await rasmOchirish(id) : "yoq";

  if (natija === "yoq") {
    return Response.json({ xato: "Rasm topilmadi" }, { status: 404 });
  }
  if (natija === "boglangan") {
    return Response.json({ xato: "Rasm jurnal yozuviga tegishli" }, { status: 409 });
  }
  return new Response(null, { status: 204 });
}
