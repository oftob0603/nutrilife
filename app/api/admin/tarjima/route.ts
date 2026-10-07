import { adminTekshiruvi } from "@/lib/services/admin";
import { aiTarjima, AiXatosi } from "@/lib/services/ai";
import { tarjimaJavobiniTekshir, tarjimaSoroviniOqi } from "@/lib/services/retsept-admin-hisob";

/**
 * A9 "Ruscha va inglizchaga tarjima qilish": `{ nomi, masalliqlar[], qadamlar[] }` o'zbekcha →
 * `{ ru, en }` shu shaklda. Natija bazaga yozilmaydi — admin shaklda ko'rib, kerak bo'lsa
 * tuzatib, o'zi saqlaydi. Faqat admin.
 */
export async function POST(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  let tana: unknown;
  try {
    tana = await sorov.json();
  } catch {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }
  const manba = tarjimaSoroviniOqi(tana);
  if (!manba) return Response.json({ xato: "Avval o'zbekcha nomini kiriting" }, { status: 400 });

  try {
    const xom = await aiTarjima(manba);
    const tarjima = xom === null ? null : tarjimaJavobiniTekshir(xom, manba);
    if (!tarjima) {
      return Response.json({ xato: "Tarjima to'liq kelmadi. Qayta urinib ko'ring" }, { status: 502 });
    }
    return Response.json(tarjima);
  } catch (xato) {
    if (xato instanceof AiXatosi) {
      console.error("Tarjima xatosi:", xato.tur, xato.message);
      const matn =
        xato.tur === "sozlanmagan"
          ? "Tarjima xizmati sozlanmagan"
          : xato.tur === "vaqt_tugadi"
            ? "Tarjima kutilgan vaqtda kelmadi. Qayta urinib ko'ring"
            : "Tarjima xizmati javob bermadi. Qayta urinib ko'ring";
      return Response.json({ xato: matn }, { status: xato.tur === "sozlanmagan" ? 503 : 502 });
    }
    console.error("Tarjima xatosi:", xato instanceof Error ? xato.message : xato);
    return Response.json({ xato: "Tarjima qilib bo'lmadi. Qayta urinib ko'ring" }, { status: 502 });
  }
}
