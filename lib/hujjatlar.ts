// AVTOMATIK YARATILGAN — qo'lda tahrirlanmaydi.
// Manba: hujjatlar/*.md · yangilash: node scripts/hujjat-yig.mjs

import type { Til } from "./lugat/tarjima.ts";

/** Hujjat matnlari: kalit -> til -> xom matn. O'zbekchasi doim bor (zaxira til). */
export const HUJJAT_MATNLARI: Record<string, Partial<Record<Til, string>>> = {
  maxfiylik: {
    uz: `NUTRILIFER BOT MAXFIYLIK SIYOSATI

Amal qilish sanasi: 2026-yil 23-sentabr
Versiya: 2026-09-23

Ushbu Maxfiylik siyosati NutriLifer bot, Telegram Mini App va unga bog‘liq xizmatlardan foydalanish vaqtida foydalanuvchilarning ma’lumotlari qanday yig‘ilishi, ishlatilishi, saqlanishi va himoya qilinishini tushuntiradi.

NutriLifer foydalanuvchining shaxsiy ma’lumotlariga ehtiyotkorlik bilan munosabatda bo‘ladi va ulardan faqat xizmatni taqdim etish, yaxshilash hamda foydalanuvchi so‘ragan funksiyalarni amalga oshirish uchun foydalanadi.

1. Biz qanday ma’lumotlarni yig‘amiz?

NutriLifer’dan foydalanishda quyidagi ma’lumotlar qayta ishlanishi mumkin:

1.1. Telegram ma’lumotlari

Telegram orqali ilovaga kirilganda quyidagi ma’lumotlar olinishi mumkin:

Telegram foydalanuvchi identifikatori;
Telegram’dagi ism;
Telegram profil rasmi;
Telegram hisobiga bog‘liq texnik ma’lumotlar.

Telegram username alohida foydalanuvchi ma’lumoti sifatida NutriLifer ma’lumotlar bazasida saqlanmaydi.

1.2. Profil va onboarding ma’lumotlari

Foydalanuvchi ilovada kiritgan quyidagi ma’lumotlar saqlanishi mumkin:

ism;
yosh;
jins;
bo‘y;
vazn;
maqsad;
jismoniy faollik darajasi;
ovqatlanish afzalliklari;
ovqatlanish odati (kuniga necha mahal va asosan qayerda ovqatlanish);
motivatsiya;
kunlik kaloriya va makroelementlar normasi.

Ushbu ma’lumotlar foydalanuvchiga mos hisob-kitoblarni amalga oshirish va ilovaning asosiy funksiyalarini taqdim etish uchun ishlatiladi.

1.3. Vazn tarixi

Foydalanuvchi kiritgan vazn o‘zgarishlari tarix sifatida saqlanishi mumkin.

Bu ma’lumotlar statistikani ko‘rsatish va vazn dinamikasini kuzatish uchun ishlatiladi.

1.4. Ovqatlanish ma’lumotlari

Foydalanuvchi NutriLifer orqali qayd etgan:

taom nomi;
porsiya yoki og‘irlik;
kaloriya;
oqsil;
yog‘;
uglevod;
boshqa ovqatlanish ko‘rsatkichlari;
ovqatlangan sana va vaqt

kabi ma’lumotlar ovqatlanish tarixini shakllantirish uchun saqlanishi mumkin.

2. Taom rasmlari va AI tahlili

Foydalanuvchi taomni rasm orqali tahlil qilganda, yuborilgan rasm AI texnologiyasi yordamida qayta ishlanadi.

AI tahlili orqali, jumladan:

taom turi;
taxminiy porsiya miqdori;
kaloriya;
oqsil;
yog‘;
uglevod;
boshqa oziqaviy ko‘rsatkichlar

aniqlanishi yoki hisoblanishi mumkin.

AI tomonidan berilgan natijalar taxminiy hisob-kitob hisoblanadi. Ular tibbiy tashxis yoki professional dietologik xulosa o‘rnini bosmaydi.

Foydalanuvchi porsiya og‘irligini aniq kiritganida, hisob-kitob aniqligi oshishi mumkin.

3. Ma’lumotlardan foydalanish maqsadi

Yig‘ilgan ma’lumotlardan quyidagi maqsadlarda foydalaniladi:

NutriLifer xizmatlarini taqdim etish;
foydalanuvchining kunlik kaloriya va makroelementlar normasini hisoblash;
ovqatlarni tahlil qilish;
ovqatlanish tarixini saqlash;
vazn o‘zgarishini kuzatish;
statistik ma’lumotlarni shakllantirish;
foydalanuvchi profilini boshqarish;
ilovaning ishlashini yaxshilash;
xavfsizlik va texnik barqarorlikni ta’minlash;
foydalanuvchi murojaatlarini ko‘rib chiqish.

NutriLifer foydalanuvchiga ilovada mavjud bo‘lmagan xizmat yoki funksiyani mavjuddek ko‘rsatmaydi.

4. Ma’lumotlar kimlar bilan almashiladi?

Xizmatni ishlatish uchun zarur hollarda ma’lumotlar NutriLifer faoliyatini ta’minlovchi texnologik xizmatlar bilan qayta ishlanishi mumkin.

Bunga quyidagilar kirishi mumkin:

Telegram — ilovaga kirish va Telegram funksiyalaridan foydalanish;
AI xizmatlari — taom rasmlarini va tegishli ma’lumotlarni tahlil qilish;
server va ma’lumotlar bazasi xizmatlari — ilovaning ma’lumotlarini saqlash va qayta ishlash;
rasm saqlash xizmatlari — foydalanuvchi yuklagan rasmlarni saqlash;
frontend va texnik infratuzilma xizmatlari — ilovaning ishlashini ta’minlash.

Ma’lumotlar xizmatni ko‘rsatish uchun zarur bo‘lmagan maqsadlarda uchinchi shaxslarga sotilmaydi.

5. To‘lov va PRO xizmati

NutriLifer’da PRO funksiyalaridan foydalanish uchun tegishli obuna yoki ruxsat berilishi mumkin.

Ayni paytda PRO imkoniyatlari operator tomonidan Telegram orqali qo‘lda faollashtirilishi mumkin.

To‘lov xizmatlari joriy etilgan taqdirda, ular bo‘yicha alohida tartib va tegishli ma’lumotlar foydalanuvchiga taqdim etiladi.

PRO muddati, uni uzaytirish yoki xizmat bilan bog‘liq boshqa masalalarda foydalanuvchi NutriLifer administratsiyasiga Telegram orqali murojaat qiladi: @NutriLiferPro.

6. Ma’lumotlarni himoya qilish

NutriLifer foydalanuvchi ma’lumotlarini ruxsatsiz kirish, yo‘qotish, o‘zgartirish yoki noqonuniy foydalanishdan himoya qilish uchun tegishli texnik va tashkiliy choralarni qo‘llaydi.

Shu bilan birga, internet tarmog‘i, serverlar, aloqa kanallari va boshqa texnologik infratuzilmalarda yuzaga kelishi mumkin bo‘lgan texnik nosozliklar, xizmatdagi vaqtinchalik uzilishlar, kiberhujumlar yoki NutriLifer nazoratidan tashqaridagi boshqa holatlar sababli ma’lumotlarning vaqtincha mavjud bo‘lmasligi yoki xavfsizlik bilan bog‘liq hodisalar yuzaga kelishi mumkin.

NutriLifer bunday holatlarning oldini olish va ularning oqibatlarini kamaytirish uchun oqilona texnik va tashkiliy choralarni ko‘radi. Biroq NutriLifer nazoratidan tashqarida yuzaga kelgan texnik nosozliklar, xizmat ko‘rsatuvchi uchinchi tomonlarning uzilishlari yoki boshqa kutilmagan holatlar natijasida kelib chiqadigan oqibatlar uchun qonunchilikda belgilangan doirada javobgarlikni o‘z zimmasiga olmaydi.

7. Foydalanuvchi ma’lumotlarini boshqarishi

Foydalanuvchi o‘z profilidagi mavjud ma’lumotlarni ilova funksiyalari orqali ko‘rishi yoki o‘zgartirishi mumkin.

Foydalanuvchi ovqatlanish jurnalidagi alohida yozuvni o‘chirganida, ushbu yozuv foydalanuvchiga ko‘rsatiladigan tarixdan olib tashlanadi.

Texnik va xavfsizlik maqsadlari uchun ayrim ma’lumotlar tizimda boshqa holatda saqlanishi mumkin.

8. Hisobni o‘chirish

Foydalanuvchi o‘z NutriLifer hisobini o‘chirishni so‘rashi mumkin.

Hisob o‘chirilganda foydalanuvchiga tegishli asosiy ma’lumotlar, profil ma’lumotlari, ovqatlanish yozuvlari, vazn tarixi va saqlangan rasmlar o‘chiriladi.

Texnik statistika yoki xizmat faoliyatini tahlil qilish uchun zarur bo‘lgan ayrim ma’lumotlar shaxsiy hisob bilan bog‘lanmaydigan shaklga keltirilishi mumkin.

9. Foydalanuvchilarning yoshi

NutriLifer xizmatidan 18 yoshga to‘lgan va undan katta shaxslar foydalanishi mumkin.

Ilovadan foydalanishni boshlash orqali foydalanuvchi o‘zining 18 yoshga to‘lganini yoki undan katta ekanini tasdiqlaydi.

18 yoshga to‘lmagan shaxslar NutriLifer xizmatidan foydalanmasligi kerak.

10. Cookie va texnik ma’lumotlar

NutriLifer xizmatning to‘g‘ri ishlashi uchun zarur bo‘lgan texnik ma’lumotlarni qayta ishlashi mumkin.

Bunday ma’lumotlarga sessiya, qurilma, texnik xatolar va xizmatdan foydalanish bilan bog‘liq ichki texnik hodisalar kirishi mumkin.

Shuningdek, foydalanuvchi tanlagan ilova sozlamalari — til, mavzu (yorug‘ yoki qorong‘i), vazn va bo‘y o‘lchov birliklari — hisobga bog‘lab saqlanadi va ilova o‘sha tanlovlar bilan ochilishi uchun ishlatiladi.

Ushbu ma’lumotlar xizmatning barqarorligi, xavfsizligi va ishlashini yaxshilash uchun ishlatiladi.

11. Maxfiylik siyosatiga o‘zgartirishlar

NutriLifer ushbu Maxfiylik siyosatiga xizmatdagi o‘zgarishlar yoki qonunchilik talablari sababli o‘zgartirish kiritishi mumkin.

Yangilangan siyosat NutriLifer’da e’lon qilingan kundan boshlab kuchga kiradi.

Muhim o‘zgarishlar yuz berganda foydalanuvchiga tegishli xabarnoma berilishi mumkin.

Foydalanuvchi yangilanishdan keyin xizmatdan foydalanishda davom etsa, yangilangan tahrir bilan tanishgan va uni qabul qilgan hisoblanadi.

12. Maxfiylik siyosatiga rozilik

NutriLifer ilovasidan foydalanishni boshlash orqali foydalanuvchi ushbu Maxfiylik siyosati bilan tanishganini, uning shartlarini qabul qilganini va shaxsga doir ma’lumotlariga ushbu Siyosatda ko‘rsatilgan maqsadlarda ishlov berilishiga rozilik bildirganini tasdiqlaydi.

Agar foydalanuvchi ushbu Maxfiylik siyosati shartlariga rozi bo‘lmasa, u NutriLifer xizmatidan foydalanishni boshlamasligi yoki undan foydalanishni to‘xtatishi kerak.


13. Amaldagi qonunchilik

NutriLifer foydalanuvchilarning ma’lumotlarini qayta ishlashda O‘zbekiston Respublikasining amaldagi qonunchiligi, shu jumladan shaxsga doir ma’lumotlarni himoya qilishga oid talablariga rioya qilishga intiladi.

14. Aloqa

Maxfiylik, shaxsiy ma’lumotlar yoki hisob bilan bog‘liq savollar bo‘yicha NutriLifer operatoriga murojaat qilish mumkin:

Xizmat: NutriLifer bot
Telegram: @NutriLiferPro`,
    ru: `ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ NUTRILIFER BOT

Дата вступления в силу: 23 сентября 2026 года
Версия: 2026-09-23

Оригинал документа составлен на узбекском языке. В случае расхождений преимущественную силу имеет узбекская версия.

Настоящая Политика конфиденциальности разъясняет, каким образом собираются, используются, хранятся и защищаются данные пользователей при использовании бота NutriLifer, Telegram Mini App и связанных с ними сервисов.

NutriLifer с особой осмотрительностью относится к персональным данным Пользователя и использует их исключительно для предоставления и улучшения сервиса, а также для реализации функций, запрошенных Пользователем.

1. Какие данные мы собираем?

При использовании NutriLifer могут обрабатываться следующие данные:

1.1. Данные Telegram

При входе в приложение через Telegram могут быть получены следующие данные:

идентификатор пользователя Telegram;
имя в Telegram;
фотография профиля Telegram;
технические данные, связанные с аккаунтом Telegram.

Имя пользователя (username) Telegram не сохраняется в базе данных NutriLifer в качестве отдельных данных пользователя.

1.2. Данные профиля и онбординга

Могут сохраняться следующие данные, введённые Пользователем в приложении:

имя;
возраст;
пол;
рост;
вес;
цель;
уровень физической активности;
предпочтения в питании;
привычки питания (сколько раз в день и преимущественно где Пользователь принимает пищу);
мотивация;
суточная норма калорий и макроэлементов.

Указанные данные используются для проведения соответствующих Пользователю расчётов и предоставления основных функций приложения.

1.3. История веса

Изменения веса, внесённые Пользователем, могут сохраняться в виде истории.

Эти данные используются для отображения статистики и отслеживания динамики веса.

1.4. Данные о питании

Зафиксированные Пользователем через NutriLifer данные, такие как:

наименование блюда;
порция или вес;
калории;
белки;
жиры;
углеводы;
иные показатели питания;
дата и время приёма пищи

могут сохраняться для формирования истории питания.

2. Фотографии блюд и AI-анализ

Когда Пользователь анализирует блюдо по фотографии, отправленное изображение обрабатывается с помощью технологии AI.

Посредством AI-анализа, в частности:

вид блюда;
примерный размер порции;
калории;
белки;
жиры;
углеводы;
иные показатели пищевой ценности

могут быть определены или рассчитаны.

Результаты, предоставленные AI, являются приблизительным расчётом. Они не заменяют медицинский диагноз или профессиональное заключение диетолога.

Если Пользователь точно указывает вес порции, точность расчёта может повыситься.

3. Цели использования данных

Собранные данные используются в следующих целях:

предоставление услуг NutriLifer;
расчёт суточной нормы калорий и макроэлементов Пользователя;
анализ блюд;
хранение истории питания;
отслеживание изменений веса;
формирование статистических данных;
управление профилем Пользователя;
улучшение работы приложения;
обеспечение безопасности и технической стабильности;
рассмотрение обращений Пользователя.

NutriLifer не представляет Пользователю отсутствующую в приложении услугу или функцию как существующую.

4. С кем осуществляется обмен данными?

В необходимых для работы сервиса случаях данные могут обрабатываться с привлечением технологических сервисов, обеспечивающих деятельность NutriLifer.

К ним могут относиться:

Telegram — вход в приложение и использование функций Telegram;
AI-сервисы — анализ фотографий блюд и связанных с ними данных;
сервисы серверов и баз данных — хранение и обработка данных приложения;
сервисы хранения изображений — хранение загруженных Пользователем фотографий;
сервисы фронтенда и технической инфраструктуры — обеспечение работы приложения.

Данные не продаются третьим лицам в целях, не являющихся необходимыми для оказания услуги.

5. Оплата и услуга PRO

В NutriLifer для использования функций PRO может быть предоставлена соответствующая подписка или разрешение.

В настоящее время возможности PRO могут активироваться оператором вручную через Telegram.

В случае внедрения платёжных сервисов Пользователю будут предоставлены отдельный порядок и соответствующие сведения по ним.

По вопросам срока действия PRO, его продления или иным вопросам, связанным с услугой, Пользователь обращается к администрации NutriLifer через Telegram: @NutriLiferPro.

6. Защита данных

NutriLifer применяет соответствующие технические и организационные меры для защиты данных Пользователя от несанкционированного доступа, утраты, изменения или неправомерного использования.

Вместе с тем вследствие возможных технических сбоев в сети интернет, на серверах, в каналах связи и иной технологической инфраструктуре, временных перерывов в работе сервиса, кибератак или иных обстоятельств, находящихся вне контроля NutriLifer, возможны временная недоступность данных или инциденты, связанные с безопасностью.

NutriLifer принимает разумные технические и организационные меры для предотвращения таких обстоятельств и уменьшения их последствий. Однако NutriLifer не несёт ответственности в пределах, установленных законодательством, за последствия, возникшие в результате технических сбоев вне его контроля, перерывов в работе третьих лиц, оказывающих услуги, или иных непредвиденных обстоятельств.

7. Управление данными Пользователем

Пользователь может просматривать или изменять имеющиеся в его профиле данные посредством функций приложения.

При удалении Пользователем отдельной записи в дневнике питания указанная запись убирается из отображаемой Пользователю истории.

В технических целях и целях безопасности отдельные данные могут сохраняться в системе в ином виде.

8. Удаление учётной записи

Пользователь может запросить удаление своей учётной записи NutriLifer.

При удалении учётной записи удаляются относящиеся к Пользователю основные данные, данные профиля, записи о питании, история веса и сохранённые фотографии.

Отдельные данные, необходимые для технической статистики или анализа деятельности сервиса, могут быть приведены к форме, не связанной с персональной учётной записью.

9. Возраст пользователей

Услугой NutriLifer могут пользоваться лица, достигшие 18 лет, и старше.

Начиная использовать приложение, Пользователь подтверждает, что ему исполнилось 18 лет или что он старше указанного возраста.

Лицам, не достигшим 18 лет, не следует пользоваться услугой NutriLifer.

10. Cookie и технические данные

NutriLifer может обрабатывать технические данные, необходимые для корректной работы сервиса.

К таким данным могут относиться сессия, устройство, технические ошибки и внутренние технические события, связанные с использованием сервиса.

Кроме того, выбранные Пользователем настройки приложения — язык, тема (светлая или тёмная), единицы измерения веса и роста — сохраняются с привязкой к учётной записи и используются для того, чтобы приложение открывалось с этими выбранными параметрами.

Указанные данные используются для повышения стабильности, безопасности и улучшения работы сервиса.

11. Изменения в Политике конфиденциальности

NutriLifer может вносить изменения в настоящую Политику конфиденциальности в связи с изменениями в сервисе или требованиями законодательства.

Обновлённая политика вступает в силу со дня её опубликования в NutriLifer.

При наступлении существенных изменений Пользователю может быть направлено соответствующее уведомление.

Если Пользователь продолжает пользоваться сервисом после обновления, считается, что он ознакомился с обновлённой редакцией и принял её.

12. Согласие с Политикой конфиденциальности

Начиная пользоваться приложением NutriLifer, Пользователь подтверждает, что ознакомился с настоящей Политикой конфиденциальности, принял её условия и дал согласие на обработку своих персональных данных в целях, указанных в настоящей Политике.

Если Пользователь не согласен с условиями настоящей Политики конфиденциальности, ему не следует начинать пользоваться услугой NutriLifer либо следует прекратить её использование.


13. Применимое законодательство

При обработке данных пользователей NutriLifer стремится соблюдать действующее законодательство Республики Узбекистан, в том числе требования о защите персональных данных.

14. Контакты

По вопросам, связанным с конфиденциальностью, персональными данными или учётной записью, можно обратиться к оператору NutriLifer:

Сервис: NutriLifer bot
Telegram: @NutriLiferPro`,
    en: `NUTRILIFER BOT PRIVACY POLICY

Effective date: 23 September 2026
Version: 2026-09-23

The original document is written in Uzbek. In case of any discrepancy, the Uzbek version prevails.

This Privacy Policy explains how users' data is collected, used, stored and protected when using the NutriLifer bot, the Telegram Mini App and the related services.

NutriLifer treats the User's personal data with care and uses it solely to provide and improve the service and to perform the functions requested by the User.

1. What data do we collect?

The following data may be processed when using NutriLifer:

1.1. Telegram data

The following data may be obtained when the application is accessed through Telegram:

the Telegram user identifier;
the name on Telegram;
the Telegram profile photo;
technical data related to the Telegram account.

The Telegram username is not stored in the NutriLifer database as separate user data.

1.2. Profile and onboarding data

The following data entered by the User in the application may be stored:

name;
age;
sex;
height;
weight;
goal;
level of physical activity;
dietary preferences;
eating habits (how many times a day and mainly where the User eats);
motivation;
daily calorie and macronutrient allowance.

This data is used to perform calculations appropriate to the User and to provide the main functions of the application.

1.3. Weight history

Weight changes entered by the User may be stored as a history.

This data is used to display statistics and to track weight dynamics.

1.4. Nutrition data

Data recorded by the User through NutriLifer, such as:

the name of the meal;
the portion or weight;
calories;
protein;
fat;
carbohydrates;
other nutrition indicators;
the date and time of the meal

may be stored in order to build the nutrition history.

2. Meal photos and AI analysis

When the User analyses a meal by photo, the submitted image is processed using AI technology.

By means of AI analysis, in particular:

the type of meal;
the approximate portion size;
calories;
protein;
fat;
carbohydrates;
other nutritional indicators

may be identified or calculated.

The results provided by AI constitute an approximate calculation. They do not replace a medical diagnosis or a professional dietetic opinion.

Where the User enters the portion weight precisely, the accuracy of the calculation may increase.

3. Purposes of using the data

The collected data is used for the following purposes:

providing the NutriLifer services;
calculating the User's daily calorie and macronutrient allowance;
analysing meals;
storing the nutrition history;
tracking weight changes;
generating statistical data;
managing the User's profile;
improving the performance of the application;
ensuring security and technical stability;
handling the User's enquiries.

NutriLifer does not present to the User a service or function that is not available in the application as if it existed.

4. With whom is the data shared?

Where necessary for the operation of the service, the data may be processed together with the technology services that support the operation of NutriLifer.

These may include:

Telegram — access to the application and use of Telegram functions;
AI services — analysis of meal photos and the related data;
server and database services — storage and processing of the application's data;
image storage services — storage of images uploaded by the User;
frontend and technical infrastructure services — ensuring the operation of the application.

The data is not sold to third parties for purposes that are not necessary for providing the service.

5. Payment and the PRO service

In NutriLifer, a corresponding subscription or permission may be granted in order to use the PRO functions.

At present, the PRO features may be activated manually by the operator through Telegram.

If payment services are introduced, a separate procedure and the relevant information regarding them will be provided to the User.

On matters concerning the PRO term, its extension or other issues related to the service, the User contacts the NutriLifer administration through Telegram: @NutriLiferPro.

6. Protection of data

NutriLifer applies appropriate technical and organisational measures to protect the User's data against unauthorised access, loss, alteration or unlawful use.

At the same time, due to technical failures that may arise in the internet network, on servers, in communication channels and in other technological infrastructure, temporary interruptions of the service, cyberattacks or other circumstances beyond the control of NutriLifer, the data may become temporarily unavailable or security-related incidents may occur.

NutriLifer takes reasonable technical and organisational measures to prevent such circumstances and to mitigate their consequences. However, NutriLifer does not assume liability, within the limits established by law, for consequences arising from technical failures beyond its control, interruptions on the part of third-party service providers or other unforeseen circumstances.

7. Management of the data by the User

The User may view or modify the data available in their profile through the functions of the application.

When the User deletes an individual entry in the nutrition log, that entry is removed from the history shown to the User.

For technical and security purposes, certain data may be retained in the system in another form.

8. Deletion of the account

The User may request the deletion of their NutriLifer account.

When the account is deleted, the main data relating to the User, the profile data, the nutrition entries, the weight history and the stored images are deleted.

Certain data necessary for technical statistics or for analysing the operation of the service may be brought into a form that is not linked to a personal account.

9. Age of users

The NutriLifer service may be used by persons who have reached the age of 18 and older.

By starting to use the application, the User confirms that they have reached the age of 18 or are older.

Persons under the age of 18 should not use the NutriLifer service.

10. Cookie and technical data

NutriLifer may process technical data necessary for the proper operation of the service.

Such data may include the session, the device, technical errors and internal technical events related to the use of the service.

In addition, the application settings chosen by the User — language, theme (light or dark), weight and height units of measurement — are stored in connection with the account and are used so that the application opens with those selections.

This data is used to improve the stability, security and performance of the service.

11. Changes to the Privacy Policy

NutriLifer may make changes to this Privacy Policy due to changes in the service or requirements of the law.

The updated policy takes effect from the day it is published on NutriLifer.

Where material changes occur, the User may be given an appropriate notification.

If the User continues to use the service after an update, the User is deemed to have reviewed and accepted the updated version.

12. Consent to the Privacy Policy

By starting to use the NutriLifer application, the User confirms that they have reviewed this Privacy Policy, accepted its terms and consented to the processing of their personal data for the purposes set out in this Policy.

If the User does not agree with the terms of this Privacy Policy, the User should not start using the NutriLifer service or should cease using it.


13. Applicable law

In processing users' data, NutriLifer endeavours to comply with the applicable law of the Republic of Uzbekistan, including the requirements on the protection of personal data.

14. Contact

For questions related to privacy, personal data or the account, the NutriLifer operator may be contacted:

Service: NutriLifer bot
Telegram: @NutriLiferPro`,
  },
  oferta: {
    uz: `NUTRILIFER BOT OMMAVIY OFERTASI

Amal qilish sanasi: 2026-yil 23-sentabr
Versiya: 2026-09-23

1. Umumiy qoidalar

Ushbu Ommaviy oferta NutriLifer bot, Telegram Mini App va ular orqali taqdim etiladigan xizmatlardan, shu jumladan PRO funksiyalaridan foydalanish shartlarini belgilaydi.

Mazkur Ommaviy oferta NutriLifer bot administratori tomonidan taqdim etiladi.

Ushbu Oferta O‘zbekiston Respublikasining amaldagi qonunchiligiga muvofiq qo‘llanadi.

2. Oferta predmeti

NutriLifer foydalanuvchilarga ovqatlanishni kuzatish va tahlil qilishga yordam beruvchi raqamli xizmatlarni taqdim etadi.

Xizmatning mavjud funksiyalariga qarab foydalanuvchi:

taomlarni rasm orqali AI yordamida tahlil qilishi;
taomning taxminiy kaloriya miqdorini aniqlashi;
oqsil, yog‘ va uglevod miqdorini ko‘rishi;
kunlik kaloriya va makroelementlar normasini hisoblatishi;
ovqatlanish tarixini yuritishi;
vazn o‘zgarishini kuzatishi;
statistik ma’lumotlarni ko‘rishi;
PRO funksiyalaridan foydalanishi

mumkin.

Xizmatning ayrim funksiyalari bepul, ayrim funksiyalari esa PRO foydalanuvchilar uchun taqdim etiladi.

3. Foydalanuvchiga qo‘yiladigan talablar

NutriLifer xizmatidan 18 yoshga to‘lgan va undan katta shaxslar foydalanishi mumkin.

Xizmatdan foydalanishni boshlash orqali foydalanuvchi o‘zining 18 yoshga to‘lganini yoki undan katta ekanini tasdiqlaydi.

Foydalanuvchi xizmatdan foydalanish vaqtida taqdim etadigan ma’lumotlarning to‘g‘riligini ta’minlashi kerak.

4. Oferta aksepti

Foydalanuvchining ushbu Oferta shartlarini qabul qilishi quyidagi harakatlar orqali amalga oshirilishi mumkin:

Oferta shartlarini qabul qilish tugmasini bosish;
NutriLifer xizmatidan foydalanishni boshlash;
PRO xizmatini faollashtirishga murojaat qilish;
PRO xizmatidan foydalanish uchun to‘lovni amalga oshirish;
Oferta shartlarini qabul qilishga qaratilgan boshqa elektron harakatni bajarish.

Foydalanuvchi tomonidan ushbu harakatlardan tegishlisi amalga oshirilganda, Oferta aksept qilingan hisoblanadi.

Oferta aksepti Foydalanuvchining Oferta shartlarini to‘liq va shartsiz qabul qilganligini anglatadi.

5. NutriLifer xizmatidan foydalanish

Foydalanuvchi NutriLifer xizmatidan ushbu Oferta, Maxfiylik siyosati va amaldagi qonunchilikka muvofiq foydalanishi kerak.

Foydalanuvchi xizmatdan foydalanish orqali:

xizmatdan qonuniy maqsadlarda foydalanish;
taqdim etayotgan ma’lumotlarini imkon qadar to‘g‘ri kiritish;
boshqa foydalanuvchilarning huquqlarini buzmaslik;
xizmatning normal ishlashiga qasddan xalaqit bermaslik

majburiyatlarini qabul qiladi.

6. AI yordamida tahlil qilish

NutriLifer ayrim funksiyalarni amalga oshirishda AI texnologiyalaridan foydalanadi.

AI yordamida aniqlangan yoki hisoblangan:

taom turi;
porsiya hajmi;
kaloriya;
oqsil;
yog‘;
uglevod;
boshqa oziqaviy ko‘rsatkichlar

taxminiy natijalar hisoblanadi.

Natijaning aniqligi rasm sifati, taom tarkibi, porsiya hajmi, tayyorlash usuli va foydalanuvchi tomonidan kiritilgan ma’lumotlarga bog‘liq bo‘lishi mumkin.

Foydalanuvchi porsiya og‘irligini aniq kiritishi orqali hisob-kitob aniqligini oshirishi mumkin.

AI natijalari tibbiy tashxis, davolash yoki individual tibbiy tavsiya hisoblanmaydi.

Foydalanuvchi sog‘lig‘i bilan bog‘liq muhim qarorlarni faqat NutriLifer natijalariga asoslanib qabul qilmasligi kerak.

7. Kaloriya va makroelementlar hisob-kitobi

NutriLifer tomonidan hisoblanadigan kunlik kaloriya va makroelementlar normasi foydalanuvchi tomonidan taqdim etilgan ma’lumotlar asosida shakllantiriladi.

Ushbu hisob-kitoblar umumiy ma’lumot va yo‘nalish berish uchun mo‘ljallangan.

Ular shifokor, dietolog yoki boshqa malakali mutaxassisning individual tavsiyasini almashtirmaydi.

8. PRO xizmatlari

PRO — NutriLifer’da qo‘shimcha funksiyalardan foydalanish imkonini beruvchi xizmat maqomidir.

PRO tarkibiga kiruvchi funksiyalar NutriLifer ilovasida yoki xizmatning tegishli sahifalarida ko‘rsatiladi.

PRO tarkibi vaqt o‘tishi bilan yangilanishi, o‘zgartirilishi yoki ayrim funksiyalar almashtirilishi mumkin.

Foydalanuvchi PRO xizmatini faollashtirishdan oldin uning amaldagi shartlari bilan tanishishi mumkin.

9. PRO narxi va to‘lov

PRO xizmatining narxi foydalanuvchiga xizmatni faollashtirishdan oldin ma’lum qilinadi.

Hozirgi bosqichda PRO funksiyalari NutriLifer bot administratori bilan Telegram orqali kelishilgan tartibda qo‘lda faollashtirilishi mumkin.

Agar kelgusida avtomatik to‘lov yoki obuna tizimi joriy etilsa, bunday to‘lovlarning tartibi, narxi, muddati va boshqa shartlari foydalanuvchiga to‘lovni amalga oshirishdan oldin ko‘rsatiladi.

PRO muddatli xizmat bo‘lib, avtomatik takroriy to‘lov qo‘llanilmaydi: muddat tugagach to‘lov o‘z-o‘zidan yechilmaydi va PRO funksiyalari yopiladi. Obunani alohida bekor qilish talab etilmaydi.

10. PRO xizmatining amal qilish muddati

PRO xizmatining amal qilish muddati foydalanuvchiga faollashtirish vaqtida ma’lum qilinadi.

PRO maqomi tegishli muddat davomida foydalanuvchining NutriLifer hisobiga biriktiriladi.

Agar alohida shart belgilanmagan bo‘lsa, PRO maqomi boshqa foydalanuvchiga o‘tkazilmaydi.

PRO maqomi to‘langan muddat oxirigacha amal qiladi va muddat tugashi bilan avtomatik yopiladi; jurnal, progress va boshqa saqlangan ma’lumotlar foydalanuvchida qoladi.

PRO muddatini uzaytirish, faollashtirish yoki xizmat bilan bog‘liq boshqa masalalarda foydalanuvchi NutriLifer administratsiyasiga Telegram orqali murojaat qiladi: @NutriLiferPro.

11. Foydalanuvchi tomonidan yuklanadigan ma’lumotlar

Foydalanuvchi NutriLifer’ga yuklaydigan rasmlar va boshqa materiallardan foydalanish huquqiga ega bo‘lishi kerak.

Foydalanuvchi quyidagi kontentni yuklamasligi yoki tarqatmasligi kerak:

noqonuniy kontent;
boshqa shaxslarning huquqlarini buzuvchi materiallar;
zararli dasturlar;
firibgarlikka qaratilgan materiallar;
xizmatning ishlashiga zarar yetkazuvchi kontent.
12. Taqiqlangan foydalanish

NutriLifer’dan:

tizimga ruxsatsiz kirish;
boshqa foydalanuvchilarning hisoblariga kirishga urinish;
server yoki tizimlarga zarar yetkazish;
xizmatga sun’iy yoki ortiqcha yuklama yaratish;
dasturiy zaifliklardan noqonuniy foydalanish;
zararli dasturlar tarqatish;
qonunga xilof faoliyatni amalga oshirish

uchun foydalanish taqiqlanadi.

13. Xizmatning mavjudligi

NutriLifer xizmatining imkon qadar barqaror ishlashi ta’minlanadi.

Biroq xizmatda quyidagi sabablar tufayli vaqtinchalik uzilishlar yoki cheklovlar yuzaga kelishi mumkin:

texnik nosozliklar;
serverdagi muammolar;
internet yoki aloqa uzilishlari;
rejalashtirilgan texnik ishlar;
uchinchi tomon xizmatlaridagi nosozliklar;
kiberxavfsizlik bilan bog‘liq hodisalar;
boshqa kutilmagan holatlar.

Bunday holatlarda ayrim funksiyalarning vaqtincha ishlamasligi mumkin.

14. Javobgarlikni cheklash

NutriLifer xizmatni imkon qadar sifatli va barqaror taqdim etishga harakat qiladi.

Biroq AI tomonidan berilgan taxminiy natijalar, kaloriya hisob-kitoblari yoki boshqa ma’lumotlarning har doim mutlaq aniqligini kafolatlamaydi.

Foydalanuvchi NutriLifer tomonidan taqdim etilgan ma’lumotlardan foydalanish asosida qabul qiladigan qarorlari uchun o‘zi javobgar hisoblanadi.

NutriLifer nazoratidan tashqarida yuzaga kelgan texnik nosozliklar, internet yoki aloqa uzilishlari, uchinchi tomon xizmatlaridagi muammolar va boshqa kutilmagan holatlar natijasida yuzaga keladigan oqibatlar uchun NutriLifer qonunchilikda belgilangan doirada javobgar bo‘lmaydi.

Ushbu band qonunchilik bo‘yicha xizmat ko‘rsatuvchi zimmasiga yuklatilgan majburiy javobgarlikni istisno qilmaydi.

15. Intellektual mulk

NutriLifer’ning nomi, logotipi, dizayni, interfeysi, dasturiy kodi, matnlari, grafik elementlari va boshqa original materiallari tegishli intellektual mulk huquqlari bilan himoyalanadi.

Ushbu materiallarni NutriLifer bot administratori ruxsatisiz nusxalash, tarqatish, o‘zgartirish yoki tijoriy maqsadda foydalanish mumkin emas.

16. Xizmatni o‘zgartirish

NutriLifer bot administratori xizmatning:

funksiyalarini;
interfeysini;
PRO tarkibini;
tariflarini;
foydalanish tartibini

o‘zgartirish huquqiga ega.

Muhim o‘zgarishlar yuz berganda foydalanuvchiga imkon qadar oldindan ma’lumot beriladi.

17. Hisobni cheklash yoki to‘xtatish

Foydalanuvchi ushbu Oferta shartlarini yoki amaldagi qonunchilikni buzgan taqdirda, NutriLifer bot administratori hisobdan foydalanishni vaqtincha cheklashi yoki to‘xtatishi mumkin.

Xavfsizlik yoki boshqa qonuniy sabablar talab qilgan holatlarda bunday cheklov oldindan ogohlantirmasdan qo‘llanishi mumkin.

18. Maxfiylik

Foydalanuvchining shaxsiy ma’lumotlarini yig‘ish, qayta ishlash, saqlash va himoya qilish tartibi alohida NutriLifer Maxfiylik siyosati bilan belgilanadi.

Maxfiylik siyosati ushbu Oferta bilan birgalikda qo‘llanadi.

19. Oferta shartlariga o‘zgartirishlar

NutriLifer bot administratori ushbu Oferta shartlarini xizmatdagi o‘zgarishlar, yangi funksiyalar yoki qonunchilikdagi o‘zgarishlar sababli yangilashi mumkin.

Yangilangan Oferta unda ko‘rsatilgan sanadan yoki e’lon qilingan paytdan boshlab kuchga kiradi.

Foydalanuvchining Oferta yangilanganidan keyin xizmatdan foydalanishda davom etishi, agar qonunchilik yoki yangi tahrirda boshqacha tartib belgilanmagan bo‘lsa, yangi shartlarni qabul qilganligini anglatadi.

20. Oferta amal qilish muddati

Ushbu Ommaviy oferta yangi tahrir e’lon qilingunga yoki bekor qilingunga qadar amal qiladi.

Yangi tahrir e’lon qilinganidan keyingi foydalanish tegishli yangi tahrir shartlari asosida amalga oshiriladi.

21. Nizolarni hal qilish

NutriLifer va foydalanuvchi o‘rtasida yuzaga kelishi mumkin bo‘lgan nizolar, avvalo, muzokara va kelishuv orqali hal qilinadi.

Kelishuvga erishishning imkoni bo‘lmagan taqdirda, nizolar O‘zbekiston Respublikasining amaldagi qonunchiligiga muvofiq hal etiladi.

22. Yakuniy qoidalar

Agar ushbu Oferta qoidalarining biror qismi amaldagi qonunchilikka zid deb topilsa yoki haqiqiy emas deb hisoblansa, bu holat Oferta boshqa qoidalarining amal qilishiga ta’sir qilmaydi.

Qolgan qoidalar o‘z kuchida qoladi.

23. Oferta va shartlarni qabul qilish

NutriLifer xizmatidan foydalanishni boshlash orqali foydalanuvchi:

ushbu Ommaviy oferta bilan tanishganini;
uning mazmunini tushunganini;
Oferta shartlarini qabul qilganini;
xizmatdan foydalanish qoidalariga rioya qilishini

tasdiqlaydi.

Foydalanuvchi ushbu shartlarga rozi bo‘lmasa, NutriLifer xizmatidan foydalanmasligi kerak.

24. Xizmat ko‘rsatuvchi haqida ma’lumot

Xizmat nomi: NutriLifer bot
Operator: NutriLifer bot administratsiyasi
Telegram: @NutriLiferPro`,
    ru: `ПУБЛИЧНАЯ ОФЕРТА NUTRILIFER BOT

Дата вступления в силу: 23 сентября 2026 года
Версия: 2026-09-23

Оригинал документа составлен на узбекском языке. В случае расхождений преимущественную силу имеет узбекская версия.

1. Общие положения

Настоящая Публичная оферта определяет условия использования бота NutriLifer, Telegram Mini App и предоставляемых через них услуг, в том числе функций PRO.

Настоящая Публичная оферта предоставляется администрацией бота NutriLifer.

Настоящая Оферта применяется в соответствии с действующим законодательством Республики Узбекистан.

2. Предмет оферты

NutriLifer предоставляет Пользователям цифровые услуги, помогающие вести учёт и анализ питания.

В зависимости от доступных функций Сервиса Пользователю:

анализ блюд по фотографии с помощью AI;
определение приблизительной калорийности блюда;
просмотр количества белков, жиров и углеводов;
расчёт суточной нормы калорий и макроэлементов;
ведение истории питания;
отслеживание изменения веса;
просмотр статистических данных;
использование функций PRO

доступны.

Отдельные функции Сервиса предоставляются бесплатно, а отдельные функции — Пользователям PRO.

3. Требования, предъявляемые к Пользователю

Сервисом NutriLifer могут пользоваться лица, достигшие 18 лет, и лица старше этого возраста.

Начиная пользоваться Сервисом, Пользователь подтверждает, что ему исполнилось 18 лет или что он старше этого возраста.

Пользователь обязан обеспечивать достоверность данных, предоставляемых им при пользовании Сервисом.

4. Акцепт оферты

Принятие Пользователем условий настоящей Оферты может осуществляться посредством следующих действий:

нажатие кнопки принятия условий Оферты;
начало пользования Сервисом NutriLifer;
обращение за активацией услуги PRO;
осуществление оплаты за пользование услугой PRO;
совершение иного электронного действия, направленного на принятие условий Оферты.

При совершении Пользователем соответствующего из указанных действий Оферта считается акцептованной.

Акцепт Оферты означает полное и безоговорочное принятие Пользователем условий Оферты.

5. Пользование Сервисом NutriLifer

Пользователь обязан пользоваться Сервисом NutriLifer в соответствии с настоящей Офертой, Политикой конфиденциальности и действующим законодательством.

Используя Сервис, Пользователь:

использовать Сервис в законных целях;
вводить предоставляемые им данные максимально достоверно;
не нарушать права других пользователей;
не препятствовать умышленно нормальной работе Сервиса

принимает на себя обязательства.

6. Анализ с помощью AI

NutriLifer при реализации отдельных функций использует технологии AI.

Определённые или рассчитанные с помощью AI:

тип блюда;
размер порции;
калории;
белки;
жиры;
углеводы;
иные показатели пищевой ценности

считаются приблизительными результатами.

Точность результата может зависеть от качества фотографии, состава блюда, размера порции, способа приготовления и данных, введённых Пользователем.

Пользователь может повысить точность расчётов, точно указав вес порции.

Результаты AI не являются медицинским диагнозом, лечением или индивидуальной медицинской рекомендацией.

Пользователь не должен принимать важные решения, связанные со своим здоровьем, основываясь только на результатах NutriLifer.

7. Расчёт калорий и макроэлементов

Рассчитываемая Сервисом NutriLifer суточная норма калорий и макроэлементов формируется на основании данных, предоставленных Пользователем.

Данные расчёты предназначены для предоставления общей информации и ориентира.

Они не заменяют индивидуальную рекомендацию врача, диетолога или иного квалифицированного специалиста.

8. Услуги PRO

PRO — статус услуги, предоставляющий возможность пользоваться дополнительными функциями в NutriLifer.

Функции, входящие в состав PRO, указываются в приложении NutriLifer или на соответствующих страницах Сервиса.

Состав PRO со временем может обновляться, изменяться, а отдельные функции могут заменяться.

Пользователь может ознакомиться с действующими условиями услуги PRO до её активации.

9. Стоимость PRO и оплата

Стоимость услуги PRO сообщается Пользователю до активации услуги.

На текущем этапе функции PRO могут активироваться вручную в порядке, согласованном с администрацией бота NutriLifer через Telegram.

Если в дальнейшем будет введена система автоматической оплаты или подписки, порядок, стоимость, срок и иные условия таких платежей будут указаны Пользователю до осуществления оплаты.

PRO является срочной услугой, автоматические повторные платежи не применяются: по окончании срока оплата не списывается сама собой и функции PRO закрываются. Отдельная отмена подписки не требуется.

10. Срок действия услуги PRO

Срок действия услуги PRO сообщается Пользователю в момент активации.

Статус PRO закрепляется за учётной записью Пользователя в NutriLifer на соответствующий срок.

Если не установлено отдельное условие, статус PRO не передаётся другому пользователю.

Статус PRO действует до окончания оплаченного срока и по истечении срока закрывается автоматически; журнал, прогресс и иные сохранённые данные остаются у Пользователя.

По вопросам продления срока PRO, активации или иным вопросам, связанным с услугой, Пользователь обращается к администрации NutriLifer через Telegram: @NutriLiferPro.

11. Данные, загружаемые Пользователем

Пользователь должен обладать правом на использование фотографий и иных материалов, загружаемых им в NutriLifer.

Пользователь не должен загружать или распространять следующий контент:

незаконный контент;
материалы, нарушающие права других лиц;
вредоносные программы;
материалы, направленные на мошенничество;
контент, причиняющий вред работе Сервиса.
12. Запрещённое использование

Использование NutriLifer в целях:

несанкционированного доступа в систему;
попыток доступа к учётным записям других пользователей;
причинения вреда серверам или системам;
создания искусственной или избыточной нагрузки на Сервис;
незаконного использования программных уязвимостей;
распространения вредоносных программ;
осуществления противоправной деятельности

запрещается.

13. Доступность Сервиса

Обеспечивается максимально стабильная работа Сервиса NutriLifer.

Однако в Сервисе по следующим причинам могут возникать временные перебои или ограничения:

технические неисправности;
проблемы на сервере;
перебои интернета или связи;
плановые технические работы;
неисправности в сервисах третьих лиц;
происшествия, связанные с кибербезопасностью;
иные непредвиденные обстоятельства.

В таких случаях отдельные функции могут временно не работать.

14. Ограничение ответственности

NutriLifer стремится предоставлять Сервис максимально качественно и стабильно.

Однако не гарантирует, что приблизительные результаты, выданные AI, расчёты калорий или иные данные всегда абсолютно точны.

Пользователь сам несёт ответственность за решения, принимаемые им на основании использования данных, предоставленных NutriLifer.

За последствия, возникающие в результате технических неисправностей, перебоев интернета или связи, проблем в сервисах третьих лиц и иных непредвиденных обстоятельств, возникших вне контроля NutriLifer, NutriLifer не несёт ответственности в пределах, установленных законодательством.

Настоящий пункт не исключает обязательную ответственность, возложенную законодательством на поставщика услуг.

15. Интеллектуальная собственность

Наименование, логотип, дизайн, интерфейс, программный код, тексты, графические элементы и иные оригинальные материалы NutriLifer защищены соответствующими правами интеллектуальной собственности.

Копирование, распространение, изменение или использование данных материалов в коммерческих целях без разрешения администрации бота NutriLifer не допускается.

16. Изменение Сервиса

Администрация бота NutriLifer:

функции Сервиса;
интерфейс Сервиса;
состав PRO;
тарифы;
порядок пользования Сервисом

вправе изменять.

При наступлении существенных изменений Пользователю по возможности заранее предоставляется информация.

17. Ограничение или приостановление учётной записи

В случае нарушения Пользователем условий настоящей Оферты или действующего законодательства администрация бота NutriLifer может временно ограничить или приостановить пользование учётной записью.

В случаях, когда этого требуют безопасность или иные законные основания, такое ограничение может применяться без предварительного предупреждения.

18. Конфиденциальность

Порядок сбора, обработки, хранения и защиты персональных данных Пользователя определяется отдельной Политикой конфиденциальности NutriLifer.

Политика конфиденциальности применяется совместно с настоящей Офертой.

19. Изменения условий Оферты

Администрация бота NutriLifer может обновлять условия настоящей Оферты в связи с изменениями в Сервисе, новыми функциями или изменениями в законодательстве.

Обновлённая Оферта вступает в силу с указанной в ней даты или с момента опубликования.

Продолжение пользования Сервисом Пользователем после обновления Оферты означает принятие им новых условий, если законодательством или новой редакцией не установлен иной порядок.

20. Срок действия Оферты

Настоящая Публичная оферта действует до опубликования новой редакции или до её отмены.

Пользование после опубликования новой редакции осуществляется на основании условий соответствующей новой редакции.

21. Разрешение споров

Споры, которые могут возникнуть между NutriLifer и Пользователем, разрешаются прежде всего путём переговоров и соглашения.

В случае невозможности достижения соглашения споры разрешаются в соответствии с действующим законодательством Республики Узбекистан.

22. Заключительные положения

Если какая-либо часть положений настоящей Оферты будет признана противоречащей действующему законодательству или будет сочтена недействительной, это обстоятельство не влияет на действие остальных положений Оферты.

Остальные положения сохраняют свою силу.

23. Принятие Оферты и условий

Начиная пользоваться Сервисом NutriLifer, Пользователь:

ознакомление с настоящей Публичной офертой;
понимание её содержания;
принятие условий Оферты;
соблюдение правил пользования Сервисом

подтверждает.

Если Пользователь не согласен с настоящими условиями, он не должен пользоваться Сервисом NutriLifer.

24. Сведения о поставщике услуг

Наименование сервиса: NutriLifer bot
Оператор: администрация бота NutriLifer
Telegram: @NutriLiferPro`,
    en: `NUTRILIFER BOT PUBLIC OFFER

Effective date: 23 September 2026
Version: 2026-09-23

The original document is written in Uzbek. In case of any discrepancy, the Uzbek version prevails.

1. General provisions

This Public Offer sets out the terms of use of the NutriLifer bot, the Telegram Mini App and the services provided through them, including PRO functions.

This Public Offer is provided by the administration of the NutriLifer bot.

This Offer applies in accordance with the current legislation of the Republic of Uzbekistan.

2. Subject matter of the Offer

NutriLifer provides users with digital services that help them track and analyse their nutrition.

Depending on the available functions of the Service, the following:

AI-assisted analysis of meals from a photograph;
determination of the approximate calorie content of a meal;
viewing the amounts of protein, fat and carbohydrates;
calculation of the daily norm of calories and macronutrients;
keeping a nutrition history;
tracking weight changes;
viewing statistical data;
use of PRO functions

are available to the User.

Some functions of the Service are free of charge, while some functions are provided to PRO users.

3. Requirements applicable to the User

The NutriLifer Service may be used by persons who have reached the age of 18 and by persons older than that.

By starting to use the Service, the User confirms that he or she has reached the age of 18 or is older than that.

The User must ensure the accuracy of the data he or she provides when using the Service.

4. Acceptance of the Offer

The User's acceptance of the terms of this Offer may be carried out through the following actions:

pressing the button accepting the terms of the Offer;
starting to use the NutriLifer Service;
applying for activation of the PRO service;
making payment for the use of the PRO service;
performing any other electronic action aimed at accepting the terms of the Offer.

Where the User performs the relevant one of these actions, the Offer is deemed to have been accepted.

Acceptance of the Offer means the User's full and unconditional acceptance of the terms of the Offer.

5. Use of the NutriLifer Service

The User must use the NutriLifer Service in accordance with this Offer, the Privacy Policy and the current legislation.

By using the Service, the following obligations:

to use the Service for lawful purposes;
to enter the data he or she provides as accurately as possible;
not to infringe the rights of other users;
not to interfere deliberately with the normal operation of the Service

are accepted by the User.

6. Analysis with the help of AI

NutriLifer uses AI technologies in performing certain functions.

The following, as determined or calculated with the help of AI:

the type of meal;
the portion size;
calories;
protein;
fat;
carbohydrates;
other nutritional indicators

are deemed to be approximate results.

The accuracy of the result may depend on the quality of the photograph, the composition of the meal, the portion size, the method of preparation and the data entered by the User.

The User may increase the accuracy of the calculation by entering the weight of the portion precisely.

AI results do not constitute a medical diagnosis, treatment or individual medical advice.

The User must not make important decisions relating to his or her health based solely on NutriLifer results.

7. Calculation of calories and macronutrients

The daily norm of calories and macronutrients calculated by NutriLifer is formed on the basis of the data provided by the User.

These calculations are intended to provide general information and guidance.

They do not replace the individual advice of a doctor, dietician or other qualified specialist.

8. PRO services

PRO is a service status that makes it possible to use additional functions in NutriLifer.

The functions included in PRO are indicated in the NutriLifer application or on the relevant pages of the Service.

The contents of PRO may be updated or changed over time, and certain functions may be replaced.

The User may familiarise himself or herself with the current terms of the PRO service before activating it.

9. Price of PRO and payment

The price of the PRO service is communicated to the User before the service is activated.

At the current stage, PRO functions may be activated manually in the manner agreed with the administration of the NutriLifer bot via Telegram.

If an automatic payment or subscription system is introduced in the future, the procedure, price, term and other terms of such payments will be shown to the User before payment is made.

PRO is a fixed-term service and no automatic recurring payment is applied: upon expiry of the term the payment is not debited by itself and the PRO functions are closed. Separate cancellation of the subscription is not required.

10. Term of the PRO service

The term of the PRO service is communicated to the User at the time of activation.

PRO status is attached to the User's NutriLifer account for the relevant term.

Unless a separate condition is established, PRO status is not transferred to another user.

PRO status is valid until the end of the paid term and is closed automatically upon expiry of the term; the log, the progress and other saved data remain with the User.

For the extension or activation of the PRO term or other matters relating to the service, the User contacts the NutriLifer administration via Telegram: @NutriLiferPro.

11. Data uploaded by the User

The User must have the right to use the photographs and other materials that he or she uploads to NutriLifer.

The User must not upload or distribute the following content:

unlawful content;
materials infringing the rights of other persons;
malicious software;
materials aimed at fraud;
content that harms the operation of the Service.
12. Prohibited use

Using NutriLifer for:

unauthorised access to the system;
attempts to access the accounts of other users;
causing harm to servers or systems;
creating an artificial or excessive load on the Service;
unlawful exploitation of software vulnerabilities;
distributing malicious software;
carrying out unlawful activity

is prohibited.

13. Availability of the Service

The most stable possible operation of the NutriLifer Service is ensured.

However, temporary interruptions or restrictions may occur in the Service for the following reasons:

technical faults;
problems with the server;
interruptions of the internet or of communications;
scheduled technical works;
faults in third-party services;
incidents relating to cybersecurity;
other unforeseen circumstances.

In such cases certain functions may temporarily not work.

14. Limitation of liability

NutriLifer endeavours to provide the Service to the highest possible quality and stability.

However, it does not guarantee that the approximate results given by AI, the calorie calculations or other data are always absolutely accurate.

The User is himself or herself responsible for the decisions he or she makes on the basis of using the data provided by NutriLifer.

NutriLifer shall not be liable, to the extent established by law, for consequences arising from technical faults, interruptions of the internet or of communications, problems in third-party services and other unforeseen circumstances occurring outside NutriLifer's control.

This clause does not exclude the mandatory liability imposed on the service provider by law.

15. Intellectual property

The name, logo, design, interface, software code, texts, graphic elements and other original materials of NutriLifer are protected by the relevant intellectual property rights.

These materials may not be copied, distributed, modified or used for commercial purposes without the permission of the administration of the NutriLifer bot.

16. Changes to the Service

The Service's:

functions;
interface;
PRO contents;
tariffs;
procedure of use

may be changed by the administration of the NutriLifer bot.

Where significant changes occur, the User is informed in advance as far as possible.

17. Restriction or suspension of an account

If the User breaches the terms of this Offer or the current legislation, the administration of the NutriLifer bot may temporarily restrict or suspend the use of the account.

In cases required by security or other lawful reasons, such a restriction may be applied without prior warning.

18. Confidentiality

The procedure for collecting, processing, storing and protecting the User's personal data is determined by a separate NutriLifer Privacy Policy.

The Privacy Policy applies together with this Offer.

19. Changes to the terms of the Offer

The administration of the NutriLifer bot may update the terms of this Offer due to changes in the Service, new functions or changes in legislation.

The updated Offer enters into force from the date indicated in it or from the moment of its publication.

The User's continued use of the Service after the Offer has been updated means acceptance of the new terms, unless a different procedure is established by legislation or by the new version.

20. Term of the Offer

This Public Offer is valid until a new version is published or until it is cancelled.

Use after the publication of a new version takes place on the basis of the terms of the relevant new version.

21. Settlement of disputes

Disputes that may arise between NutriLifer and the User shall be settled, first of all, through negotiation and agreement.

If it is not possible to reach an agreement, disputes shall be settled in accordance with the current legislation of the Republic of Uzbekistan.

22. Final provisions

If any part of the provisions of this Offer is found to be contrary to the current legislation or is deemed invalid, this shall not affect the validity of the other provisions of the Offer.

The remaining provisions shall remain in force.

23. Acceptance of the Offer and the terms

By starting to use the NutriLifer Service, the User's:

familiarity with this Public Offer;
understanding of its content;
acceptance of the terms of the Offer;
compliance with the rules for using the Service

are confirmed.

If the User does not agree with these terms, he or she must not use the NutriLifer Service.

24. Information about the service provider

Service name: NutriLifer bot
Operator: NutriLifer bot administration
Telegram: @NutriLiferPro`,
  },
  shartlar: {
    uz: `NUTRILIFER BOT FOYDALANISH SHARTLARI

Amal qilish sanasi: 2026-yil 23-sentabr
Versiya: 2026-09-23

Ushbu Foydalanish shartlari NutriLifer bot, Telegram Mini App va unga bog‘liq xizmatlardan foydalanish tartibini belgilaydi.

NutriLifer xizmatidan foydalanishni boshlash orqali foydalanuvchi ushbu Foydalanish shartlarini o‘qib chiqqanini, tushunganini va ularni qabul qilganini tasdiqlaydi.

1. NutriLifer haqida

NutriLifer — foydalanuvchiga ovqatlanishini kuzatish, taomlarni AI yordamida tahlil qilish, kaloriya va makroelementlarni hisoblash hamda ovqatlanish tarixini yuritishga yordam beruvchi raqamli xizmat.

Xizmatning asosiy imkoniyatlari:

taomlarni rasm orqali AI yordamida tahlil qilish;
kaloriya miqdorini hisoblash;
oqsil, yog‘ va uglevodlarni hisoblash;
foydalanuvchi uchun kunlik kaloriya va makroelementlar normasini hisoblash;
ovqatlanish tarixini yuritish;
vazn o‘zgarishini kuzatish;
statistik ma’lumotlarni ko‘rish;
mavjud bo‘lsa, PRO funksiyalaridan foydalanish.
2. Foydalanuvchiga qo‘yiladigan talablar

NutriLifer xizmatidan 18 yoshga to‘lgan va undan katta shaxslar foydalanishi mumkin.

Xizmatdan foydalanishni boshlash orqali foydalanuvchi o‘zining 18 yoshga to‘lganini yoki undan katta ekanini tasdiqlaydi.

Foydalanuvchi ro‘yxatdan o‘tish va onboarding jarayonida o‘zi haqida to‘g‘ri va dolzarb ma’lumotlarni taqdim etishi kerak.

3. Hisobdan foydalanish

Foydalanuvchi o‘z hisobidan foydalanish xavfsizligi uchun javobgardir.

Foydalanuvchi:

o‘z hisobidan boshqa shaxslarning foydalanishiga yo‘l qo‘ymasligi;
hisobidan noqonuniy maqsadlarda foydalanmasligi;
tizimning normal ishlashiga xalaqit beruvchi harakatlarni amalga oshirmasligi;
boshqa foydalanuvchilarning ma’lumotlariga ruxsatsiz kirishga urinmasligi kerak.
4. AI tomonidan beriladigan natijalar

NutriLifer’dagi AI tahlillari, jumladan taom turi, porsiya og‘irligi, kaloriya va oziqaviy qiymat haqidagi ma’lumotlar taxminiy hisob-kitob hisoblanadi.

Natijaning aniqligi:

rasm sifati;
taomning ko‘rinishi;
porsiya hajmi;
tarkibiy qismlar;
tayyorlash usuli;
foydalanuvchi tomonidan kiritilgan ma’lumotlar

kabi omillarga bog‘liq bo‘lishi mumkin.

AI natijalari professional dietolog, shifokor yoki boshqa malakali mutaxassisning maslahatini almashtirmaydi.

Foydalanuvchi sog‘lig‘i bilan bog‘liq muhim qarorlarni faqat NutriLifer AI natijalariga asoslanib qabul qilmasligi kerak.

5. Kaloriya va ovqatlanish hisob-kitoblari

NutriLifer tomonidan hisoblangan kunlik kaloriya va makroelementlar normasi foydalanuvchi tomonidan kiritilgan ma’lumotlar asosida hisoblanadi.

Ushbu hisob-kitoblar umumiy yo‘nalish berish uchun mo‘ljallangan bo‘lib, individual tibbiy yoki klinik tavsiya hisoblanmaydi.

Foydalanuvchi o‘zining aniq ehtiyojlarini baholash uchun zarur hollarda shifokor yoki malakali ovqatlanish mutaxassisiga murojaat qilishi kerak.

6. Foydalanuvchi tomonidan yuklanadigan kontent

Foydalanuvchi NutriLifer’ga yuklaydigan rasm va boshqa ma’lumotlarga nisbatan tegishli huquqlarga ega bo‘lishi kerak.

Foydalanuvchi:

boshqa shaxslarning huquqlarini buzuvchi;
noqonuniy;
zararli;
haqoratli;
firibgarlikka qaratilgan;
xizmatning ishlashiga zarar yetkazuvchi

kontentni yuklamasligi yoki tarqatmasligi kerak.

7. Taqiqlangan foydalanish

NutriLifer’dan quyidagi maqsadlarda foydalanish taqiqlanadi:

xizmatni buzish yoki ishdan chiqarishga urinish;
server yoki tizimlarga ruxsatsiz kirish;
boshqa foydalanuvchilarning hisoblariga kirishga urinish;
avtomatlashtirilgan vositalar orqali xizmatga haddan tashqari yuklama yaratish;
xizmatdagi zaifliklarni noqonuniy maqsadlarda ishlatish;
NutriLifer’dan qonunga xilof faoliyat uchun foydalanish.
8. PRO funksiyalari

NutriLifer ayrim qo‘shimcha funksiyalarni PRO foydalanuvchilarga taqdim etishi mumkin.

PRO funksiyalarining tarkibi, foydalanish shartlari va narxi NutriLifer tomonidan alohida belgilanadi va o‘zgartirilishi mumkin.

PRO funksiyalaridan foydalanish huquqi foydalanuvchi hisobiga bog‘langan bo‘lib, agar alohida tartib belgilanmagan bo‘lsa, boshqa shaxsga o‘tkazilmaydi.

PRO muddatli xizmat: avtomatik takroriy to‘lov yo‘q, shuning uchun obunani bekor qilish talab etilmaydi. Muddat tugagach PRO funksiyalari o‘zi yopiladi, foydalanuvchi esa xohlasa muddatni uzaytiradi.

PRO muddati, uni uzaytirish yoki to‘lov bilan bog‘liq boshqa masalalarda foydalanuvchi NutriLifer administratsiyasiga Telegram orqali murojaat qiladi: @NutriLiferPro.

9. Xizmatning mavjudligi

NutriLifer xizmatni imkon qadar barqaror ishlashini ta’minlashga harakat qiladi.

Biroq quyidagi holatlarda xizmat vaqtincha ishlamasligi yoki ayrim funksiyalar mavjud bo‘lmasligi mumkin:

texnik xizmat ko‘rsatish;
serverdagi nosozliklar;
internet yoki aloqa muammolari;
uchinchi tomon xizmatlaridagi uzilishlar;
kiberhujumlar;
tabiiy yoki boshqa favqulodda holatlar;
NutriLifer nazoratidan tashqaridagi boshqa sabablar.

Bunday holatlarda xizmatni doimiy va uzluksiz ishlashi kafolatlanmaydi.

10. Javobgarlikni cheklash

NutriLifer xizmatdan foydalanish natijasida yuzaga kelishi mumkin bo‘lgan har qanday holatning oldini olishni kafolatlamaydi.

AI tomonidan berilgan taxminiy natijalar, kaloriya hisob-kitoblari yoki boshqa ma’lumotlardan foydalanish bilan bog‘liq qarorlar foydalanuvchining o‘z javobgarligida amalga oshiriladi.

NutriLifer texnik nosozliklar, internetdagi uzilishlar, uchinchi tomon xizmatlaridagi muammolar yoki NutriLifer nazoratidan tashqaridagi boshqa holatlar sababli yuzaga kelgan zararlar uchun qonunchilikda belgilangan doirada javobgar bo‘lmaydi.

Ushbu band amaldagi qonunchilik bilan taqiqlangan yoki cheklangan javobgarlikni istisno qilish uchun qo‘llanilmaydi.

11. Intellektual mulk

NutriLifer ilovasining:

nomi;
logotipi;
dizayni;
interfeysi;
dasturiy kodi;
matnlari;
grafik elementlari;
boshqa original materiallari

tegishli intellektual mulk huquqlari bilan himoyalanadi.

NutriLifer’ning yozma ruxsatisiz ushbu materiallarni nusxalash, o‘zgartirish, tarqatish yoki tijoriy maqsadda foydalanish mumkin emas.

12. Xizmatni o‘zgartirish yoki to‘xtatish

NutriLifer xizmatning ayrim funksiyalarini:

qo‘shishi;
o‘zgartirishi;
vaqtincha cheklashi;
to‘xtatishi

mumkin.

Bunday o‘zgarishlar xizmatning texnik rivojlanishi, xavfsizlik talablari yoki boshqa asosli sabablar bilan amalga oshirilishi mumkin.

13. Hisobni cheklash yoki to‘xtatish

Agar foydalanuvchi ushbu Foydalanish shartlarini buzsa yoki xizmatdan noqonuniy tarzda foydalansa, NutriLifer tegishli choralarni ko‘rishi, jumladan hisobdan foydalanishni vaqtincha cheklashi yoki to‘xtatishi mumkin.

Imkon qadar bunday choralar qo‘llanishidan oldin foydalanuvchiga sabab haqida ma’lumot beriladi, biroq xavfsizlik yoki qonunchilik talablari bunga imkon bermaydigan holatlar bundan mustasno.

14. Maxfiylik

Foydalanuvchining shaxsiy ma’lumotlarini yig‘ish, foydalanish, saqlash va himoya qilish tartibi alohida NutriLifer Maxfiylik siyosati bilan belgilanadi.

Xizmatdan foydalanish orqali foydalanuvchi Maxfiylik siyosati bilan ham tanishganini tasdiqlaydi.

15. Shartlarga o‘zgartirishlar

NutriLifer ushbu Foydalanish shartlarini xizmatdagi o‘zgarishlar, yangi funksiyalar yoki qonunchilikdagi o‘zgarishlar sababli yangilashi mumkin.

Yangilangan shartlar NutriLifer’da e’lon qilingan paytdan boshlab yoki hujjatda ko‘rsatilgan boshqa sanadan boshlab kuchga kiradi.

Muhim o‘zgarishlar yuz berganda foydalanuvchiga tegishli xabarnoma berilishi mumkin.

Foydalanuvchi yangilanishdan keyin xizmatdan foydalanishda davom etsa, yangilangan tahrir bilan tanishgan va uni qabul qilgan hisoblanadi.

16. Amaldagi qonunchilik

Ushbu Foydalanish shartlari O‘zbekiston Respublikasining amaldagi qonunchiligi asosida qo‘llaniladi.

Shartlarning ayrim qoidalari qonunchilikdagi majburiy talablar bilan cheklangan yoki o‘zgartirilgan bo‘lsa, tegishli qonunchilik talablari ustuvor hisoblanadi.

17. Aloqa

NutriLifer xizmatidan foydalanish, PRO funksiyalari, hisob yoki ushbu Foydalanish shartlari bo‘yicha savollar yuzasidan:

Xizmat: NutriLifer bot
Telegram: @NutriLiferPro

orqali murojaat qilish mumkin.

18. Shartlarni qabul qilish

NutriLifer’dan foydalanishni boshlash orqali foydalanuvchi:

ushbu Foydalanish shartlari bilan tanishganini;
ularni tushunganini;
shartlarni qabul qilganini;
xizmatdan foydalanish qoidalariga rioya qilishga roziligini

tasdiqlaydi.

Agar foydalanuvchi ushbu shartlarga rozi bo‘lmasa, NutriLifer xizmatidan foydalanmasligi kerak.`,
    ru: `УСЛОВИЯ ИСПОЛЬЗОВАНИЯ NUTRILIFER BOT

Дата вступления в силу: 23 сентября 2026 года
Версия: 2026-09-23

Оригинал документа составлен на узбекском языке. В случае расхождений преимущественную силу имеет узбекская версия.

Настоящие Условия использования определяют порядок использования бота NutriLifer, Telegram Mini App и связанных с ними сервисов.

Начиная пользоваться сервисом NutriLifer, Пользователь подтверждает, что он ознакомился с настоящими Условиями использования, понял их и принял их.

1. О NutriLifer

NutriLifer — цифровой сервис, который помогает Пользователю отслеживать своё питание, анализировать блюда с помощью ИИ, рассчитывать калории и макроэлементы, а также вести историю питания.

Основные возможности сервиса:

анализ блюд по фотографии с помощью ИИ;
расчёт количества калорий;
расчёт белков, жиров и углеводов;
расчёт суточной нормы калорий и макроэлементов для Пользователя;
ведение истории питания;
отслеживание изменения веса;
просмотр статистических данных;
использование функций PRO при их наличии.
2. Требования к Пользователю

Сервисом NutriLifer могут пользоваться лица, достигшие 18 лет, и старше.

Начиная пользоваться сервисом, Пользователь подтверждает, что ему исполнилось 18 лет или что он старше.

Пользователь должен предоставлять достоверные и актуальные сведения о себе при регистрации и в процессе онбординга.

3. Использование учётной записи

Пользователь несёт ответственность за безопасность использования своей учётной записи.

Пользователь должен:

не допускать использования своей учётной записи другими лицами;
не использовать учётную запись в противоправных целях;
не совершать действий, препятствующих нормальной работе системы;
не пытаться получить несанкционированный доступ к данным других пользователей.
4. Результаты, предоставляемые ИИ

Анализ ИИ в NutriLifer, в том числе сведения о виде блюда, весе порции, калорийности и пищевой ценности, считается приблизительным расчётом.

Точность результата может зависеть от таких факторов, как:

качество фотографии;
внешний вид блюда;
объём порции;
составные части;
способ приготовления;
сведения, введённые Пользователем

и иных подобных обстоятельств.

Результаты ИИ не заменяют консультацию профессионального диетолога, врача или иного квалифицированного специалиста.

Пользователь не должен принимать важные решения, связанные со своим здоровьем, основываясь только на результатах ИИ NutriLifer.

5. Расчёты калорий и питания

Суточная норма калорий и макроэлементов, рассчитанная NutriLifer, определяется на основании сведений, введённых Пользователем.

Эти расчёты предназначены для предоставления общего ориентира и не являются индивидуальной медицинской или клинической рекомендацией.

Для оценки своих конкретных потребностей Пользователь при необходимости должен обратиться к врачу или квалифицированному специалисту по питанию.

6. Контент, загружаемый Пользователем

Пользователь должен обладать соответствующими правами на изображения и иные материалы, загружаемые им в NutriLifer.

Пользователь не должен загружать или распространять:

нарушающий права других лиц;
противоправный;
вредоносный;
оскорбительный;
направленный на мошенничество;
наносящий вред работе сервиса

контент.

7. Запрещённое использование

Использование NutriLifer в следующих целях запрещается:

попытка нарушить работу сервиса или вывести его из строя;
несанкционированный доступ к серверам или системам;
попытки доступа к учётным записям других пользователей;
создание чрезмерной нагрузки на сервис посредством автоматизированных средств;
использование уязвимостей сервиса в противоправных целях;
использование NutriLifer для деятельности, противоречащей закону.
8. Функции PRO

NutriLifer может предоставлять отдельные дополнительные функции Пользователям PRO.

Состав функций PRO, условия их использования и стоимость определяются NutriLifer отдельно и могут быть изменены.

Право пользования функциями PRO привязано к учётной записи Пользователя и, если не установлен иной порядок, не передаётся другому лицу.

PRO — услуга с ограниченным сроком: автоматических повторяющихся платежей нет, поэтому отмена подписки не требуется. По истечении срока функции PRO закрываются автоматически, а Пользователь при желании продлевает срок.

По вопросам срока PRO, его продления или иным вопросам, связанным с оплатой, Пользователь обращается к администрации NutriLifer через Telegram: @NutriLiferPro.

9. Доступность сервиса

NutriLifer стремится обеспечить по возможности стабильную работу сервиса.

Однако в следующих случаях сервис может временно не работать или отдельные функции могут быть недоступны:

техническое обслуживание;
сбои на сервере;
проблемы с интернетом или связью;
перебои в работе сторонних сервисов;
кибератаки;
стихийные или иные чрезвычайные обстоятельства;
иные причины, находящиеся вне контроля NutriLifer.

В таких случаях постоянная и бесперебойная работа сервиса не гарантируется.

10. Ограничение ответственности

NutriLifer не гарантирует предотвращение любых обстоятельств, которые могут возникнуть в результате использования сервиса.

Решения, связанные с использованием приблизительных результатов, предоставленных ИИ, расчётов калорий или иных сведений, принимаются Пользователем под свою ответственность.

NutriLifer в пределах, установленных законодательством, не несёт ответственности за убытки, возникшие вследствие технических сбоев, перебоев в интернете, проблем в работе сторонних сервисов или иных обстоятельств, находящихся вне контроля NutriLifer.

Настоящий пункт не применяется для исключения ответственности, исключение или ограничение которой запрещено действующим законодательством.

11. Интеллектуальная собственность

Следующие элементы приложения NutriLifer:

наименование;
логотип;
дизайн;
интерфейс;
программный код;
тексты;
графические элементы;
иные оригинальные материалы

защищаются соответствующими правами интеллектуальной собственности.

Без письменного разрешения NutriLifer копирование, изменение, распространение или использование этих материалов в коммерческих целях не допускается.

12. Изменение или прекращение работы сервиса

NutriLifer может:

добавлять;
изменять;
временно ограничивать;
прекращать

отдельные функции сервиса.

Такие изменения могут осуществляться в связи с техническим развитием сервиса, требованиями безопасности или иными обоснованными причинами.

13. Ограничение или прекращение доступа к учётной записи

Если Пользователь нарушает настоящие Условия использования или пользуется сервисом противоправным образом, NutriLifer может принять соответствующие меры, в том числе временно ограничить или прекратить доступ к учётной записи.

По возможности перед применением таких мер Пользователю сообщается о причине, за исключением случаев, когда этого не позволяют требования безопасности или законодательства.

14. Конфиденциальность

Порядок сбора, использования, хранения и защиты персональных данных Пользователя определяется отдельной Политикой конфиденциальности NutriLifer.

Пользуясь сервисом, Пользователь подтверждает, что он ознакомился также с Политикой конфиденциальности.

15. Изменения Условий

NutriLifer может обновлять настоящие Условия использования в связи с изменениями в сервисе, появлением новых функций или изменениями в законодательстве.

Обновлённые Условия вступают в силу с момента их публикации в NutriLifer или с иной даты, указанной в документе.

При существенных изменениях Пользователю может быть направлено соответствующее уведомление.

Если Пользователь продолжает пользоваться сервисом после обновления, считается, что он ознакомился с обновлённой редакцией и принял её.

16. Применимое законодательство

Настоящие Условия использования применяются на основании действующего законодательства Республики Узбекистан.

Если отдельные положения Условий ограничены или изменены императивными требованиями законодательства, преимущественную силу имеют соответствующие требования законодательства.

17. Контакты

По вопросам использования сервиса NutriLifer, функций PRO, учётной записи или настоящих Условий использования:

Сервис: NutriLifer bot
Telegram: @NutriLiferPro

можно обращаться по указанным контактам.

18. Принятие Условий

Начиная пользоваться NutriLifer, Пользователь:

ознакомление с настоящими Условиями использования;
их понимание;
принятие Условий;
согласие соблюдать правила пользования сервисом

подтверждает.

Если Пользователь не согласен с настоящими Условиями, он не должен пользоваться сервисом NutriLifer.`,
    en: `NUTRILIFER BOT TERMS OF USE

Effective date: 23 September 2026
Version: 2026-09-23

The original document is written in Uzbek. In case of any discrepancy, the Uzbek version prevails.

These Terms of Use establish the rules for using the NutriLifer bot, the Telegram Mini App and the related services.

By starting to use the NutriLifer service, the User confirms that he has read, understood and accepted these Terms of Use.

1. About NutriLifer

NutriLifer is a digital service that helps the User to track his nutrition, analyse dishes with the help of AI, calculate calories and macronutrients, and keep a nutrition history.

The main features of the service:

analysis of dishes from a photograph with the help of AI;
calculation of the amount of calories;
calculation of proteins, fats and carbohydrates;
calculation of the daily calorie and macronutrient norm for the User;
keeping a nutrition history;
tracking of weight changes;
viewing of statistical data;
use of the PRO features where available.
2. Requirements for the User

The NutriLifer service may be used by persons who have reached the age of 18 and older.

By starting to use the service, the User confirms that he has reached the age of 18 or is older.

The User must provide accurate and up-to-date information about himself during registration and the onboarding process.

3. Use of the Account

The User is responsible for the security of the use of his account.

The User must:

not allow other persons to use his account;
not use the account for unlawful purposes;
not carry out actions that interfere with the normal operation of the system;
not attempt to gain unauthorised access to the data of other users.
4. Results Provided by AI

The AI analyses in NutriLifer, including information about the type of dish, the weight of the portion, the calories and the nutritional value, are considered approximate calculations.

The accuracy of the result may depend on such factors as:

the quality of the photograph;
the appearance of the dish;
the size of the portion;
the ingredients;
the method of preparation;
the information entered by the User

and other similar circumstances.

The AI results do not replace the advice of a professional dietitian, a doctor or another qualified specialist.

The User must not take important decisions relating to his health based solely on the results of the NutriLifer AI.

5. Calorie and Nutrition Calculations

The daily calorie and macronutrient norm calculated by NutriLifer is calculated on the basis of the information entered by the User.

These calculations are intended to provide general guidance and are not an individual medical or clinical recommendation.

In order to assess his specific needs, the User must, where necessary, consult a doctor or a qualified nutrition specialist.

6. Content Uploaded by the User

The User must hold the relevant rights to the images and other materials that he uploads to NutriLifer.

Content that is:

infringing the rights of other persons;
unlawful;
harmful;
offensive;
aimed at fraud;
damaging to the operation of the service

may not be uploaded or distributed by the User.

7. Prohibited Use

The use of NutriLifer for the following purposes is prohibited:

attempting to disrupt the service or put it out of operation;
unauthorised access to servers or systems;
attempting to access the accounts of other users;
creating an excessive load on the service through automated tools;
exploiting vulnerabilities in the service for unlawful purposes;
using NutriLifer for activities contrary to the law.
8. PRO Features

NutriLifer may provide certain additional features to PRO users.

The composition of the PRO features, the conditions of their use and their price are determined separately by NutriLifer and may be changed.

The right to use the PRO features is linked to the User's account and, unless a separate procedure is established, is not transferable to another person.

PRO is a fixed-term service: there are no automatic recurring payments, and therefore cancellation of the subscription is not required. When the term expires, the PRO features close automatically, and the User extends the term if he wishes.

On the PRO term, its extension or other matters relating to payment, the User contacts the NutriLifer administration through Telegram: @NutriLiferPro.

9. Availability of the Service

NutriLifer endeavours to ensure that the service operates as stably as possible.

However, in the following cases the service may temporarily not operate or certain features may not be available:

technical maintenance;
server failures;
internet or communication problems;
interruptions in third-party services;
cyberattacks;
natural or other force majeure circumstances;
other causes beyond the control of NutriLifer.

In such cases, the permanent and uninterrupted operation of the service is not guaranteed.

10. Limitation of Liability

NutriLifer does not guarantee the prevention of any circumstances that may arise as a result of the use of the service.

Decisions relating to the use of the approximate results provided by AI, the calorie calculations or other information are taken by the User at his own responsibility.

NutriLifer shall not be liable, to the extent established by law, for damages arising from technical failures, internet interruptions, problems in third-party services or other circumstances beyond the control of NutriLifer.

This clause shall not apply so as to exclude liability the exclusion or limitation of which is prohibited by the applicable law.

11. Intellectual Property

The following elements of the NutriLifer application:

the name;
the logo;
the design;
the interface;
the program code;
the texts;
the graphic elements;
other original materials

are protected by the relevant intellectual property rights.

Without the written permission of NutriLifer, these materials may not be copied, modified, distributed or used for commercial purposes.

12. Modification or Discontinuation of the Service

NutriLifer may:

add;
modify;
temporarily restrict;
discontinue

certain features of the service.

Such changes may be carried out for reasons of the technical development of the service, security requirements or other justified reasons.

13. Restriction or Termination of the Account

If the User breaches these Terms of Use or uses the service unlawfully, NutriLifer may take appropriate measures, including temporarily restricting or terminating access to the account.

Where possible, before such measures are applied, the User is informed of the reason, except in cases where security or legal requirements do not allow this.

14. Privacy

The procedure for the collection, use, storage and protection of the User's personal data is established by the separate NutriLifer Privacy Policy.

By using the service, the User confirms that he has also read the Privacy Policy.

15. Changes to the Terms

NutriLifer may update these Terms of Use due to changes in the service, new features or changes in legislation.

The updated Terms enter into force from the moment they are published in NutriLifer or from another date indicated in the document.

In the event of significant changes, an appropriate notice may be given to the User.

If the User continues to use the service after an update, he is deemed to have read and accepted the updated version.

16. Applicable Law

These Terms of Use are applied on the basis of the current legislation of the Republic of Uzbekistan.

If certain provisions of the Terms are restricted or modified by mandatory requirements of the legislation, the relevant requirements of the legislation prevail.

17. Contact

For questions concerning the use of the NutriLifer service, the PRO features, the account or these Terms of Use:

Service: NutriLifer bot
Telegram: @NutriLiferPro

contact may be made through the contacts indicated above.

18. Acceptance of the Terms

By starting to use NutriLifer, the following:

that the User has read these Terms of Use;
that he has understood them;
that he has accepted the Terms;
that he agrees to comply with the rules of use of the service

are confirmed by the User.

If the User does not agree with these Terms, he must not use the NutriLifer service.`,
  },
};

/** Tanlangan tildagi matn; tarjimasi bo'lmasa — o'zbekchasi. Hujjat yo'q bo'lsa null. */
export function hujjatMatni(kalit: string, til: Til): string | null {
  const tillar = HUJJAT_MATNLARI[kalit];
  return tillar ? (tillar[til] ?? tillar.uz ?? null) : null;
}

/** Matn shu tilda bormi — yo'q bo'lsa ekranda "hozircha o'zbek tilida" izohi chiqadi. */
export function hujjatShuTildami(kalit: string, til: Til): boolean {
  return Boolean(HUJJAT_MATNLARI[kalit]?.[til]);
}
