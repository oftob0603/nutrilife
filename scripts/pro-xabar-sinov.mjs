#!/usr/bin/env node
/**
 * PRO xabarlari zanjirini ko'rib chiqish uchun: berilgan Telegram ID'ga istalgan zanjir kuni yoki
 * reaktivatsiya xabarini (matn, tugma) tanlangan tilda yuboradi. Bazaga yozmaydi, zanjirga
 * ta'sir qilmaydi — faqat ko'rinishni tekshirish uchun.
 *
 *   node --env-file=.env scripts/pro-xabar-sinov.mjs <telegramId> <zanjir> <kun> [til]
 *   node --env-file=.env scripts/pro-xabar-sinov.mjs <telegramId> <zanjir> r<1-3> [til]   — reaktivatsiya
 *   node --env-file=.env scripts/pro-xabar-sinov.mjs <telegramId> <zanjir> hammasi [til] — zanjir + 3 reaktivatsiya
 *
 * zanjir: oylik | yarim_yillik | yillik; til: uz | ru | en (standart uz).
 * Tugmalar `APP_URL` (ilova manzili) ni ochadi — .env dagi APP_URL production bo'lishi kerak.
 */
import { xabarYubor } from "../lib/services/bot-api.ts";
import { ilovaManzili } from "../lib/services/bot.ts";
import {
  kunXabari,
  reaktivatsiyaXabari,
  ZANJIR_KUNLARI,
  zanjirniOqi,
} from "../lib/services/pro-xabar-hisob.ts";

const [, , idMatni, zanjirMatni, kunMatni, tilMatni] = process.argv;
const telegramId = Number(idMatni);
const zanjir = zanjirniOqi(zanjirMatni);
if (!telegramId || !zanjir || !kunMatni) {
  console.error("Masalan: node --env-file=.env scripts/pro-xabar-sinov.mjs 123456 oylik 3 uz");
  process.exit(1);
}
const manzil = ilovaManzili();
if (!manzil) {
  console.error("APP_URL sozlanmagan yoki https emas.");
  process.exit(1);
}
const til = ["uz", "ru", "en"].includes(tilMatni) ? tilMatni : "uz";

/** Element: `{ kun }` yoki `{ bosqich }`. */
const royxat =
  kunMatni === "hammasi"
    ? [...ZANJIR_KUNLARI[zanjir].map((k) => ({ kun: k.kun })), { bosqich: 1 }, { bosqich: 2 }, { bosqich: 3 }]
    : kunMatni.startsWith("r")
      ? [{ bosqich: Number(kunMatni.slice(1)) }]
      : [{ kun: Number(kunMatni) }];

for (const element of royxat) {
  const xabar =
    "kun" in element ? kunXabari(zanjir, element.kun, til) : reaktivatsiyaXabari(zanjir, element.bosqich, til);
  if (!xabar) {
    console.error(`Noto'g'ri kun yoki bosqich: ${JSON.stringify(element)}`);
    process.exit(1);
  }
  await xabarYubor(telegramId, xabar.matn, {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: [[{ text: xabar.tugma, web_app: { url: `${manzil}${xabar.sahifa}` } }]] },
  });
  console.log(`Yuborildi: ${zanjir}, ${"kun" in element ? `${element.kun}-kun` : `reaktivatsiya ${element.bosqich}`}, ${til}`);
  if (royxat.length > 1) await new Promise((r) => setTimeout(r, 1200));
}
