#!/usr/bin/env node
/**
 * Fon vazifalarini qo'lda bir marta ishga tushiradi (tekshirish uchun) — Railway'dagi
 * aylanish bilan bir xil kod (xabar faqat belgilangan vaqtdan keyingi 6 soat ichida ketadi): obuna muddati xabarlari va yetim rasmlarni tozalash.
 *
 *   node --env-file=.env scripts/fon-vazifalari.mjs
 */
import { db } from '../lib/db.ts';
import { fonVazifalariniIshlat } from '../lib/services/fon-vazifalari.ts';

await fonVazifalariniIshlat();
await db.$disconnect();
