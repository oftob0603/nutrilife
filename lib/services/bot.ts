// Botga kelgan yangilanishlarni (webhook, app/api/bot) turiga qarab taqsimlaydi.
// Bot faqat kirish nuqtasi (DECISIONS 2026-09-13): /start, til tanlash va "Ilovani ochish".
// Logga foydalanuvchi matni yoki ismi yozilmaydi — faqat yangilanish turi va raqami.

/** Telegram `User` ning bizga kerak qismi. */
export type BotFoydalanuvchi = {
  id: number;
  is_bot: boolean;
  first_name: string;
  language_code?: string;
};

export type BotXabar = {
  message_id: number;
  from?: BotFoydalanuvchi;
  chat: { id: number; type: string };
  text?: string;
};

export type BotTugmaBosildi = {
  id: string;
  from: BotFoydalanuvchi;
  message?: BotXabar;
  data?: string;
};

/** Telegram `Update` — webhook `allowed_updates` da faqat shu ikki tur so'ralgan. */
export type BotYangilanish = {
  update_id: number;
  message?: BotXabar;
  callback_query?: BotTugmaBosildi;
};

/** Tana Telegram yangilanishiga o'xshaydimi (update_id butun son). */
export function yangilanishmi(tana: unknown): tana is BotYangilanish {
  return (
    typeof tana === "object" &&
    tana !== null &&
    Number.isInteger((tana as { update_id?: unknown }).update_id)
  );
}

function turi(yangilanish: BotYangilanish): string {
  if (yangilanish.message) return "message";
  if (yangilanish.callback_query) return "callback_query";
  return "boshqa";
}

/**
 * Bitta yangilanishni qayta ishlaydi. Hozircha faqat qayd qiladi — /start va til tanlash
 * keyingi taskda shu yerga ulanadi. Xato chiqsa yuqoriga uzatiladi (webhook logga yozadi).
 */
export async function yangilanishniQaytaIshla(yangilanish: BotYangilanish): Promise<void> {
  console.info(`Bot: yangilanish ${yangilanish.update_id} (${turi(yangilanish)})`);
}
