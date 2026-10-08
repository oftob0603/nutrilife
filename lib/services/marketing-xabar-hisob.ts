// 7 kunlik bot xabarlari (PRO olmagan foydalanuvchilarga, DECISIONS 2026-10-08) uchun sof hisob —
// bazaga bog'lanmagan: matnlar uch tilda, segment, yuborish jadvali. Yuborish lib/services/fon-vazifalari.ts
// da. Matnlar egasi bergan (2026-10-08); ruscha va inglizcha tarjimalar shu yerda.
//
// Jadval (egasi bergan): 1-kun — startdan 1 soat keyin (22:00–09:00 oralig'iga tushsa ertasi 10:00),
// 2–7-kunlar — ankor kundan sanab belgilangan Toshkent soatida. Ankor — 1-kun xabari ketadigan
// kun: 1-kun ertasiga surilsa qolganlari ham shu kundan sanaladi (aks holda 2-kun 1-kundan bir
// yarim soat keyin kelib qolardi). Belgilangan vaqtdan 6 soat o'tib ketsa o'sha kun o'tkaziladi
// (obuna-xabar-hisob.ts qoidasi).

import type { Til } from "../lugat/tarjima.ts";
import { toshkentSanasi } from "./yozuv-hisob.ts";

const KUN_MS = 24 * 60 * 60 * 1000;
const SOAT_MS = 60 * 60 * 1000;
/** Belgilangan vaqtdan keyin shu muddat ichida kechikib yuborilishi mumkin. */
export const KECHIKISH_MS = 6 * SOAT_MS;
/** Zanjir uzunligi — oxirgi kun; `marketing_bosqichi` shu songa yetsa tugagan. */
export const OXIRGI_KUN = 7;

/** A — faol (3+ skan yoki yozuv), B — qiziqqan (1–2), C — passiv (hech narsa). Har xabar oldidan qayta hisoblanadi. */
export type Segment = "A" | "B" | "C";

export function segmentniAniqla(skanlar: number, yozuvlar: number): Segment {
  const eng = Math.max(skanlar, yozuvlar);
  if (eng >= 3) return "A";
  if (eng >= 1) return "B";
  return "C";
}

export type UchTilda = Readonly<Record<Til, string>>;

export type MarketingXabari = {
  /** Qalin birinchi qator. */
  sarlavha: UchTilda;
  /** Qolgan matn; bo'sh qator — abzats. */
  matn: UchTilda;
  tugma: UchTilda;
  /** Tugma ochadigan ilova sahifasi. */
  sahifa: string;
};

type Kun = {
  kun: number;
  /** Toshkent vaqti "SS:DD"; 1-kunda yo'q — startdan 1 soat keyin. */
  soat: string | null;
  xabarlar: Readonly<Record<Segment, MarketingXabari>>;
};

const KAMERA = "/kamera";
const HOME = "/";
const PROGRESS = "/progress";
const RETSEPTLAR = "/retseptlar";
const PRO = "/pro?manba=profil";

const PRO_ROYXATI_5: UchTilda = {
  uz: "🤖 Kuniga 20 tagacha AI skan\n🎯 Nutrition Score\n⚖️ Aqlli porsiya tavsiyalari\n📊 Batafsil statistika\n🍽️ Qolgan kaloriyaga mos retseptlar",
  ru: "🤖 До 20 AI-сканирований в день\n🎯 Nutrition Score\n⚖️ Умные рекомендации по порциям\n📊 Подробная статистика\n🍽️ Рецепты под остаток калорий",
  en: "🤖 Up to 20 AI scans a day\n🎯 Nutrition Score\n⚖️ Smart portion advice\n📊 Detailed statistics\n🍽️ Recipes that fit your remaining calories",
};

export const KUNLAR: readonly Kun[] = [
  {
    kun: 1,
    soat: null,
    xabarlar: {
      A: {
        sarlavha: { uz: "🔥 Bugun ham ovqatlanishingizni kuzatib boring", ru: "🔥 Продолжайте следить за питанием и сегодня", en: "🔥 Keep tracking your meals today" },
        matn: {
          uz: "Siz allaqachon bir nechta taomni tahlil qildingiz.\n\nEndi kun davomida kaloriya, oqsil, yog' va uglevodlar qanday yig'ilayotganini kuzatib boring.\n\n🌿 Har bir qayd — maqsadingizga yaqinlashtiradigan yana bir qadam.",
          ru: "Вы уже проанализировали несколько блюд.\n\nТеперь следите, как в течение дня набираются калории, белки, жиры и углеводы.\n\n🌿 Каждая запись — ещё один шаг к вашей цели.",
          en: "You have already analysed a few dishes.\n\nNow watch how calories, protein, fat and carbs add up during the day.\n\n🌿 Every entry is one more step towards your goal.",
        },
        tugma: { uz: "📸 Taomni tahlil qilish", ru: "📸 Проанализировать блюдо", en: "📸 Analyse a dish" },
        sahifa: KAMERA,
      },
      B: {
        sarlavha: { uz: "📸 Yana bitta taomni sinab ko'ring", ru: "📸 Попробуйте ещё одно блюдо", en: "📸 Try one more dish" },
        matn: {
          uz: "Taomingizni rasmga oling — NutriLifer AI uning taxminiy:\n\n🔥 kaloriyasi\n🥩 oqsili\n🥑 yog'i\n🍚 uglevodlarini\n\nhisoblab beradi.\n\nBitta taomdan boshlash kifoya.",
          ru: "Сфотографируйте блюдо — NutriLifer AI примерно посчитает его:\n\n🔥 калории\n🥩 белки\n🥑 жиры\n🍚 углеводы\n\nДостаточно начать с одного блюда.",
          en: "Take a photo of your dish — NutriLifer AI will estimate its:\n\n🔥 calories\n🥩 protein\n🥑 fat\n🍚 carbs\n\nOne dish is enough to start.",
        },
        tugma: { uz: "📸 Taomni tahlil qilish", ru: "📸 Проанализировать блюдо", en: "📸 Analyse a dish" },
        sahifa: KAMERA,
      },
      C: {
        sarlavha: { uz: "🌿 NutriLifer bilan birinchi taomingizni tahlil qilib ko'ring", ru: "🌿 Проанализируйте первое блюдо с NutriLifer", en: "🌿 Analyse your first dish with NutriLifer" },
        matn: {
          uz: "Taomni suratga oling — qolganini NutriLifer AI bajaradi.\n\n🔥 Kaloriya\n🥩 Oqsil\n🥑 Yog'\n🍚 Uglevodlar\n\nBir marta sinab ko'ring.",
          ru: "Сфотографируйте блюдо — остальное сделает NutriLifer AI.\n\n🔥 Калории\n🥩 Белки\n🥑 Жиры\n🍚 Углеводы\n\nПопробуйте один раз.",
          en: "Take a photo of the dish — NutriLifer AI does the rest.\n\n🔥 Calories\n🥩 Protein\n🥑 Fat\n🍚 Carbs\n\nGive it one try.",
        },
        tugma: { uz: "📸 Boshlash", ru: "📸 Начать", en: "📸 Get started" },
        sahifa: KAMERA,
      },
    },
  },
  {
    kun: 2,
    soat: "11:30",
    xabarlar: {
      A: {
        sarlavha: { uz: "🎯 Sizga kuniga qancha kaloriya kerak?", ru: "🎯 Сколько калорий вам нужно в день?", en: "🎯 How many calories do you need a day?" },
        matn: {
          uz: "Ovqatlaringizni kuzatayotganingizdan keyin keyingi muhim qadam — o'zingizga mos kunlik normani bilish.\n\nNutriLifer ma'lumotlaringiz asosida kaloriya va makroelementlar normangizni hisoblaydi.",
          ru: "Вы уже следите за питанием — следующий важный шаг: узнать свою дневную норму.\n\nNutriLifer рассчитывает норму калорий и макроэлементов по вашим данным.",
          en: "You are already tracking meals — the next important step is knowing your daily target.\n\nNutriLifer calculates your calorie and macro targets from your data.",
        },
        tugma: { uz: "🎯 Normamni ko'rish", ru: "🎯 Посмотреть норму", en: "🎯 See my target" },
        sahifa: HOME,
      },
      B: {
        sarlavha: { uz: "🎯 Kaloriya normangizni bilasizmi?", ru: "🎯 Вы знаете свою норму калорий?", en: "🎯 Do you know your calorie target?" },
        matn: {
          uz: "Har bir insonning kunlik ehtiyoji har xil.\n\nNutriLifer sizning ma'lumotlaringiz asosida shaxsiy kunlik kaloriya va makroelementlar normangizni hisoblashga yordam beradi.",
          ru: "Дневная потребность у каждого своя.\n\nNutriLifer поможет рассчитать вашу личную норму калорий и макроэлементов по вашим данным.",
          en: "Everyone's daily needs are different.\n\nNutriLifer helps calculate your personal calorie and macro targets from your data.",
        },
        tugma: { uz: "🎯 Hisoblash", ru: "🎯 Рассчитать", en: "🎯 Calculate" },
        sahifa: HOME,
      },
      C: {
        sarlavha: { uz: "🤔 Sizga kuniga qancha kaloriya kerakligini bilasizmi?", ru: "🤔 Знаете, сколько калорий вам нужно в день?", en: "🤔 Do you know how many calories you need a day?" },
        matn: {
          uz: "Bu raqam har bir odamda har xil.\n\nNutriLifer sizning ma'lumotlaringiz asosida kunlik normangizni hisoblab beradi.",
          ru: "Это число у каждого своё.\n\nNutriLifer рассчитает вашу дневную норму по вашим данным.",
          en: "This number is different for everyone.\n\nNutriLifer calculates your daily target from your data.",
        },
        tugma: { uz: "🎯 Normamni hisoblash", ru: "🎯 Рассчитать норму", en: "🎯 Calculate my target" },
        sahifa: HOME,
      },
    },
  },
  {
    kun: 3,
    soat: "19:00",
    xabarlar: {
      A: {
        sarlavha: { uz: "📊 Natijangizni ko'rish vaqti", ru: "📊 Время посмотреть результат", en: "📊 Time to see your results" },
        matn: {
          uz: "Sizning ovqatlanish tarixingiz asta-sekin shakllanmoqda.\n\nEndi kunlik ovqatlanishingizni kuzatib, qayerda ko'proq yoki kamroq iste'mol qilayotganingizni ko'rishingiz mumkin.",
          ru: "Ваша история питания постепенно складывается.\n\nТеперь можно видеть, где вы едите больше, а где меньше.",
          en: "Your eating history is taking shape.\n\nNow you can see where you eat more and where less.",
        },
        tugma: { uz: "📊 Statistikam", ru: "📊 Моя статистика", en: "📊 My statistics" },
        sahifa: PROGRESS,
      },
      B: {
        sarlavha: { uz: "📊 Ovqatlanishingizni kuzatib ko'ring", ru: "📊 Попробуйте следить за питанием", en: "📊 Try tracking your meals" },
        matn: {
          uz: "Bugun yeganlaringizni qayd qiling.\n\nBir necha kun davomida ma'lumot yig'ilgach, o'z ovqatlanish odatlaringizni aniqroq ko'ra boshlaysiz.",
          ru: "Запишите, что вы ели сегодня.\n\nЧерез несколько дней данных накопится достаточно, чтобы увидеть свои привычки.",
          en: "Log what you ate today.\n\nAfter a few days of data you will start seeing your eating habits clearly.",
        },
        tugma: { uz: "📊 Kuzatishni boshlash", ru: "📊 Начать отслеживать", en: "📊 Start tracking" },
        sahifa: KAMERA,
      },
      C: {
        sarlavha: { uz: "🌿 O'zgarish avval kuzatishdan boshlanadi", ru: "🌿 Перемены начинаются с наблюдения", en: "🌿 Change starts with tracking" },
        matn: {
          uz: "Bugun yegan bitta taomingizni qayd qilib ko'ring.\n\nKeyinchalik NutriLifer sizga ovqatlanish tarixingizni ko'rishga yordam beradi.",
          ru: "Запишите одно блюдо, которое вы съели сегодня.\n\nДальше NutriLifer поможет видеть вашу историю питания.",
          en: "Log one dish you ate today.\n\nLater NutriLifer will help you see your eating history.",
        },
        tugma: { uz: "📸 Birinchi taomni qo'shish", ru: "📸 Добавить первое блюдо", en: "📸 Add your first dish" },
        sahifa: KAMERA,
      },
    },
  },
  {
    kun: 4,
    soat: "20:00",
    xabarlar: {
      A: {
        sarlavha: { uz: "✨ Siz NutriLifer'dan faol foydalanayapsiz", ru: "✨ Вы активно пользуетесь NutriLifer", en: "✨ You are an active NutriLifer user" },
        matn: {
          uz: `Agar kun davomida ko'proq taomlarni tahlil qilmoqchi bo'lsangiz, PRO siz uchun ayniqsa qulay.\n\n${PRO_ROYXATI_5.uz}`,
          ru: `Если хотите анализировать больше блюд за день, PRO будет особенно удобен.\n\n${PRO_ROYXATI_5.ru}`,
          en: `If you want to analyse more dishes during the day, PRO is made for you.\n\n${PRO_ROYXATI_5.en}`,
        },
        tugma: { uz: "✨ PRO imkoniyatlari", ru: "✨ Возможности PRO", en: "✨ PRO features" },
        sahifa: PRO,
      },
      B: {
        sarlavha: { uz: "✨ NutriLifer'da bundan ham ko'proq imkoniyat bor", ru: "✨ В NutriLifer есть ещё больше возможностей", en: "✨ NutriLifer can do even more" },
        matn: {
          uz: `PRO bilan:\n\n${PRO_ROYXATI_5.uz}`,
          ru: `С PRO:\n\n${PRO_ROYXATI_5.ru}`,
          en: `With PRO:\n\n${PRO_ROYXATI_5.en}`,
        },
        tugma: { uz: "✨ PRO'ni ko'rish", ru: "✨ Посмотреть PRO", en: "✨ See PRO" },
        sahifa: PRO,
      },
      C: {
        sarlavha: { uz: "🌿 NutriLifer siz uchun oddiyroq ishlashi mumkin", ru: "🌿 NutriLifer может быть проще для вас", en: "🌿 NutriLifer can make it simpler" },
        matn: {
          uz: "Taomlarni qo'lda hisoblash o'rniga AI yordamidan foydalanishingiz mumkin.\n\nPRO'da esa kuniga 20 tagacha AI skan va boshqa qo'shimcha imkoniyatlar mavjud.",
          ru: "Вместо подсчёта блюд вручную можно использовать помощь AI.\n\nА в PRO — до 20 AI-сканирований в день и другие дополнительные возможности.",
          en: "Instead of counting dishes by hand, you can let AI help.\n\nPRO adds up to 20 AI scans a day and other extra features.",
        },
        tugma: { uz: "✨ PRO haqida", ru: "✨ О PRO", en: "✨ About PRO" },
        sahifa: PRO,
      },
    },
  },
  {
    kun: 5,
    soat: "12:00",
    xabarlar: {
      A: {
        sarlavha: { uz: "🍽️ Kaloriya qolgan bo'lsa, nima yeyish mumkin?", ru: "🍽️ Остались калории — что съесть?", en: "🍽️ Calories left — what can you eat?" },
        matn: {
          uz: "NutriLifer PRO sizning qolgan kaloriyangizga mos retseptlarni taklif qilishga yordam beradi.\n\nShunchaki “nima yeysam ekan?” deb o'ylab o'tirmaysiz.",
          ru: "NutriLifer PRO подберёт рецепты под ваш остаток калорий.\n\nБольше не нужно думать «что бы поесть?».",
          en: "NutriLifer PRO suggests recipes that fit your remaining calories.\n\nNo more wondering “what should I eat?”.",
        },
        tugma: { uz: "🍽️ Retseptlarni ko'rish", ru: "🍽️ Посмотреть рецепты", en: "🍽️ See recipes" },
        sahifa: RETSEPTLAR,
      },
      B: {
        sarlavha: { uz: "🍽️ “Endi nima yeysam bo'ladi?”", ru: "🍽️ «Что теперь можно съесть?»", en: "🍽️ “What can I eat now?”" },
        matn: {
          uz: "Kunlik kaloriyangizdan qancha qolgani muhim.\n\nPRO sizga qolgan kaloriyangizga mos retseptlarni topishga yordam beradi.",
          ru: "Важно, сколько калорий осталось от дневной нормы.\n\nPRO поможет найти рецепты под ваш остаток.",
          en: "What matters is how much of your daily budget is left.\n\nPRO helps you find recipes that fit it.",
        },
        tugma: { uz: "🍽️ Retseptlarni ko'rish", ru: "🍽️ Посмотреть рецепты", en: "🍽️ See recipes" },
        sahifa: RETSEPTLAR,
      },
      C: {
        sarlavha: { uz: "🍽️ Sog'lomroq tanlov qilish osonroq bo'lishi mumkin", ru: "🍽️ Выбирать полезное может быть проще", en: "🍽️ Healthier choices can be easier" },
        matn: {
          uz: "NutriLifer PRO qolgan kaloriyangizga mos retseptlarni tavsiya qilishga yordam beradi.",
          ru: "NutriLifer PRO рекомендует рецепты под ваш остаток калорий.",
          en: "NutriLifer PRO recommends recipes that fit your remaining calories.",
        },
        tugma: { uz: "✨ PRO'ni ko'rish", ru: "✨ Посмотреть PRO", en: "✨ See PRO" },
        sahifa: PRO,
      },
    },
  },
  {
    kun: 6,
    soat: "19:30",
    xabarlar: {
      A: {
        sarlavha: { uz: "🌿 Siz allaqachon boshladingiz", ru: "🌿 Вы уже начали", en: "🌿 You have already started" },
        matn: {
          uz: "Eng qiyin qadam — boshlash.\n\nEndi vazifa oddiy: ovqatlanishingizni kuzatishda davom eting va o'zgarishingizni statistikada ko'ring.\n\n📊 Har bir qayd — o'zingiz haqingizda yangi ma'lumot.",
          ru: "Самый трудный шаг — начать.\n\nТеперь задача проста: продолжайте следить за питанием и смотрите свои изменения в статистике.\n\n📊 Каждая запись — новая информация о вас.",
          en: "The hardest step is starting.\n\nNow the task is simple: keep tracking your meals and watch your progress in statistics.\n\n📊 Every entry is new information about you.",
        },
        tugma: { uz: "📊 Natijalarim", ru: "📊 Мои результаты", en: "📊 My results" },
        sahifa: PROGRESS,
      },
      B: {
        sarlavha: { uz: "🌿 Bugun yana bir kichik qadam", ru: "🌿 Ещё один маленький шаг сегодня", en: "🌿 One more small step today" },
        matn: {
          uz: "Mukammal ovqatlanish shart emas.\n\nBugun faqat bitta taomni qayd qiling.\n\nKichik, ammo muntazam harakatlar ovqatlanish odatlarini kuzatishni osonlashtiradi.",
          ru: "Идеальное питание не обязательно.\n\nСегодня запишите всего одно блюдо.\n\nМаленькие, но регулярные действия упрощают наблюдение за привычками.",
          en: "Perfect eating is not required.\n\nJust log one dish today.\n\nSmall but regular actions make tracking habits easier.",
        },
        tugma: { uz: "📸 Taom qo'shish", ru: "📸 Добавить блюдо", en: "📸 Add a dish" },
        sahifa: KAMERA,
      },
      C: {
        sarlavha: { uz: "🌿 Boshlash uchun kech emas", ru: "🌿 Начать не поздно", en: "🌿 It is not too late to start" },
        matn: {
          uz: "Bugun bitta taomni tahlil qilib ko'ring.\n\nSizdan katta o'zgarish talab qilinmaydi — faqat birinchi qadam.",
          ru: "Проанализируйте одно блюдо сегодня.\n\nБольших перемен не требуется — только первый шаг.",
          en: "Analyse one dish today.\n\nNo big change is required — just the first step.",
        },
        tugma: { uz: "📸 Boshlash", ru: "📸 Начать", en: "📸 Get started" },
        sahifa: KAMERA,
      },
    },
  },
  {
    kun: 7,
    soat: "19:00",
    xabarlar: {
      A: {
        sarlavha: { uz: "✨ NutriLifer'dan foydalanishingizni davom ettiring", ru: "✨ Продолжайте пользоваться NutriLifer", en: "✨ Keep going with NutriLifer" },
        matn: {
          uz: "Siz allaqachon ovqatlanishingizni kuzatishni boshladingiz.\n\nPRO bilan imkoniyatlaringiz yanada kengayadi:\n\n🤖 20 tagacha AI skan / kun\n📖 To'liq retseptlar\n🎯 Nutrition Score\n🍽️ Qolgan kaloriyaga mos retseptlar\n🥩 Oqsil, yog' va uglevod nazorati\n⚖️ Aqlli porsiya tavsiyalari\n📊 Batafsil statistika\n❤️ Sevimli retseptlar\n📅 Haftalik hisobot\n\n🌿 Kuzatishni davom ettiring. Natijani muntazamlik yaratadi.",
          ru: "Вы уже начали следить за питанием.\n\nС PRO возможностей становится больше:\n\n🤖 До 20 AI-сканирований в день\n📖 Полные рецепты\n🎯 Nutrition Score\n🍽️ Рецепты под остаток калорий\n🥩 Контроль белков, жиров и углеводов\n⚖️ Умные рекомендации по порциям\n📊 Подробная статистика\n❤️ Избранные рецепты\n📅 Недельный отчёт\n\n🌿 Продолжайте наблюдать. Результат создаёт регулярность.",
          en: "You have already started tracking your meals.\n\nWith PRO you get even more:\n\n🤖 Up to 20 AI scans a day\n📖 Full recipes\n🎯 Nutrition Score\n🍽️ Recipes that fit your remaining calories\n🥩 Protein, fat and carb control\n⚖️ Smart portion advice\n📊 Detailed statistics\n❤️ Favourite recipes\n📅 Weekly report\n\n🌿 Keep tracking. Consistency creates results.",
        },
        tugma: { uz: "✨ PRO'ga o'tish", ru: "✨ Перейти на PRO", en: "✨ Go PRO" },
        sahifa: PRO,
      },
      B: {
        sarlavha: { uz: "✨ NutriLifer'da keyingi bosqichga o'ting", ru: "✨ Перейдите на следующий уровень в NutriLifer", en: "✨ Take the next step in NutriLifer" },
        matn: {
          uz: "Siz asosiy imkoniyatlarni sinab ko'rdingiz.\n\nPRO bilan esa ovqatlanishingizni yanada batafsil kuzatishingiz mumkin:\n\n🤖 20 tagacha AI skan\n🎯 Nutrition Score\n⚖️ Aqlli porsiya tavsiyalari\n📊 Batafsil statistika\n🍽️ Shaxsiy kaloriyangizga mos retseptlar\n📅 Haftalik hisobotlar\n\nSizga kerakli imkoniyatlarni bir joyda.",
          ru: "Вы попробовали основные возможности.\n\nС PRO можно следить за питанием ещё подробнее:\n\n🤖 До 20 AI-сканирований\n🎯 Nutrition Score\n⚖️ Умные рекомендации по порциям\n📊 Подробная статистика\n🍽️ Рецепты под ваши калории\n📅 Недельные отчёты\n\nВсё нужное — в одном месте.",
          en: "You have tried the basics.\n\nWith PRO you can track your eating in more detail:\n\n🤖 Up to 20 AI scans\n🎯 Nutrition Score\n⚖️ Smart portion advice\n📊 Detailed statistics\n🍽️ Recipes that fit your calories\n📅 Weekly reports\n\nEverything you need in one place.",
        },
        tugma: { uz: "✨ PRO'ni ko'rish", ru: "✨ Посмотреть PRO", en: "✨ See PRO" },
        sahifa: PRO,
      },
      C: {
        sarlavha: { uz: "🌿 NutriLifer'ni to'liqroq sinab ko'ring", ru: "🌿 Попробуйте NutriLifer полнее", en: "🌿 Try NutriLifer in full" },
        matn: {
          uz: "Agar ovqatlanishingizni qulayroq nazorat qilishni istasangiz, PRO'da:\n\n🤖 Kuniga 20 tagacha AI skan\n🎯 Nutrition Score\n🍽️ Qolgan kaloriyaga mos retseptlar\n⚖️ Aqlli porsiya tavsiyalari\n📊 Batafsil statistika\n📅 Haftalik ovqatlanish hisoboti\n\nva boshqa imkoniyatlar mavjud.\n\nBugun boshlash uchun yaxshi vaqt.",
          ru: "Если хотите контролировать питание удобнее, в PRO есть:\n\n🤖 До 20 AI-сканирований в день\n🎯 Nutrition Score\n🍽️ Рецепты под остаток калорий\n⚖️ Умные рекомендации по порциям\n📊 Подробная статистика\n📅 Недельный отчёт о питании\n\nи другие возможности.\n\nСегодня хороший день, чтобы начать.",
          en: "If you want an easier way to control your eating, PRO offers:\n\n🤖 Up to 20 AI scans a day\n🎯 Nutrition Score\n🍽️ Recipes that fit your remaining calories\n⚖️ Smart portion advice\n📊 Detailed statistics\n📅 Weekly nutrition report\n\nand more.\n\nToday is a good day to start.",
        },
        tugma: { uz: "✨ PRO'ga o'tish", ru: "✨ Перейти на PRO", en: "✨ Go PRO" },
        sahifa: PRO,
      },
    },
  },
];

function html(matn: string): string {
  return matn.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Rasm yo'li (`public/bot/7kun`): har kunga bitta, segmentdan qat'i nazar, foydalanuvchi tilida. */
export function rasmYoli(kun: number, til: Til): string {
  return `/bot/7kun/${til}-${kun}.jpg`;
}

export type TayyorXabar = { izoh: string; tugma: string; sahifa: string; rasm: string };

/** Kun va segment uchun tayyor xabar foydalanuvchi tilida: HTML izoh (sarlavha qalin), tugma, sahifa, rasm. */
export function xabarniTayyorla(kun: number, segment: Segment, til: Til): TayyorXabar | null {
  const k = KUNLAR.find((x) => x.kun === kun);
  if (!k) return null;
  const x = k.xabarlar[segment];
  return {
    izoh: `<b>${html(x.sarlavha[til])}</b>\n\n${html(x.matn[til])}`,
    tugma: x.tugma[til],
    sahifa: x.sahifa,
    rasm: rasmYoli(kun, til),
  };
}

/** Toshkent soati (0–23) berilgan lahzada. */
function toshkentSoati(lahza: Date): number {
  return new Date(lahza.getTime() + 5 * SOAT_MS).getUTCHours();
}

/** Toshkent sanasi "YYYY-MM-DD" ga `kun` qo'shib, shu kundagi `soat` lahzasi. */
function toshkentLahzasi(sana: string, kun: number, soat: string): Date {
  const kunBoshi = new Date(Date.parse(`${sana}T00:00:00Z`) + kun * KUN_MS).toISOString().slice(0, 10);
  return new Date(`${kunBoshi}T${soat}:00+05:00`);
}

/**
 * 1-kun lahzasi: startdan 1 soat keyin. 22:00 dan keyin bo'lsa ertasi 10:00, 09:00 dan oldin
 * bo'lsa shu kuni 10:00 — kechasi xabar ketmaydi (egasining qoidasi).
 */
export function birinchiLahza(start: Date): Date {
  const lahza = new Date(start.getTime() + SOAT_MS);
  const soat = toshkentSoati(lahza);
  if (soat >= 9 && soat < 22) return lahza;
  return toshkentLahzasi(toshkentSanasi(lahza), soat >= 22 ? 1 : 0, "10:00");
}

/** Kun lahzasi: 1-kun — `birinchiLahza`; qolganlari ankor (1-kun sanasi) + (kun − 1) kuni belgilangan soatda. */
export function kunLahzasi(kun: number, start: Date): Date | null {
  const k = KUNLAR.find((x) => x.kun === kun);
  if (!k) return null;
  const birinchi = birinchiLahza(start);
  if (k.soat === null) return birinchi;
  return toshkentLahzasi(toshkentSanasi(birinchi), kun - 1, k.soat);
}

/**
 * Hozir yuborilishi kerak bo'lgan kun; `yuborilgan` dan keyingisi bo'lmasa null.
 * Vaqti kelgan (6 soatdan ko'p o'tmagan) eng so'nggi kun — o'tib ketganlari yuborilmaydi.
 */
export function navbatdagiKun(start: Date, hozir: Date, yuborilgan: number): number | null {
  const vaqti = KUNLAR.filter((k) => {
    const lahza = kunLahzasi(k.kun, start);
    if (!lahza) return false;
    const farq = hozir.getTime() - lahza.getTime();
    return farq >= 0 && farq < KECHIKISH_MS;
  }).at(-1);
  return vaqti && vaqti.kun > yuborilgan ? vaqti.kun : null;
}

/** Nomzodlar oynasi: start shundan eski bo'lsa butun zanjir o'tib ketgan — bazadan olinmaydi. */
export const NOMZOD_OYNASI_MS = 9 * KUN_MS;
