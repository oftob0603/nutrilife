import { hisobniOchirish } from "@/lib/services/foydalanuvchilar";
import { joriyVazn, profilniOl, shaxsiyniSaqlash } from "@/lib/services/profil";
import {
  joriyFoydalanuvchiId,
  kirishKerak,
  sessiyaEgasiId,
  sessiyaniOchirishCookie,
} from "@/lib/services/sessiya";
import { shaxsiyniTekshir } from "@/lib/services/shaxsiy-hisob";

async function tanaOqi(sorov: Request): Promise<Record<string, unknown> | null> {
  try {
    const tana: unknown = await sorov.json();
    return typeof tana === "object" && tana !== null ? (tana as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function oqilmadi() {
  return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
}

/** Profil ekrani (F1, F3) va Home salomi uchun hisob egasining ma'lumoti. */
export async function GET(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  const profil = foydalanuvchiId ? await profilniOl(foydalanuvchiId) : null;
  return profil ? Response.json({ profil }) : kirishKerak();
}

/** Shaxsiy ma'lumotni (F3) saqlaydi — tekshiruv onboardingdagi bilan bir xil. */
export async function PATCH(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();

  const tana = await tanaOqi(sorov);
  if (!tana) return oqilmadi();

  const tekshiruv = shaxsiyniTekshir(tana, await joriyVazn(foydalanuvchiId));
  if ("xato" in tekshiruv) return Response.json({ xato: tekshiruv.xato }, { status: 400 });

  await shaxsiyniSaqlash(foydalanuvchiId, tekshiruv.malumot);
  return new Response(null, { status: 204 });
}

/**
 * Hisobni o'chiradi (F5). Faqat haqiqiy sessiya bilan — lokal "birinchi hisob" zaxirasi bu
 * yerda ishlamaydi. Tana `{ tasdiq: "ochirish" }` bo'lishi shart: tasodifiy DELETE o'tmaydi.
 */
export async function DELETE(sorov: Request) {
  const foydalanuvchiId = sessiyaEgasiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();

  const tana = await tanaOqi(sorov);
  if (tana?.tasdiq !== "ochirish") return oqilmadi();

  if (!(await hisobniOchirish(foydalanuvchiId))) return kirishKerak();
  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": sessiyaniOchirishCookie() },
  });
}
