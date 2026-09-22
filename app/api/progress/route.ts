import { progressniOl } from "@/lib/services/progress";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";

/** Progress sahifasi (P1, P3): o'lchovlar, streak va kuzatilgan kunlar. Tarifdan qat'i nazar ochiq. */
export async function GET(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  const progress = foydalanuvchiId ? await progressniOl(foydalanuvchiId) : null;
  return progress ? Response.json({ progress }) : kirishKerak();
}
