// Telegram Bot API'ga so'rov (https://core.telegram.org/bots/api). Kutubxonasiz — oddiy fetch.
// Token faqat shu yerda, `TELEGRAM_BOT_TOKEN` dan o'qiladi; manzil tokenni o'z ichiga olgani
// uchun xato xabarlarida manzil emas, faqat metod nomi yoziladi.

export class BotTokenYoq extends Error {
  constructor() {
    super("TELEGRAM_BOT_TOKEN sozlanmagan");
  }
}

/** Bot API javob bermadi yoki `ok: false` qaytardi. */
export class BotApiXatosi extends Error {
  constructor(metod: string, tavsif: string) {
    super(`Bot API ${metod}: ${tavsif}`);
  }
}

type BotJavobi<T> = { ok: true; result: T } | { ok: false; description?: string };

/** Bot API metodini chaqiradi va `result` ni qaytaradi. */
export async function botSorov<T = unknown>(
  metod: string,
  parametrlar: Record<string, unknown> = {},
): Promise<T> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new BotTokenYoq();

  let javob: Response;
  try {
    javob = await fetch(`https://api.telegram.org/bot${token}/${metod}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parametrlar),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new BotApiXatosi(metod, "ulanib bo'lmadi");
  }

  let tana: BotJavobi<T>;
  try {
    tana = (await javob.json()) as BotJavobi<T>;
  } catch {
    throw new BotApiXatosi(metod, `javob o'qilmadi (${javob.status})`);
  }
  if (!tana.ok) throw new BotApiXatosi(metod, tana.description ?? String(javob.status));
  return tana.result;
}

/** Chatga matnli xabar. `qoshimcha` — reply_markup, parse_mode va boshqa Bot API maydonlari. */
export function xabarYubor(
  chatId: number,
  matn: string,
  qoshimcha: Record<string, unknown> = {},
): Promise<unknown> {
  return botSorov("sendMessage", { chat_id: chatId, text: matn, ...qoshimcha });
}

/** Xabar matni va tugmalarini almashtiradi (til tanlanganda). */
export function xabarniTahrirla(
  chatId: number,
  xabarId: number,
  matn: string,
  qoshimcha: Record<string, unknown> = {},
): Promise<unknown> {
  return botSorov("editMessageText", { chat_id: chatId, message_id: xabarId, text: matn, ...qoshimcha });
}

/** Inline tugma bosilganini tasdiqlaydi — aks holda tugmada yuklanish belgisi aylanib turadi. */
export function tugmaniTasdiqla(tugmaId: string): Promise<unknown> {
  return botSorov("answerCallbackQuery", { callback_query_id: tugmaId });
}
