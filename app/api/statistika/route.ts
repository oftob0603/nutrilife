import { after } from "next/server";
import { faollikniBelgila } from "@/lib/services/faollik";
import { ovqatStatistikasiniOl } from "@/lib/services/statistika";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";

/**
 * P1 dagi PRO bo'limlari: batafsil ovqatlanish statistikasi (7 va 30 kun) va haftalik hisobot.
 * FREE'ga faqat `{ yopiq: true }` — raqamlar PRO'dan tashqariga chiqmaydi.
 */
export async function GET(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  const statistika = foydalanuvchiId ? await ovqatStatistikasiniOl(foydalanuvchiId) : null;
  if (foydalanuvchiId && statistika) after(() => faollikniBelgila(foydalanuvchiId));
  return statistika ? Response.json({ statistika }) : kirishKerak();
}
