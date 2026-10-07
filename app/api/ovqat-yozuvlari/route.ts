import { kunlikYozuvlar, RasmBoglanmadi, yozuvYaratish } from "@/lib/services/ovqat-yozuvlari";
import { foydalanuvchiHuquqlari } from "@/lib/services/foydalanuvchilar";
import { kunRejasi } from "@/lib/services/rejalar";
import { nutritionScore, type ScoreJavobi } from "@/lib/services/score-hisob";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";
import { sorovTili } from "@/lib/lugat/server";
import { taklifUchunRetseptlar } from "@/lib/services/retseptlar";
import {
  qolganKaloriya,
  retseptTaklifi,
  type QulfJavobi,
  type TaklifJavobi,
} from "@/lib/services/taklif-hisob";
import { bugunSana, kunlikJami, sanaYaroqli } from "@/lib/services/yozuv-hisob";
import { yozuvKirishiniTekshir } from "@/lib/services/yozuv-kirish";

const UUID_QOLIPI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/**
 * Bir kunning yozuvlari, jami, shu kun uchun amaldagi reja, qolgan kaloriya, Nutrition Score
 * va qolganga mos retsept taklifi: `?sana=2026-09-20` (standart — bugun). Score va taklif
 * faqat PRO'ga hisoblab beriladi; `qoldi` hammaga — Home doirasi shu sondan chizadi.
 * `makro` va `porsiya` — hisobsiz PRO imkoniyatlari, faqat qulf bayrog'i: Home/Jurnal makro
 * chiziqlari va E7 porsiya tavsiyasi shu bayroqdan o'qiydi.
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
  const qoldi = reja ? qolganKaloriya(jami, reja) : null;
  const score: ScoreJavobi = huquq.nutritionScore
    ? { yopiq: false, natija: reja ? nutritionScore(jami, reja) : null }
    : { yopiq: true };
  // Retseptlar faqat taklif kerak bo'lganda o'qiladi — FREE so'rovi qimmatlashmasin.
  const taklif: TaklifJavobi = huquq.retseptTakliflari
    ? {
        yopiq: false,
        taklif:
          qoldi === null ? null : retseptTaklifi(await taklifUchunRetseptlar(sorovTili(sorov)), qoldi),
      }
    : { yopiq: true };
  const makro: QulfJavobi = { yopiq: !huquq.makroKuzatish };
  const porsiya: QulfJavobi = { yopiq: !huquq.porsiyaTavsiyasi };
  return Response.json({ sana, yozuvlar, jami, reja, qoldi, score, taklif, makro, porsiya });
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

  const rasmId = tana.rasmId ?? null;
  if (rasmId !== null && (typeof rasmId !== "string" || !UUID_QOLIPI.test(rasmId))) {
    return Response.json({ xato: "Rasm topilmadi" }, { status: 400 });
  }

  try {
    const yozuv = await yozuvYaratish(foydalanuvchiId, {
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
