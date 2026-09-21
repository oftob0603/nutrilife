import { obunaTafsiloti } from "@/lib/services/obuna";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";

/** Obuna ekrani (F4) uchun joriy holat va faol muddat. */
export async function GET(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  const obuna = foydalanuvchiId ? await obunaTafsiloti(foydalanuvchiId) : null;
  return obuna ? Response.json({ obuna }) : kirishKerak();
}
