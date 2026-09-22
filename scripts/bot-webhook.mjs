#!/usr/bin/env node
/**
 * Bot webhook'ini boshqaradi. Token va maxfiy kalit .env dan o'qiladi, ekranga chiqmaydi.
 *
 *   node --env-file=.env scripts/bot-webhook.mjs https://<production-domen>   — o'rnatish
 *   node --env-file=.env scripts/bot-webhook.mjs info                          — holatini ko'rish
 *
 * O'rnatishda: manzil `<domen>/api/bot`, faqat https (Telegram talabi; localhost bo'lmaydi),
 * `secret_token` — TELEGRAM_WEBHOOK_SECRET (production'dagi qiymat bilan bir xil bo'lishi
 * shart), faqat `message` va `callback_query` yangilanishlari, to'planib qolganlari tashlanadi.
 */

const token = process.env.TELEGRAM_BOT_TOKEN;
const sir = process.env.TELEGRAM_WEBHOOK_SECRET;
const buyruq = process.argv[2];

function toxta(xabar) {
  console.error(xabar);
  process.exit(1);
}

async function botSorov(metod, parametrlar = {}) {
  const javob = await fetch(`https://api.telegram.org/bot${token}/${metod}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(parametrlar),
  });
  const tana = await javob.json();
  if (!tana.ok) toxta(`${metod} bajarilmadi: ${tana.description ?? javob.status}`);
  return tana.result;
}

if (!token) toxta('TELEGRAM_BOT_TOKEN .env da yo\'q');
if (!buyruq) toxta('Foydalanish: bot-webhook.mjs https://<domen> | info');

if (buyruq === 'info') {
  const holat = await botSorov('getWebhookInfo');
  const oxirgiXato = holat.last_error_date
    ? `${new Date(holat.last_error_date * 1000).toISOString()} — ${holat.last_error_message}`
    : 'yo\'q';
  console.log(`Manzil: ${holat.url || '(o\'rnatilmagan)'}`);
  console.log(`Kutayotgan yangilanishlar: ${holat.pending_update_count}`);
  console.log(`Ruxsat etilgan turlar: ${(holat.allowed_updates ?? ['(standart)']).join(', ')}`);
  console.log(`Oxirgi xato: ${oxirgiXato}`);
  process.exit(0);
}

if (!sir) toxta('TELEGRAM_WEBHOOK_SECRET .env da yo\'q');
if (!/^[A-Za-z0-9_-]{1,256}$/.test(sir)) {
  toxta('TELEGRAM_WEBHOOK_SECRET faqat A-Z, a-z, 0-9, _ va - dan iborat bo\'lishi kerak');
}

let manzil;
try {
  manzil = new URL('/api/bot', buyruq);
} catch {
  toxta(`Manzil noto'g'ri: ${buyruq}`);
}
if (manzil.protocol !== 'https:') toxta('Manzil https bo\'lishi kerak');
if (['localhost', '127.0.0.1', '[::1]'].includes(manzil.hostname)) {
  toxta('localhost ga webhook o\'rnatilmaydi — production domenini bering');
}

await botSorov('setWebhook', {
  url: manzil.href,
  secret_token: sir,
  allowed_updates: ['message', 'callback_query'],
  drop_pending_updates: true,
});
console.log(`Webhook o'rnatildi: ${manzil.href}`);
