#!/usr/bin/env node
/**
 * 7 kunlik bot xabarlarini ko'rib chiqish uchun: berilgan Telegram ID'ga istalgan kun va segment
 * xabarini (rasm, matn, tugmalar) foydalanuvchi tilida yuboradi. Bazaga yozmaydi, zanjirga
 * ta'sir qilmaydi — faqat ko'rinishni tekshirish uchun.
 *
 *   node --env-file=.env scripts/marketing-xabar-sinov.mjs <telegramId> <kun 1-7> <segment A|B|C> [til uz|ru|en]
 *   node --env-file=.env scripts/marketing-xabar-sinov.mjs <telegramId> hammasi [til]   — 21 ta xabar ketma-ket
 *
 * Rasmlar `APP_URL` (ilova manzili) orqali olinadi — lokal manzil Telegram'ga ko'rinmaydi, shuning
 * uchun .env dagi APP_URL production bo'lishi kerak.
 */
import { rasmYubor } from "../lib/services/bot-api.ts";
import { ilovaManzili } from "../lib/services/bot.ts";
import { xabarniTayyorla } from "../lib/services/marketing-xabar-hisob.ts";

const [, , idMatni, kunMatni, segmentMatni, tilMatni] = process.argv;
const telegramId = Number(idMatni);
if (!telegramId) {
  console.error("Telegram ID kerak. Masalan: node --env-file=.env scripts/marketing-xabar-sinov.mjs 123456 3 B uz");
  process.exit(1);
}
const manzil = ilovaManzili();
if (!manzil) {
  console.error("APP_URL sozlanmagan yoki https emas.");
  process.exit(1);
}
const til = ["uz", "ru", "en"].includes(tilMatni ?? segmentMatni) ? (tilMatni ?? segmentMatni) : "uz";

const juftliklar =
  kunMatni === "hammasi"
    ? [1, 2, 3, 4, 5, 6, 7].flatMap((kun) => ["A", "B", "C"].map((segment) => [kun, segment]))
    : [[Number(kunMatni), (segmentMatni ?? "A").toUpperCase()]];

for (const [kun, segment] of juftliklar) {
  const xabar = xabarniTayyorla(kun, segment, til);
  if (!xabar) {
    console.error(`Noto'g'ri kun yoki segment: ${kun} ${segment}`);
    process.exit(1);
  }
  await rasmYubor(telegramId, `${manzil}${xabar.rasm}`, xabar.izoh, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: xabar.tugma, web_app: { url: `${manzil}${xabar.sahifa}` } }]],
    },
  });
  console.log(`Yuborildi: ${kun}-kun, ${segment} segment, ${til}`);
  if (juftliklar.length > 1) await new Promise((r) => setTimeout(r, 1200));
}
