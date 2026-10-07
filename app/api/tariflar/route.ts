import { tariflarniOl } from "@/lib/services/narxlar";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";
import { adminUsername } from "@/lib/services/tarif-hisob";

/**
 * PRO tariflari va narxlari — tariflar ekrani (W1) uchun, `tariflar` jadvalidan (A12 dan beri admin
 * o'zgartiradi). `admin` — obuna so'rovi yuboriladigan admin Telegram username'i (`ADMIN_TELEGRAM`,
 * @siz); berilmagan yoki noto'g'ri bo'lsa null.
 */
export async function GET(sorov: Request) {
  if (!(await joriyFoydalanuvchiId(sorov))) return kirishKerak();
  return Response.json({ tariflar: await tariflarniOl(), admin: adminUsername(process.env.ADMIN_TELEGRAM) });
}
