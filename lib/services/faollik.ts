import { db } from "../db.ts";

const SOAT_MS = 60 * 60 * 1000;

/**
 * Muhim amal belgisi — PRO xabarlari zanjiri (pro-xabar-hisob.ts) faolsizlikni shundan hisoblaydi.
 * Muhim amallar: AI skan, ovqat yozuvi, retsept ochish, progress va statistika ko'rish
 * (egasining qarori, 2026-10-08). Soatiga bir marta yoziladi — har so'rovda yozuv bo'lmasin.
 * Hech qachon xato tashlamaydi — asosiy oqimni buzmasligi kerak.
 */
export async function faollikniBelgila(foydalanuvchiId: string, hozir = new Date()): Promise<void> {
  try {
    await db.foydalanuvchi.updateMany({
      where: {
        id: foydalanuvchiId,
        OR: [{ oxirgiFaollik: null }, { oxirgiFaollik: { lt: new Date(hozir.getTime() - SOAT_MS) } }],
      },
      data: { oxirgiFaollik: hozir },
    });
  } catch (xato) {
    console.error("Faollik belgilanmadi:", xato instanceof Error ? xato.message : xato);
  }
}
