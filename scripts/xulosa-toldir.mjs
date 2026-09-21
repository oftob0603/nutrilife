#!/usr/bin/env node
/**
 * Bir martalik: `kunlik_xulosa` ni mavjud yozuvlardan to'ldiradi (S4 11-qadamgacha bu
 * jadvalga hech narsa yozilmagan). Ilova ishlatadigan `xulosaniYangilash` ning o'zini
 * chaqiradi, shuning uchun qayta ishga tushirish xavfsiz — natija o'zgarmaydi.
 *
 *   node --env-file=.env scripts/xulosa-toldir.mjs
 */
import { db } from '../lib/db.ts';
import { xulosaniYangilash } from '../lib/services/kunlik-xulosa.ts';
import { toshkentSanasi } from '../lib/services/yozuv-hisob.ts';

const yozuvlar = await db.ovqatYozuvi.findMany({
  where: { holat: { not: 'ochirildi' } },
  select: { foydalanuvchiId: true, vaqt: true },
});

const kunlar = new Map();
for (const { foydalanuvchiId, vaqt } of yozuvlar) {
  const sana = toshkentSanasi(vaqt);
  kunlar.set(`${foydalanuvchiId}|${sana}`, { foydalanuvchiId, sana });
}

for (const { foydalanuvchiId, sana } of kunlar.values()) {
  await db.$transaction((tx) => xulosaniYangilash(tx, foydalanuvchiId, sana), {
    maxWait: 10_000,
    timeout: 20_000,
  });
}

console.log(`${yozuvlar.length} ta yozuv, ${kunlar.size} ta kun xulosasi yangilandi.`);
await db.$disconnect();
