/* NutriLife i18n — ONE dictionary for the whole user app.

   Keyed on the Uzbek source string (the gettext pattern) rather than on invented ids, so
   a screen reads `t("Bugungi ovqatlar")` and the untranslated fallback is the real Uzbek
   copy, never a bare key like `home.meals.title`. A missing translation therefore
   degrades to correct Uzbek instead of debug text.

   Uzbek is the default and is NOT stored in the table — it IS the key.

   ADMIN PANEL IS EXCLUDED. The panel is an internal Uzbek-only tool; it never loads this
   file and none of its strings appear here.

   Data stays data: food names, recipe names, category names and ingredient text come from
   the database and are not translated here. Only UI chrome is. */

const TILLAR = [
  { code:'uz', label:"O'zbekcha" },
  { code:'ru', label:'Русский' },
  { code:'en', label:'English' },
];

const SOZLAR = {
  // ── bare attribute literals (empty states, error bodies, sheet titles) ──
  "Ovqat qo'shish": { ru:"Добавить приём пищи", en:"Add food" },
  "Bugun hali hech narsa qo'shilmadi": { ru:"Сегодня пока ничего не добавлено", en:"Nothing added today yet" },
  "Birinchi ovqatni qo'shsangiz, doira to'lishni boshlaydi.": { ru:"Как только добавите первый приём пищи, круг начнёт заполняться.", en:"Once you add your first meal, the ring starts filling." },
  "Ovqat qo'shsangiz, u shu yerda ovqat turi bo'yicha guruhlanadi": { ru:"Добавленная еда группируется здесь по типу приёма пищи", en:"Food you add is grouped here by meal type" },
  "Rasmda bir nechta taom bor yoki yorug'lik yetmagan. Qiymatni o'zimiz uydirmaymiz.": { ru:"На фото несколько блюд или не хватает света. Мы не выдумываем значения.", en:"The photo has several dishes or too little light. We do not invent values." },
  'Boshqa': { ru:"Другое", en:"Other" },
  "Sevimlilarga qo'shish": { ru:"Добавить в избранное", en:"Add to favourites" },
  "Yangi retseptlar qo'shilgach shu yerda ko'rinadi.": { ru:"Новые рецепты появятся здесь.", en:"New recipes will appear here." },
  "Retsept ustidagi yurakni bossangiz, shu yerda yig'iladi.": { ru:"Нажмите на сердечко у рецепта — он появится здесь.", en:"Tap the heart on a recipe and it collects here." },
  "O'lchovni o'chirish": { ru:"Удалить измерение", en:"Delete measurement" },
  "Norma o'zgaradi": { ru:"Норма изменится", en:"Your target changes" },
  "To'lovlar tarixi": { ru:"История платежей", en:"Payment history" },
  "Bu amalni qaytarib bo'lmaydi": { ru:"Это действие нельзя отменить", en:"This cannot be undone" },

  // ── PRO feature labels + ProLock captions ────────────────────────
  'Kuniga 20 tagacha AI skan': { ru:"До 20 AI-сканирований в день", en:"Up to 20 AI scans a day" },
  "Retseptlarni to'liq ko'rish": { ru:"Полный просмотр рецептов", en:"Full recipe access" },
  'Qolgan kaloriyaga mos taom takliflari': { ru:"Блюда под остаток калорий", en:"Meals that fit your remaining calories" },
  "Oqsil, yog' va uglevodlarni kuzatish": { ru:"Отслеживание белков, жиров и углеводов", en:"Track protein, fat and carbs" },
  'Aqlli porsiya tavsiyalari': { ru:"Умные рекомендации порций", en:"Smart portion suggestions" },
  'Sevimli retseptlar': { ru:"Избранные рецепты", en:"Favourite recipes" },
  "Har hafta: o'rtacha kaloriya, oldingi hafta bilan solishtirish va kunlar bo'yicha ustunlar.": { ru:"Каждую неделю: средние калории, сравнение с прошлой неделей и столбцы по дням.", en:"Each week: average calories, comparison with last week and per-day bars." },
  "Kunlik ovqatlanish muvozanatini 0–100 ball bilan ko'rsatadi.": { ru:"Показывает баланс питания за день по шкале 0–100.", en:"Shows your daily nutrition balance on a 0–100 scale." },
  "Qolgan kaloriyangizga sig'adigan taomlar tanlanadi.": { ru:"Подбираются блюда, которые уместятся в остаток калорий.", en:"Picks dishes that fit your remaining calories." },
  "{0} ta o'lchov": { ru:"{0} измерений", en:"{0} measurements" },
  "Ma'lumotni yuklab bo'lmadi": { ru:"Не удалось загрузить данные", en:"Could not load the data" },

  // ── units, weekdays, portion words ──────────────────────────────────────
  'Ya': { ru:"Вс", en:"Su" },
  'Du': { ru:"Пн", en:"Mo" },
  'Se': { ru:"Вт", en:"Tu" },
  'Ch': { ru:"Ср", en:"We" },
  'Pa': { ru:"Чт", en:"Th" },
  'Ju': { ru:"Пт", en:"Fr" },
  'Sh': { ru:"Сб", en:"Sa" },
  'dona': { ru:"шт.", en:"pcs" },
  "bo'lak": { ru:"кусок", en:"slice" },
  'g': { ru:"г", en:"g" },
  '{0} kkal · {1}': { ru:"{0} ккал · {1}", en:"{0} kcal · {1}" },

  // ── sixth pass: keys an earlier substring dedupe wrongly skipped ──────
  'yoniq': { ru:"вкл.", en:"on" },

  "boshlang'ich yozuv": { ru:"первая запись", en:"first record" },
  'Qolgan {0} kkal ichida qoladi': { ru:"Останется в пределах {0} ккал", en:"Stays within your remaining {0} kcal" },
  '{0} — {1} kg': { ru:"{0} — {1} кг", en:"{0} — {1} kg" },
  "{0} · {1} kg o'chiriladi. Kunlik norma qayta hisoblanadi.": { ru:"{0} · {1} кг будет удалено. Дневная норма пересчитается.", en:"{0} · {1} kg will be deleted. Your daily target is recalculated." },

  'Qolgan {0} kkal uchun mos taom topilmadi.': { ru:"Для остатка {0} ккал подходящего блюда не нашлось.", en:"No dish fits your remaining {0} kcal." },
  'Xush kelibsiz, {0}': { ru:"Добро пожаловать, {0}", en:"Welcome, {0}" },
  "O'rtacha": { ru:"Средний", en:"Average" },
  '{0} ta retsept': { ru:"{0} рецепта", en:"{0} recipes" },
  'oxirgi {0} kunda': { ru:"за последние {0} дн.", en:"last {0} days" },
  'Yana {0} kg': { ru:"Ещё {0} кг", en:"{0} kg to go" },
  'Tanlash': { ru:"Выбрать", en:"Select" },
  'Qiyin': { ru:"Сложно", en:"Hard" },
  'Oson': { ru:"Легко", en:"Easy" },
  "Birlik faqat ko'rsatish uchun — baza doim kg, sm va kkal da saqlaydi.": { ru:"Единица только для отображения — база всегда хранит кг, см и ккал.", en:"The unit is display-only — the database always stores kg, cm and kcal." },
  'Home — yuklanmoqda': { ru:"Главная — загрузка", en:"Home — loading" },
  'Home — xato': { ru:"Главная — ошибка", en:"Home — error" },
  "Jurnal bo'sh": { ru:"Журнал пуст", en:"Journal empty" },
  "Oflayn chizig'i": { ru:"Полоса «офлайн»", en:"Offline bar" },
  'Vazn: bitta nuqta': { ru:"Вес: одна точка", en:"Weight: single point" },
  "o'chiq": { ru:"выкл.", en:"off" },
  'Streak +1': { ru:"Серия +1", en:"Streak +1" },
  'Qurilma: tungi rejim': { ru:"Устройство: ночной режим", en:"Device: night mode" },
  'Obuna admin bergan': { ru:"Подписку выдал админ", en:"Admin-granted subscription" },
  'Obuna: FREE': { ru:"Подписка: FREE", en:"Subscription: FREE" },
  'Obuna: PRO': { ru:"Подписка: PRO", en:"Subscription: PRO" },
  'Obuna: muddati tugagan': { ru:"Подписка: истекла", en:"Subscription: expired" },
  'sm': { ru:"см", en:"cm" },
  'kg': { ru:"кг", en:"kg" },
  '14-oktabr': { ru:"14 октября", en:"14 October" },

  // ── navigation / chrome ────────────────────────────────────────────────
  'Asosiy':            { ru:'Главная', en:'Home' },
  'Retseptlar':        { ru:'Рецепты', en:'Recipes' },
  'Statistika':        { ru:'Статистика', en:'Statistics' },
  'Profil':            { ru:'Профиль', en:'Profile' },
  'Orqaga':            { ru:'Назад', en:'Back' },
  'Yopish':            { ru:'Закрыть', en:'Close' },
  'Bekor qilish':      { ru:'Отмена', en:'Cancel' },
  'Saqlash':           { ru:'Сохранить', en:'Save' },
  'Tasdiqlash':        { ru:'Подтвердить', en:'Confirm' },
  'Davom etish':       { ru:'Продолжить', en:'Continue' },
  'Hozir emas':        { ru:'Не сейчас', en:'Not now' },
  'Yangilash':         { ru:'Обновить', en:'Refresh' },
  'Qayta urinish':     { ru:'Повторить', en:'Try again' },
  'Tahrirlash':        { ru:'Изменить', en:'Edit' },
  "O'chirish":         { ru:'Удалить', en:'Delete' },
  'Yuborish':          { ru:'Отправить', en:'Send' },
  'Yaxshi':            { ru:'Хорошо', en:'OK' },
  'Nusxalash':         { ru:'Копировать', en:'Copy' },
  'Hammasi':           { ru:'Все', en:'All' },
  'Qisqacha':          { ru:'Кратко', en:'Summary' },
  'Batafsil':          { ru:'Подробно', en:'Details' },

  // ── home ───────────────────────────────────────────────────────────────
  'Salom':             { ru:'Привет', en:'Hello' },
  'Bugungi ovqatlar':  { ru:'Приёмы пищи за сегодня', en:"Today's meals" },
  'Kunlik norma':      { ru:'Дневная норма', en:'Daily target' },
  'Qolgan':            { ru:'Осталось', en:'Remaining' },
  'Norma ichida':      { ru:'В пределах нормы', en:'Within target' },
  "Normadan oshgan":   { ru:'Превышение нормы', en:'Over target' },
  'Ovqat qoʻshish':    { ru:'Добавить приём пищи', en:'Add food' },
  "Yana qo'shish":     { ru:'Добавить ещё', en:'Add more' },
  'Nonushta':          { ru:'Завтрак', en:'Breakfast' },
  'Tushlik':           { ru:'Обед', en:'Lunch' },
  'Kechki':            { ru:'Ужин', en:'Dinner' },
  'Gazak':             { ru:'Перекус', en:'Snack' },
  'Oqsil':             { ru:'Белки', en:'Protein' },
  "Yog'":              { ru:'Жиры', en:'Fat' },
  'Uglevod':           { ru:'Углеводы', en:'Carbs' },
  'Kaloriya':          { ru:'Калории', en:'Calories' },
  'Porsiya':           { ru:'Порция', en:'Portion' },
  'Manba':             { ru:'Источник', en:'Source' },
  'Sana':              { ru:'Дата', en:'Date' },
  'Holat':             { ru:'Статус', en:'Status' },
  'Natija':            { ru:'Результат', en:'Result' },
  'Makro taqsimoti':   { ru:'Распределение БЖУ', en:'Macro split' },
  'Nutrition Score':   { ru:'Nutrition Score', en:'Nutrition Score' },
  'Qolgan kaloriyaga mos': { ru:'Под остаток калорий', en:'Fits your remaining calories' },

  // ── AI scan ────────────────────────────────────────────────────────────
  'Ovqatni rasmga oling': { ru:'Сфотографируйте еду', en:'Photograph your food' },
  'Rasmga olish':      { ru:'Сфотографировать', en:'Take photo' },
  'Boshqa rasm olish': { ru:'Сделать другое фото', en:'Take another photo' },
  'Qayta olish':       { ru:'Переснять', en:'Retake' },
  'Galereya':          { ru:'Галерея', en:'Gallery' },
  'Kamera':            { ru:'Камера', en:'Camera' },
  'Tahlil':            { ru:'Анализ', en:'Analysis' },
  'Tahlil qilish':     { ru:'Анализировать', en:'Analyse' },
  'Taom nomi':         { ru:'Название блюда', en:'Dish name' },
  'AI taxmini':        { ru:'Оценка ИИ', en:'AI estimate' },
  'AI tanimaydi':      { ru:'ИИ не распознаёт', en:'AI cannot recognise it' },
  'Taom aniqlanmoqda': { ru:'Определяем блюдо', en:'Identifying dish' },
  'Porsiya baholanmoqda': { ru:'Оцениваем порцию', en:'Estimating portion' },
  'Kaloriya hisoblanmoqda': { ru:'Считаем калории', en:'Calculating calories' },
  'Matn bilan tasvirlash': { ru:'Описать текстом', en:'Describe in text' },
  'Taom qidiruvi':     { ru:'Поиск блюда', en:'Dish search' },
  'Bir porsiyada':     { ru:'В одной порции', en:'Per portion' },
  "Jurnalga qo'shish": { ru:'Добавить в журнал', en:'Add to journal' },
  "Jurnalga qo'shildi": { ru:'Добавлено в журнал', en:'Added to journal' },
  "Tasdiqlash va qo'shish": { ru:'Подтвердить и добавить', en:'Confirm and add' },
  'Baribir tahrirlab kiritish': { ru:'Всё равно ввести вручную', en:'Enter manually anyway' },
  'Taomni aniq taniy olmadik': { ru:'Не удалось точно распознать блюдо', en:'We could not identify the dish' },

  // ── recipes ────────────────────────────────────────────────────────────
  'Masalliqlar':       { ru:'Ингредиенты', en:'Ingredients' },
  'Tayyorlash':        { ru:'Приготовление', en:'Preparation' },
  'Sevimli':           { ru:'Избранное', en:'Favourites' },
  'Barcha retseptlar': { ru:'Все рецепты', en:'All recipes' },
  'Past':              { ru:'Легко', en:'Easy' },
  "O'rta":             { ru:'Средне', en:'Medium' },
  'Yuqori':            { ru:'Сложно', en:'Hard' },

  // ── progress ───────────────────────────────────────────────────────────
  'Vazn grafigi':      { ru:'График веса', en:'Weight chart' },
  'Vazn tarixi':       { ru:'История веса', en:'Weight history' },
  'Kuzatilgan kunlar': { ru:'Отмеченные дни', en:'Tracked days' },
  'Vaznni qayd etish': { ru:'Записать вес', en:'Record weight' },
  "Vazn qo'shish":     { ru:'Добавить вес', en:'Add weight' },
  'Joriy vazn':        { ru:'Текущий вес', en:'Current weight' },
  'Maqsad vazn':       { ru:'Целевой вес', en:'Goal weight' },
  'Maqsadgacha':       { ru:'До цели', en:'To goal' },
  'Maqsad':            { ru:'Цель', en:'Goal' },
  'Vazn':              { ru:'Вес', en:'Weight' },
  "Haftalik o'zgarish": { ru:'Изменение за неделю', en:'Weekly change' },
  'Eng baland kun':    { ru:'Самый высокий день', en:'Highest day' },
  'Eng past kun':      { ru:'Самый низкий день', en:'Lowest day' },
  'Normaga mos kunlar': { ru:'Дни в пределах нормы', en:'Days within target' },
  'Normadan oshgan kunlar': { ru:'Дни с превышением', en:'Days over target' },
  'Yozuv bor kunlar':  { ru:'Дни с записями', en:'Days with entries' },
  'Streak hali boshlanmagan': { ru:'Серия ещё не началась', en:'No streak yet' },
  'Haftalik ovqatlanish hisoboti': { ru:'Недельный отчёт о питании', en:'Weekly nutrition report' },
  'Batafsil ovqatlanish statistikasi': { ru:'Подробная статистика питания', en:'Detailed nutrition statistics' },

  // ── profile / settings ─────────────────────────────────────────────────
  'Til':               { ru:'Язык', en:'Language' },
  'Mavzu':             { ru:'Тема', en:'Theme' },
  'Vazn birligi':      { ru:'Единица веса', en:'Weight unit' },
  "Bo'y birligi":      { ru:'Единица роста', en:'Height unit' },
  'Energiya birligi':  { ru:'Единица энергии', en:'Energy unit' },
  'Bildirishnomalar':  { ru:'Уведомления', en:'Notifications' },
  'Kunlik eslatma':    { ru:'Ежедневное напоминание', en:'Daily reminder' },
  "O'chirilgan":       { ru:'Выключено', en:'Off' },
  'Yoqilgan':          { ru:'Включено', en:'On' },
  'Tizim':             { ru:'Системная', en:'System' },
  "Yorug'":            { ru:'Светлая', en:'Light' },
  "Qorong'i":          { ru:'Тёмная', en:'Dark' },
  "Shaxsiy ma'lumot":  { ru:'Личные данные', en:'Personal information' },
  "Hisobni o'chirish": { ru:'Удалить аккаунт', en:'Delete account' },
  'Ism':               { ru:'Имя', en:'Name' },
  'Jins':              { ru:'Пол', en:'Sex' },
  'Yosh':              { ru:'Возраст', en:'Age' },
  "Bo'y":              { ru:'Рост', en:'Height' },
  'Erkak':             { ru:'Мужской', en:'Male' },
  'Ayol':              { ru:'Женский', en:'Female' },
  'Aytmayman':         { ru:'Не указывать', en:'Prefer not to say' },
  'Faollik darajasi':  { ru:'Уровень активности', en:'Activity level' },
  'Kam harakat':       { ru:'Малоподвижный', en:'Sedentary' },
  'Yengil faol':       { ru:'Слегка активный', en:'Lightly active' },
  "O'rtacha faol":     { ru:'Умеренно активный', en:'Moderately active' },
  'Juda faol':         { ru:'Очень активный', en:'Very active' },
  'Vazn tashlash':     { ru:'Снижение веса', en:'Lose weight' },
  'Vaznni saqlash':    { ru:'Поддержание веса', en:'Maintain weight' },
  "Ortiqcha vazndan xalos bo'ling": { ru:"Избавьтесь от лишнего веса", en:"Lose the extra weight" },
  'Hozirgi vazningizni ushlab turing': { ru:"Удерживайте текущий вес", en:"Hold your current weight" },
  "Sog'lom yo'l bilan vazn qo'shing": { ru:"Набирайте вес здоровым путём", en:"Put on weight healthily" },
  'Mushak massasini oshiring': { ru:"Увеличивайте мышечную массу", en:"Build muscle mass" },
  'Aytishni xohlamayman': { ru:"Не хочу указывать", en:"Prefer not to say" },
  "Asosan o'tirib ishlayman": { ru:"В основном сидячая работа", en:"Mostly desk-based" },
  'Haftada 1–3 kun harakat': { ru:"1–3 дня активности в неделю", en:"1–3 active days a week" },
  'Haftada 3–5 kun mashq': { ru:"3–5 тренировок в неделю", en:"3–5 workouts a week" },
  "Haftada 6–7 kun mashq yoki og'ir jismoniy ish": { ru:"6–7 тренировок в неделю или тяжёлый физический труд", en:"6–7 workouts a week or heavy physical work" },
  'Vazn oshirish':     { ru:'Набор веса', en:'Gain weight' },
  // Legacy wording, kept so a profile saved under the old label still translates.
  'Vazn ortdirish':    { ru:'Набор веса', en:'Gain weight' },
  "Mushak yig'ish":    { ru:'Набор мышц', en:'Build muscle' },
  'Ovqat afzalliklari va odatlari': { ru:'Предпочтения и привычки в еде', en:'Food preferences and habits' },
  'Odatlar':           { ru:'Привычки', en:'Habits' },
  'Yordam':            { ru:'Поддержка', en:'Support' },
  'Xabar':             { ru:'Сообщение', en:'Message' },
  'Savolingiz bormi?': { ru:'Есть вопрос?', en:'Have a question?' },
  'Admin javob berdi': { ru:'Администратор ответил', en:'Admin replied' },
  'Admin':             { ru:'Администратор', en:'Admin' },
  'Siz':               { ru:'Вы', en:'You' },

  // ── PRO / paywall ──────────────────────────────────────────────────────
  'PRO':               { ru:'PRO', en:'PRO' },
  'PRO haqida':        { ru:'О PRO', en:'About PRO' },
  'PRO ni ochish':     { ru:'Открыть PRO', en:'Unlock PRO' },
  'Obuna':             { ru:'Подписка', en:'Subscription' },
  'Obunani boshqarish': { ru:'Управление подпиской', en:'Manage subscription' },
  'Obunani bekor qilish': { ru:'Отменить подписку', en:'Cancel subscription' },
  'Bepul reja':        { ru:'Бесплатный план', en:'Free plan' },
  'Tarif':             { ru:'Тариф', en:'Plan' },
  'Oylik':             { ru:'Месячный', en:'Monthly' },
  'Tugaydi':           { ru:'Истекает', en:'Expires' },
  'Boshlangan':        { ru:'Начата', en:'Started' },
  'Afzalliklar':       { ru:'Преимущества', en:'Benefits' },
  'Skan limiti tugagan': { ru:'Лимит сканирований исчерпан', en:'Scan limit reached' },
  'Bu retsept PRO obunada': { ru:'Этот рецепт доступен в PRO', en:'This recipe is in PRO' },
  'Barcha retseptlar ochiladi': { ru:'Откроются все рецепты', en:'All recipes unlocked' },
  'Foydalanish shartlari': { ru:'Условия использования', en:'Terms of use' },
  'Maxfiylik siyosati': { ru:'Политика конфиденциальности', en:'Privacy policy' },
  'Click':             { ru:'Click', en:'Click' },
  'Payme':             { ru:'Payme', en:'Payme' },
  'Telegram Stars':    { ru:'Telegram Stars', en:'Telegram Stars' },

  // ── empty / error / validation states ──────────────────────────────────
  "Bugun hali hech narsa qo'shilmagan": { ru:'Сегодня ещё ничего не добавлено', en:'Nothing added today yet' },
  "Birinchi ovqatni qo'shing": { ru:'Добавьте первый приём пищи', en:'Add your first meal' },
  "Hozircha retsept yo'q": { ru:'Пока нет рецептов', en:'No recipes yet' },
  "Sevimli retsept yo'q": { ru:'Нет избранных рецептов', en:'No favourite recipes' },
  "Bu kunda yozuv yo'q": { ru:'В этот день нет записей', en:'No entries for this day' },
  'Saqlanmadi. Qayta urinish': { ru:'Не сохранено. Повторить', en:'Not saved. Try again' },
  'Saqlash xatosi':    { ru:'Ошибка сохранения', en:'Save error' },
  "Internet yo'q":     { ru:'Нет интернета', en:'No internet' },
  "Profilni yuklab bo'lmadi": { ru:'Не удалось загрузить профиль', en:'Could not load profile' },
  'Hisobot serveriga ulanolmadik.': { ru:'Не удалось подключиться к серверу отчётов.', en:'Could not reach the report server.' },
  'Statistika uchun kamida ikki kunlik yozuv kerak.': { ru:'Для статистики нужны записи минимум за два дня.', en:'Statistics need at least two days of entries.' },
  'Hisobot uchun bu haftada kamida uch kunlik yozuv kerak.': { ru:'Для отчёта нужны записи минимум за три дня этой недели.', en:'The report needs at least three days of entries this week.' },
  'Biroz choʻzilmoqda, kutamiz…': { ru:'Немного затягивается, ждём…', en:'Taking a little longer, hold on…' },
  'Ovqatingiz tahlil qilinmoqda…': { ru:'Анализируем вашу еду…', en:'Analysing your food…' },

  // ── fifth pass: profile composites and stored lowercase values ─────────
  'Ilovada {0} kun': { ru:"{0} дн. в приложении", en:"{0} days in the app" },
  "o'chirilgan": { ru:"выключено", en:"off" },
  '{0} kkal': { ru:"{0} ккал", en:"{0} kcal" },
  '{0} kg': { ru:"{0} кг", en:"{0} kg" },
  '{0} sm': { ru:"{0} см", en:"{0} cm" },
  'PRO · {0} gacha faol': { ru:"PRO · активна до {0}", en:"PRO · active until {0}" },

  // ── states panel (kit chrome) — translated whole, not half ────────────
  'Holatlar': { ru:"Состояния", en:"States" },
  'Ekranlar': { ru:"Экраны", en:"Screens" },
  "Prototip holatlarini shu yerdan almashtiring — kitning o'zida bu panel yo'q. Obuna holati bitta: FREE / PRO / muddati tugagan. To'qqizta PRO imkoniyati shu bittasiga bog'langan.": { ru:"Переключайте состояния прототипа здесь — в самом ките этой панели нет. Статус подписки один: FREE / PRO / истёкший. Девять возможностей PRO привязаны к нему.", en:"Switch prototype states here — the kit itself has no such panel. Subscription status is one value: FREE / PRO / expired. All nine PRO features hang off it." },

  // ── fourth pass: Home/AI/Profile strings + units ─────────────────────
  'kkal': { ru:"ккал", en:"kcal" },
  'Oqsil ulushi': { ru:"Доля белков", en:"Protein share" },
  "Yog' ulushi": { ru:"Доля жиров", en:"Fat share" },
  'Uglevod ulushi': { ru:"Доля углеводов", en:"Carb share" },
  '{0} dan': { ru:"из {0}", en:"of {0}" },
  'qoldi: {0} kkal': { ru:"осталось: {0} ккал", en:"{0} kcal left" },
  "Eng past ko'rsatkich — {0}.": { ru:"Самый низкий показатель — {0}.", en:"Lowest score — {0}." },
  "Ball bugungi yozuvlardan hisoblanadi — birinchi ovqatni qo'shsangiz chiqadi.": { ru:"Балл считается по записям за сегодня — появится после первого приёма пищи.", en:"The score is computed from today’s entries — it appears once you add your first meal." },
  "Bu yozuvni o'chiramizmi? Doira shu qiymatga kamayadi.": { ru:"Удалить эту запись? Круг уменьшится на это значение.", en:"Delete this entry? The ring drops by this amount." },
  '{0} · {1} kkal · qolgan {2} kkal ichida': { ru:"{0} · {1} ккал · в пределах остатка {2} ккал", en:"{0} · {1} kcal · within your remaining {2} kcal" },
  '{0} dona': { ru:"{0} шт.", en:"{0} pcs" },
  "{0} bo'lak": { ru:"{0} кусок", en:"{0} slice" },
  '{0} g': { ru:"{0} г", en:"{0} g" },
  "Taomni tepadan, to'liq ko'rinishda oling": { ru:"Сфотографируйте блюдо сверху, полностью", en:"Photograph the dish from above, fully in frame" },
  "0 dan katta bo'lishi kerak": { ru:"Должно быть больше 0", en:"Must be greater than 0" },
  "30–300 kg oralig'ida bo'lsin": { ru:"Должно быть в пределах 30–300 кг", en:"Must be between 30 and 300 kg" },
  "Oldingi o'lchovdan {0} kg farq qilyapti. To'g'rimi?": { ru:"Отличается от прошлого измерения на {0} кг. Верно?", en:"That differs from your last measurement by {0} kg. Is that right?" },
  "Kunlik normangiz {0} dan {1} ga o'zgaradi. Saqlansinmi?": { ru:"Ваша дневная норма изменится с {0} на {1}. Сохранить?", en:"Your daily target changes from {0} to {1}. Save?" },
  "O'tgan kunlar qayta hisoblanmaydi — har kun o'sha kundagi norma bilan qoladi.": { ru:"Прошедшие дни не пересчитываются — каждый день остаётся со своей нормой.", en:"Past days are not recomputed — each day keeps the target it had." },
  'Administrator tomonidan berilgan': { ru:"Выдана администратором", en:"Granted by an admin" },
  '{0} tadan {1} ta skan qoldi': { ru:"Осталось {1} из {0} сканирований", en:"{1} of {0} scans left" },
  "Qo'lda qo'shish": { ru:"Добавить вручную", en:"Add manually" },
  'Taom bazasidan tanlang — cheklovsiz': { ru:"Выберите из базы блюд — без ограничений", en:"Pick from the dish database — no limit" },
  'Tayyor rasmni tanlang': { ru:"Выберите готовое фото", en:"Choose an existing photo" },
  'Vazn tashlashni tanlagansiz, lekin maqsad vazn joriysidan katta': { ru:"Вы выбрали снижение веса, но целевой вес больше текущего", en:"You chose to lose weight, but the goal weight is above your current weight" },
  '{0} — bugun': { ru:"{0} — сегодня", en:"{0} — today" },

  // ── third pass: composites (t1) and statistics labels ───────────────────
  'kkal / kun': { ru:"ккал / день", en:"kcal / day" },
  "{0} o'tgan haftaga nisbatan": { ru:"{0} по сравнению с прошлой неделей", en:"{0} vs last week" },
  "O'rtachalar faqat yozuv bor kunlardan olinadi — bo'sh kun nol deb hisoblanmaydi.": { ru:"Средние считаются только по дням с записями — пустой день не считается нулём.", en:"Averages use only days with entries — an empty day is not counted as zero." },
  "{0} kg o'chiriladi. Kunlik norma qayta hisoblanadi.": { ru:"{0} кг будет удалено. Дневная норма пересчитается.", en:"{0} kg will be deleted. Your daily target is recalculated." },
  "Oxirgi 30 kun. Kuzatilgan kunni bosing — o'sha kundagi jurnal ochiladi.": { ru:"Последние 30 дней. Нажмите на отмеченный день — откроется журнал за него.", en:"The last 30 days. Tap a tracked day to open its journal." },
  "O'rtacha oqsil": { ru:"Средний белок", en:"Average protein" },
  "O'rtacha Nutrition Score": { ru:"Средний Nutrition Score", en:"Average Nutrition Score" },
  "O'rtacha kaloriya, makro taqsimoti va normaga mos kunlar.": { ru:"Средние калории, распределение БЖУ и дни в пределах нормы.", en:"Average calories, macro split and days within target." },
  'Maqsad: {0} kg': { ru:"Цель: {0} кг", en:"Goal: {0} kg" },
  'Maqsadgacha: {0} kg': { ru:"До цели: {0} кг", en:"To goal: {0} kg" },
  '{0} kg qoldi': { ru:"осталось {0} кг", en:"{0} kg to go" },
  '{0} kunlik streak': { ru:"серия {0} дн.", en:"{0}-day streak" },
  'Rekord: {0} kun': { ru:"Рекорд: {0} дн.", en:"Record: {0} days" },
  "Yo'lning {0}% i bosib o'tildi": { ru:"Пройдено {0}% пути", en:"{0}% of the way there" },
  'kkal — kunlik o‘rtacha': { ru:"ккал — в среднем в день", en:"kcal — daily average" },
  '{0} / {1} kun': { ru:"{0} / {1} дн.", en:"{0} / {1} days" },
  '{0} kun': { ru:"{0} дн.", en:"{0} days" },
  'maqsad {0} kg': { ru:"цель {0} кг", en:"goal {0} kg" },
  '{0} kg / hafta': { ru:"{0} кг / нед.", en:"{0} kg / week" },
  // ── second pass: sentences and labels found by the source audit ──────────
  'Asosiy maqsad': { ru:"Основная цель", en:"Main goal" },
  'Ovqat turi': { ru:"Тип приёма пищи", en:"Meal type" },
  'Jurnal': { ru:"Журнал", en:"Journal" },
  'Natijalar': { ru:"Результаты", en:"Results" },
  'Faol': { ru:"Активна", en:"Active" },
  'Chop etilgan': { ru:"Опубликован", en:"Published" },
  'Yozuvni tahrirlash': { ru:"Изменить запись", en:"Edit entry" },
  'Bugungi vaznni yangilash': { ru:"Обновить вес за сегодня", en:"Update today’s weight" },
  'Barcha rasmlar': { ru:"Все фотографии", en:"All photos" },
  'Butun ovqat jurnali': { ru:"Весь журнал питания", en:"The whole food journal" },
  'Faqat streak': { ru:"Только серия", en:"Just the streak" },
  'Norma o‘zgaradi': { ru:"Норма изменится", en:"Your target will change" },
  'Oldingi o‘lchovdan': { ru:"С прошлого измерения", en:"Since last measurement" },
  'Sevimlilarga qo‘shish': { ru:"Добавить в избранное", en:"Add to favourites" },
  'Home‘ga qaytish': { ru:"Вернуться на главную", en:"Back to Home" },
  'Progress bo‘limida vazn qo‘shish': { ru:"Добавить вес в разделе «Статистика»", en:"Add weight in Statistics" },
  'Quyidagilar butunlay o‘chadi:': { ru:"Будет полностью удалено:", en:"The following is permanently deleted:" },
  'Administrator tomonidan berilgan obuna — to‘lov yozuvi yo‘q.': { ru:"Подписка выдана администратором — записи об оплате нет.", en:"Subscription granted by an admin — no payment record." },
  'Birlik faqat ko‘rsatish uchun — baza doim kg, sm va kkal da saqlaydi.': { ru:"Единица только для отображения — база всегда хранит кг, см и ккал.", en:"The unit is display-only — the database always stores kg, cm and kcal." },
  'Bu javoblar hozircha taom takliflari uchun saqlanadi.': { ru:"Пока эти ответы сохраняются для подбора блюд.", en:"For now these answers are kept for meal suggestions." },
  'Joriy vazn bu yerda o‘zgartirilmaydi — u tarix yozuvi.': { ru:"Текущий вес здесь не меняется — это запись истории.", en:"Current weight is not edited here — it is a history record." },
  'To‘liq retseptni ko‘rish uchun PRO obuna kerak.': { ru:"Для полного рецепта нужна подписка PRO.", en:"A PRO subscription is needed to see the full recipe." },
  'Yozib qoldiring — admin shu yerda javob beradi.': { ru:"Напишите — администратор ответит здесь.", en:"Write to us — an admin replies here." },
  'Taomni matn bilan tasvirlab bering yoki rasmga oling.': { ru:"Опишите блюдо текстом или сфотографируйте его.", en:"Describe the dish in text, or photograph it." },
  'PRO obunangiz tugaydi, pul qaytarilmaydi.': { ru:"Ваша подписка PRO закончится, деньги не возвращаются.", en:"Your PRO subscription ends; payments are not refunded." },
};

/* Current language. `settings.til` stores the LABEL the row displays, so the label is
   mapped back to a code — the setting already existed and already persisted, and
   rewriting its stored shape would have discarded whatever users had chosen. */
let TIL = 'uz';

const tilKodi = (labelOrCode) => {
  const hit = TILLAR.find((l) => l.label === labelOrCode || l.code === labelOrCode);
  return hit ? hit.code : 'uz';
};

const tilniOrnat = (labelOrCode) => { TIL = tilKodi(labelOrCode); return TIL; };

/* Translate. Uzbek returns the key itself, so an entry missing from the table falls back
   to correct Uzbek rather than to a key name. */
/* Apostrophe-insensitive index. Uzbek text in this project is written with both the
   straight (') and the typographic (’) apostrophe — the theme option list stores
   "Qorong’i" while the dictionary key was "Qorong'i", so the lookup silently missed and
   that one row stayed Uzbek in every language. Normalising both sides means a key and a
   call site can disagree about the glyph without the translation disappearing. */
const APOS = /[\u2018\u2019\u02bc\u02bb`]/g;
const nrm = (s) => String(s).replace(APOS, "'");

const SOZLAR_NRM = (() => {
  const map = {};
  for (const k in SOZLAR) map[nrm(k)] = SOZLAR[k];
  return map;
})();

function t(uz) {
  if (TIL === 'uz') return uz;
  const row = SOZLAR[uz] || SOZLAR_NRM[nrm(uz)];
  if (!row) return uz;
  return row[TIL] || uz;
}

/* Portion strings are STORED language-neutral ("350 g", "1 dona", "2 bo'lak") because
   they are data written into the journal, and baking a translation into them at write
   time would freeze an entry in whatever language it was added. They are localised HERE,
   at render, by splitting the number from the unit word and translating only the word.
   Every screen and component that displays a portion calls this, which is why units
   stopped being a per-call-site whack-a-mole. */
/* Russian plurals for the one unit that needs them. «шт.» and «г» are invariant
   abbreviations and «кусок» is a full word, so only it declines. The rule is Russian's
   standard one-few-many by last digits. */
/* English needs the same treatment for the same word — «pcs» and «g» are invariant. */
const EN_PLURAL = { "bo'lak": ['slice', 'slices'] };

const RU_PLURAL = { "bo'lak": ['кусок', 'куска', 'кусков'] };

function ruForm(forms, n) {
  const num = Math.abs(Math.round(Number(n) || 0));
  const d10 = num % 10, d100 = num % 100;
  if (d10 === 1 && d100 !== 11) return forms[0];
  if (d10 >= 2 && d10 <= 4 && (d100 < 10 || d100 >= 20)) return forms[1];
  return forms[2];
}

function tPorsiya(s) {
  if (s == null) return s;
  const m = String(s).match(/^\s*([\d.,]+)\s*(.*)$/);
  if (!m) return t(String(s));
  const qty = m[1], unit = m[2].trim();
  if (!unit) return qty;
  const n = Number(qty.replace(',', '.')) || 0;
  // Normalised, for the same reason `t` is: a portion stored with a typographic
  // apostrophe ("2 bo’lak") must still find its plural forms.
  const u = nrm(unit);
  if (TIL === 'ru' && RU_PLURAL[u]) return qty + ' ' + ruForm(RU_PLURAL[u], n);
  if (TIL === 'en' && EN_PLURAL[u]) return qty + ' ' + EN_PLURAL[u][n === 1 ? 0 : 1];
  return qty + ' ' + t(unit);
}

/* Interpolation for the few strings carrying a number or name: t1('Xush kelibsiz, {0}', 'Aziz').
   The placeholder travels with the translation, so word order can differ per language. */
function t1(uz, ...args) {
  return String(t(uz)).replace(/\{(\d)\}/g, (m, i) => (args[i] != null ? args[i] : m));
}

if (typeof window !== 'undefined') Object.assign(window, { TILLAR, SOZLAR, t, t1, tPorsiya, tilniOrnat, tilKodi, getTil: () => TIL });
