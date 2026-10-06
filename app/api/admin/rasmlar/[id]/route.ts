import { adminTekshiruvi } from "@/lib/services/admin";
import { HAVOLA_MUDDATI_SONIYA } from "@/lib/services/ombor";
import { rasmHavolasiAdmin } from "@/lib/services/rasmlar";

const UUID_QOLIPI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Foydalanuvchi rasmini adminga ko'rsatadi — takliflar navbati (A4/A5) uchun; panelda rasm faqat
 * shu yerda ko'rinadi (admin-tz.md §4). `/api/rasmlar/[id]` kabi ombordagi imzoli havolaga
 * yo'naltiradi, farqi — egasi emas, admin roli tekshiriladi.
 */
export async function GET(sorov: Request, { params }: { params: Promise<{ id: string }> }) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  const { id } = await params;
  const havola = UUID_QOLIPI.test(id) ? await rasmHavolasiAdmin(id) : null;
  if (!havola) return Response.json({ xato: "Rasm topilmadi" }, { status: 404 });

  return new Response(null, {
    status: 302,
    headers: {
      Location: havola,
      "Cache-Control": `private, max-age=${HAVOLA_MUDDATI_SONIYA - 600}`,
    },
  });
}
