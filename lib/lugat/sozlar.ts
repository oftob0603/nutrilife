// Interfeys lug'ati — butun ilova uchun bitta jadval (qolip: prototip/ui_kits/shared/i18n.js).
//
// Kalit — o'zbekcha matnning o'zi: ekranda `t("Bugungi ovqatlar")` yoziladi. O'zbekcha
// jadvalda saqlanmaydi — u kalitning o'zi. Kalitlar TypeScript turi (`Kalit`) bilan
// tekshiriladi: lug'atda yo'q matn yozilsa `tsc` xato beradi, tarjimasiz matn o'tib ketmaydi.
//
// Ma'lumot tarjima qilinmaydi: taom nomlari va foydalanuvchi yozgan matn bazadan qanday
// kelsa shunday ko'rinadi. Ovqat turi ("Nonushta") va porsiya birligi ("2 bo'lak") bazada
// o'zbekcha saqlanadi va faqat ko'rsatish paytida tarjima qilinadi.
//
// `{0}`, `{1}` — o'rniga qiymat qo'yiladigan joylar; so'z tartibi har tilda o'zicha.
// Admin paneli bu lug'atga kirmaydi — u faqat o'zbekcha ichki vosita.

type Tarjima = { ru: string; en: string };

export const SOZLAR = {
  // ── Umumiy tugmalar va navigatsiya ─────────────────────────────────────────
  "Orqaga": { ru: "Назад", en: "Back" },
  "Yopish": { ru: "Закрыть", en: "Close" },
  "Bekor qilish": { ru: "Отмена", en: "Cancel" },
  "Saqlash": { ru: "Сохранить", en: "Save" },
  "Davom etish": { ru: "Продолжить", en: "Continue" },
  "Obuna bo'lish": { ru: "Оформить подписку", en: "Subscribe" },
  "Qayta urinish": { ru: "Повторить", en: "Try again" },
  "O'chirish": { ru: "Удалить", en: "Delete" },
  "Nusxalash": { ru: "Копировать", en: "Copy" },
  "Hammasi": { ru: "Все", en: "All" },
  "Qisqacha": { ru: "Кратко", en: "Summary" },
  "Asosiy": { ru: "Главная", en: "Home" },
  "Retseptlar": { ru: "Рецепты", en: "Recipes" },
  "Statistika": { ru: "Статистика", en: "Statistics" },
  "Profil": { ru: "Профиль", en: "Profile" },
  "Asosiy navigatsiya": { ru: "Основная навигация", en: "Main navigation" },
  "Asosiyga qaytish": { ru: "Вернуться на главную", en: "Back to Home" },

  // ── Birliklar va makrolar ──────────────────────────────────────────────────
  "kkal": { ru: "ккал", en: "kcal" },
  "g": { ru: "г", en: "g" },
  "ml": { ru: "мл", en: "ml" },
  "kg": { ru: "кг", en: "kg" },
  "sm": { ru: "см", en: "cm" },
  "dona": { ru: "шт.", en: "pcs" },
  "bo'lak": { ru: "кусок", en: "slice" },
  "six": { ru: "шампур", en: "skewer" },
  "porsiya": { ru: "порция", en: "serving" },
  "kg · sm": { ru: "кг · см", en: "kg · cm" },
  "{0} kkal": { ru: "{0} ккал", en: "{0} kcal" },
  "/ {0} kkal": { ru: "/ {0} ккал", en: "/ {0} kcal" },
  "{0} g": { ru: "{0} г", en: "{0} g" },
  "{0} / {1} g": { ru: "{0} / {1} г", en: "{0} / {1} g" },
  "{0} · {1} kkal": { ru: "{0} · {1} ккал", en: "{0} · {1} kcal" },
  "kkal · {0}": { ru: "ккал · {0}", en: "kcal · {0}" },
  "Oqsil": { ru: "Белки", en: "Protein" },
  "Yog'": { ru: "Жиры", en: "Fat" },
  "Uglevod": { ru: "Углеводы", en: "Carbs" },
  "Kaloriya": { ru: "Калории", en: "Calories" },
  "Porsiya": { ru: "Порция", en: "Portion" },
  "O {0} g · Y {1} g · U {2} g": { ru: "Б {0} г · Ж {1} г · У {2} г", en: "P {0} g · F {1} g · C {2} g" },
  "Oqsil {0} g, yog' {1} g, uglevod {2} g": {
    ru: "Белки {0} г, жиры {1} г, углеводы {2} г",
    en: "Protein {0} g, fat {1} g, carbs {2} g",
  },

  // ── Ovqat turlari (bazada o'zbekcha saqlanadi) ─────────────────────────────
  "Ovqat turi": { ru: "Тип приёма пищи", en: "Meal type" },
  "Nonushta": { ru: "Завтрак", en: "Breakfast" },
  "Tushlik": { ru: "Обед", en: "Lunch" },
  "Kechki": { ru: "Ужин", en: "Dinner" },
  "Gazak": { ru: "Перекус", en: "Snack" },

  // ── Kirish pardasi ─────────────────────────────────────────────────────────
  "Kirilmoqda": { ru: "Выполняется вход", en: "Signing in" },
  "Kirib bo'lmadi": { ru: "Не удалось войти", en: "Could not sign in" },
  "Internetni tekshirib, qayta urinib ko'ring.": {
    ru: "Проверьте интернет и попробуйте ещё раз.",
    en: "Check your connection and try again.",
  },
  "Ilovani qayta oching": { ru: "Откройте приложение заново", en: "Reopen the app" },
  "Kirish muddati tugadi. Ilovani yopib, Telegram'dan qaytadan oching.": {
    ru: "Срок входа истёк. Закройте приложение и откройте его снова из Telegram.",
    en: "Your session has expired. Close the app and open it again from Telegram.",
  },
  "Ilovani Telegram orqali oching": { ru: "Откройте приложение через Telegram", en: "Open the app from Telegram" },
  "NutriLifer faqat Telegram ichida ishlaydi. Botni ochib, ilovani o'sha yerdan ishga tushiring.": {
    ru: "NutriLifer работает только внутри Telegram. Откройте бота и запустите приложение оттуда.",
    en: "NutriLifer only works inside Telegram. Open the bot and launch the app from there.",
  },

  // ── Home (E1) ──────────────────────────────────────────────────────────────
  "Xush kelibsiz, {0}": { ru: "Добро пожаловать, {0}", en: "Welcome, {0}" },
  "Xush kelibsiz": { ru: "Добро пожаловать", en: "Welcome" },
  "Bugun": { ru: "Сегодня", en: "Today" },
  "Kecha": { ru: "Вчера", en: "Yesterday" },
  "O'tgan kun": { ru: "Прошедший день", en: "Past day" },
  "Hafta kunlari": { ru: "Дни недели", en: "Days of the week" },
  "{0}, {1} (bugun)": { ru: "{0}, {1} (сегодня)", en: "{0}, {1} (today)" },
  "{0} dan": { ru: "из {0}", en: "of {0}" },
  "qoldi: {0} kkal": { ru: "осталось: {0} ккал", en: "{0} kcal left" },
  "Normadan oshdi — {0} kkal": { ru: "Норма превышена — {0} ккал", en: "Over target — {0} kcal" },
  "Bugungi ovqatlar": { ru: "Приёмы пищи за сегодня", en: "Today's meals" },
  "Shu kungi ovqatlar": { ru: "Приёмы пищи за этот день", en: "Meals that day" },
  "Ma'lumotni yuklab bo'lmadi": { ru: "Не удалось загрузить данные", en: "Could not load the data" },
  "Hisobot serveriga ulanolmadik. Internetni tekshirib, qayta urinib ko'ring.": {
    ru: "Не удалось подключиться к серверу отчётов. Проверьте интернет и попробуйте ещё раз.",
    en: "Could not reach the report server. Check your connection and try again.",
  },
  "Bugun hali hech narsa qo'shilmadi": { ru: "Сегодня пока ничего не добавлено", en: "Nothing added today yet" },
  "Birinchi ovqatni qo'shsangiz, doira to'lishni boshlaydi.": {
    ru: "Как только добавите первый приём пищи, круг начнёт заполняться.",
    en: "Once you add your first meal, the ring starts filling.",
  },
  "Birinchi ovqatni qo'shish": { ru: "Добавить первый приём пищи", en: "Add your first meal" },
  "Bu kunda yozuv yo'q": { ru: "В этот день нет записей", en: "No entries for this day" },
  "Bu kuni jurnalga ovqat qo'shilmagan.": {
    ru: "В этот день в журнал ничего не добавлено.",
    en: "No food was added to the journal that day.",
  },

  // ── Ovqat qo'shish paneli (E2) ─────────────────────────────────────────────
  "Ovqat qo'shish": { ru: "Добавить приём пищи", en: "Add food" },
  "Kamera": { ru: "Камера", en: "Camera" },
  "Rasmni ko'rib chiqing": { ru: "Проверьте фото", en: "Review the photo" },
  "Ovqatni rasmga oling": { ru: "Сфотографируйте еду", en: "Photograph your food" },
  "Galereya": { ru: "Галерея", en: "Gallery" },
  "Tayyor rasmni tanlang": { ru: "Выберите готовое фото", en: "Choose an existing photo" },
  "Rasm yuklanmoqda…": { ru: "Фото загружается…", en: "Uploading photo…" },
  "Qo'lda qo'shish": { ru: "Добавить вручную", en: "Add manually" },
  "Nima yeganingizni yozing — AI hisoblaydi": {
    ru: "Напишите, что вы ели — ИИ посчитает",
    en: "Write what you ate — the AI will count it",
  },
  "Taom bazasidan tanlang — cheklovsiz": {
    ru: "Выберите из базы блюд — без ограничений",
    en: "Pick from the dish database — unlimited",
  },
  "{0} tadan {1} ta skan qoldi": { ru: "Осталось сканирований: {1} из {0}", en: "{1} of {0} scans left" },
  "Bepul skanlar tugadi.": {
    ru: "Бесплатные сканирования закончились.",
    en: "Your free scans are used up.",
  },
  "Bugungi {0} ta skan ishlatildi. Ertaga yangilanadi.": {
    ru: "Сегодняшние сканирования ({0}) использованы. Завтра лимит обновится.",
    en: "Today's {0} scans are used up. They reset tomorrow.",
  },
  "Yuklanmadi": { ru: "Не загружено", en: "Upload failed" },

  // ── Kamera (E3) va rasm yuklash ────────────────────────────────────────────
  "Olingan rasm": { ru: "Сделанное фото", en: "Captured photo" },
  "Taomni tepadan, to'liq ko'rinishda oling": {
    ru: "Сфотографируйте блюдо сверху, полностью",
    en: "Photograph the dish from above, fully in frame",
  },
  "Kamerani ocholmadik": { ru: "Не удалось открыть камеру", en: "Could not open the camera" },
  "Brauzer sozlamalarida kameraga ruxsat bering yoki tayyor rasmni tanlang.": {
    ru: "Разрешите доступ к камере в настройках браузера или выберите готовое фото.",
    en: "Allow camera access in your browser settings, or choose an existing photo.",
  },
  "Galereyadan tanlash": { ru: "Выбрать из галереи", en: "Choose from gallery" },
  "Rasmga olish": { ru: "Сфотографировать", en: "Take photo" },
  "Qayta olish": { ru: "Переснять", en: "Retake" },
  "Yuklanmoqda…": { ru: "Загрузка…", en: "Uploading…" },
  "Tahlil qilish": { ru: "Анализировать", en: "Analyse" },
  "Bu rasmni o'qib bo'lmadi. Boshqa rasm tanlang": {
    ru: "Не удалось прочитать это фото. Выберите другое",
    en: "This photo could not be read. Choose another one",
  },
  "Rasm juda katta. Boshqa rasm tanlang": {
    ru: "Фото слишком большое. Выберите другое",
    en: "The photo is too large. Choose another one",
  },
  "Internet yo'q. Ulanishni tekshiring": {
    ru: "Нет интернета. Проверьте подключение",
    en: "No internet. Check your connection",
  },
  "Internet yo'q — oxirgi ma'lumot ko'rsatilmoqda": {
    ru: "Нет интернета — показаны последние данные",
    en: "You're offline — showing the last loaded data",
  },
  "Yuklanmadi. Internetni tekshirib, qayta urinib ko'ring": {
    ru: "Не загружено. Проверьте интернет и попробуйте ещё раз",
    en: "Upload failed. Check your connection and try again",
  },
  "Yuklanmadi. Qayta urinib ko'ring": { ru: "Не загружено. Попробуйте ещё раз", en: "Upload failed. Try again" },
  "Rasm 4 MB dan katta": { ru: "Фото больше 4 МБ", en: "The photo is larger than 4 MB" },
  "Faqat rasm yuklash mumkin: JPEG, PNG yoki WebP": {
    ru: "Можно загружать только изображения: JPEG, PNG или WebP",
    en: "Only images can be uploaded: JPEG, PNG or WebP",
  },
  "Rasmni saqlab bo'lmadi. Qayta urinib ko'ring": {
    ru: "Не удалось сохранить фото. Попробуйте ещё раз",
    en: "Could not save the photo. Try again",
  },

  // ── Taom sahifasi va porsiya (E5) ─────────────────────────────────────────
  "Baza hozircha bo'sh.": { ru: "База пока пуста.", en: "The database is empty for now." },
  "Progress bo'limida vazn qo'shish": {
    ru: "Добавить вес в разделе «Статистика»",
    en: "Add weight in Statistics",
  },
  "Boshqa nom bilan qidirib ko'ring yoki taomni AI yordamida qo'shing.": {
    ru: "Попробуйте другое название или добавьте блюдо с помощью ИИ.",
    en: "Try another name, or add the dish with AI.",
  },
  "Matn bilan tasvirlash": { ru: "Описать текстом", en: "Describe in text" },
  "Boshqa miqdor": { ru: "Другое количество", en: "Other amount" },
  "Boshqa": { ru: "Другое", en: "Other" },
  "Jurnalga qo'shish": { ru: "Добавить в журнал", en: "Add to journal" },
  "Saqlanmadi. Qayta urinib ko'ring": { ru: "Не сохранено. Попробуйте ещё раз", en: "Not saved. Try again" },
  "Nima yedingiz? Taom nomi va og'irligini (grammda) yozing.": {
    ru: "Что вы ели? Напишите название блюда и вес (в граммах).",
    en: "What did you eat? Write the dish name and its weight (in grams).",
  },
  "Masalan: mastava 400 g va yarimta non (100 g)": {
    ru: "Например: мастава 400 г и пол-лепёшки (100 г)",
    en: "For example: mastava 400 g and half a flatbread (100 g)",
  },

  // ── AI tahlil (E6) va tasdiqlash (E7) ──────────────────────────────────────
  "AI taxmini": { ru: "Оценка ИИ", en: "AI estimate" },
  "Taom aniqlanmoqda": { ru: "Определяем блюдо", en: "Identifying dish" },
  "Porsiya baholanmoqda": { ru: "Оцениваем порцию", en: "Estimating portion" },
  "Kaloriya hisoblanmoqda": { ru: "Считаем калории", en: "Calculating calories" },
  "Ovqatingiz tahlil qilinmoqda…": { ru: "Анализируем вашу еду…", en: "Analysing your food…" },
  "Biroz cho'zilmoqda, kutamiz…": { ru: "Немного затягивается, ждём…", en: "Taking a little longer, hold on…" },
  "Yuklangan ovqat rasmi": { ru: "Загруженное фото еды", en: "Uploaded food photo" },
  "AI javob bermadi. Qayta urinib ko'ring yoki taomni qo'lda qo'shing.": {
    ru: "ИИ не ответил. Попробуйте ещё раз или добавьте блюдо вручную.",
    en: "The AI did not respond. Try again, or add the dish manually.",
  },
  "Internet bilan aloqa yo'q": { ru: "Нет связи с интернетом", en: "No internet connection" },
  "Bugungi AI skanlar tugadi. Ertaga yana urinib ko'ring": {
    ru: "ИИ-сканирования на сегодня закончились. Попробуйте завтра",
    en: "Today's AI scans are used up. Try again tomorrow",
  },
  // "Bepul skanlar tugadi" — W1 bo'limida (bitta kalit, ikki joyda ishlatiladi).
  "Bugungi skanlar ishlatildi. Ertaga yangilanadi": {
    ru: "Сканирования на сегодня использованы. Завтра лимит обновится",
    en: "Today's scans are used up. They reset tomorrow",
  },
  "Bugun taom bir necha marta tanilmadi. Ertaga yana urinib ko'ring yoki taomni qo'lda qo'shing": {
    ru: "Сегодня блюдо не удалось распознать несколько раз. Попробуйте завтра или добавьте блюдо вручную",
    en: "The dish could not be recognised several times today. Try again tomorrow or add it manually",
  },
  "Natija": { ru: "Результат", en: "Result" },
  "AI porsiyani taxmin qildi. Og'irlikni aniq kiritsangiz, natija yanada aniq bo'ladi.": {
    ru: "ИИ оценил порцию примерно. Укажите точный вес — результат станет точнее.",
    en: "The AI estimated the portion. Enter the exact weight for a more accurate result.",
  },
  "Ma'lumotni o'zingiz kiriting": { ru: "Введите данные сами", en: "Enter the details yourself" },
  "Raqamlar taxminiy, tahrirlash mumkin": {
    ru: "Цифры приблизительные, их можно изменить",
    en: "The numbers are estimates and can be edited",
  },
  "Yozuv saqlanmadi. Qayta urinib ko'ring": {
    ru: "Запись не сохранена. Попробуйте ещё раз",
    en: "The entry was not saved. Try again",
  },
  "Tasdiqlash va qo'shish": { ru: "Подтвердить и добавить", en: "Confirm and add" },
  "Taomni aniq taniy olmadik": { ru: "Не удалось точно распознать блюдо", en: "We could not identify the dish" },
  "Rasmda bir nechta taom bor yoki yorug'lik yetmagan bo'lishi mumkin. Qiymatni o'zimiz uydirmaymiz.": {
    ru: "Возможно, на фото несколько блюд или не хватает света. Мы не выдумываем значения.",
    en: "The photo may have several dishes or too little light. We do not invent values.",
  },
  "Tasvir yetarli emas yoki bu ovqat emas. Qiymatni o'zimiz uydirmaymiz.": {
    ru: "Описания недостаточно, или это не еда. Мы не выдумываем значения.",
    en: "The description is not enough, or this is not food. We do not invent values.",
  },
  "Boshqa rasm olish": { ru: "Сделать другое фото", en: "Take another photo" },
  "Qayta yozish": { ru: "Написать заново", en: "Rewrite" },
  "Baribir tahrirlab kiritish": { ru: "Всё равно ввести вручную", en: "Enter manually anyway" },
  "Tahlil": { ru: "Анализ", en: "Analysis" },
  "Tahlil qilib bo'lmadi": { ru: "Не удалось проанализировать", en: "Analysis failed" },

  // ── Yozuv formasi (E7, E10) ────────────────────────────────────────────────
  "Taom nomi": { ru: "Название блюда", en: "Dish name" },
  "Taom nomini kiriting": { ru: "Введите название блюда", en: "Enter the dish name" },
  "Porsiyani kiriting": { ru: "Введите порцию", en: "Enter the portion" },
  "Kaloriyani kiriting": { ru: "Введите калории", en: "Enter the calories" },
  "Kaloriya 0 dan kichik bo'lmaydi": { ru: "Калории не могут быть меньше 0", en: "Calories cannot be below 0" },
  "Qiymat noto'g'ri": { ru: "Неверное значение", en: "Invalid value" },
  "Yozuv tahriri": { ru: "Изменить запись", en: "Edit entry" },
  "Vaqt": { ru: "Время", en: "Time" },
  "Vaqtni kiriting": { ru: "Введите время", en: "Enter the time" },
  "Vaqt hozirgidan keyin bo'lmaydi": { ru: "Время не может быть позже текущего", en: "The time cannot be in the future" },
  "O'zgarish saqlanmadi. Qayta urinib ko'ring": {
    ru: "Изменение не сохранено. Попробуйте ещё раз",
    en: "The change was not saved. Try again",
  },
  "Bu yozuvni o'chiramizmi? Doira shu qiymatga kamayadi.": {
    ru: "Удалить эту запись? Круг уменьшится на это значение.",
    en: "Delete this entry? The ring will drop by this amount.",
  },

  // ── Qo'shildi (E8) va jurnal (E9) ──────────────────────────────────────────
  "Jurnalga qo'shildi": { ru: "Добавлено в журнал", en: "Added to journal" },
  "Yana qo'shish": { ru: "Добавить ещё", en: "Add more" },
  "Jurnal": { ru: "Журнал", en: "Journal" },
  "Sana": { ru: "Дата", en: "Date" },
  "Oldingi kun": { ru: "Предыдущий день", en: "Previous day" },
  "Keyingi kun": { ru: "Следующий день", en: "Next day" },
  "Kunlik jami": { ru: "Итог за день", en: "Daily total" },
  "Ovqat qo'shsangiz, u shu yerda ovqat turi bo'yicha guruhlanadi.": {
    ru: "Добавьте еду — она появится здесь, сгруппированная по приёмам пищи.",
    en: "Add a meal and it will show up here, grouped by meal type.",
  },
  "Jurnalni yuklab bo'lmadi": { ru: "Не удалось загрузить журнал", en: "Could not load the journal" },
  "Serverga ulanolmadik. Internetni tekshirib, qayta urinib ko'ring.": {
    ru: "Не удалось подключиться к серверу. Проверьте интернет и попробуйте ещё раз.",
    en: "Could not reach the server. Check your connection and try again.",
  },

  // ── 404 ────────────────────────────────────────────────────────────────────
  "Sahifa topilmadi": { ru: "Страница не найдена", en: "Page not found" },
  "Bu havola eskirgan yoki noto'g'ri yozilgan. Asosiy sahifadan davom eting.": {
    ru: "Эта ссылка устарела или написана с ошибкой. Продолжите с главной страницы.",
    en: "This link is outdated or mistyped. Continue from the home page.",
  },

  // ── Onboarding (O1–O9) ─────────────────────────────────────────────────────
  "Ozish, vazn olish, sog'lom turmush tarzi va vaznni saqlash": {
    ru: "Похудение, набор веса, здоровый образ жизни и поддержание веса",
    en: "Losing weight, gaining weight, a healthy lifestyle and maintaining weight",
  },
  "Taomingiz haqida ko'proq bilishni xohlaysizmi?": {
    ru: "Хотите знать больше о своей еде?",
    en: "Want to know more about your food?",
  },
  "«Boshlash»ni bosish orqali Ommaviy oferta shartlarini qabul qilasiz.": {
    ru: "Нажимая «Начать», вы принимаете условия Публичной оферты.",
    en: "By tapping “Start” you accept the terms of the Public Offer.",
  },
  "Boshlash": { ru: "Начать", en: "Start" },
  "Tugatish": { ru: "Завершить", en: "Finish" },
  "{0} dan {1}": { ru: "{1} из {0}", en: "{1} of {0}" },
  "O'tkazib yuborish": { ru: "Пропустить", en: "Skip" },
  "Onboarding bosqichi": { ru: "Шаг знакомства", en: "Onboarding step" },
  "Tanlanmagan": { ru: "Не выбрано", en: "Not selected" },
  "Javob qabul qilinmadi": { ru: "Ответ не принят", en: "The answer was not accepted" },
  "Javob noto'g'ri": { ru: "Неверный ответ", en: "Invalid answer" },
  "Internetni tekshirib, ilovani qayta ochib ko'ring.": {
    ru: "Проверьте интернет и откройте приложение заново.",
    en: "Check your connection and reopen the app.",
  },

  "Sizni qanday chaqiraylik?": { ru: "Как к вам обращаться?", en: "What should we call you?" },
  "Ism": { ru: "Имя", en: "Name" },
  "Bu faqat salomlashish uchun": { ru: "Это только для приветствия", en: "This is only used to greet you" },
  "{0} belgidan oshmasin": { ru: "Не больше {0} символов", en: "No more than {0} characters" },

  "Nimaga erishmoqchisiz?": { ru: "Чего вы хотите достичь?", en: "What do you want to achieve?" },
  "Asosiy maqsad": { ru: "Основная цель", en: "Main goal" },
  "Vazn tashlash": { ru: "Снижение веса", en: "Lose weight" },
  "Ortiqcha vazndan xalos bo'ling": { ru: "Избавьтесь от лишнего веса", en: "Lose the extra weight" },
  "Vaznni saqlash": { ru: "Поддержание веса", en: "Maintain weight" },
  "Hozirgi vazningizni ushlab turing": { ru: "Удерживайте текущий вес", en: "Hold your current weight" },
  "Vazn ortdirish": { ru: "Набор веса", en: "Gain weight" },
  "Sog'lom yo'l bilan vazn qo'shing": { ru: "Набирайте вес здоровым путём", en: "Put on weight healthily" },
  "Mushak yig'ish": { ru: "Набор мышц", en: "Build muscle" },
  "Mushak massasini oshiring": { ru: "Увеличивайте мышечную массу", en: "Build muscle mass" },

  "Hisob to'g'ri chiqishi uchun bir-ikki raqam kerak": {
    ru: "Для точного расчёта нужна пара цифр",
    en: "We need a couple of numbers to get the maths right",
  },
  "Jins": { ru: "Пол", en: "Sex" },
  "Erkak": { ru: "Мужской", en: "Male" },
  "Ayol": { ru: "Женский", en: "Female" },
  "Aytishni xohlamayman": { ru: "Не хочу указывать", en: "Prefer not to say" },
  "Yosh": { ru: "Возраст", en: "Age" },
  "Jins va yosh faqat kaloriya formulasi uchun ishlatiladi": {
    ru: "Пол и возраст используются только в формуле калорий",
    en: "Sex and age are only used in the calorie formula",
  },
  "Ilovadan 18 yoshdan katta foydalanuvchilar foydalanishi mumkin": {
    ru: "Приложением могут пользоваться только лица старше 18 лет",
    en: "The app can only be used by people over 18",
  },

  "Bo'yingiz va vazningiz?": { ru: "Ваш рост и вес?", en: "Your height and weight?" },
  "O'lchov birliklari": { ru: "Единицы измерения", en: "Units" },
  "Bo'y": { ru: "Рост", en: "Height" },
  "Joriy vazn": { ru: "Текущий вес", en: "Current weight" },
  "Maqsad vazn": { ru: "Целевой вес", en: "Goal weight" },
  "Reja tayyorlanmoqda": { ru: "Готовим ваш план", en: "Preparing your plan" },
  "Javoblaringiz yig'ilmoqda": { ru: "Собираем ваши ответы", en: "Gathering your answers" },
  "Kunlik norma hisoblanmoqda": { ru: "Считаем дневную норму", en: "Calculating your daily target" },
  "Makrolar taqsimlanmoqda": { ru: "Распределяем макросы", en: "Splitting your macros" },
  "kunlik taxminiy maqsadingiz, kkal": {
    ru: "ваша примерная дневная цель, ккал",
    en: "your estimated daily target, kcal",
  },
  "Nega shunday?": { ru: "Почему так?", en: "Why this number?" },
  "Bo'y, vazn, yosh, jins va faollikdan kunlik sarf hisoblandi, keyin maqsadingizga qarab tuzatildi. Raqam taxminiy va profil o'zgarsa qayta hisoblanadi.":
    {
      ru: "По росту, весу, возрасту, полу и активности рассчитан дневной расход, затем он скорректирован под вашу цель. Число примерное и пересчитывается при изменении профиля.",
      en: "Your daily energy use was calculated from height, weight, age, sex and activity, then adjusted for your goal. The number is an estimate and is recalculated when your profile changes.",
    },
  "Hisob pastki chegaradan past chiqdi — xavfsiz chegara qiymati berildi.": {
    ru: "Расчёт получился ниже нижней границы — показано безопасное минимальное значение.",
    en: "The calculation came out below the lower limit — the safe minimum is shown instead.",
  },
  "Jins ko'rsatilmagani uchun taxmin kengroq.": {
    ru: "Пол не указан, поэтому оценка менее точная.",
    en: "Sex wasn't specified, so the estimate is less precise.",
  },
  "Makrolar taqsimlandi": { ru: "Макросы распределены", en: "Your macros are set" },
  "Natijaning sabablaridan biri — har kungi intizom. Bugungi kichik qadam — ertangi katta o'zgarish.":
    {
      ru: "Одна из причин результата — ежедневная дисциплина. Маленький шаг сегодня — большая перемена завтра.",
      en: "One of the reasons behind results is daily discipline. A small step today is a big change tomorrow.",
    },
  "Bu tibbiy tavsiya emas. Qiymatlar taxminiy.": {
    ru: "Это не медицинская рекомендация. Значения примерные.",
    en: "This is not medical advice. Values are estimates.",
  },
  "Boshlaymiz": { ru: "Начинаем", en: "Let's start" },
  "Kunlik norma": { ru: "Дневная норма", en: "Daily target" },
  "Norma o'zgaradi": { ru: "Норма изменится", en: "Your target will change" },
  "Kunlik normangiz {0} dan {1} ga o'zgaradi. Saqlansinmi?": {
    ru: "Ваша дневная норма изменится с {0} на {1}. Сохранить?",
    en: "Your daily target will change from {0} to {1}. Save?",
  },
  "O'tgan kunlar qayta hisoblanmaydi — har kun o'sha kundagi norma bilan qoladi.": {
    ru: "Прошедшие дни не пересчитываются — каждый день остаётся с нормой того дня.",
    en: "Past days are not recalculated — each day keeps the target it had.",
  },
  "Raqamni to'g'rilash": { ru: "Исправить цифру", en: "Fix the number" },
  "Maqsadni o'zgartirish": { ru: "Изменить цель", en: "Change the goal" },
  "Vazn tashlashni tanlagansiz, lekin maqsad vazn joriysidan katta": {
    ru: "Вы выбрали снижение веса, но целевой вес больше текущего",
    en: "You chose to lose weight, but the goal weight is above your current weight",
  },
  "Vazn ortdirishni tanlagansiz, lekin maqsad vazn joriysidan kichik": {
    ru: "Вы выбрали набор веса, но целевой вес меньше текущего",
    en: "You chose to gain weight, but the goal weight is below your current weight",
  },
  "Bu vazn bo'yingizga nisbatan pastroq bo'lishi mumkin. Bu tibbiy maslahat emas.": {
    ru: "Этот вес может быть низковат для вашего роста. Это не медицинский совет.",
    en: "This weight may be on the low side for your height. This is not medical advice.",
  },
  "Bu vazn bo'yingizga nisbatan yuqoriroq bo'lishi mumkin. Bu tibbiy maslahat emas.": {
    ru: "Этот вес может быть высоковат для вашего роста. Это не медицинский совет.",
    en: "This weight may be on the high side for your height. This is not medical advice.",
  },
  "Bu maqsad joriy vaznga juda yaqin — «Vaznni saqlash» to'g'riroq bo'lishi mumkin": {
    ru: "Эта цель очень близка к текущему весу — возможно, больше подойдёт «Поддержание веса»",
    en: "This goal is very close to your current weight — “Maintain weight” may fit better",
  },
  "Bu maqsad vazni bo'yingizga nisbatan pastroq bo'lishi mumkin. Bu tibbiy maslahat emas.": {
    ru: "Этот целевой вес может быть низковат для вашего роста. Это не медицинский совет.",
    en: "This goal weight may be on the low side for your height. This is not medical advice.",
  },
  "Bu maqsad vazni bo'yingizga nisbatan yuqoriroq bo'lishi mumkin. Bu tibbiy maslahat emas.": {
    ru: "Этот целевой вес может быть высоковат для вашего роста. Это не медицинский совет.",
    en: "This goal weight may be on the high side for your height. This is not medical advice.",
  },

  "Kuningiz qanday o'tadi?": { ru: "Как проходит ваш день?", en: "What is your day like?" },
  "Faollik darajasi": { ru: "Уровень активности", en: "Activity level" },
  "Kam harakat": { ru: "Малоподвижный", en: "Sedentary" },
  "Asosan o'tirib ishlayman": { ru: "В основном сидячая работа", en: "Mostly desk-based" },
  "Yengil faol": { ru: "Слегка активный", en: "Lightly active" },
  "Haftada 1–3 kun harakat": { ru: "1–3 дня активности в неделю", en: "1–3 active days a week" },
  "O'rtacha faol": { ru: "Умеренно активный", en: "Moderately active" },
  "Haftada 3–5 kun mashq": { ru: "3–5 тренировок в неделю", en: "3–5 workouts a week" },
  "Juda faol": { ru: "Очень активный", en: "Very active" },
  "Haftada 6–7 kun mashq yoki og'ir jismoniy ish": {
    ru: "6–7 тренировок в неделю или тяжёлый физический труд",
    en: "6–7 workouts a week or heavy physical work",
  },

  "Ovqatda cheklovingiz bormi?": { ru: "Есть ли у вас ограничения в еде?", en: "Any dietary restrictions?" },
  "Bu normaga ta'sir qilmaydi — taom takliflari va retseptlar uchun.": {
    ru: "Это не влияет на норму — только на подбор блюд и рецептов.",
    en: "This does not affect your target — it is for dish suggestions and recipes.",
  },
  "Ovqat afzalliklari": { ru: "Предпочтения в еде", en: "Food preferences" },
  "Cheklov yo'q": { ru: "Нет ограничений", en: "No restrictions" },
  "Vegetarian": { ru: "Вегетарианец", en: "Vegetarian" },
  "Go'shtni kam yeyman": { ru: "Ем мало мяса", en: "I eat little meat" },
  "Laktoza yo'q": { ru: "Без лактозы", en: "Lactose-free" },
  "Glyuten yo'q": { ru: "Без глютена", en: "Gluten-free" },
  "Shakarni cheklayman": { ru: "Ограничиваю сахар", en: "I limit sugar" },

  "Odatda qanday ovqatlanasiz?": { ru: "Как вы обычно питаетесь?", en: "How do you usually eat?" },
  "Kuniga necha mahal": { ru: "Сколько раз в день", en: "Meals per day" },
  "4 va undan ko'p": { ru: "4 и больше", en: "4 or more" },
  "Asosan qayerda": { ru: "В основном где", en: "Mostly where" },
  "Uyda": { ru: "Дома", en: "At home" },
  "Ishda yoki tashqarida": { ru: "На работе или вне дома", en: "At work or out" },
  "Aralash": { ru: "По-разному", en: "Mixed" },

  "Nima sizni harakatga undaydi?": { ru: "Что вас мотивирует?", en: "What motivates you?" },
  "Eslatma va matnlarni shunga qarab tanlaymiz.": {
    ru: "Под это мы подберём напоминания и тексты.",
    en: "We pick reminders and wording based on this.",
  },
  "Motivatsiya": { ru: "Мотивация", en: "Motivation" },
  "Sog'lig'im": { ru: "Моё здоровье", en: "My health" },
  "Tashqi ko'rinishim": { ru: "Мой внешний вид", en: "My appearance" },
  "Ko'proq energiya": { ru: "Больше энергии", en: "More energy" },
  "Shifokor tavsiyasi": { ru: "Рекомендация врача", en: "Doctor's advice" },
  "Sport natijasi": { ru: "Спортивный результат", en: "Athletic performance" },

  // ── Profil (F1) ────────────────────────────────────────────────────────────
  "Profilni yuklab bo'lmadi": { ru: "Не удалось загрузить профиль", en: "Could not load profile" },
  "Ism kiritilmagan": { ru: "Имя не указано", en: "No name given" },
  "Ilovada {0} kun": { ru: "{0} дн. в приложении", en: "{0} days in the app" },
  "Bepul reja": { ru: "Бесплатный план", en: "Free plan" },
  "PRO · {0}gacha faol": { ru: "PRO · активна до {0}", en: "PRO · active until {0}" },
  "PRO muddati tugadi · tarix ochiq qoladi": {
    ru: "Срок PRO истёк · история остаётся открытой",
    en: "PRO has expired · your history stays open",
  },
  "Jurnal, tarix va progress o'qish uchun ochiq. Faqat yangi AI skan va retseptlarning to'liq matni yopildi.": {
    ru: "Журнал, история и прогресс открыты для чтения. Закрыты только новые ИИ-сканирования и полный текст рецептов.",
    en: "Your journal, history and progress stay readable. Only new AI scans and full recipe text are locked.",
  },

  // ── Sozlama qatorlari (Profil sahifasida) ──────────────────────────────────
  "Til": { ru: "Язык", en: "Language" },
  "Vazn birligi": { ru: "Единица веса", en: "Weight unit" },
  "Bo'y birligi": { ru: "Единица роста", en: "Height unit" },
  "lb": { ru: "фунт", en: "lb" },
  "ft": { ru: "фут", en: "ft" },
  "Shaxsiy ma'lumot": { ru: "Личные данные", en: "Personal details" },
  "Hisobni o'chirish": { ru: "Удалить аккаунт", en: "Delete account" },
  "Rasm mualliflari": { ru: "Авторы фотографий", en: "Photo credits" },
  "Taom rasmlari Wikimedia Commons'dan olingan. Har biri kesilgan va WebP formatiga o'girilgan — boshqa o'zgarish kiritilmagan.": {
    ru: "Фотографии блюд взяты с Wikimedia Commons. Каждая обрезана и преобразована в формат WebP — других изменений нет.",
    en: "Dish photos come from Wikimedia Commons. Each one was cropped and converted to WebP — no other changes were made.",
  },
  "Muallif: {0}": { ru: "Автор: {0}", en: "Author: {0}" },
  "saqlanmoqda…": { ru: "сохраняется…", en: "saving…" },
  "Saqlanmadi. Qayta urinish": { ru: "Не сохранено. Повторить", en: "Not saved. Try again" },
  "Internet yo'q. Sozlamalar o'qish uchun ochiq, o'zgartirish vaqtincha bloklangan.": {
    ru: "Нет интернета. Настройки можно просматривать, но изменить пока нельзя.",
    en: "You are offline. Settings stay readable, but changes are blocked for now.",
  },
  "Birlik faqat ko'rsatish uchun — baza doim kg va sm da saqlaydi.": {
    ru: "Единицы влияют только на отображение — данные всегда хранятся в кг и см.",
    en: "Units only change what you see — data is always stored in kg and cm.",
  },

  // ── Shaxsiy ma'lumot (F3) ──────────────────────────────────────────────────
  "Aytmayman": { ru: "Не указывать", en: "Rather not say" },
  "Maqsad": { ru: "Цель", en: "Goal" },
  "Ovqat afzalliklari va odatlari": { ru: "Предпочтения и привычки в еде", en: "Food preferences and habits" },
  "Afzalliklar": { ru: "Предпочтения", en: "Preferences" },
  "Odatlar": { ru: "Привычки", en: "Habits" },
  "Tayyor": { ru: "Готово", en: "Done" },
  "Bu javoblar hozircha taom takliflari uchun saqlanadi.": {
    ru: "Эти ответы пока сохраняются для подбора блюд.",
    en: "For now these answers are kept for dish suggestions.",
  },
  "Joriy vazn bu yerda o'zgartirilmaydi — u tarix yozuvi.": {
    ru: "Текущий вес здесь не меняется — это запись в истории.",
    en: "Current weight is not edited here — it is a history record.",
  },
  "Yosh {0}–{1} oralig'ida bo'lsin": { ru: "Возраст должен быть от {0} до {1}", en: "Age must be between {0} and {1}" },
  "Bo'y {0}–{1} {2} oralig'ida bo'lsin": {
    ru: "Рост должен быть от {0} до {1} {2}",
    en: "Height must be between {0} and {1} {2}",
  },
  "Maqsad vazn {0}–{1} {2} oralig'ida bo'lsin": {
    ru: "Целевой вес должен быть от {0} до {1} {2}",
    en: "Goal weight must be between {0} and {1} {2}",
  },

  // ── Hisobni o'chirish (F5) ─────────────────────────────────────────────────
  "Quyidagilar butunlay o'chadi:": { ru: "Будет удалено безвозвратно:", en: "The following will be deleted for good:" },
  "Profil va shaxsiy ma'lumot": { ru: "Профиль и личные данные", en: "Profile and personal details" },
  "Butun ovqat jurnali": { ru: "Весь журнал питания", en: "Your entire food journal" },
  "Barcha rasmlar": { ru: "Все фотографии", en: "All photos" },
  "Vazn tarixi": { ru: "История веса", en: "Weight history" },
  "Bu amalni qaytarib bo'lmaydi": { ru: "Это действие нельзя отменить", en: "This cannot be undone" },
  "PRO obunangiz tugaydi, pul qaytarilmaydi.": {
    ru: "Ваша подписка PRO прекратится, деньги не возвращаются.",
    en: "Your PRO subscription ends and is not refunded.",
  },
  "O'chirilgan ma'lumotni tiklash imkoni yo'q.": {
    ru: "Удалённые данные восстановить невозможно.",
    en: "Deleted data cannot be restored.",
  },
  "Tasdiqlash": { ru: "Подтверждение", en: "Confirm" },
  "Tasdiqlash uchun «{0}» deb yozing": { ru: "Для подтверждения введите «{0}»", en: "Type “{0}” to confirm" },
  "O'CHIRISH": { ru: "УДАЛИТЬ", en: "DELETE" },
  "Hisob darhol o'chadi. Ilovani qayta ochsangiz, yangi hisob yaratiladi.": {
    ru: "Аккаунт удаляется сразу. Если открыть приложение снова, будет создан новый аккаунт.",
    en: "The account is deleted right away. Opening the app again creates a new account.",
  },
  "O'chirib bo'lmadi. Qayta urinib ko'ring": { ru: "Не удалось удалить. Попробуйте ещё раз", en: "Could not delete. Try again" },
  "Hisobingiz o'chirildi": { ru: "Ваш аккаунт удалён", en: "Your account has been deleted" },
  "Ilovani yopishingiz mumkin.": { ru: "Приложение можно закрыть.", en: "You can close the app." },

  // ── Obuna (F4) ─────────────────────────────────────────────────────────────
  "Obunani boshqarish": { ru: "Управление подпиской", en: "Manage subscription" },
  "Obuna": { ru: "Подписка", en: "Subscription" },
  "Holat": { ru: "Статус", en: "Status" },
  "Faol": { ru: "Активна", en: "Active" },
  "Tarif": { ru: "Тариф", en: "Plan" },
  "Oylik": { ru: "Месячный", en: "Monthly" },
  "6 oylik": { ru: "6 месяцев", en: "6 months" },
  "Yillik": { ru: "Годовой", en: "Yearly" },
  "Boshlangan": { ru: "Начало", en: "Started" },
  "Tugaydi": { ru: "Окончание", en: "Ends" },
  "Manba": { ru: "Источник", en: "Source" },
  "Administrator tomonidan berilgan": { ru: "Выдана администратором", en: "Granted by an administrator" },
  "To'lovlar tarixi": { ru: "История платежей", en: "Payment history" },
  "Hozircha to'lov yo'q": { ru: "Платежей пока нет", en: "No payments yet" },
  "Administrator tomonidan berilgan obuna — to'lov yozuvi yo'q.": {
    ru: "Подписка выдана администратором — записей об оплате нет.",
    en: "This subscription was granted by an administrator — there are no payment records.",
  },
  "Obunani yuklab bo'lmadi": { ru: "Не удалось загрузить подписку", en: "Could not load the subscription" },

  // ── Tariflar (W1) va onboarding oxiri (O13) ────────────────────────────────
  "NutriLifer PRO bilan ko'proq": { ru: "С NutriLifer PRO — больше", en: "Get more with NutriLifer PRO" },
  "NutriLifer PRO": { ru: "NutriLifer PRO", en: "NutriLifer PRO" },
  "Bepul skanlar tugadi": { ru: "Бесплатные сканирования закончились", en: "Your free scans are used up" },
  "PRO ni tiklash": { ru: "Восстановить PRO", en: "Restore PRO" },
  "Kuniga 20 tagacha AI skan": { ru: "До 20 ИИ-сканирований в день", en: "Up to 20 AI scans a day" },
  "Retseptlarni to'liq ko'rish": { ru: "Полные тексты рецептов", en: "Full recipe text" },
  "Nutrition Score": { ru: "Nutrition Score", en: "Nutrition Score" },
  "Qolgan kaloriyaga mos taom takliflari": {
    ru: "Подборка блюд под оставшиеся калории",
    en: "Dish ideas that fit your remaining calories",
  },
  "Oqsil, yog' va uglevodlarni kuzatish": {
    ru: "Учёт белков, жиров и углеводов",
    en: "Protein, fat and carb tracking",
  },
  "Aqlli porsiya tavsiyalari": { ru: "Умные советы по размеру порции", en: "Smart portion advice" },
  "Batafsil ovqatlanish statistikasi": { ru: "Подробная статистика питания", en: "Detailed nutrition statistics" },
  "Sevimli retseptlar": { ru: "Избранные рецепты", en: "Favourite recipes" },
  "Haftalik ovqatlanish hisoboti": { ru: "Еженедельный отчёт о питании", en: "Weekly nutrition report" },
  "PRO imkoniyatlari": { ru: "Возможности PRO", en: "PRO features" },
  "Tarif tanlang": { ru: "Выберите тариф", en: "Choose a plan" },
  "Tavsiya etiladi": { ru: "Рекомендуем", en: "Recommended" },
  "{0} so'm": { ru: "{0} сум", en: "{0} UZS" },
  "{0} so'm / oy": { ru: "{0} сум / мес.", en: "{0} UZS / mo" },
  "≈{0} so'm / oy": { ru: "≈{0} сум / мес.", en: "≈{0} UZS / mo" },
  "{0}% tejash": { ru: "экономия {0}%", en: "save {0}%" },
  "Avtomatik yechish yo'q. Muddat tugagach o'zingiz uzaytirasiz.": {
    ru: "Автосписаний нет. Когда срок закончится, вы продлеваете сами.",
    en: "No automatic charges. When the term ends, you renew it yourself.",
  },
  "Foydalanish shartlari": { ru: "Условия использования", en: "Terms of Use" },
  "Maxfiylik siyosati": { ru: "Политика конфиденциальности", en: "Privacy Policy" },
  "Hozir emas": { ru: "Не сейчас", en: "Not now" },
  "Tariflarni yuklab bo'lmadi": { ru: "Не удалось загрузить тарифы", en: "Could not load the plans" },
  "NutriLifer PRO — {0} tarif ({1} so'm) ga obuna bo'lmoqchiman.": {
    ru: "NutriLifer PRO — хочу оформить подписку на тариф «{0}» ({1} сум).",
    en: "NutriLifer PRO — I'd like to subscribe to the {0} plan ({1} UZS).",
  },
  "To'lov tez orada": { ru: "Оплата скоро появится", en: "Payments are coming soon" },
  "To'lov tez orada ishga tushadi. Hozircha ilovadan bepul foydalanishingiz mumkin.": {
    ru: "Оплата скоро заработает. Пока приложением можно пользоваться бесплатно.",
    en: "Payments will be available soon. For now you can keep using the app for free.",
  },
  "Tushunarli": { ru: "Понятно", en: "Got it" },
  "Hujjat tayyorlanmoqda": { ru: "Документ готовится", en: "This document is being prepared" },
  "Hujjat matni tez orada shu yerda paydo bo'ladi.": {
    ru: "Текст документа скоро появится здесь.",
    en: "The document will appear here soon.",
  },
  "PRO": { ru: "PRO", en: "PRO" },
  "Ovqatlanishingizni chuqurroq kuzatib, aniqroq natijaga erishing.": {
    ru: "Следите за питанием глубже и приходите к более точному результату.",
    en: "Track your eating in more depth and get to a more precise result.",
  },
  "FREE bilan ham ishlaydi": { ru: "Работает и с FREE", en: "Works on FREE too" },
  "3 ta bepul AI skan · cheksiz qo'lda kiritish · kunlik doira": {
    ru: "3 бесплатных ИИ-сканирования · ручной ввод без ограничений · дневной круг",
    en: "3 free AI scans · unlimited manual entry · the daily ring",
  },
  "PRO ni ochish": { ru: "Открыть PRO", en: "Unlock PRO" },
  "PRO haqida": { ru: "О PRO", en: "About PRO" },
  "Yangilash": { ru: "Продлить", en: "Renew" },

  // ── Qiymat chegaralari (E5, E7, E10) ───────────────────────────────────────
  "{0} dan oshmasin": { ru: "Не больше {0}", en: "No more than {0}" },
  "Bitta yozuv {0} kkal dan oshmasin": {
    ru: "Одна запись — не больше {0} ккал",
    en: "One entry can be at most {0} kcal",
  },
  "Oqsil, yog' yoki uglevod {0} g dan oshmasin": {
    ru: "Белки, жиры или углеводы — не больше {0} г",
    en: "Protein, fat or carbs can be at most {0} g",
  },
  "Miqdor 0 dan katta bo'lishi kerak": {
    ru: "Количество должно быть больше 0",
    en: "The amount must be greater than 0",
  },

  // ── Nutrition Score (E1) ───────────────────────────────────────────────────
  "Yaxshi": { ru: "Хорошо", en: "Good" },
  "O'rtacha": { ru: "Средне", en: "Average" },
  "Past": { ru: "Низко", en: "Low" },
  "Oqsil ulushi": { ru: "Доля белков", en: "Protein share" },
  "Yog' ulushi": { ru: "Доля жиров", en: "Fat share" },
  "Uglevod ulushi": { ru: "Доля углеводов", en: "Carb share" },
  "Norma ichida": { ru: "В пределах нормы", en: "Within target" },
  "{0} / {1}": { ru: "{0} / {1}", en: "{0} / {1}" },
  "/ 100 · {0}": { ru: "/ 100 · {0}", en: "/ 100 · {0}" },
  "Eng past ko'rsatkich — {0}.": { ru: "Самый низкий показатель — {0}.", en: "Lowest score — {0}." },
  "Ball axborot uchun — tibbiy baho emas.": {
    ru: "Балл носит справочный характер — это не медицинская оценка.",
    en: "The score is for information only — it is not a medical assessment.",
  },
  "Ball bugungi yozuvlardan hisoblanadi — birinchi ovqatni qo'shsangiz chiqadi.": {
    ru: "Балл считается по записям за сегодня — появится после первого приёма пищи.",
    en: "The score is computed from today’s entries — it appears once you add your first meal.",
  },
  "Ball makrolardan hisoblanadi — bu kungi yozuvlarda oqsil, yog' va uglevod kiritilmagan.": {
    ru: "Балл считается по БЖУ — в записях за этот день белки, жиры и углеводы не указаны.",
    en: "The score is computed from macros — this day’s entries have no protein, fat or carbs.",
  },
  "Kunlik ovqatlanish muvozanatini 0–100 ball bilan ko'rsatadi.": {
    ru: "Показывает баланс питания за день по шкале 0–100.",
    en: "Shows your daily nutrition balance on a 0–100 scale.",
  },

  // ── Qolgan kaloriyaga mos taklif (E1) va porsiya tavsiyasi (E5) ────────────
  "Qolgan kaloriyaga mos": { ru: "Под оставшиеся калории", en: "Fits your remaining calories" },
  "Qolgan kaloriyangizga sig'adigan taomlar tanlanadi.": {
    ru: "Подбираем блюда, которые вписываются в оставшиеся калории.",
    en: "We pick dishes that fit within your remaining calories.",
  },
  "Kunlik norma to'ldi — bugunga taklif yo'q.": {
    ru: "Дневная норма набрана — на сегодня предложений нет.",
    en: "You’ve reached today’s target — no suggestions for today.",
  },
  "Qolgan {0} kkal uchun mos taom topilmadi.": {
    ru: "Под оставшиеся {0} ккал подходящего блюда не нашлось.",
    en: "No dish fits the remaining {0} kcal.",
  },
  "{0} · {1} kkal · qolgan {2} kkal ichida": {
    ru: "{0} · {1} ккал · в пределах оставшихся {2} ккал",
    en: "{0} · {1} kcal · within the remaining {2} kcal",
  },
  "Aqlli porsiya tavsiyalari — PRO": {
    ru: "Умные советы по размеру порции — PRO",
    en: "Smart portion advice — PRO",
  },
  "Oqsil, yog' va uglevodlarni kuzatish — PRO": {
    ru: "Учёт белков, жиров и углеводов — PRO",
    en: "Protein, fat and carb tracking — PRO",
  },
  "Tavsiya: {0} g": { ru: "Совет: {0} г", en: "Suggested: {0} g" },
  "Qolgan {0} kkal ichida qoladi": {
    ru: "Останется в пределах оставшихся {0} ккал",
    en: "Stays within the remaining {0} kcal",
  },
  "Tavsiya: {0}": { ru: "Совет: {0}", en: "Suggested: {0}" },
  "{0} kkal — qolgan {1} kkal ichida": {
    ru: "{0} ккал — в пределах оставшихся {1} ккал",
    en: "{0} kcal — within the remaining {1} kcal",
  },
  "{0} kkal — odatdagi katta porsiya, qolgan {1} kkal ichida": {
    ru: "{0} ккал — обычная большая порция, в пределах оставшихся {1} ккал",
    en: "{0} kcal — a regular large serving, within the remaining {1} kcal",
  },

  // ── Mavzu ──────────────────────────────────────────────────────────────────
  "Mavzu": { ru: "Тема", en: "Theme" },
  "Yorug'": { ru: "Светлая", en: "Light" },
  // Progress (P1–P3)
  "Yo'lning {0}% i bosib o'tildi": { ru: "Пройдено {0}% пути", en: "{0}% of the way there" },
  "Vaznni qayd etish": { ru: "Записать вес", en: "Log weight" },
  "Vazn grafigi": { ru: "График веса", en: "Weight chart" },
  "{0} kun": { ru: "{0} дн.", en: "{0} days" },
  "Ikkinchi o'lchovdan keyin grafik chiziladi": {
    ru: "График появится после второго измерения",
    en: "The chart appears after your second weigh-in",
  },
  "Vazn qo'shish": { ru: "Добавить вес", en: "Add weight" },
  "oxirgi {0} kunda": { ru: "за последние {0} дн.", en: "in the last {0} days" },
  "Maqsad: {0}": { ru: "Цель: {0}", en: "Goal: {0}" },
  "Yana {0}": { ru: "Ещё {0}", en: "{0} to go" },
  "Streak hali boshlanmagan": { ru: "Серия ещё не началась", en: "Your streak hasn't started yet" },
  "Birinchi ovqatni qo'shing": { ru: "Добавьте первый приём пищи", en: "Add your first meal" },
  "{0} kunlik streak": { ru: "Серия: {0} дн.", en: "{0}-day streak" },
  "Rekord: {0} kun": { ru: "Рекорд: {0} дн.", en: "Best: {0} days" },
  "Kuzatilgan kunlar": { ru: "Отмеченные дни", en: "Tracked days" },
  "{0} / {1} kun": { ru: "{0} / {1} дн.", en: "{0} / {1} days" },
  "Oxirgi 30 kun. Kuzatilgan kunni bosing — o'sha kundagi jurnal ochiladi.": {
    ru: "Последние 30 дней. Нажмите на отмеченный день — откроется журнал за этот день.",
    en: "Last 30 days. Tap a tracked day to open that day's journal.",
  },
  "Haftalik o'zgarish": { ru: "Изменение за неделю", en: "Weekly change" },
  "{0} / hafta": { ru: "{0} / нед.", en: "{0} / week" },
  "{0} ta o'lchov": { ru: "Измерений: {0}", en: "{0} weigh-ins" },
  "Vazn": { ru: "Вес", en: "Weight" },
  "Bugungi vaznni yangilash": { ru: "Обновить сегодняшний вес", en: "Update today's weight" },
  "O'lchovni tahrirlash": { ru: "Изменить измерение", en: "Edit weigh-in" },
  "Vazn {0}–{1} {2} oralig'ida bo'lsin": {
    ru: "Вес должен быть от {0} до {1} {2}",
    en: "Weight must be between {0} and {1} {2}",
  },
  "Oldingi o'lchovdan {0} farq qilyapti. To'g'rimi?": {
    ru: "Отличается от прошлого измерения на {0}. Всё верно?",
    en: "That's {0} off your last weigh-in. Is that right?",
  },
  "Ha, to'g'ri": { ru: "Да, верно", en: "Yes, that's right" },
  "{0} — bugun": { ru: "{0} — сегодня", en: "{0} — today" },
  "Kunlik normangiz yangilandi: {0} → {1}": {
    ru: "Дневная норма обновлена: {0} → {1}",
    en: "Your daily target was updated: {0} → {1}",
  },
  "Tahrirlash": { ru: "Изменить", en: "Edit" },
  "boshlang'ich yozuv": { ru: "начальная запись", en: "starting record" },
  "Onboardingdagi birinchi yozuv o'chirilmaydi — u grafikning boshlang'ich nuqtasi.": {
    ru: "Первую запись из онбординга удалить нельзя — это начальная точка графика.",
    en: "The first record from onboarding can't be deleted — it's the chart's starting point.",
  },
  "O'lchovni o'chirish": { ru: "Удалить измерение", en: "Delete weigh-in" },
  "{0} · {1} o'chiriladi. Kunlik norma qayta hisoblanadi.": {
    ru: "{0} · {1} будет удалено. Дневная норма пересчитается.",
    en: "{0} · {1} will be deleted. Your daily target will be recalculated.",
  },
  "O'chirilmadi. Qayta urinib ko'ring": { ru: "Не удалено. Попробуйте ещё раз", en: "Not deleted. Try again" },
  "Qorong'i": { ru: "Тёмная", en: "Dark" },
  "Tizim": { ru: "Системная", en: "System" },

  // ── P1: batafsil statistika va haftalik hisobot (PRO) ─────────────────────
  "Statistika uchun kamida ikki kunlik yozuv kerak.": {
    ru: "Для статистики нужны записи минимум за два дня.",
    en: "Statistics need at least two days of entries.",
  },
  "Hisobot uchun bu haftada kamida uch kunlik yozuv kerak.": {
    ru: "Для отчёта нужны записи минимум за три дня этой недели.",
    en: "The report needs at least three days of entries this week.",
  },
  "kkal — kunlik o'rtacha": { ru: "ккал — в среднем в день", en: "kcal — daily average" },
  "Makro taqsimoti": { ru: "Распределение БЖУ", en: "Macro split" },
  "Normaga mos kunlar": { ru: "Дни в пределах нормы", en: "Days within target" },
  "Normadan oshgan kunlar": { ru: "Дни с превышением", en: "Days over target" },
  "Eng past kun": { ru: "Самый низкий день", en: "Lowest day" },
  "Eng baland kun": { ru: "Самый высокий день", en: "Highest day" },
  "{0} kkal · {1}": { ru: "{0} ккал · {1}", en: "{0} kcal · {1}" },
  "O'rtacha Nutrition Score": { ru: "Средний Nutrition Score", en: "Average Nutrition Score" },
  "O'rtachalar faqat yozuv bor kunlardan olinadi — bo'sh kun nol deb hisoblanmaydi.": {
    ru: "Средние считаются только по дням с записями — пустой день не считается нулём.",
    en: "Averages use only days with entries — an empty day is not counted as zero.",
  },
  "kkal / kun": { ru: "ккал / день", en: "kcal / day" },
  "{0} o'tgan haftaga nisbatan": { ru: "{0} по сравнению с прошлой неделей", en: "{0} vs last week" },
  "Yozuv bor kunlar": { ru: "Дни с записями", en: "Days with entries" },
  "O'rtacha oqsil": { ru: "Средний белок", en: "Average protein" },
  "O'rtacha kaloriya, makro taqsimoti va normaga mos kunlar.": {
    ru: "Средние калории, распределение БЖУ и дни в пределах нормы.",
    en: "Average calories, macro split and days within target.",
  },
  "Har hafta: o'rtacha kaloriya, oldingi hafta bilan solishtirish va kunlar bo'yicha ustunlar.": {
    ru: "Каждую неделю: средние калории, сравнение с прошлой неделей и столбцы по дням.",
    en: "Each week: average calories, comparison with last week and per-day bars.",
  },

  // ── Telegram bot (/start) — lib/services/bot.ts ────────────────────────────
  "NutriLifer — ovqatlanishingizni aqlli nazorat qiling!": {
    ru: "NutriLifer — умный контроль вашего питания!",
    en: "NutriLifer — track your nutrition the smart way!",
  },
  "Taomni rasmga oling — AI kaloriyasi va ozuqaviy qiymatini hisoblaydi.": {
    ru: "Сфотографируйте блюдо — AI посчитает его калорийность и пищевую ценность.",
    en: "Snap a photo of your meal — AI calculates its calories and nutritional value.",
  },
  "Uglevodlar": { ru: "Углеводы", en: "Carbs" },
  "Shuningdek, kunlik maqsadingizni kuzatib, ovqatlanish tarixingizni saqlashingiz mumkin.": {
    ru: "Также можно следить за дневной целью и хранить историю питания.",
    en: "You can also track your daily goal and keep a history of your meals.",
  },
  "Boshlash uchun tugmani bosing:": { ru: "Нажмите кнопку, чтобы начать:", en: "Tap the button to get started:" },
  "Ovqat ilova ichida qo'shiladi. Ochish uchun tugmani bosing:": {
    ru: "Еда добавляется в приложении. Нажмите кнопку, чтобы открыть его:",
    en: "Meals are added in the app. Tap the button to open it:",
  },
} as const satisfies Record<string, Tarjima>;

export type Kalit = keyof typeof SOZLAR;
