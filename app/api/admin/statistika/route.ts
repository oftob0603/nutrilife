import { adminTekshiruvi } from "@/lib/services/admin";
import { statistika } from "@/lib/services/admin-statistika";
import { davrniOqi } from "@/lib/services/admin-statistika-hisob";

/** A10 statistika: `?davr=7|30|90` bo'yicha metrikalar va daromad — faqat admin. */
export async function GET(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const davr = davrniOqi(new URL(sorov.url).searchParams.get("davr"));
  return Response.json(await statistika(davr));
}
