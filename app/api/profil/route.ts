import { profilniOl } from "@/lib/services/profil";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";

/** Profil ekrani (F1) va Home salomi uchun hisob egasining ma'lumoti. */
export async function GET(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  const profil = foydalanuvchiId ? await profilniOl(foydalanuvchiId) : null;
  return profil ? Response.json({ profil }) : kirishKerak();
}
