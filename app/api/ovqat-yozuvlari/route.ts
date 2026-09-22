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
import {
  qolganKaloriya,
  taomTaklifi,
  type QulfJavobi,
  type TaklifJavobi,
} from "@/lib/services/taklif-hisob";
import { taomlarniOl } from "@/lib/services/taomlar";
import { bugunSana, kunlikJami, sanaYaroqli } from "@/lib/services/yozuv-hisob";
import { yozuvKirishiniTekshir } from "@/lib/services/yozuv-kirish";

const UUID_QOLIPI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Taom identifikatori UUID emas, slug (`chuchvara`, `achchiq-chuchuk` — prisma/seed): faqat
// kichik lotin harf, raqam va chiziqcha. Yo'q id baribir bazada tutiladi (`TaomTopilmadi`).
const TAOM_ID_QOLIPI = /^[a-z0-9-]{1,64}$/;

/**
 * Bir kunning yozuvlari, jami, shu kun uchun amaldagi reja, qolgan kaloriya, Nutrition Score
 * va qolganga mos taom taklifi: `?sana=2026-09-20` (standart — bugun). Score va taklif
 * faqat PRO'ga hisoblab beriladi; `qoldi` hammaga — Home doirasi shu sondan chizadi.
 * `makro` va `porsiya` — hisobsiz PRO imkoniyatlari, faqat qulf bayrog'i: Home/Jurnal makro
 * chiziqlari va E5/E7 porsiya tavsiyasi shu bayroqdan o'qiydi.
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
  // Taomlar bazasi faqat taklif kerak bo'lganda o'qiladi — FREE so'rovi qimmatlashmasin.
  const taklif: TaklifJavobi = huquq.taomTakliflari
    ? { yopiq: false, taklif: qoldi === null ? null : taomTaklifi(await taomlarniOl(), qoldi) }
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

  const taomId = tana.taomId ?? null;
  if (taomId !== null && (typeof taomId !== "string" || !TAOM_ID_QOLIPI.test(taomId))) {
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
