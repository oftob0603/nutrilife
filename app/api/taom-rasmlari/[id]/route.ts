import { HAVOLA_MUDDATI_SONIYA } from "@/lib/services/ombor";
import { taomRasmHavolasi } from "@/lib/services/taom-admin";

const ID_QOLIPI = /^[a-z0-9-]{1,64}$/;

/**
 * Admin A7'dan yuklangan taom rasmi — umumiy baza rasmi, shuning uchun sessiyasiz ochiq (seed'dagi
 * `public/taomlar/*.webp` kabi). Ombordagi faylning imzoli havolasiga yo'naltiradi; `?v=` faqat
 * brauzer keshini yangilash uchun.
 */
export async function GET(_sorov: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const havola = ID_QOLIPI.test(id) ? await taomRasmHavolasi(id) : null;
  if (!havola) return Response.json({ xato: "Rasm topilmadi" }, { status: 404 });

  return new Response(null, {
    status: 302,
    headers: {
      Location: havola,
      "Cache-Control": `public, max-age=${HAVOLA_MUDDATI_SONIYA - 600}`,
    },
  });
}
