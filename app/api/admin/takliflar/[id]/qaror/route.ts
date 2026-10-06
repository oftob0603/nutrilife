import { adminTekshiruvi } from "@/lib/services/admin";
import { qarorniTekshir } from "@/lib/services/taom-taklif-hisob";
import { taklifQarori, type QarorNatijasi } from "@/lib/services/taom-takliflari";

const UUID_QOLIPI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function xato(matn: string, status = 400): Response {
  return Response.json({ xato: matn }, { status });
}

/** Servis natijasi → javob: topilmadi 404, yopilgan 409, taom yo'q 400, bo'ldi 204. */
function natijaJavobi(natija: QarorNatijasi): Response {
  if (natija === "topilmadi") return xato("Taklif topilmadi", 404);
  if (natija === "yopilgan") return xato("Bu taklif bo'yicha qaror allaqachon berilgan", 409);
  if (natija === "taom_topilmadi") return xato("Birlashtiriladigan taom bazada yo'q");
  return new Response(null, { status: 204 });
}

/**
 * A5 qarori — `{ qaror: "yangi" | "birlashtirish" | "rad", nomi?, nomiRu?, nomiEn?, taomId?, sabab? }`.
 * Har qaror `admin_amallari`ga yoziladi (admin-tz.md §4).
 */
export async function POST(sorov: Request, { params }: { params: Promise<{ id: string }> }) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  const { id } = await params;
  if (!UUID_QOLIPI.test(id)) return xato("Taklif topilmadi", 404);

  let tana: unknown = null;
  try {
    tana = await sorov.json();
  } catch {
    // tana bo'sh — tekshiruv o'zi rad etadi
  }
  const qaror = qarorniTekshir(tana);
  if ("xato" in qaror) return xato(qaror.xato);
  return natijaJavobi(await taklifQarori(tekshiruv.admin.id, id, qaror.qaror));
}
