import { db } from "../db.ts";
import { progressHisobi, type Progress } from "./progress-hisob.ts";
import { sozlamalarniOqi } from "./sozlamalar-hisob.ts";
import { bugunSana, toshkentSanasi } from "./yozuv-hisob.ts";

/**
 * Progress sahifasi (P1, P3) uchun hamma narsa bitta javobda: o'lchovlar, streak va
 * kuzatilgan kunlar. Kuzatilgan kunlar `kunlik_xulosa` dan o'qiladi — u yerda faqat faol
 * yozuvi bor kunlar turadi (kunlik-xulosa.ts), ta'rif bilan aynan mos.
 */
export async function progressniOl(foydalanuvchiId: string): Promise<Progress | null> {
  const [foydalanuvchi, olchovlar, xulosalar] = await Promise.all([
    db.foydalanuvchi.findUnique({
      where: { id: foydalanuvchiId },
      select: { til: true, mavzu: true, vaznBirligi: true, boyBirligi: true },
    }),
    db.vaznYozuvi.findMany({
      where: { foydalanuvchiId },
      orderBy: { vaqt: "asc" },
      select: { id: true, vazn: true, maqsad: true, vaqt: true },
    }),
    db.kunlikXulosa.findMany({ where: { foydalanuvchiId }, select: { sana: true } }),
  ]);
  if (!foydalanuvchi) return null;

  return progressHisobi({
    bugun: bugunSana(),
    vaznBirligi: sozlamalarniOqi(foydalanuvchi).vaznBirligi,
    vaznlar: olchovlar.map((olchov, i) => ({
      id: olchov.id,
      sana: toshkentSanasi(olchov.vaqt),
      vazn: olchov.vazn,
      birinchi: i === 0,
    })),
    // Maqsad vazn eng oxirgi o'lchovda turadi (profil.ts).
    maqsadVazn: olchovlar.at(-1)?.maqsad ?? null,
    // DATE ustuni UTC yarim tuni bo'lib keladi — sana qismi o'sha kunning o'zi.
    kuzatilganSanalar: xulosalar.map((xulosa) => xulosa.sana.toISOString().slice(0, 10)),
  });
}
