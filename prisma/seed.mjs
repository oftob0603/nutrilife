// Taom bazasining boshlang'ich yozuvlari.
// Qiymatlar prototipdagi FOODS ro'yxatidan aynan olingan:
// prototip/ui_kits/mobile-app/data.jsx
//
// Ishga tushirish: npm run db:seed
// Qayta ishga tushirilsa nusxa qo'shmaydi — mavjud yozuv yangilanadi.

import { db } from '../lib/db.ts';

const TAOMLAR = [
  { id: 'osh', nomi: 'Osh', olchovMiqdori: 100, olchovBirligi: 'g', kaloriya: 186, oqsil: 6.4, yog: 8.1, uglevod: 22, porsiyalar: [150, 250, 350] },
  { id: 'manti', nomi: 'Manti', olchovMiqdori: 1, olchovBirligi: 'dona', kaloriya: 210, oqsil: 9.2, yog: 9.8, uglevod: 22.4, porsiyalar: [1, 2, 3] },
  { id: 'somsa', nomi: 'Somsa', olchovMiqdori: 1, olchovBirligi: 'dona', kaloriya: 310, oqsil: 11.4, yog: 17.2, uglevod: 27, porsiyalar: [1, 2] },
  { id: 'lagman', nomi: 'Lagmon', olchovMiqdori: 100, olchovBirligi: 'g', kaloriya: 132, oqsil: 5.8, yog: 4.9, uglevod: 16.2, porsiyalar: [250, 350, 450] },
  { id: 'shurpa', nomi: "Sho'rva", olchovMiqdori: 100, olchovBirligi: 'g', kaloriya: 78, oqsil: 4.1, yog: 3.6, uglevod: 7.2, porsiyalar: [250, 350] },
  { id: 'non', nomi: 'Obi non', olchovMiqdori: 1, olchovBirligi: "bo'lak", kaloriya: 142, oqsil: 4.4, yog: 1.1, uglevod: 28.6, porsiyalar: [1, 2] },
  { id: 'chuchvara', nomi: 'Chuchvara', olchovMiqdori: 100, olchovBirligi: 'g', kaloriya: 198, oqsil: 8.6, yog: 8.2, uglevod: 22.1, porsiyalar: [200, 300] },
  { id: 'norin', nomi: 'Norin', olchovMiqdori: 100, olchovBirligi: 'g', kaloriya: 174, oqsil: 11.2, yog: 7.4, uglevod: 16.8, porsiyalar: [150, 250] },
];

for (const taom of TAOMLAR) {
  const { id, ...maydonlar } = taom;
  await db.taom.upsert({ where: { id }, update: maydonlar, create: taom });
}

console.log(`Seed tayyor — ${TAOMLAR.length} ta taom.`);
await db.$disconnect();
