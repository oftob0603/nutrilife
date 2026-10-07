// Boshlang'ich yozuvlar: retsept kategoriyalari (admin-tz.md A9). Admin A9'dan yangisini
// qo'shadi, seed faqat boshlang'ichlarni beradi; qayta ishga tushirilsa nusxa qo'shmaydi.
// Taomlar bazasi olib tashlangan (DECISIONS 2026-10-07) — seed endi taom yozmaydi.
//
// Ishga tushirish: npm run db:seed

import { db } from '../lib/db.ts';

const KATEGORIYALAR = ['Birinchi taom', 'Ikkinchi taom', 'Non', 'Salat', 'Shirinlik', 'Ichimlik'];
for (const nomi of KATEGORIYALAR) {
  await db.kategoriya.upsert({ where: { nomi }, update: {}, create: { nomi } });
}

console.log(`Seed tayyor — ${KATEGORIYALAR.length} ta kategoriya.`);
await db.$disconnect();
