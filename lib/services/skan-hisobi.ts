import { db } from "../db.ts";
import { S1_FOYDALANUVCHI } from "./ovqat-yozuvlari.ts";
import { bugunSana } from "./yozuv-hisob.ts";

const STANDART_CHEGARA = 50;

/**
 * Bir kunda ruxsat etilgan AI skanlar soni. S3'gacha auth yo'q — bu chegara ochiq
 * turgan `/api/skan` orqali AI xarajati nazoratsiz o'sib ketmasligi uchun.
 */
function kunlikChegara(): number {
  const berilgan = Number(process.env.SKAN_KUNLIK_CHEGARA);
  return Number.isInteger(berilgan) && berilgan >= 0 ? berilgan : STANDART_CHEGARA;
}

function bugun() {
  return {
    foydalanuvchiId: S1_FOYDALANUVCHI,
    sana: new Date(`${bugunSana()}T00:00:00.000Z`),
  };
}

/**
 * Bugungi hisobdan bitta skan band qiladi; chegara to'lgan bo'lsa false. Oshirish
 * bazada atomar bajariladi — parallel so'rovlar chegaradan o'tib keta olmaydi.
 */
export async function skanBandQil(): Promise<boolean> {
  const kalit = bugun();
  const { soni } = await db.skanHisobi.upsert({
    where: { foydalanuvchiId_sana: kalit },
    create: { ...kalit, soni: 1 },
    update: { soni: { increment: 1 } },
    select: { soni: true },
  });
  if (soni <= kunlikChegara()) return true;

  await skanQaytar();
  return false;
}

/** Band qilingan skanni qaytaradi — AI ishlamay qolganda foydalanuvchi skanini yo'qotmasin. */
export async function skanQaytar(): Promise<void> {
  await db.skanHisobi.update({
    where: { foydalanuvchiId_sana: bugun() },
    data: { soni: { decrement: 1 } },
  });
}
