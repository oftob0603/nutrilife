import { vaznniTekshir } from "@/lib/services/progress-hisob";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";
import { vaznQoshish } from "@/lib/services/vazn";

/**
 * Bugungi vazn o'lchovi (P2). Tana: `{ vazn }` — kilogrammda. Sana qabul qilinmaydi: o'lchov
 * doim bugunga tushadi, bugungi bor bo'lsa yangilanadi (200), yo'q bo'lsa yaratiladi (201).
 */
export async function POST(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();

  let tana: unknown;
  try {
    tana = await sorov.json();
  } catch {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }

  const tekshiruv = vaznniTekshir((tana as { vazn?: unknown } | null)?.vazn);
  if ("xato" in tekshiruv) return Response.json({ xato: tekshiruv.xato }, { status: 400 });

  const natija = await vaznQoshish(foydalanuvchiId, tekshiruv.vazn);
  return Response.json(natija, { status: natija.yangilandi ? 200 : 201 });
}
