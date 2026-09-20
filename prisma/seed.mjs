// Taom bazasining boshlang'ich yozuvlari.
// Birinchi 8 ta taom prototipdagi FOODS ro'yxatidan aynan olingan
// (prototip/ui_kits/mobile-app/data.jsx); qolganlari S2'da qo'shilgan va qiymatlari
// taxminiy — uy retsepti bo'yicha o'rtacha (PRD.md, 7-bo'lim: "taxminiy kaloriya").
//
// Ishga tushirish: npm run db:seed
// Qayta ishga tushirilsa nusxa qo'shmaydi — mavjud yozuv yangilanadi.

import { db } from '../lib/db.ts';

// n — o'lchov miqdori, b — o'lchov birligi; k/o/y/u — kaloriya, oqsil, yog', uglevod
// shu o'lchovga; p — porsiya variantlari shu birlikda.
// Rasmi bor taomlar: public/taomlar/<id>.webp (manbalar — public/taomlar/MUALLIFLAR.md).
// Qolganlarida rasm o'rni bo'sh turadi.
const RASMLI = new Set([
  'achchiq-chuchuk', 'ayron', 'bahor-salati', 'chuchvara', 'dimlama', 'gumma', 'guruch',
  'halim', 'hasip', 'lagman', 'manti', 'mastava', 'mosh-kichiri', 'non', 'norin', 'olivye',
  'osh', 'patir', 'qatiq', 'qatlama', 'qovurdoq', 'qozonkabob', 'shashlik-mol',
  'shashlik-tovuq', 'shurpa', 'somsa', 'sumalak', 'suzma', 'tandir-kabob', 'tok-dolma',
  'tovuq-shorva', 'tuxum', 'tuxum-barak', 'vinegret', 'xonim',
]);

const taom = (id, nomi, nomiRu, nomiEn, n, b, k, o, y, u, p) => ({
  id, nomi, nomiRu, nomiEn,
  rasm: RASMLI.has(id) ? `/taomlar/${id}.webp` : null,
  olchovMiqdori: n, olchovBirligi: b,
  kaloriya: k, oqsil: o, yog: y, uglevod: u,
  porsiyalar: p,
});

const TAOMLAR = [
  // S1 — prototipdan
  taom('osh', 'Osh', 'Плов', 'Plov', 100, 'g', 186, 6.4, 8.1, 22, [150, 250, 350]),
  taom('manti', 'Manti', 'Манты', 'Manti', 1, 'dona', 210, 9.2, 9.8, 22.4, [1, 2, 3]),
  taom('somsa', 'Somsa', 'Самса', 'Samsa', 1, 'dona', 310, 11.4, 17.2, 27, [1, 2]),
  taom('lagman', 'Lagmon', 'Лагман', 'Lagman', 100, 'g', 132, 5.8, 4.9, 16.2, [250, 350, 450]),
  taom('shurpa', "Sho'rva", 'Шурпа', 'Shurpa', 100, 'g', 78, 4.1, 3.6, 7.2, [250, 350]),
  taom('non', 'Obi non', 'Лепёшка', 'Uzbek flatbread', 1, "bo'lak", 142, 4.4, 1.1, 28.6, [1, 2]),
  taom('chuchvara', 'Chuchvara', 'Чучвара', 'Chuchvara', 100, 'g', 198, 8.6, 8.2, 22.1, [200, 300]),
  taom('norin', 'Norin', 'Нарын', 'Naryn', 100, 'g', 174, 11.2, 7.4, 16.8, [150, 250]),

  // Asosiy taomlar
  taom('dimlama', 'Dimlama', 'Дымляма', 'Dimlama', 100, 'g', 95, 5.5, 4.8, 7.5, [250, 350, 450]),
  taom('qozonkabob', 'Qozonkabob', 'Казан-кабоб', 'Kazan kebab', 100, 'g', 235, 13, 15, 11, [200, 300, 400]),
  taom('shashlik-mol', "Mol go'shti shashligi", 'Шашлык из говядины', 'Beef shashlik', 1, 'six', 200, 19, 13, 1, [1, 2, 3]),
  taom('shashlik-tovuq', 'Tovuq shashligi', 'Шашлык из курицы', 'Chicken shashlik', 1, 'six', 150, 20, 7, 1, [1, 2, 3]),
  taom('tandir-kabob', 'Tandir kabob', 'Тандыр-кабоб', 'Tandoor lamb', 100, 'g', 260, 20, 20, 0, [150, 250, 350]),
  taom('qovurdoq', 'Qovurdoq', 'Кавурдак', 'Kavurdak', 100, 'g', 210, 10, 14, 11, [200, 300, 400]),
  taom('jiz', 'Jiz', 'Жиз', 'Jiz fried meat', 100, 'g', 290, 21, 23, 0, [150, 200, 300]),
  taom('qovurma-lagmon', "Qovurma lag'mon", 'Жареный лагман', 'Fried lagman', 100, 'g', 165, 6.5, 7, 19, [250, 350, 450]),
  taom('xonim', 'Xonim', 'Ханум', 'Khanum', 100, 'g', 170, 6, 7, 21, [200, 300]),
  taom('tok-dolma', "Tok do'lma", 'Долма', 'Dolma', 100, 'g', 150, 7.5, 9, 9.5, [150, 250, 350]),
  taom('hasip', 'Hasip', 'Хасып', 'Hasip sausage', 100, 'g', 220, 11, 15, 10, [100, 150, 200]),
  taom('shovla', 'Shovla', 'Шавля', 'Shavla', 100, 'g', 150, 5, 6, 19, [250, 350]),
  taom('mosh-kichiri', 'Mosh kichiri', 'Машкичири', 'Mung bean rice porridge', 100, 'g', 130, 5.5, 4, 18, [250, 350]),
  taom('tuxum-barak', 'Tuxum barak', 'Тухум-барак', 'Egg dumplings', 100, 'g', 215, 8, 10, 23, [150, 250]),
  taom('gumma', 'Gumma', 'Гумма', 'Gumma fried pie', 1, 'dona', 240, 7, 13, 24, [1, 2, 3]),

  // Suyuq taomlar
  taom('mastava', 'Mastava', 'Мастава', 'Mastava rice soup', 100, 'g', 70, 3.5, 2.8, 7.5, [250, 350, 450]),
  taom('moshxorda', "Moshxo'rda", 'Машхурда', 'Mung bean soup', 100, 'g', 75, 4, 2.5, 9, [250, 350, 450]),
  taom('ugra-osh', 'Ugra osh', 'Угра-ош', 'Noodle soup', 100, 'g', 65, 3.5, 2.2, 8, [250, 350]),
  taom('tovuq-shorva', "Tovuq sho'rva", 'Куриный суп', 'Chicken soup', 100, 'g', 50, 4, 1.8, 4.5, [250, 350]),
  taom('halim', 'Halim', 'Халим', 'Halim wheat porridge', 100, 'g', 140, 7, 6, 14, [200, 300]),

  // Non va xamir
  taom('patir', 'Patir non', 'Патыр', 'Patir bread', 1, "bo'lak", 190, 5, 5, 31, [1, 2]),
  taom('qatlama', 'Qatlama', 'Катлама', 'Katlama', 1, "bo'lak", 260, 5, 13, 31, [1, 2]),

  // Salatlar
  taom('achchiq-chuchuk', 'Achchiq-chuchuk', 'Ачик-чучук', 'Tomato onion salad', 100, 'g', 25, 1, 0.3, 5, [100, 150, 200]),
  taom('bahor-salati', 'Bahor salati', 'Весенний салат', 'Spring salad', 100, 'g', 60, 1.2, 4.5, 3.5, [100, 150, 200]),
  taom('olivye', 'Olivye', 'Оливье', 'Olivier salad', 100, 'g', 200, 5.5, 16, 8, [100, 150, 200]),
  taom('vinegret', 'Vinegret', 'Винегрет', 'Vinaigrette salad', 100, 'g', 90, 1.6, 5, 9, [100, 150, 200]),

  // Sut mahsulotlari
  taom('qatiq', 'Qatiq', 'Катык', 'Katyk yogurt', 100, 'g', 60, 3, 3.2, 4.2, [150, 250]),
  taom('suzma', 'Suzma', 'Сузьма', 'Suzma strained yogurt', 100, 'g', 140, 9, 9, 5, [50, 100, 150]),
  taom('ayron', 'Ayron', 'Айран', 'Ayran', 100, 'ml', 30, 1.5, 1.5, 2, [200, 300]),

  // Shirinlik va yondosh
  taom('sumalak', 'Sumalak', 'Сумаляк', 'Sumalak', 100, 'g', 215, 4.5, 5, 38, [50, 100, 150]),
  taom('holvaytar', 'Holvaytar', 'Халвайтар', 'Halvaitar', 100, 'g', 330, 4, 14, 47, [50, 100]),
  taom('guruch', 'Qaynatilgan guruch', 'Отварной рис', 'Boiled rice', 100, 'g', 130, 2.7, 0.3, 28, [150, 200, 250]),
  taom('tuxum', 'Qaynatilgan tuxum', 'Варёное яйцо', 'Boiled egg', 1, 'dona', 78, 6.3, 5.3, 0.6, [1, 2, 3]),
];

for (const yozuv of TAOMLAR) {
  const { id, ...maydonlar } = yozuv;
  await db.taom.upsert({ where: { id }, update: maydonlar, create: yozuv });
}

console.log(`Seed tayyor — ${TAOMLAR.length} ta taom.`);
await db.$disconnect();
