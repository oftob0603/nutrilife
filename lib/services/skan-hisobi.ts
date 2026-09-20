import { db } from "../db.ts";
import { bugunSana } from "./yozuv-hisob.ts";

const STANDART_CHEGARA = 50;

/**
 * Bir foydalanuvchiga bir kunda ruxsat etilgan AI skanlar soni — AI xarajati nazoratsiz
 * o'sib ketmasligi uchun. FREE/PRO limitlari S4'da shu hisob ustiga quriladi.
 */
function kunlikChegara(): number {
  const berilgan = Number(process.env.SKAN_KUNLIK_CHEGARA);
  return Number.isInteger(berilgan) && berilgan >= 0 ? berilgan : STANDART_CHEGARA;
}

function bugun(foydalanuvchiId: string) {
  return {
    foydalanuvchiId,
    sana: new Date(`${bugunSana()}T00:00:00.000Z`),
  };
}

/**
 * Bugungi hisobdan bitta skan band qiladi; chegara to'lgan bo'lsa false. Oshirish
 * bazada atomar bajariladi — parallel so'rovlar chegaradan o'tib keta olmaydi.
 */
export async function skanBandQil(foydalanuvchiId: string): Promise<boolean> {
  const kalit = bugun(foydalanuvchiId);
  const { soni } = await db.skanHisobi.upsert({
    where: { foydalanuvchiId_sana: kalit },
    create: { ...kalit, soni: 1 },
    update: { soni: { increment: 1 } },
    select: { soni: true },
  });
  if (soni <= kunlikChegara()) return true;

  await skanQaytar(foydalanuvchiId);
  return false;
}

/** Band qilingan skanni qaytaradi — AI ishlamay qolganda foydalanuvchi skanini yo'qotmasin. */
export async function skanQaytar(foydalanuvchiId: string): Promise<void> {
  await db.skanHisobi.update({
    where: { foydalanuvchiId_sana: bugun(foydalanuvchiId) },
    data: { soni: { decrement: 1 } },
  });
}
