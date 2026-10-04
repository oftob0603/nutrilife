# SPRINT 5 — telegram

**Maqsad:** Mahsulot Telegram ichida tabiiy ishlasin, o'zi xabar bersin va to'lovni
qabul qilsin.

**Savol:** Qo'lda turadimi?

## Tasklar

- [x] Telegram Mini App sifatida to'liq ishlashi: WebApp SDK ulanishi, tema Telegram mavzusiga moslashishi, orqaga tugmasi (S1–S2 ekranlaridagi o'z orqaga tugmasi o'rniga Telegram'niki), xavfsiz maydon (safe area). Pastki navigatsiya S2–S4'da qurilgan — bu yerda faqat Telegram xavfsiz maydoniga moslanadi
- [x] Bot webhook'i API yo'li sifatida (`/api/bot`) — 2026-09-22 dan backend Railway'da, webhook Railway domeniga o'rnatiladi
- [x] Bot kirish nuqtasi: `/start` — salomlashish, til tanlash (o'zbek, rus, ingliz) va "Ilovani ochish" tugmasi. Bot ichida ovqat kiritish yo'q
- [x] P1 PRO bo'limlari: batafsil ovqatlanish statistikasi (7/30 kun) va haftalik ovqatlanish hisoboti prototipdagidek; FREE'da qulf kartasi (DECISIONS 2026-09-22)
- [x] Paywall va obuna ekrani: uch tarif (39,000 so'm/oy · 170,000 so'm/6 oy · 290,000 so'm/yil), yillik tavsiya belgisi, oylik ekvivalent va tejash ko'rsatilishi, "Hozir emas" tugmasi
- [ ] To'lov integratsiyasi: Click, Payme va Telegram Stars. Kalitlar Railway Environment Variables'da, qaytish manzillari production domeniga yoziladi. `tolovlar` jadvali, holat zanjiri `boshlandi` -> `to'landi` / `bekor qilindi` — KEYINGA QOLDIRILDI (DECISIONS 2026-09-22: hozircha obuna admin orqali qo'lda, to'lov API'lari real foydalanuvchilardan keyin talabga qarab)
- [ ] Obuna faollashuvi: muvaffaqiyatli to'lovdan keyin `obunalar` yozuvi va PRO huquqlari darhol ochiladi — KEYINGA QOLDIRILDI (DECISIONS 2026-09-22: hozircha obuna admin orqali qo'lda, to'lov API'lari real foydalanuvchilardan keyin talabga qarab)
- [ ] Bildirishnomalar bot orqali: nonushta, tushlik, kechki ovqat va suv eslatmalari; sozlamalarda har biri alohida yoqiladi va o'chiriladi — KEYINGA QOLDIRILDI (DECISIONS 2026-09-22: bot bildirishnomalari keyinroq, to'lovlar kabi)
- [x] Fon vazifalari (backend Railway'da doimiy ishlaydi — Railway cron yoki jarayon ichidagi rejalashtirgich, sprint boshida tanlanadi): obuna muddati tugashi va tugashdan oldingi ogohlantirish, PRO kunlik skan limitining yangilanishi, kunlik xulosani yopish. 2026-09-22 aniqlandi: tugash, limit va xulosa vazifasiz ishlaydi; vazifalar — obuna muddati bot xabarlari (7/3/1 kun, tugaganda, 2–3 kundan keyin) va yetim rasmlarni tozalash (DECISIONS 2026-09-22)
- [x] Privacy Policy va Terms of Use sahifalari: 18+, AI taxminlari, obuna va to'lov, sog'liq bo'yicha ogohlantirish, rasmlar uchinchi tomon AI xizmatiga yuborilishi, O'zbekiston Respublikasi qonuni. 2026-09-23 aniqlandi: "bekor qilish" va "pul qaytarilmasligi" bandlari yozilmaydi — avtomatik takroriy to'lov yo'q, PRO muddat oxirida o'zi yopiladi, to'lov masalalari admin bilan hal qilinadi (foydalanuvchi qarori); matnlar tayyor: uchta .txt fayl repo ildizida

## Qabul mezoni

- Botda `/start` bosilganda til tanlanadi va "Ilovani ochish" tugmasi Mini App'ni ochadi
- Mini App Telegram ichida to'liq ekranda ochiladi, pastki navigatsiya barmoq yetadigan joyda
- Telegram Stars orqali test to'lov o'tkaziladi va PRO darhol faollashadi
- Obuna muddati tugagach yangi skan yopiladi, lekin butun jurnal va progress ochiq qoladi
- Nonushta eslatmasi belgilangan vaqtda botdan keladi — keyinga qoldirildi (bildirishnomalar taski bilan)
- Terms sahifasida sog'liq bo'yicha ogohlantirish matni to'liq ko'rinadi

## Bu sprintda YO'Q

Bot ichida ovqat kiritish · to'liq bot menyusi (/profile, /progress, /settings) ·
avtomatik takroriy to'lov · admin paneli.

## Hisobot

- 2026-09-22: Telegram Mini App SDK ulandi (tema, orqaga tugmasi, safe area) va bot webhook `/api/bot` qo'shildi, jonli sinov deploy va webhook o'rnatishdan keyin (lib/telegram.ts, app/_components/TelegramUlagich.tsx, app/api/bot/route.ts, lib/services/bot.ts, scripts/bot-webhook.mjs)
- 2026-09-22: backend Railway'ga ko'chirildi, frontend Vercel'da qoldi (DECISIONS 2026-09-16 amalga oshirildi) (next.config.ts, lib/api-asos.ts, lib/services/sessiya.ts, .env.example)
- 2026-09-22: Railway'ga ko'chirish telefonda jonli sinovda tasdiqlandi, bot webhook Railway domeniga o'rnatildi
- 2026-09-22: galereyadan rasm tanlanganda to'liq ekranli E6 yuklash holati va telefondagi nusxa tahlilda ishlatilishi qo'shildi (app/_components/QoshishPaneli.tsx, app/_components/Tahlil.tsx, lib/services/rasm-yuklash.ts)
- 2026-09-22: W1 asosiy tugmasi matni "Obuna bo'lish" ga almashtirildi, ruscha/inglizcha tarjima qo'shildi (app/_components/Tariflar.tsx, lib/lugat/sozlar.ts)
- 2026-09-22: matn bilan tasvirlash ekranida izoh va placeholder taxminiy miqdor o'rniga og'irlikni (grammda) so'raydi, ruscha/inglizcha tarjimalar yangilandi (app/_components/Tasvirlash.tsx, lib/lugat/sozlar.ts)
- 2026-09-22: bot /start darhol tanishtiruv matni, "Boshlash" web_app tugmasi va til qatorini chiqaradi, ilovadagi ko'rinadigan nom "NutriLifer" ga almashtirildi (lib/services/bot.ts, lib/services/bot-api.ts, lib/services/foydalanuvchilar.ts, lib/lugat/sozlar.ts)
- 2026-09-22: bot /start avval til savoli va 3 ta til tugmasini chiqaradi, til tanlangach xabar tanishtiruv matni va "Boshlash" tugmasiga almashadi (lib/services/bot.ts)
- 2026-09-22: W1 paywall "Davom etish" tugmasiga prototipdagi pw-sweep yorug'lik effekti qo'shildi, faqat shu tugmada (app/globals.css, app/_components/Tugma.tsx, app/_components/Tariflar.tsx, DESIGN.md)
- 2026-09-22: W1 orqaga chiqishi ("Hozir emas" va Telegram/tizim orqaga tugmasi) kelgan sahifaga qaytadigan qilindi, Telegram Mini App yopilib ketmaydi (app/_components/Tariflar.tsx, lib/services/tarif-hisob.ts)
- 2026-09-22: P1 sahifasiga PRO uchun batafsil ovqatlanish statistikasi va haftalik ovqatlanish hisoboti prototipdagidek qurildi, FREE'da qulf kartasi (lib/services/statistika-hisob.ts, lib/services/statistika.ts, app/api/statistika/route.ts, app/_components/progress/OvqatStatistikasi.tsx, app/progress/page.tsx, app/progress/yukla.ts, lib/services/huquqlar.ts, lib/services/yozuv-hisob.ts, lib/lugat/sozlar.ts)
- 2026-09-22: W1 "Davom etish" tanlangan tarif yozilgan tayyor xabar bilan admin Telegram chatini ochadigan qilindi, tarif kartasida oylik narx katta ko'rsatiladi (app/_components/Tariflar.tsx, app/api/tariflar/route.ts, lib/services/tarif-hisob.ts, lib/telegram.ts, lib/lugat/sozlar.ts, .env.example)
- 2026-09-22: Home kunlik kaloriya doirasi 10% kichraytirildi (224 -> 202px, halqa qalinligi o'zgarmadi), E8'da ham (app/_components/KunlikDoira.tsx)
- 2026-09-22: E7 natija ekranidan katta "~kkal" sarlavhasi olib tashlandi, AI taxmini belgisi qoldi (app/_components/Tahlil.tsx)
- 2026-09-22: E7 Kaloriya maydoni aksent bilan ajratildi — --aksent-fon foni, lime chegara, yorliq va flame belgisi, yangi --aksent-fon/--aksent-yorliq tokenlari (app/_components/YozuvFormasi.tsx, app/_components/Tahlil.tsx, app/globals.css, DESIGN.md)
- 2026-09-22: E4 taom qidiruvidan "Oxirgi qo'shilganlar" bo'limi olib tashlandi, ro'yxat faqat qidiruvda chiqadi (app/_components/TaomlarRoyxati.tsx, lib/lugat/sozlar.ts)
- 2026-09-22: E4 taom qidiruvi ekrani (/taomlar) to'liq olib tashlandi, taom sahifasi /taomlar/[id] Home taklifi uchun qoldi va "Orqaga" Home'ga qaytadi (app/taomlar/, app/_components/TaomlarRoyxati.tsx, app/_components/TaomKartasi.tsx, app/api/taomlar/route.ts, lib/lugat/sozlar.ts)
- 2026-09-22: fon vazifalari qo'shildi — obuna muddati bot xabarlari 5 bosqichda (7/3/1 kun oldin, tugagandan keyin, 2 kun keyin) va yetim rasmlarni tozalash, Railway'da FON_VAZIFALARI=1 bilan har daqiqada ishlaydigan rejalashtirgich (instrumentation.ts, lib/services/fon-vazifalari.ts, lib/services/obuna-xabar-hisob.ts, lib/services/bot.ts, prisma/schema.prisma, scripts/fon-vazifalari.mjs)
- 2026-09-22: bot nomi va tavsiflari uch tilda (standart o'zbekcha, ru, en) Bot API orqali o'rnatildi (scripts/bot-tavsif.mjs); bot yangi botga almashtirildi, webhook Railway domeniga qayta o'rnatildi
- 2026-09-22: bot chatidagi menyu tugmasi foydalanuvchi tilida — /start da til tanlanganda va Profil'da til o'zgarganda "Kirish" / "Войти" / "Open app" (lib/services/bot.ts, lib/services/foydalanuvchilar.ts, app/api/profil/sozlamalar/route.ts, lib/lugat/sozlar.ts)
- 2026-09-23: Ommaviy oferta, Foydalanish shartlari va Maxfiylik siyosati sahifalari uch tilda qo'shildi, Profil va W1 havolalari ularga ulandi (hujjatlar/, lib/hujjatlar.ts, lib/services/hujjat-hisob.ts, app/_components/Hujjat.tsx, app/oferta, app/shartlar, app/maxfiylik, app/_components/profil/Sozlamalar.tsx, app/_components/Tariflar.tsx, app/_components/onboarding/OnboardingOqimi.tsx, scripts/hujjat-yig.mjs)
- 2026-09-23: F5 hisobni o'chirish tasdig'i matn yozdirmaydi — "Hisobni o'chirishni tasdiqlaysizmi?" savoli va "Ha, o'chirilsin" tugmasi (app/_components/profil/HisobniOchirish.tsx, lib/lugat/sozlar.ts)
- 2026-09-23: onboarding O1 dagi Ommaviy oferta havolasi ilova ichida ochiladigan qilindi, orqaga qaytganda O1 joyida qoladi (app/_components/onboarding/OnboardingOqimi.tsx)
- 2026-09-23: profil sozlamalarida huquqiy hujjatlar va rasm mualliflari mayda havolalar qatoriga aylandi (doimiy chiziq bilan), "Rasm mualliflari" kartasi va birlik haqidagi izoh olib tashlandi (app/_components/profil/Sozlamalar.tsx, lib/lugat/sozlar.ts)
- 2026-09-23: prototip auditi — ~75 farq, ~30 tasi ataylab; tuzatildi: asosiy tugma lime, qorong'i matn/karta tokenlari (on-siyoh, karta-press, text-belgi), sarlavha shrifti Inter Tight, orqaga 24 px, E2 qatorlari va panel, E3 kamera ramkasi, E7 tavsiya joyi, E9 jami kartasi, E10 sarlavhasi, P1 streak/vazn formati/sanalar, P2 xato va xabar, P3 farq joyi, ProQulfi butunicha bosiladi, F3 18+ izohi, Profil Yordam (admin Telegram chati), skeletlar, O13/F1 matnlari, ~50 ru/en tarjima (app/_components/*, app/globals.css, lib/lugat/sozlar.ts, DESIGN.md, DECISIONS.md)
- 2026-09-23: skan limiti tugaganda tez bosish xatosi tuzatildi — limit serverdan kelguncha E2 qatorlari, Tasvirlash tugmasi va kameradagi rasmga olish/galereya o'chiq; limit tugagan bo'lsa kamera yoqilmaydi, xabar va FREE'da PRO ni ochish chiqadi; server nazorati o'zgarmadi (app/_components/QoshishPaneli.tsx, Tasvirlash.tsx, Kamera.tsx)
- 2026-09-23: O1 onboarding posteri uch tilda qo'shildi, til bo'yicha tanlanadi (public/onboarding/intro.png, public/onboarding/intro-ru.png, public/onboarding/intro-en.png, app/_components/onboarding/OnboardingOqimi.tsx)
- 2026-09-23: W1 paywall'da tarif oldindan tanlanmaydi, foydalanuvchi o'zi tanlaydi; tarifsiz "Obuna bo'lish" bosilsa "Avval tarifni tanlang" ogohlantirishi chiqadi va kartalar tugmalar ustida to'liq ko'rinadigan joyga siljiydi (app/_components/Tariflar.tsx, lib/services/tarif-hisob.ts, lib/lugat/sozlar.ts)
- 2026-09-23: W1 paywall'dan "Avtomatik yechish yo'q..." matni olib tashlandi, o'rniga o'rtada bitta "Ommaviy oferta" havolasi qo'shildi (app/_components/Tariflar.tsx, lib/lugat/sozlar.ts)
- 2026-09-23: W1 "Avval tarifni tanlang" avtomatik siljishi mustahkamlandi — o'lchov keyingi kadrda, xavfsiz maydon hisobga olinadi (app/_components/Tariflar.tsx)
- 2026-09-23: huquqiy hujjatlar ichida boshqa hujjat nomi bosiladigan havolaga aylandi, ko'k rangda ↗ belgisi bilan (lib/services/hujjat-hisob.ts, app/_components/Hujjat.tsx, app/globals.css, DESIGN.md)
- 2026-09-23: Ommaviy oferta §5 ga Foydalanish shartlariga havola qiluvchi jumla qo'shildi uch tilda (hujjatlar/oferta.*.md, lib/hujjatlar.ts)
- 2026-10-04: hisob o'chirilgach Telegram Mini App yopiladi va bot foydalanuvchi tilida bitta xabar yuboradi, izoh prototip matniga qaytdi (lib/telegram.ts, lib/services/bot.ts, lib/services/foydalanuvchilar.ts, app/api/profil/route.ts, app/_components/profil/HisobniOchirish.tsx, lib/lugat/sozlar.ts)

## Handoff

Deploy: frontend Vercel, backend Railway (DECISIONS 2026-09-16, amalga oshirildi 2026-09-22): bot webhook,
eslatmalar va fon vazifalari Railway'dagi doimiy jarayonda ishlaydi. Paywall (W1) uchun paywall-tz.md tayyor.
Telefonda jonli sinov va bot webhook o'rnatish bajarildi (2026-09-22); Vercel'da BACKEND_URL qo'shildi (2026-09-23).

Prototip auditidan S5'ga qolgan eslatmalar (2026-09-22):
- F4 (obuna sahifasi): to'lovlar tarixi ro'yxati — har to'lov uchun summa, `sana · usul` va holat belgisi (prototip `screens-profile.jsx:291-307`); hozir faqat "Hozircha to'lov yo'q". To'lov integratsiyasi taskida qurish.
~~F5 (hisobni o'chirish, 2-qadam): izoh matni prototipda "O'chirilgach Telegramga qaytariladi va bot orqali bitta xabar yuboriladi." — ilovada vaqtincha "Hisob darhol o'chadi. Ilovani qayta ochsangiz, yangi hisob yaratiladi." Mini App SDK va bot ulangach prototip matniga qaytarish, o'chirishdan keyin ilovani yopish va bot xabari.~~ — bajarildi (2026-10-04)
- ~~F4 "Obunani bekor qilish" tugmasi va tasdiq varag'i~~ — qurilmaydi (DECISIONS 2026-09-23).
- ~~Privacy/Terms matnida "18+" bandi~~ — yopildi (DECISIONS 2026-09-23: onboarding to'smaydi, hujjatda foydalanuvchi o'zi tasdiqlaydi).

W1 orqaga tugmasi: telefonda jonli sinovda tasdiqlandi (2026-09-22).

Prototip auditi (2026-09-23, S5 yopilgach): ~75 farq, ~30 tasi ataylab. Tuzatildi — asosiy tugma lime, qorong'i matn/karta tokenlari, sarlavha shrifti, orqaga 24 px, E2 qatorlari, E3 kamera ramkasi, E7 tavsiya joyi, E9 jami kartasi, P1 streak/vazn formati/sanalar, P2 xato va xabar, P3 farq joyi, ProQulfi butunicha bosiladi, F3 18+ izohi, Profil "Yordam" (admin Telegram chati), skeletlar, O13/F1 matnlari, ~50 ta ru/en tarjima. Qoldirilganlar va sabablari — DECISIONS 2026-09-23 "prototip auditi". Telefonda jonli ko'rish (lime tugmalar, jonli kamera ramkasi) — bajarildi (2026-09-23).

Keyingi: S5 yakuni — qolgan tasklar (to'lov, bildirishnomalar) keyinga qoldirilgan. 3-task jonli sinovi (/start → til → Boshlash → ilova shu tilda ochilishi) — bajarildi (2026-09-23). Railway'da APP_URL Vercel https domeni bo'lishi shart (aks holda Boshlash tugmasi chiqmaydi).

P1 haftalik hisobot: ustunli ko'rinish jonli ma'lumotda (bu haftada 3+ kun yozuv) ko'rib chiqilsin.

Railway backend'ga ADMIN_TELEGRAM=NutrliLiferPro qo'shildi (2026-09-23) — bo'lmasa W1 "Davom etish" "To'lov tez orada" varag'ini ochadi.

Fon vazifalari: Railway backend'da FON_VAZIFALARI=1 qo'shilgan (foydalanuvchi, 2026-09-22); deploydan keyin Railway logida "Fon vazifalari —" qatorlari chiqishini tekshirish. Dev foydalanuvchining telegram_id si soxta (1000000001) — bot sinovi uchun haqiqiy hisob kerak.

Bot almashtirilsa: Railway va .env da TELEGRAM_BOT_TOKEN, keyin scripts/bot-webhook.mjs https://nutrilife-production-e0a5.up.railway.app va scripts/bot-tavsif.mjs; @BotFather'da menyu tugmasi (URL https://nutrilife-khaki.vercel.app, Title "Kirish") va avatar.

Hujjat matni o'zgarsa: hujjatlar/<nom>.<til>.md ni tahrirlab, `node scripts/hujjat-yig.mjs` ni ishga tushirish shart (lib/hujjatlar.ts avtomatik yaratiladi).

O1 posteri uch tilda (2026-09-23): intro.png / intro-ru.png / intro-en.png, til bo'yicha tanlanadi. Onboarding'ni tugatgan dev hisobda ekran brauzerda ko'rilmadi — telefonda uch tilda ko'rish.

W1 "Avval tarifni tanlang" tepada kesilishi (2026-09-23) lokal qayta hosil qilinmadi, himoya tuzatishi qo'yildi — telefonda Telegram ichida qayta tekshirish.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
