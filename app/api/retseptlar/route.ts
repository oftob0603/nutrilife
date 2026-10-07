import { sorovTili } from "@/lib/lugat/server";
import { foydalanuvchiHuquqlari } from "@/lib/services/foydalanuvchilar";
import { chopEtilganRetseptlar } from "@/lib/services/retseptlar";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";

/**
 * R1 — chop etilgan retseptlar foydalanuvchi tilida, sevimli belgisi va PRO qulf bayroqlari
 * (`qulf.toliqMatn`, `qulf.sevimli`). Sarlavha, rasm, kaloriya va vaqt hammaga (admin-tz.md A9).
 */
export async function GET(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();
  const huquq = await foydalanuvchiHuquqlari(foydalanuvchiId);
  if (!huquq) return kirishKerak();

  return Response.json(await chopEtilganRetseptlar(foydalanuvchiId, sorovTili(sorov), huquq));
}
