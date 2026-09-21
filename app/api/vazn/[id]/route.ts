import { vaznniTekshir } from "@/lib/services/progress-hisob";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";
import { BirinchiOlchov, vaznniOchirish, vaznniTahrirlash } from "@/lib/services/vazn";

const UUID_QOLIPI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Kontekst = RouteContext<"/api/vazn/[id]">;

function topilmadi() {
  return Response.json({ xato: "O'lchov topilmadi" }, { status: 404 });
}

/** O'lchov qiymatini o'zgartiradi (P3). Tana: `{ vazn }` — kilogrammda; sana o'zgarmaydi. */
export async function PATCH(sorov: Request, kontekst: Kontekst) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();

  const { id } = await kontekst.params;
  if (!UUID_QOLIPI.test(id)) return topilmadi();

  let tana: unknown;
  try {
    tana = await sorov.json();
  } catch {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }

  const tekshiruv = vaznniTekshir((tana as { vazn?: unknown } | null)?.vazn);
  if ("xato" in tekshiruv) return Response.json({ xato: tekshiruv.xato }, { status: 400 });

  const natija = await vaznniTahrirlash(foydalanuvchiId, id, tekshiruv.vazn);
  return natija ? Response.json(natija) : topilmadi();
}

/** O'lchovni o'chiradi (P3). Onboardingdagi birinchi o'lchov o'chirilmaydi — 400. */
export async function DELETE(sorov: Request, kontekst: Kontekst) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();

  const { id } = await kontekst.params;
  if (!UUID_QOLIPI.test(id)) return topilmadi();

  try {
    const natija = await vaznniOchirish(foydalanuvchiId, id);
    return natija ? Response.json(natija) : topilmadi();
  } catch (sabab) {
    if (sabab instanceof BirinchiOlchov) {
      return Response.json({ xato: "Birinchi o'lchov o'chirilmaydi" }, { status: 400 });
    }
    throw sabab;
  }
}
