// PRO xabarlari zanjiri (PRO olgan foydalanuvchilarga, DECISIONS 2026-10-08) uchun sof hisob —
// bazaga bog'lanmagan: uch tarif zanjiri matnlari uch tilda, reaktivatsiya xabarlari, jadval va
// segment. Yuborish lib/services/fon-vazifalari.ts da. Matnlar egasi bergan (2026-10-08); ruscha
// va inglizcha tarjimalar shu yerda.
//
// Jadval (egasi bergan): 0-kun — PRO berilgan zahoti; qolganlari ankor (PRO davri boshlangan
// Toshkent sanasi) dan sanab belgilangan Toshkent soatida: 12:00 — amaliy (skan, retsept, porsiya),
// 19:00 — natija, motivatsiya. Belgilangan vaqtdan 6 soat o'tib ketsa o'sha kun o'tkaziladi
// (obuna-xabar-hisob.ts qoidasi).
//
// Segment (egasi bergan): tugash xabarlari (obuna-xabar-hisob.ts: 7/3/1 kun oldin, tugagan kun,
// 2 kundan keyin) chiqadigan kunlarda bu zanjir jim turadi — bir kunda ikki oqim bo'lmaydi.
// 7 kun muhim amal bo'lmasa zanjir to'xtab, reaktivatsiya (7/10/14 kun, 19:00) ketadi; 14 kundan
// keyin xabarlar to'xtaydi; foydalanuvchi qaytsa zanjir davom etadi, o'tib ketgan kunlar yuborilmaydi.
// Uzaytirish ankorni o'zgartirmaydi — zanjir qayta boshlanmaydi.

import type { Til } from "../lugat/tarjima.ts";
import { bosqichLahzasi, XABAR_BOSQICHLARI } from "./obuna-xabar-hisob.ts";
import { toshkentSanasi } from "./yozuv-hisob.ts";

const KUN_MS = 24 * 60 * 60 * 1000;
const SOAT_MS = 60 * 60 * 1000;
/** Belgilangan vaqtdan keyin shu muddat ichida kechikib yuborilishi mumkin. */
export const KECHIKISH_MS = 6 * SOAT_MS;

/** Zanjir turi — PRO davrini boshlagan obuna tarifi. */
export const ZANJIRLAR = ["oylik", "yarim_yillik", "yillik"] as const;
export type Zanjir = (typeof ZANJIRLAR)[number];

export function zanjirniOqi(qiymat: unknown): Zanjir | null {
  return ZANJIRLAR.includes(qiymat as Zanjir) ? (qiymat as Zanjir) : null;
}

/**
 * Obuna tarifidan zanjir; tarifsiz "qolda" muddatda uzunligiga qarab: 35 kungacha oylik,
 * 190 kungacha yarim yillik, undan uzuni yillik.
 */
export function zanjirniTanla(tarif: string, boshlanish: Date, tugash: Date): Zanjir {
  const tayyor = zanjirniOqi(tarif);
  if (tayyor) return tayyor;
  const kunlar = (tugash.getTime() - boshlanish.getTime()) / KUN_MS;
  if (kunlar <= 35) return "oylik";
  if (kunlar <= 190) return "yarim_yillik";
  return "yillik";
}

/** Reaktivatsiya: shuncha kun muhim amal bo'lmasa — bosqich raqami (1–3). */
export const REAKTIVATSIYA_KUNLARI = [7, 10, 14] as const;
export const REAKTIVATSIYA_SOATI = "19:00";
/** Oxirgi amaldan shuncha kun o'tsa foydalanuvchi faol emas. */
export const FAOLSIZLIK_KUNI = REAKTIVATSIYA_KUNLARI[0];

export type UchTilda = Readonly<Record<Til, string>>;

export type ProXabari = {
  /** Qalin birinchi qator. */
  sarlavha: UchTilda;
  /** Qolgan matn; bo'sh qator — abzats. */
  matn: UchTilda;
  tugma: UchTilda;
  /** Tugma ochadigan ilova sahifasi. */
  sahifa: string;
};

export type ZanjirKuni = ProXabari & {
  kun: number;
  /** Toshkent vaqti "SS:DD"; 0-kunda yo'q — PRO berilgan zahoti. */
  soat: string | null;
};

const HOME = "/";
const KAMERA = "/kamera";
const PROGRESS = "/progress";
const RETSEPTLAR = "/retseptlar";

const T_ILOVA: UchTilda = { uz: "🌿 Ilovani ochish", ru: "🌿 Открыть приложение", en: "🌿 Open the app" };
const T_SKAN: UchTilda = { uz: "📸 Taomni tahlil qilish", ru: "📸 Проанализировать блюдо", en: "📸 Analyse a dish" };
const T_QAYD: UchTilda = { uz: "📸 Taomni qayd qilish", ru: "📸 Записать блюдо", en: "📸 Log a meal" };
const T_SCORE: UchTilda = { uz: "🎯 Score'ni ko'rish", ru: "🎯 Посмотреть Score", en: "🎯 See my Score" };
const T_RETSEPT: UchTilda = { uz: "🍽️ Retseptlarni ko'rish", ru: "🍽️ Посмотреть рецепты", en: "🍽️ See recipes" };
const T_STATISTIKA: UchTilda = { uz: "📊 Statistikani ko'rish", ru: "📊 Посмотреть статистику", en: "📊 See statistics" };
const T_PORSIYA: UchTilda = { uz: "⚖️ Porsiyani tekshirish", ru: "⚖️ Проверить порцию", en: "⚖️ Check a portion" };
const T_SEVIMLI: UchTilda = { uz: "❤️ Retseptlarni ochish", ru: "❤️ Открыть рецепты", en: "❤️ Open recipes" };

const PRO_ROYXATI_6: UchTilda = {
  uz: "🤖 Kuniga 20 tagacha AI skan\n🎯 Nutrition Score\n🍽️ Qolgan kaloriyangizga mos retseptlar\n⚖️ Aqlli porsiya tavsiyalari\n📊 Batafsil statistika\n❤️ Sevimli retseptlar",
  ru: "🤖 До 20 AI-сканирований в день\n🎯 Nutrition Score\n🍽️ Рецепты под остаток калорий\n⚖️ Умные рекомендации по порциям\n📊 Подробная статистика\n❤️ Избранные рецепты",
  en: "🤖 Up to 20 AI scans a day\n🎯 Nutrition Score\n🍽️ Recipes that fit your remaining calories\n⚖️ Smart portion advice\n📊 Detailed statistics\n❤️ Favourite recipes",
};
const PRO_ROYXATI_QISQA: UchTilda = {
  uz: "🤖 AI skanlar\n🎯 Nutrition Score\n🍽️ Mos retseptlar\n⚖️ Aqlli porsiya\n📊 Batafsil statistika\n❤️ Sevimli retseptlar",
  ru: "🤖 AI-сканирования\n🎯 Nutrition Score\n🍽️ Подходящие рецепты\n⚖️ Умные порции\n📊 Подробная статистика\n❤️ Избранные рецепты",
  en: "🤖 AI scans\n🎯 Nutrition Score\n🍽️ Matching recipes\n⚖️ Smart portions\n📊 Detailed statistics\n❤️ Favourite recipes",
};

// Bir nechta zanjirda takrorlanadigan xabarlar.
const SKAN_1: ProXabari = {
  sarlavha: { uz: "📸 Bugungi taomingizni tahlil qilib ko'ring", ru: "📸 Проанализируйте сегодняшнее блюдо", en: "📸 Analyse today's dish" },
  matn: {
    uz: "Taomni rasmga oling va uning kaloriyasini aniqlang.\n\nKun davomida ovqatlaringizni qayd qilib boring — shunda ovqatlanish tarixingiz shakllanib boradi. 🌿",
    ru: "Сфотографируйте блюдо и узнайте его калорийность.\n\nЗаписывайте блюда в течение дня — так будет складываться ваша история питания. 🌿",
    en: "Take a photo of your dish and find out its calories.\n\nLog your meals during the day — that is how your nutrition history takes shape. 🌿",
  },
  tugma: T_SKAN,
  sahifa: KAMERA,
};
const SKAN_QISQA: ProXabari = {
  sarlavha: { uz: "📸 Bugungi taomingizni tahlil qilib ko'ring", ru: "📸 Проанализируйте сегодняшнее блюдо", en: "📸 Analyse today's dish" },
  matn: {
    uz: "Taomni rasmga oling va kaloriyasini aniqlang.",
    ru: "Сфотографируйте блюдо и узнайте его калорийность.",
    en: "Take a photo of your dish and find out its calories.",
  },
  tugma: T_SKAN,
  sahifa: KAMERA,
};
const BIR_OY: ProXabari = {
  sarlavha: { uz: "🌿 NutriLifer bilan bir oy", ru: "🌿 Месяц с NutriLifer", en: "🌿 One month with NutriLifer" },
  matn: {
    uz: "Bir oy davomida to'plangan ovqatlanish ma'lumotlaringizni ko'rib chiqing.",
    ru: "Посмотрите данные о питании, собранные за месяц.",
    en: "Take a look at the nutrition data you have collected over the month.",
  },
  tugma: T_STATISTIKA,
  sahifa: PROGRESS,
};
const IKKI_OY: ProXabari = {
  sarlavha: { uz: "📊 2 oylik natijalaringizni ko'ring", ru: "📊 Посмотрите результаты за 2 месяца", en: "📊 See your 2-month results" },
  matn: {
    uz: "Statistikangiz orqali ovqatlanish odatlaringizni kuzatib boring. 🌿",
    ru: "Следите за своими пищевыми привычками через статистику. 🌿",
    en: "Follow your eating habits through your statistics. 🌿",
  },
  tugma: T_STATISTIKA,
  sahifa: PROGRESS,
};
const UCH_OY: ProXabari = {
  sarlavha: { uz: "✨ NutriLifer bilan 3 oy", ru: "✨ 3 месяца с NutriLifer", en: "✨ 3 months with NutriLifer" },
  matn: {
    uz: "Siz ovqatlanishingizni kuzatib kelayotganingizga 3 oy bo'ldi.\n\n🌿 Muntazamlikni davom ettiring.",
    ru: "Вы следите за своим питанием уже 3 месяца.\n\n🌿 Продолжайте в том же духе.",
    en: "You have been tracking your nutrition for 3 months now.\n\n🌿 Keep up the consistency.",
  },
  tugma: T_STATISTIKA,
  sahifa: PROGRESS,
};
const RETSEPT_MENYU: ProXabari = {
  sarlavha: { uz: "🍽️ Bugungi menyuni rejalashtiring", ru: "🍽️ Спланируйте сегодняшнее меню", en: "🍽️ Plan today's menu" },
  matn: {
    uz: "Qolgan kaloriyangizga mos retseptlarni ko'rib chiqing.",
    ru: "Посмотрите рецепты, которые подходят под остаток ваших калорий.",
    en: "Check out recipes that fit your remaining calories.",
  },
  tugma: T_RETSEPT,
  sahifa: RETSEPTLAR,
};

/** 1 oylik PRO — tezroq o'rgatamiz. */
const OYLIK: readonly ZanjirKuni[] = [
  {
    kun: 0,
    soat: null,
    sarlavha: { uz: "✨ NutriLifer PRO faollashtirildi!", ru: "✨ NutriLifer PRO активирован!", en: "✨ NutriLifer PRO is active!" },
    matn: {
      uz: `Endi PRO imkoniyatlaridan foydalanishingiz mumkin:\n\n${PRO_ROYXATI_6.uz}\n\n🌿 Bugundan foydalanishni boshlang.`,
      ru: `Теперь вам доступны возможности PRO:\n\n${PRO_ROYXATI_6.ru}\n\n🌿 Начните пользоваться уже сегодня.`,
      en: `PRO features are now available to you:\n\n${PRO_ROYXATI_6.en}\n\n🌿 Start using them today.`,
    },
    tugma: T_ILOVA,
    sahifa: HOME,
  },
  { kun: 1, soat: "12:00", ...SKAN_1 },
  {
    kun: 3,
    soat: "19:00",
    sarlavha: { uz: "🎯 Bugungi Nutrition Score'ingizni ko'ring", ru: "🎯 Посмотрите сегодняшний Nutrition Score", en: "🎯 See today's Nutrition Score" },
    matn: {
      uz: "Kun davomida qayd qilgan ovqatlaringiz asosida natijangizni kuzatib ko'ring.\n\n📊 Keyingi kunlarda o'zgarishlarni solishtirish yanada qiziqroq bo'ladi.",
      ru: "Посмотрите результат по блюдам, записанным за день.\n\n📊 В следующие дни сравнивать изменения будет ещё интереснее.",
      en: "See your result based on the meals you logged today.\n\n📊 Comparing the changes over the next days gets even more interesting.",
    },
    tugma: T_SCORE,
    sahifa: HOME,
  },
  {
    kun: 5,
    soat: "12:00",
    sarlavha: { uz: "🍽️ Bugun nima yeyishni rejalashtiryapsiz?", ru: "🍽️ Что планируете съесть сегодня?", en: "🍽️ What are you planning to eat today?" },
    matn: {
      uz: "Qolgan kaloriyangizga mos retseptlarni ko'rib chiqing.\n\n🌿 Keyingi ovqatni tanlash yanada qulay.",
      ru: "Посмотрите рецепты, которые подходят под остаток ваших калорий.\n\n🌿 Выбрать следующий приём пищи станет проще.",
      en: "Check out recipes that fit your remaining calories.\n\n🌿 Choosing your next meal gets easier.",
    },
    tugma: T_RETSEPT,
    sahifa: RETSEPTLAR,
  },
  {
    kun: 7,
    soat: "19:00",
    sarlavha: { uz: "📊 Birinchi haftangiz qanday o'tdi?", ru: "📊 Как прошла ваша первая неделя?", en: "📊 How did your first week go?" },
    matn: {
      uz: "Bir hafta davomida qayd qilgan ovqatlaringiz va natijalaringizni ko'rib chiqing.\n\n🌿 Muntazam kuzatish ovqatlanish odatlaringizni yaxshiroq tushunishga yordam beradi.",
      ru: "Посмотрите блюда и результаты, записанные за неделю.\n\n🌿 Регулярное наблюдение помогает лучше понять свои пищевые привычки.",
      en: "Review the meals and results you logged over the week.\n\n🌿 Regular tracking helps you understand your eating habits better.",
    },
    tugma: T_STATISTIKA,
    sahifa: PROGRESS,
  },
  {
    kun: 10,
    soat: "12:00",
    sarlavha: { uz: "⚖️ Porsiya ham muhim", ru: "⚖️ Порция тоже важна", en: "⚖️ Portions matter too" },
    matn: {
      uz: "Taom nomi bir xil bo'lsa ham, porsiya miqdori natijaga ta'sir qiladi.\n\nPRO'dagi aqlli porsiya tavsiyalaridan foydalanib ko'ring. 🌿",
      ru: "Даже если блюдо то же самое, размер порции влияет на результат.\n\nПопробуйте умные рекомендации по порциям в PRO. 🌿",
      en: "Even when the dish is the same, the portion size affects the result.\n\nTry the smart portion advice in PRO. 🌿",
    },
    tugma: T_PORSIYA,
    sahifa: KAMERA,
  },
  {
    kun: 14,
    soat: "19:00",
    sarlavha: { uz: "🥩 Kunlik makrolaringizni kuzating", ru: "🥩 Следите за дневными макросами", en: "🥩 Track your daily macros" },
    matn: {
      uz: "🥩 Oqsil\n🥑 Yog'\n🍚 Uglevodlar\n\nKunlik ko'rsatkichlaringizni kuzatib boring va ovqatlanish tarixingizni yaxshiroq tushuning.",
      ru: "🥩 Белки\n🥑 Жиры\n🍚 Углеводы\n\nСледите за дневными показателями и лучше понимайте свою историю питания.",
      en: "🥩 Protein\n🥑 Fat\n🍚 Carbs\n\nTrack your daily numbers and understand your nutrition history better.",
    },
    tugma: T_STATISTIKA,
    sahifa: PROGRESS,
  },
  {
    kun: 18,
    soat: "12:00",
    sarlavha: { uz: "❤️ Sevimli retseptlaringizni saqlab qo'ying", ru: "❤️ Сохраните любимые рецепты", en: "❤️ Save your favourite recipes" },
    matn: {
      uz: "Yoqtirgan retseptlaringizni sevimlilarga qo'shing.\n\nKeyingi safar ularni tezroq topishingiz mumkin. 🌿",
      ru: "Добавляйте понравившиеся рецепты в избранное.\n\nВ следующий раз вы найдёте их быстрее. 🌿",
      en: "Add the recipes you like to your favourites.\n\nNext time you will find them faster. 🌿",
    },
    tugma: T_SEVIMLI,
    sahifa: RETSEPTLAR,
  },
  {
    kun: 21,
    soat: "19:00",
    sarlavha: { uz: "📈 3 haftalik natijalaringizni ko'rib chiqing", ru: "📈 Посмотрите результаты за 3 недели", en: "📈 Review your 3-week results" },
    matn: {
      uz: "Ovqatlanish tarixingizga nazar tashlang.\n\nQaysi kunlarda muntazamroq bo'lganingizni ko'rib chiqing. 🌿",
      ru: "Загляните в свою историю питания.\n\nПосмотрите, в какие дни вы были последовательнее. 🌿",
      en: "Take a look at your nutrition history.\n\nSee which days you were most consistent on. 🌿",
    },
    tugma: T_STATISTIKA,
    sahifa: PROGRESS,
  },
  {
    kun: 25,
    soat: "19:00",
    sarlavha: { uz: "🌿 Yaxshi odatlarni davom ettiring", ru: "🌿 Продолжайте хорошие привычки", en: "🌿 Keep up the good habits" },
    matn: {
      uz: "Bugungi ovqatlaringizni ham qayd qilib qo'ying.\n\n📸 Taomni tahlil qiling\n📊 Natijangizni ko'ring\n🎯 Kunlik maqsadlaringizni kuzating",
      ru: "Запишите и сегодняшние блюда.\n\n📸 Проанализируйте блюдо\n📊 Посмотрите результат\n🎯 Следите за дневными целями",
      en: "Log today's meals too.\n\n📸 Analyse a dish\n📊 See your result\n🎯 Track your daily goals",
    },
    tugma: T_QAYD,
    sahifa: KAMERA,
  },
];

/** 6 oylik PRO — onboarding qisqaroq, keyin siyrak. */
const YARIM_YILLIK: readonly ZanjirKuni[] = [
  {
    kun: 0,
    soat: null,
    sarlavha: { uz: "✨ 6 oylik NutriLifer PRO faollashtirildi!", ru: "✨ NutriLifer PRO на 6 месяцев активирован!", en: "✨ Your 6-month NutriLifer PRO is active!" },
    matn: {
      uz: `Endi 6 oy davomida PRO imkoniyatlaridan foydalanishingiz mumkin.\n\n${PRO_ROYXATI_QISQA.uz}\n\n🌿 Foydalanishni bugundan boshlang.`,
      ru: `Теперь возможности PRO доступны вам 6 месяцев.\n\n${PRO_ROYXATI_QISQA.ru}\n\n🌿 Начните пользоваться уже сегодня.`,
      en: `PRO features are yours for the next 6 months.\n\n${PRO_ROYXATI_QISQA.en}\n\n🌿 Start using them today.`,
    },
    tugma: T_ILOVA,
    sahifa: HOME,
  },
  {
    kun: 1,
    soat: "12:00",
    sarlavha: { uz: "📸 Birinchi PRO skaningizni sinab ko'ring", ru: "📸 Попробуйте первое PRO-сканирование", en: "📸 Try your first PRO scan" },
    matn: {
      uz: "Bugungi taomingizni rasmga oling va kaloriyasini aniqlang.",
      ru: "Сфотографируйте сегодняшнее блюдо и узнайте его калорийность.",
      en: "Take a photo of today's dish and find out its calories.",
    },
    tugma: T_SKAN,
    sahifa: KAMERA,
  },
  {
    kun: 4,
    soat: "19:00",
    sarlavha: { uz: "🎯 Nutrition Score'ni ko'rib chiqing", ru: "🎯 Посмотрите Nutrition Score", en: "🎯 Check your Nutrition Score" },
    matn: {
      uz: "Bugungi ovqatlanishingiz qanday natija berganini ko'ring. 🌿",
      ru: "Посмотрите, какой результат дало сегодняшнее питание. 🌿",
      en: "See what today's eating added up to. 🌿",
    },
    tugma: T_SCORE,
    sahifa: HOME,
  },
  {
    kun: 7,
    soat: "19:00",
    sarlavha: { uz: "📊 Birinchi haftangiz yakunlandi", ru: "📊 Первая неделя позади", en: "📊 Your first week is complete" },
    matn: {
      uz: "Ovqatlanish tarixingizni ko'rib chiqing.\n\nMuntazam qaydlar keyinchalik natijalaringizni yaxshiroq tushunishga yordam beradi.",
      ru: "Посмотрите свою историю питания.\n\nРегулярные записи помогут потом лучше понять результаты.",
      en: "Review your nutrition history.\n\nRegular logging will help you understand your results better later on.",
    },
    tugma: T_STATISTIKA,
    sahifa: PROGRESS,
  },
  {
    kun: 14,
    soat: "12:00",
    sarlavha: { uz: "🍽️ Qolgan kaloriyangizga mos retseptlarni ko'ring", ru: "🍽️ Рецепты под остаток ваших калорий", en: "🍽️ Recipes that fit your remaining calories" },
    matn: {
      uz: "Bugungi menyu uchun mos variantlarni topib ko'ring. 🌿",
      ru: "Найдите подходящие варианты для сегодняшнего меню. 🌿",
      en: "Find options that fit today's menu. 🌿",
    },
    tugma: T_RETSEPT,
    sahifa: RETSEPTLAR,
  },
  {
    kun: 21,
    soat: "19:00",
    sarlavha: { uz: "⚖️ Porsiyangizni kuzatib boring", ru: "⚖️ Следите за порциями", en: "⚖️ Keep an eye on your portions" },
    matn: {
      uz: "Aqlli porsiya tavsiyalaridan foydalanib ko'ring.",
      ru: "Попробуйте умные рекомендации по порциям.",
      en: "Try the smart portion advice.",
    },
    tugma: T_PORSIYA,
    sahifa: KAMERA,
  },
  { kun: 30, soat: "19:00", ...BIR_OY },
  { kun: 60, soat: "19:00", ...IKKI_OY },
  { kun: 90, soat: "19:00", ...UCH_OY },
  { kun: 120, soat: "12:00", ...RETSEPT_MENYU },
  {
    kun: 150,
    soat: "19:00",
    sarlavha: { uz: "📈 Natijalaringizni yana bir bor ko'rib chiqing", ru: "📈 Ещё раз посмотрите на результаты", en: "📈 Take another look at your results" },
    matn: {
      uz: "Oxirgi haftalar va oylar davomida to'plangan ma'lumotlaringizni kuzating.",
      ru: "Посмотрите данные, собранные за последние недели и месяцы.",
      en: "Look over the data you have collected over the past weeks and months.",
    },
    tugma: T_STATISTIKA,
    sahifa: PROGRESS,
  },
];

/** 1 yillik PRO — xabar charchog'idan ayniqsa ehtiyot bo'lamiz. */
const YILLIK: readonly ZanjirKuni[] = [
  {
    kun: 0,
    soat: null,
    sarlavha: { uz: "✨ 1 yillik NutriLifer PRO faollashtirildi!", ru: "✨ NutriLifer PRO на 1 год активирован!", en: "✨ Your 1-year NutriLifer PRO is active!" },
    matn: {
      uz: `Siz bir yil davomida PRO imkoniyatlaridan foydalanishingiz mumkin.\n\n${PRO_ROYXATI_QISQA.uz}\n\n🌿 Yaxshi odatlarni muntazam davom ettiring.`,
      ru: `Возможности PRO доступны вам целый год.\n\n${PRO_ROYXATI_QISQA.ru}\n\n🌿 Регулярно поддерживайте хорошие привычки.`,
      en: `PRO features are yours for a whole year.\n\n${PRO_ROYXATI_QISQA.en}\n\n🌿 Keep up the good habits regularly.`,
    },
    tugma: T_ILOVA,
    sahifa: HOME,
  },
  { kun: 1, soat: "12:00", ...SKAN_QISQA },
  {
    kun: 7,
    soat: "19:00",
    sarlavha: { uz: "📊 Birinchi haftangiz", ru: "📊 Ваша первая неделя", en: "📊 Your first week" },
    matn: {
      uz: "Ovqatlanish tarixingizni ko'rib chiqing va natijalaringizni kuzating. 🌿",
      ru: "Посмотрите историю питания и следите за результатами. 🌿",
      en: "Review your nutrition history and follow your results. 🌿",
    },
    tugma: T_STATISTIKA,
    sahifa: PROGRESS,
  },
  {
    kun: 14,
    soat: "12:00",
    sarlavha: { uz: "🍽️ Bugungi kaloriyangizga mos retsept", ru: "🍽️ Рецепт под сегодняшние калории", en: "🍽️ A recipe that fits today's calories" },
    matn: {
      uz: "Qolgan kaloriyangizga mos variantlarni ko'rib chiqing.",
      ru: "Посмотрите варианты, которые подходят под остаток калорий.",
      en: "Check out options that fit your remaining calories.",
    },
    tugma: T_RETSEPT,
    sahifa: RETSEPTLAR,
  },
  { kun: 30, soat: "19:00", ...BIR_OY },
  {
    kun: 60,
    soat: "19:00",
    sarlavha: { uz: "📊 2 oylik natijalaringizni kuzating", ru: "📊 Следите за результатами 2 месяцев", en: "📊 Follow your 2-month results" },
    matn: {
      uz: "Ovqatlanish tarixingizga nazar tashlang.",
      ru: "Загляните в свою историю питания.",
      en: "Take a look at your nutrition history.",
    },
    tugma: T_STATISTIKA,
    sahifa: PROGRESS,
  },
  {
    kun: 90,
    soat: "19:00",
    sarlavha: { uz: "✨ 3 oy davomida", ru: "✨ Уже 3 месяца", en: "✨ 3 months in" },
    matn: {
      uz: "NutriLifer bilan ovqatlanishingizni kuzatib kelyapsiz.\n\n🌿 Davomiylikni saqlab qoling.",
      ru: "Вы следите за питанием вместе с NutriLifer.\n\n🌿 Сохраняйте постоянство.",
      en: "You have been tracking your nutrition with NutriLifer.\n\n🌿 Keep the streak going.",
    },
    tugma: T_STATISTIKA,
    sahifa: PROGRESS,
  },
  {
    kun: 120,
    soat: "12:00",
    sarlavha: { uz: "⚖️ Porsiya nazoratini unutmang", ru: "⚖️ Не забывайте про контроль порций", en: "⚖️ Don't forget portion control" },
    matn: {
      uz: "Aqlli porsiya tavsiyalaridan foydalanib ko'ring.",
      ru: "Попробуйте умные рекомендации по порциям.",
      en: "Try the smart portion advice.",
    },
    tugma: T_PORSIYA,
    sahifa: KAMERA,
  },
  {
    kun: 150,
    soat: "19:00",
    sarlavha: { uz: "🥩 Makrolaringizni kuzating", ru: "🥩 Следите за макросами", en: "🥩 Track your macros" },
    matn: {
      uz: "Oqsil, yog' va uglevodlar bo'yicha ko'rsatkichlaringizni tekshirib boring.",
      ru: "Проверяйте показатели по белкам, жирам и углеводам.",
      en: "Keep checking your protein, fat and carb numbers.",
    },
    tugma: T_STATISTIKA,
    sahifa: PROGRESS,
  },
  {
    kun: 180,
    soat: "19:00",
    sarlavha: { uz: "✨ Yarim yil!", ru: "✨ Полгода!", en: "✨ Half a year!" },
    matn: {
      uz: "NutriLifer PRO bilan 6 oyni yakunladingiz.\n\n📊 Shu vaqt ichidagi ovqatlanish tarixingizni ko'rib chiqing.\n\n🌿 Yana 6 oy oldinda.",
      ru: "Вы прошли 6 месяцев с NutriLifer PRO.\n\n📊 Посмотрите историю питания за это время.\n\n🌿 Впереди ещё 6 месяцев.",
      en: "You have completed 6 months with NutriLifer PRO.\n\n📊 Review your nutrition history for this period.\n\n🌿 Another 6 months ahead.",
    },
    tugma: T_STATISTIKA,
    sahifa: PROGRESS,
  },
  {
    kun: 240,
    soat: "19:00",
    sarlavha: { uz: "📈 Natijalaringizni kuzatishda davom eting", ru: "📈 Продолжайте следить за результатами", en: "📈 Keep following your results" },
    matn: {
      uz: "Muntazam qaydlar ovqatlanish odatlaringizni yaxshiroq tushunishga yordam beradi.",
      ru: "Регулярные записи помогают лучше понять пищевые привычки.",
      en: "Regular logging helps you understand your eating habits better.",
    },
    tugma: T_STATISTIKA,
    sahifa: PROGRESS,
  },
  {
    kun: 300,
    soat: "19:00",
    sarlavha: { uz: "🌿 Yaxshi odatlarni davom ettiring", ru: "🌿 Продолжайте хорошие привычки", en: "🌿 Keep up the good habits" },
    matn: {
      uz: "Bugungi ovqatlaringizni ham qayd qilib qo'ying.",
      ru: "Запишите и сегодняшние блюда.",
      en: "Log today's meals too.",
    },
    tugma: T_QAYD,
    sahifa: KAMERA,
  },
  {
    kun: 335,
    soat: "19:00",
    sarlavha: { uz: "📊 Yillik natijangizga oz qoldi", ru: "📊 Скоро годовой итог", en: "📊 Your yearly result is almost here" },
    matn: {
      uz: "Bir yil davomida to'plangan ma'lumotlaringizni ko'rib chiqish vaqti yaqinlashmoqda. 🌿",
      ru: "Приближается время посмотреть данные, собранные за год. 🌿",
      en: "It is almost time to review the data you have collected over the year. 🌿",
    },
    tugma: T_STATISTIKA,
    sahifa: PROGRESS,
  },
];

export const ZANJIR_KUNLARI: Readonly<Record<Zanjir, readonly ZanjirKuni[]>> = {
  oylik: OYLIK,
  yarim_yillik: YARIM_YILLIK,
  yillik: YILLIK,
};

/** Reaktivatsiya xabarlari: bosqich 1–3 (7/10/14 kun faolsizlik), zanjirga qarab biroz farq qiladi. */
export const REAKTIVATSIYA: Readonly<Record<Zanjir, readonly ProXabari[]>> = {
  oylik: [
    {
      sarlavha: { uz: "🌿 NutriLifer'da sizni kutib turibmiz", ru: "🌿 Мы ждём вас в NutriLifer", en: "🌿 We're waiting for you in NutriLifer" },
      matn: {
        uz: "Bugun faqat bitta taomni qayd qilib ko'ring.\n\nKichik qadamdan boshlashning o'zi yetarli. 🌿",
        ru: "Запишите сегодня всего одно блюдо.\n\nДостаточно начать с маленького шага. 🌿",
        en: "Log just one meal today.\n\nStarting with a small step is enough. 🌿",
      },
      tugma: T_QAYD,
      sahifa: KAMERA,
    },
    {
      sarlavha: { uz: "📸 Bugungi taomingizni tahlil qilib ko'ring", ru: "📸 Проанализируйте сегодняшнее блюдо", en: "📸 Analyse today's dish" },
      matn: {
        uz: "Taomni rasmga oling va uning kaloriyasini bilib oling.\n\nBugun yana bir kichik qadamdan boshlashingiz mumkin.",
        ru: "Сфотографируйте блюдо и узнайте его калорийность.\n\nСегодня можно снова начать с маленького шага.",
        en: "Take a photo of your dish and find out its calories.\n\nToday you can start again with one small step.",
      },
      tugma: T_SKAN,
      sahifa: KAMERA,
    },
    {
      sarlavha: { uz: "🌿 Qaytish uchun maxsus sabab shart emas", ru: "🌿 Чтобы вернуться, не нужен особый повод", en: "🌿 You don't need a special reason to come back" },
      matn: {
        uz: "Bugungi bitta taomni qayd qilishdan boshlang.\n\nNutriLifer qolganini kuzatishda yordam beradi.",
        ru: "Начните с записи одного сегодняшнего блюда.\n\nNutriLifer поможет отследить остальное.",
        en: "Start by logging one of today's meals.\n\nNutriLifer helps you track the rest.",
      },
      tugma: T_QAYD,
      sahifa: KAMERA,
    },
  ],
  yarim_yillik: [
    {
      sarlavha: { uz: "🌿 Bugun faqat bitta taomni qayd qilib ko'ring", ru: "🌿 Запишите сегодня всего одно блюдо", en: "🌿 Log just one meal today" },
      matn: {
        uz: "Kichik qadamdan boshlashingiz mumkin.",
        ru: "Можно начать с маленького шага.",
        en: "You can start with a small step.",
      },
      tugma: T_QAYD,
      sahifa: KAMERA,
    },
    {
      sarlavha: { uz: "📸 Bugungi taomingizni tahlil qilib ko'ring", ru: "📸 Проанализируйте сегодняшнее блюдо", en: "📸 Analyse today's dish" },
      matn: {
        uz: "Birgina taomni qayd qilishdan boshlang.",
        ru: "Начните с записи одного блюда.",
        en: "Start by logging a single meal.",
      },
      tugma: T_SKAN,
      sahifa: KAMERA,
    },
    {
      sarlavha: { uz: "🌿 NutriLifer bilan kuzatishni yana davom ettirishingiz mumkin", ru: "🌿 Вы можете снова продолжить наблюдение с NutriLifer", en: "🌿 You can pick up tracking with NutriLifer again" },
      matn: {
        uz: "Bugungi ovqatlaringizni qayd qilib ko'ring.",
        ru: "Запишите сегодняшние блюда.",
        en: "Log today's meals.",
      },
      tugma: T_QAYD,
      sahifa: KAMERA,
    },
  ],
  yillik: [
    {
      sarlavha: { uz: "🌿 Bugun NutriLifer'ga qaytib ko'ring", ru: "🌿 Вернитесь сегодня в NutriLifer", en: "🌿 Come back to NutriLifer today" },
      matn: {
        uz: "Faqat bitta taomni qayd qilib ko'ring.",
        ru: "Запишите всего одно блюдо.",
        en: "Log just one meal.",
      },
      tugma: T_QAYD,
      sahifa: KAMERA,
    },
    {
      sarlavha: { uz: "📸 Bugungi taomingizni tahlil qilib ko'ring", ru: "📸 Проанализируйте сегодняшнее блюдо", en: "📸 Analyse today's dish" },
      matn: {
        uz: "Birgina taomdan boshlashingiz mumkin.",
        ru: "Можно начать с одного блюда.",
        en: "You can start with a single dish.",
      },
      tugma: T_SKAN,
      sahifa: KAMERA,
    },
    {
      sarlavha: { uz: "🌿 Ovqatlanish tarixingiz siz qaytishingizni kutib turibdi", ru: "🌿 Ваша история питания ждёт вашего возвращения", en: "🌿 Your nutrition history is waiting for you" },
      matn: {
        uz: "Bugungi ovqatingizni qayd qilib ko'ring.",
        ru: "Запишите сегодняшнюю еду.",
        en: "Log what you ate today.",
      },
      tugma: T_QAYD,
      sahifa: KAMERA,
    },
  ],
};

function html(matn: string): string {
  return matn.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export type TayyorXabar = { matn: string; tugma: string; sahifa: string };

function tayyorla(x: ProXabari, til: Til): TayyorXabar {
  return { matn: `<b>${html(x.sarlavha[til])}</b>\n\n${html(x.matn[til])}`, tugma: x.tugma[til], sahifa: x.sahifa };
}

/** Zanjir kuni xabari foydalanuvchi tilida: HTML matn (sarlavha qalin), tugma, sahifa. */
export function kunXabari(zanjir: Zanjir, kun: number, til: Til): TayyorXabar | null {
  const k = ZANJIR_KUNLARI[zanjir].find((x) => x.kun === kun);
  return k ? tayyorla(k, til) : null;
}

/** Reaktivatsiya xabari (bosqich 1–3) foydalanuvchi tilida. */
export function reaktivatsiyaXabari(zanjir: Zanjir, bosqich: number, til: Til): TayyorXabar | null {
  const x = REAKTIVATSIYA[zanjir][bosqich - 1];
  return x ? tayyorla(x, til) : null;
}

/** Toshkent sanasi "YYYY-MM-DD" ga `kun` qo'shib, shu kundagi `soat` lahzasi. */
function toshkentLahzasi(sana: string, kun: number, soat: string): Date {
  const kunBoshi = new Date(Date.parse(`${sana}T00:00:00Z`) + kun * KUN_MS).toISOString().slice(0, 10);
  return new Date(`${kunBoshi}T${soat}:00+05:00`);
}

/** Kun lahzasi: 0-kun — ankorning o'zi (darhol); qolganlari ankor sanasi + kun, belgilangan soatda. */
export function kunLahzasi(zanjir: Zanjir, kun: number, ankor: Date): Date | null {
  const k = ZANJIR_KUNLARI[zanjir].find((x) => x.kun === kun);
  if (!k) return null;
  if (k.soat === null) return ankor;
  return toshkentLahzasi(toshkentSanasi(ankor), kun, k.soat);
}

/** Vaqti kelgan (6 soatdan ko'p o'tmagan) eng so'nggi element. */
function vaqtiKelgan<T>(royxat: readonly T[], lahzasi: (x: T) => Date | null, hozir: Date): T | undefined {
  return royxat
    .filter((x) => {
      const lahza = lahzasi(x);
      if (!lahza) return false;
      const farq = hozir.getTime() - lahza.getTime();
      return farq >= 0 && farq < KECHIKISH_MS;
    })
    .at(-1);
}

/**
 * Hozir yuborilishi kerak bo'lgan zanjir kuni; `yuborilgan` (null — hali yo'q) dan keyingisi
 * bo'lmasa null. O'tib ketgan kunlar yuborilmaydi.
 */
export function navbatdagiKun(zanjir: Zanjir, ankor: Date, hozir: Date, yuborilgan: number | null): number | null {
  const k = vaqtiKelgan(ZANJIR_KUNLARI[zanjir], (x) => kunLahzasi(zanjir, x.kun, ankor), hozir);
  if (!k) return null;
  return yuborilgan === null || k.kun > yuborilgan ? k.kun : null;
}

/** Faolsizlik kunlari: oxirgi amaldan (yo'q bo'lsa ankordan) o'tgan to'liq kunlar. */
export function faolsizKunlar(oxirgiFaollik: Date | null, ankor: Date, hozir: Date): number {
  const oxirgi = Math.max(oxirgiFaollik?.getTime() ?? 0, ankor.getTime());
  return Math.floor((hozir.getTime() - oxirgi) / KUN_MS);
}

/** Reaktivatsiya bosqichi lahzasi: oxirgi amal sanasi + 7/10/14 kun, 19:00 Toshkent. */
export function reaktivatsiyaLahzasi(bosqich: number, oxirgiFaollik: Date | null, ankor: Date): Date | null {
  const kun = REAKTIVATSIYA_KUNLARI[bosqich - 1];
  if (!kun) return null;
  const oxirgi = new Date(Math.max(oxirgiFaollik?.getTime() ?? 0, ankor.getTime()));
  return toshkentLahzasi(toshkentSanasi(oxirgi), kun, REAKTIVATSIYA_SOATI);
}

/**
 * Hozir yuborilishi kerak bo'lgan reaktivatsiya bosqichi (1–3); `yuborilgan` dan keyingisi
 * bo'lmasa null. 14 kundan keyin (bosqich 3 yuborilgan) hech narsa — foydalanuvchi qaytguncha.
 */
export function navbatdagiReaktivatsiya(
  oxirgiFaollik: Date | null,
  ankor: Date,
  hozir: Date,
  yuborilgan: number,
): number | null {
  const bosqich = vaqtiKelgan([1, 2, 3], (b) => reaktivatsiyaLahzasi(b, oxirgiFaollik, ankor), hozir);
  return bosqich && bosqich > yuborilgan ? bosqich : null;
}

/**
 * Bugun (Toshkent) obuna tugashi xabari kuni — 7/3/1 kun oldin, tugagan kun, 2 kundan keyin
 * (obuna-xabar-hisob.ts). Shu kunlarda PRO zanjiri va reaktivatsiya jim turadi.
 */
export function tugashXabariKunimi(tugash: Date, hozir: Date): boolean {
  const bugun = toshkentSanasi(hozir);
  return XABAR_BOSQICHLARI.some((b) => toshkentSanasi(bosqichLahzasi(b, tugash)) === bugun);
}

export type Segment = "faol" | "reaktivatsiya" | "tugash_kuni";

/** Foydalanuvchi segmenti: tugash xabari kuni → jim; 7+ kun faolsiz → reaktivatsiya; aks holda faol. */
export function segmentniAniqla(oxirgiFaollik: Date | null, ankor: Date, tugash: Date, hozir: Date): Segment {
  if (tugashXabariKunimi(tugash, hozir)) return "tugash_kuni";
  return faolsizKunlar(oxirgiFaollik, ankor, hozir) >= FAOLSIZLIK_KUNI ? "reaktivatsiya" : "faol";
}

/**
 * Uzluksiz PRO davrining boshi: faol obunadan orqaga qarab, oldingi qator tugashi keyingisining
 * boshlanishiga tutashgan (bir kun ichida) bo'lsa — bitta davr. Tugash sanasi — davrning oxiri.
 */
export function proDavri(
  obunalar: readonly { tarif: string; boshlanish: Date; tugash: Date }[],
  hozir: Date,
): { boshlanish: Date; tugash: Date; zanjir: Zanjir } | null {
  const tartibda = [...obunalar].sort((a, b) => a.boshlanish.getTime() - b.boshlanish.getTime());
  const faolIndeks = tartibda.findIndex((o) => o.boshlanish <= hozir && o.tugash > hozir);
  if (faolIndeks < 0) return null;

  let bosh = faolIndeks;
  while (bosh > 0 && tartibda[bosh].boshlanish.getTime() - tartibda[bosh - 1].tugash.getTime() <= KUN_MS) bosh -= 1;
  let oxir = faolIndeks;
  while (oxir < tartibda.length - 1 && tartibda[oxir + 1].boshlanish.getTime() - tartibda[oxir].tugash.getTime() <= KUN_MS) {
    oxir += 1;
  }

  const birinchi = tartibda[bosh];
  const tugash = tartibda.slice(bosh, oxir + 1).reduce((eng, o) => (o.tugash > eng ? o.tugash : eng), birinchi.tugash);
  return { boshlanish: birinchi.boshlanish, tugash, zanjir: zanjirniTanla(birinchi.tarif, birinchi.boshlanish, birinchi.tugash) };
}
