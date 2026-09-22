import { tilCookie } from "@/lib/lugat/server";
import { foydalanuvchiMenyusiniYangila } from "@/lib/services/bot";
import { sozlamalarniSaqlash } from "@/lib/services/foydalanuvchilar";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";
import { sozlamaniTekshir } from "@/lib/services/sozlamalar-hisob";

/** Sozlama qatoridagi tanlov: `{ til }`, `{ mavzu }`, `{ vaznBirligi }` yoki `{ boyBirligi }`. */
export async function PATCH(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();

  let tana: unknown;
  try {
    tana = await sorov.json();
  } catch {
    tana = null;
  }
  const ozgarish =
    typeof tana === "object" && tana !== null
      ? sozlamaniTekshir(tana as Record<string, unknown>)
      : null;
  if (!ozgarish) return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });

  if (!(await sozlamalarniSaqlash(foydalanuvchiId, ozgarish))) return kirishKerak();
  // Bot chatidagi menyu tugmasi ham yangi tilda bo'lsin; xato javobni to'xtatmaydi.
  if (ozgarish.til) await foydalanuvchiMenyusiniYangila(foydalanuvchiId, ozgarish.til).catch(() => {});

  // Sahifalar tilni cookie'dan o'qiydi — til o'zgarsa u ham shu javobda yangilanadi.
  return new Response(null, {
    status: 204,
    headers: ozgarish.til ? { "Set-Cookie": tilCookie(ozgarish.til) } : undefined,
  });
}
