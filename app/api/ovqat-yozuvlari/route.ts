import {
  kunlikYozuvlar,
  RasmBoglanmadi,
  TaomTopilmadi,
  yozuvYaratish,
} from "@/lib/services/ovqat-yozuvlari";
import { foydalanuvchiHuquqlari } from "@/lib/services/foydalanuvchilar";
import { kunRejasi } from "@/lib/services/rejalar";
import { nutritionScore, type ScoreJavobi } from "@/lib/services/score-hisob";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";
import { bugunSana, kunlikJami, sanaYaroqli } from "@/lib/services/yozuv-hisob";
import { yozuvKirishiniTekshir } from "@/lib/services/yozuv-kirish";

const UUID_QOLIPI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Bir kunning yozuvlari, jami, shu kun uchun amaldagi reja va Nutrition Score:
 * `?sana=2026-09-20` (standart — bugun). Score faqat PRO'ga hisoblab beriladi.
 */
export async function GET(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();

  const berilgan = new URL(sorov.url).searchParams.get("sana");
  const sana = berilgan && sanaYaroqli(berilgan) ? berilgan : bugunSana();

  const [yozuvlar, reja, huquq] = await Promise.all([
    kunlikYozuvlar(foydalanuvchiId, sana),
    kunRejasi(foydalanuvchiId, sana),
    foydalanuvchiHuquqlari(foydalanuvchiId),
  ]);
  if (!huquq) return kirishKerak();

  const jami = kunlikJami(yozuvlar);
  const score: ScoreJavobi = huquq.nutritionScore
    ? { yopiq: false, natija: reja ? nutritionScore(jami, reja) : null }
    : { yopiq: true };
  return Response.json({ sana, yozuvlar, jami, reja, score });
}

/** Jurnalga yangi yozuv qo'shadi. */
export async function POST(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();

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

  const taomId = tana.taomId ?? null;
  if (taomId !== null && (typeof taomId !== "string" || !UUID_QOLIPI.test(taomId))) {
    return Response.json({ xato: "Taom topilmadi" }, { status: 400 });
  }

  const rasmId = tana.rasmId ?? null;
  if (rasmId !== null && (typeof rasmId !== "string" || !UUID_QOLIPI.test(rasmId))) {
    return Response.json({ xato: "Rasm topilmadi" }, { status: 400 });
  }

  try {
    const yozuv = await yozuvYaratish(foydalanuvchiId, {
      taomId,
      ...tekshiruv.kirish,
      manba: tana.manba === "ai" ? "ai" : "qolda",
      rasmId,
    });
    return Response.json({ yozuv }, { status: 201 });
  } catch (xato) {
    if (xato instanceof RasmBoglanmadi) {
      return Response.json({ xato: "Rasm topilmadi" }, { status: 400 });
    }
    if (xato instanceof TaomTopilmadi) {
      return Response.json({ xato: "Taom topilmadi" }, { status: 400 });
    }
    throw xato;
  }
}
