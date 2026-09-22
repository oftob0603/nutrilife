// Botga kelgan yangilanishlarni (webhook, app/api/bot) turiga qarab taqsimlaydi.
// Bot faqat kirish nuqtasi (DECISIONS 2026-09-13): /start, til tanlash va "Ilovani ochish".
// Logga foydalanuvchi matni yoki ismi yozilmaydi — faqat yangilanish turi va raqami.

import { tarjimon, tilniOqi, TILLAR, type Tarjimon, type Til } from "../lugat/tarjima.ts";
import { BotApiXatosi, tugmaniTasdiqla, xabarniTahrirla, xabarYubor } from "./bot-api.ts";
import { botTiliniSaqlash, telegramTili } from "./foydalanuvchilar.ts";

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

/** Til tugmalari. Nomlar tarjima qilinmaydi: har til o'z nomi bilan. */
const TIL_NOMLARI: Record<Til, string> = {
  uz: "🇺🇿 O'zbekcha",
  ru: "🇷🇺 Русский",
  en: "🇬🇧 English",
};
const TIL_TUGMASI = /^til:(uz|ru|en)$/;

function html(matn: string): string {
  return matn.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Mini App manzili — `APP_URL` (Railway'da frontend, Vercel domeni). Telegram `web_app`
 * tugmasi faqat https qabul qiladi; noto'g'ri bo'lsa tugmasiz xabar ketadi va logga yoziladi.
 */
export function ilovaManzili(): string | null {
  const manzil = process.env.APP_URL;
  if (manzil?.startsWith("https://")) return manzil;
  console.error("Bot: APP_URL https emas yoki sozlanmagan — \"Boshlash\" tugmasi chiqmaydi");
  return null;
}

function boshlashTugmasi(t: Tarjimon["t"]): object[] {
  const manzil = ilovaManzili();
  return manzil ? [{ text: `✨ ${t("Boshlash")}`, web_app: { url: manzil } }] : [];
}

/**
 * /start xabari: til hali noma'lum bo'lgani uchun savol uch tilda, pastda shu tartibda
 * uchta til tugmasi. Til bosilgach shu xabar `salomXabari` ga almashadi.
 */
const TIL_SAVOLI = [
  "✨ Xush kelibsiz! Qaysi tilda davom etamiz?",
  "✨ Добро пожаловать! На каком языке продолжим?",
  "✨ Welcome! Which language should we use?",
].join("\n");

const TIL_TUGMALARI = {
  inline_keyboard: TILLAR.map((kod) => [{ text: TIL_NOMLARI[kod], callback_data: `til:${kod}` }]),
};

/** Til tanlangandan keyingi xabar: tanishtiruv va "Boshlash" tugmasi. */
function salomXabari(til: Til): { matn: string; tugmalar: object } {
  const { t } = tarjimon(til);
  const matn = [
    `🥗 <b>${html(t("NutriLifer — ovqatlanishingizni aqlli nazorat qiling!"))}</b>`,
    `📸 ${html(t("Taomni rasmga oling — AI kaloriyasi va ozuqaviy qiymatini hisoblaydi."))}`,
    [`🔥 ${t("Kaloriya")}`, `🥩 ${t("Oqsil")}`, `🥑 ${t("Yog'")}`, `🍚 ${t("Uglevodlar")}`].map(html).join("\n"),
    html(t("Shuningdek, kunlik maqsadingizni kuzatib, ovqatlanish tarixingizni saqlashingiz mumkin.")),
    `<b>${html(t("Boshlash uchun tugmani bosing:"))}</b>`,
  ].join("\n\n");
  const tugma = boshlashTugmasi(t);
  return { matn, tugmalar: { inline_keyboard: tugma.length > 0 ? [tugma] : [] } };
}

/** Saqlangan til, u bo'lmasa Telegram tili (tanish bo'lmasa o'zbekcha). */
async function foydalanuvchiTili(kimdan: BotFoydalanuvchi | undefined): Promise<Til> {
  if (!kimdan) return "uz";
  const saqlangan = await telegramTili(BigInt(kimdan.id));
  return tilniOqi(saqlangan ?? kimdan.language_code?.slice(0, 2));
}

async function xabarniQaytaIshla(xabar: BotXabar): Promise<void> {
  // Bot faqat shaxsiy chatda javob beradi — web_app tugmasi guruhlarda ishlamaydi.
  if (xabar.chat.type !== "private" || xabar.from?.is_bot) return;

  if (xabar.text === "/start" || xabar.text?.startsWith("/start ")) {
    await xabarYubor(xabar.chat.id, TIL_SAVOLI, { reply_markup: TIL_TUGMALARI });
    return;
  }

  const til = await foydalanuvchiTili(xabar.from);
  // Botda ovqat kiritish yo'q (DECISIONS 2026-09-13) — har qanday boshqa xabarga ilovaga yo'l.
  const { t } = tarjimon(til);
  const tugma = boshlashTugmasi(t);
  await xabarYubor(xabar.chat.id, t("Ovqat ilova ichida qo'shiladi. Ochish uchun tugmani bosing:"), {
    ...(tugma.length > 0 && { reply_markup: { inline_keyboard: [tugma] } }),
  });
}

async function tugmaniQaytaIshla(bosildi: BotTugmaBosildi): Promise<void> {
  const mos = TIL_TUGMASI.exec(bosildi.data ?? "");
  const xabar = bosildi.message;
  if (!mos || !xabar) {
    await tugmaniTasdiqla(bosildi.id);
    return;
  }

  const til = tilniOqi(mos[1]);
  await botTiliniSaqlash(BigInt(bosildi.from.id), til, bosildi.from.first_name || null);
  await tugmaniTasdiqla(bosildi.id);

  const { matn, tugmalar } = salomXabari(til);
  try {
    await xabarniTahrirla(xabar.chat.id, xabar.message_id, matn, {
      parse_mode: "HTML",
      reply_markup: tugmalar,
    });
  } catch (xato) {
    // Shu tilning o'zi qayta bosilsa Telegram "message is not modified" qaytaradi — bu xato emas.
    if (!(xato instanceof BotApiXatosi && xato.message.includes("message is not modified"))) throw xato;
  }
}

/** Bitta yangilanishni qayta ishlaydi. Xato chiqsa yuqoriga uzatiladi (webhook logga yozadi). */
export async function yangilanishniQaytaIshla(yangilanish: BotYangilanish): Promise<void> {
  console.info(`Bot: yangilanish ${yangilanish.update_id} (${turi(yangilanish)})`);
  if (yangilanish.message) await xabarniQaytaIshla(yangilanish.message);
  else if (yangilanish.callback_query) await tugmaniQaytaIshla(yangilanish.callback_query);
}
