/* Shared recipe store — the stand-in for the recipes table the admin panel writes to.
   Both kits load THIS file: ui_kits/admin (A8 list, A9 editor) and ui_kits/mobile-app
   (Retseptlar tab). Nothing about recipes is hardcoded inside either kit.

   Record shape mirrors the A9 editor exactly:
     nomi / masalliqlar / qadamlar  are per-language ({uz, ru, en}) because A9 edits
                                    each language under its own tab
     qadamlar                       may be an EMPTY array — the admin can publish a
                                    recipe without preparation steps, and the app must
                                    then render no preparation section at all
     rasm                           image URL or null; null renders the FoodImage box
     holat                          'Chop etilgan' (public) | 'Qoralama' (admin-only)
     pro                            true when ingredients + steps sit behind PRO.
                                    Title, image, calories and time are always FREE. */

const RECIPE_DB = [
  {
    id: 1,
    nomi: { uz: 'Yengil mastava', ru: 'Легкая мастава', en: 'Light mastava' },
    kat: 'Birinchi taom',
    kkal: 180, oqsil: 9, yog: 5, uglevod: 24,
    vaqt: 45, murakkab: "O'rta",
    holat: 'Chop etilgan', pro: true, rasm: null,
    porsiya: '300 g',
    masalliqlar: {
      uz: ['Mol go\'shti — 200 g', 'Guruch — 100 g', 'Sabzi — 1 dona', 'Piyoz — 1 dona',
           'Pomidor — 2 dona', 'Kartoshka — 2 dona', 'Tuz, ziravorlar — ta\'bga ko\'ra'],
      ru: ['Говядина — 200 г', 'Рис — 100 г', 'Морковь — 1 шт', 'Лук — 1 шт',
           'Помидоры — 2 шт', 'Картофель — 2 шт', 'Соль, специи — по вкусу'],
      en: ['Beef — 200 g', 'Rice — 100 g', 'Carrot — 1', 'Onion — 1',
           'Tomatoes — 2', 'Potatoes — 2', 'Salt and spices to taste'],
    },
    qadamlar: {
      uz: ["Go'shtni mayda to'g'rab, qozonda yengil qovuring — yog' qo'shmasa ham bo'ladi.",
           'Piyoz va sabzini qo\'shib, piyoz shaffof bo\'lguncha qovuring.',
           'Pomidorni qo\'shib, 5 daqiqa damlang.',
           'Ikki litr suv quyib, qaynashini kuting.',
           'Guruch va kartoshkani soling, sekin olovda 25 daqiqa pishiring.',
           'Tuz va ziravorni oxirida qo\'shing, 5 daqiqa damlab qo\'ying.'],
      ru: ['Мелко нарежьте мясо и слегка обжарьте в казане.',
           'Добавьте лук и морковь, обжаривайте до прозрачности лука.',
           'Добавьте помидоры и тушите 5 минут.',
           'Влейте два литра воды и дайте закипеть.',
           'Добавьте рис и картофель, варите на медленном огне 25 минут.',
           'Соль и специи добавьте в конце, дайте настояться 5 минут.'],
      en: ['Dice the beef and sear it lightly in a heavy pot.',
           'Add onion and carrot, cook until the onion turns translucent.',
           'Add the tomatoes and let them break down for 5 minutes.',
           'Pour in two litres of water and bring to a boil.',
           'Add rice and potatoes, simmer for 25 minutes.',
           'Season at the end and rest for 5 minutes before serving.'],
    },
  },
  {
    id: 2,
    nomi: { uz: 'Tovuqli salat', ru: 'Салат с курицей', en: 'Chicken salad' },
    kat: 'Salat',
    kkal: 140, oqsil: 18, yog: 4, uglevod: 8,
    vaqt: 20, murakkab: 'Oson',
    holat: 'Chop etilgan', pro: true, rasm: null,
    porsiya: '200 g',
    masalliqlar: {
      uz: ['Tovuq ko\'kragi — 150 g', 'Bodring — 2 dona', 'Pomidor — 1 dona',
           'Yashil salat — bir siqim', 'Limon sharbati — 1 osh qoshiq', 'Zaytun moyi — 1 choy qoshiq'],
      ru: ['Куриная грудка — 150 г', 'Огурцы — 2 шт', 'Помидор — 1 шт',
           'Зелёный салат — горсть', 'Сок лимона — 1 ст. л.', 'Оливковое масло — 1 ч. л.'],
      en: ['Chicken breast — 150 g', 'Cucumbers — 2', 'Tomato — 1',
           'Green salad — a handful', 'Lemon juice — 1 tbsp', 'Olive oil — 1 tsp'],
    },
    qadamlar: {
      uz: ['Tovuq ko\'kragini tuzli suvda 12 daqiqa qaynatib, sovutib bo\'laklang.',
           'Bodring, pomidor va salatni yirik to\'g\'rang.',
           'Hammasini aralashtirib, limon sharbati va zaytun moyi bilan ziravorlang.'],
      ru: ['Отварите грудку в подсоленной воде 12 минут, остудите и нарежьте.',
           'Крупно нарежьте огурцы, помидор и салат.',
           'Смешайте всё и заправьте соком лимона и оливковым маслом.'],
      en: ['Simmer the chicken in salted water for 12 minutes, cool and slice.',
           'Roughly chop the cucumbers, tomato and salad leaves.',
           'Toss everything with lemon juice and olive oil.'],
    },
  },
  {
    /* Published WITHOUT preparation steps — the admin entered ingredients only.
       The app must show the ingredients and no preparation section whatsoever. */
    id: 4,
    nomi: { uz: 'Grechka bo\'tqasi', ru: 'Гречневая каша', en: 'Buckwheat porridge' },
    kat: 'Birinchi taom',
    kkal: 155, oqsil: 6, yog: 3, uglevod: 28,
    vaqt: 25, murakkab: 'Oson',
    holat: 'Chop etilgan', pro: true, rasm: null,
    porsiya: '250 g',
    masalliqlar: {
      uz: ['Grechka — 100 g', 'Suv — 250 ml', 'Sariyog\' — 5 g', 'Tuz — bir chimdim'],
      ru: ['Гречка — 100 г', 'Вода — 250 мл', 'Масло — 5 г', 'Соль — щепотка'],
      en: ['Buckwheat — 100 g', 'Water — 250 ml', 'Butter — 5 g', 'Pinch of salt'],
    },
    qadamlar: { uz: [], ru: [], en: [] },
  },
  {
    /* Draft — visible in the admin list, never in the app. */
    id: 3,
    nomi: { uz: "Bug'da pishirilgan baliq", ru: 'Рыба на пару', en: 'Steamed fish' },
    kat: 'Ikkinchi taom',
    kkal: 220, oqsil: 26, yog: 11, uglevod: 2,
    vaqt: 35, murakkab: "O'rta",
    holat: 'Qoralama', pro: true, rasm: null,
    porsiya: '180 g',
    masalliqlar: {
      uz: ['Baliq filesi — 180 g', 'Limon — yarim dona', 'Ziravor — ta\'bga ko\'ra'],
      ru: ['Филе рыбы — 180 г', 'Лимон — половина', 'Специи — по вкусу'],
      en: ['Fish fillet — 180 g', 'Half a lemon', 'Spices to taste'],
    },
    qadamlar: {
      uz: ['Baliqni ziravorlab, 10 daqiqa turg\'azing.', 'Bug\'da 15 daqiqa pishiring.'],
      ru: ['Приправьте рыбу и дайте постоять 10 минут.', 'Готовьте на пару 15 минут.'],
      en: ['Season the fish and let it rest for 10 minutes.', 'Steam for 15 minutes.'],
    },
  },
];

/* Everything the app shows comes through here — published only, newest id first. */
function publishedRecipes(db) {
  return (db || RECIPE_DB).filter((r) => r.holat === 'Chop etilgan');
}
function recipeById(id, db) {
  return (db || RECIPE_DB).find((r) => r.id === id) || null;
}
/* An empty / whitespace-only step list means "the admin added no preparation". */
function hasSteps(recipe, lang) {
  const list = recipe && recipe.qadamlar && recipe.qadamlar[lang || 'uz'];
  return Array.isArray(list) && list.filter((s) => String(s).trim()).length > 0;
}
function recipeCategories(db) {
  return ['Hammasi'].concat(
    publishedRecipes(db).map((r) => r.kat).filter((k, i, a) => a.indexOf(k) === i)
  );
}

Object.assign(window, { RECIPE_DB, publishedRecipes, recipeById, hasSteps, recipeCategories });
