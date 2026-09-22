import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";
import { adminUsername } from "@/lib/services/tarif-hisob";
import { TARIF_NARXLARI } from "@/lib/tariflar";

/**
 * PRO tariflari va narxlari — tariflar ekrani (W1) uchun. `admin` — obuna so'rovi yuboriladigan
 * admin Telegram username'i (`ADMIN_TELEGRAM`, @siz); berilmagan yoki noto'g'ri bo'lsa null.
 */
export async function GET(sorov: Request) {
  if (!(await joriyFoydalanuvchiId(sorov))) return kirishKerak();
  return Response.json({ tariflar: TARIF_NARXLARI, admin: adminUsername(process.env.ADMIN_TELEGRAM) });
}
