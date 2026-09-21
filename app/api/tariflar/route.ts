import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";
import { TARIF_NARXLARI } from "@/lib/tariflar";

/** PRO tariflari va narxlari — tariflar ekrani (W1) uchun. */
export async function GET(sorov: Request) {
  if (!(await joriyFoydalanuvchiId(sorov))) return kirishKerak();
  return Response.json({ tariflar: TARIF_NARXLARI });
}
