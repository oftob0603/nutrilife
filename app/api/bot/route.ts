import { timingSafeEqual } from "node:crypto";
import { yangilanishmi, yangilanishniQaytaIshla } from "@/lib/services/bot";

/**
 * Telegram bot webhook'i (scripts/bot-webhook.mjs o'rnatadi). Serverless muhitda doimiy
 * jarayon yo'q, shuning uchun long polling emas — har yangilanish shu yo'lga keladi.
 *
 * Telegram har so'rovga `setWebhook` da berilgan maxfiy kalitni sarlavhada qo'shadi; mos
 * kelmasa 401. Kalit tasdiqlangandan keyin javob doim 200: Telegram 200 bo'lmagan javobda
 * o'sha yangilanishni qayta-qayta yuboradi va keyingilarini ham to'sib qo'yadi, shuning
 * uchun buzuq tana yoki ichki xato faqat logga yoziladi.
 */
export async function POST(sorov: Request) {
  const sir = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!sir) {
    console.error("TELEGRAM_WEBHOOK_SECRET sozlanmagan");
    return new Response(null, { status: 500 });
  }

  const kutilgan = Buffer.from(sir);
  const berilgan = Buffer.from(sorov.headers.get("x-telegram-bot-api-secret-token") ?? "");
  if (berilgan.length !== kutilgan.length || !timingSafeEqual(berilgan, kutilgan)) {
    return new Response(null, { status: 401 });
  }

  let tana: unknown;
  try {
    tana = await sorov.json();
  } catch {
    console.warn("Bot: yangilanish o'qilmadi");
    return new Response(null, { status: 200 });
  }
  if (!yangilanishmi(tana)) {
    console.warn("Bot: yangilanish noma'lum ko'rinishda");
    return new Response(null, { status: 200 });
  }

  // Serverless funksiya javobdan keyin to'xtashi mumkin — ish javobdan oldin tugaydi.
  try {
    await yangilanishniQaytaIshla(tana);
  } catch (xato) {
    console.error(`Bot: yangilanish ${tana.update_id} bajarilmadi`, xato);
  }
  return new Response(null, { status: 200 });
}
