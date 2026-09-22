#!/usr/bin/env node
/**
 * Bot nomi va tavsiflarini (Bot API setMyName / setMyDescription / setMyShortDescription)
 * o'rnatadi. Telegram ularni foydalanuvchining Telegram ilovasi tiliga qarab o'zi tanlaydi:
 * ruscha va inglizcha — alohida, qolgan hamma tillar (o'zbekcha ham) — standart matn.
 * Matn o'zgarsa shu faylni tahrirlab, qayta ishga tushiring. Token .env dan, ekranga chiqmaydi.
 *
 *   node --env-file=.env scripts/bot-tavsif.mjs          — o'rnatish
 *   node --env-file=.env scripts/bot-tavsif.mjs info     — hozirgi holatni ko'rish
 */

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('TELEGRAM_BOT_TOKEN .env da yo\'q');
  process.exit(1);
}

/** Kalit — Bot API `language_code`; bo'sh satr — standart (o'zbekcha). */
const MATNLAR = {
  '': {
    nom: 'NutriLifer - Kaloriya kalkulyatori',
    tavsif: [
      '🥗 Kaloriyangizni nazorat qiling, maqsadingizga erishing!',
      '📸 Taomni rasmga oling — AI kaloriyasi va ozuqaviy qiymatini hisoblaydi.',
      '📊 Kunlik kaloriyangiz, oqsil, yog‘ va uglevodlaringizni kuzating.',
      '🎯 Maqsadingizga mos ovqatlanishni boshlang!',
    ].join('\n'),
    qisqa: '📸 Taomni rasmga oling, qolganini AI hisoblaydi.',
  },
  ru: {
    nom: 'NutriLifer - Калькулятор калорий',
    tavsif: [
      '🥗 Контролируйте калории и достигайте своей цели!',
      '📸 Сфотографируйте блюдо — AI посчитает его калории и пищевую ценность.',
      '📊 Следите за дневными калориями, белками, жирами и углеводами.',
      '🎯 Начните питаться в соответствии со своей целью!',
    ].join('\n'),
    qisqa: '📸 Сфотографируйте блюдо — остальное посчитает AI.',
  },
  en: {
    nom: 'NutriLifer - Calorie Calculator',
    tavsif: [
      '🥗 Keep your calories in check and reach your goal!',
      '📸 Snap a photo of your meal — AI calculates its calories and nutrition.',
      '📊 Track your daily calories, protein, fat and carbs.',
      '🎯 Start eating the way your goal needs!',
    ].join('\n'),
    qisqa: '📸 Snap your meal — AI does the rest.',
  },
};

async function sorov(metod, parametrlar) {
  const javob = await fetch(`https://api.telegram.org/bot${token}/${metod}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(parametrlar),
  });
  const tana = await javob.json();
  if (!tana.ok) throw new Error(`${metod}: ${tana.description ?? javob.status}`);
  return tana.result;
}

const tilParam = (til) => (til ? { language_code: til } : {});

if (process.argv[2] === 'info') {
  for (const til of Object.keys(MATNLAR)) {
    const p = tilParam(til);
    const [n, d, s] = await Promise.all([
      sorov('getMyName', p),
      sorov('getMyDescription', p),
      sorov('getMyShortDescription', p),
    ]);
    console.log(`[${til || 'standart'}]\n  nom: ${n.name}\n  qisqa: ${s.short_description}\n  tavsif:\n    ${d.description.replaceAll('\n', '\n    ')}`);
  }
} else {
  for (const [til, { nom, tavsif, qisqa }] of Object.entries(MATNLAR)) {
    const p = tilParam(til);
    await sorov('setMyName', { name: nom, ...p });
    await sorov('setMyDescription', { description: tavsif, ...p });
    await sorov('setMyShortDescription', { short_description: qisqa, ...p });
    console.log(`${til || 'standart'}: o'rnatildi`);
  }
}
