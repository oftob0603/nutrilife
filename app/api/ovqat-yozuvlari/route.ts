import {
  kunlikYozuvlar,
  RasmBoglanmadi,
  yozuvYaratish,
} from "@/lib/services/ovqat-yozuvlari";
import { bugunSana, kunlikJami, sanaYaroqli } from "@/lib/services/yozuv-hisob";
import { yozuvKirishiniTekshir } from "@/lib/services/yozuv-kirish";

const UUID_QOLIPI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Bir kunning yozuvlari va jami: `?sana=2026-09-20` (standart — bugun). */
export async function GET(sorov: Request) {
  const berilgan = new URL(sorov.url).searchParams.get("sana");
  const sana = berilgan && sanaYaroqli(berilgan) ? berilgan : bugunSana();

  const yozuvlar = await kunlikYozuvlar(sana);
  return Response.json({ sana, yozuvlar, jami: kunlikJami(yozuvlar) });
}

/** Jurnalga yangi yozuv qo'shadi. */
export async function POST(sorov: Request) {
  let tana: Record<string, unknown>;
  try {
    tana = (await sorov.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }

  const tekshiruv = yozuvKirishiniTekshir(tana);
  if ("xato" in tekshiruv) {
    return Response.json({ xato: tekshiruv.xato }, { status: 400 });
  }

  const rasmId = tana.rasmId ?? null;
  if (rasmId !== null && (typeof rasmId !== "string" || !UUID_QOLIPI.test(rasmId))) {
    return Response.json({ xato: "Rasm topilmadi" }, { status: 400 });
  }

  try {
    const yozuv = await yozuvYaratish({
      taomId: typeof tana.taomId === "string" ? tana.taomId : null,
      ...tekshiruv.kirish,
      manba: tana.manba === "ai" ? "ai" : "qolda",
      rasmId,
    });
    return Response.json({ yozuv }, { status: 201 });
  } catch (xato) {
    if (xato instanceof RasmBoglanmadi) {
      return Response.json({ xato: "Rasm topilmadi" }, { status: 400 });
    }
    throw xato;
  }
}
