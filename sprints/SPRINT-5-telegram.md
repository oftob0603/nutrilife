# SPRINT 5 — telegram

**Maqsad:** Mahsulot Telegram ichida tabiiy ishlasin, o'zi xabar bersin va to'lovni
qabul qilsin.

**Savol:** Qo'lda turadimi?

## Tasklar

- [x] Telegram Mini App sifatida to'liq ishlashi: WebApp SDK ulanishi, tema Telegram mavzusiga moslashishi, orqaga tugmasi (S1–S2 ekranlaridagi o'z orqaga tugmasi o'rniga Telegram'niki), xavfsiz maydon (safe area). Pastki navigatsiya S2–S4'da qurilgan — bu yerda faqat Telegram xavfsiz maydoniga moslanadi
- [x] Bot webhook'i API yo'li sifatida (`/api/bot`) — 2026-09-22 dan backend Railway'da, webhook Railway domeniga o'rnatiladi
- [ ] Bot kirish nuqtasi: `/start` — salomlashish, til tanlash (o'zbek, rus, ingliz) va "Ilovani ochish" tugmasi. Bot ichida ovqat kiritish yo'q
- [ ] Paywall va obuna ekrani: uch tarif (39,000 so'm/oy · 170,000 so'm/6 oy · 290,000 so'm/yil), yillik tavsiya belgisi, oylik ekvivalent va tejash ko'rsatilishi, "Hozir emas" tugmasi
- [ ] To'lov integratsiyasi: Click, Payme va Telegram Stars. Kalitlar Railway Environment Variables'da, qaytish manzillari production domeniga yoziladi. `tolovlar` jadvali, holat zanjiri `boshlandi` -> `to'landi` / `bekor qilindi`
- [ ] Obuna faollashuvi: muvaffaqiyatli to'lovdan keyin `obunalar` yozuvi va PRO huquqlari darhol ochiladi
- [ ] Bildirishnomalar bot orqali: nonushta, tushlik, kechki ovqat va suv eslatmalari; sozlamalarda har biri alohida yoqiladi va o'chiriladi
- [ ] Fon vazifalari (backend Railway'da doimiy ishlaydi — Railway cron yoki jarayon ichidagi rejalashtirgich, sprint boshida tanlanadi): obuna muddati tugashi va tugashdan oldingi ogohlantirish, PRO kunlik skan limitining yangilanishi, kunlik xulosani yopish
- [ ] Privacy Policy va Terms of Use sahifalari: 18+, AI taxminlari, obuna va to'lov, bekor qilish, pul qaytarilmasligi, sog'liq bo'yicha ogohlantirish, rasmlar uchinchi tomon AI xizmatiga yuborilishi, O'zbekiston Respublikasi qonuni

## Qabul mezoni

- Botda `/start` bosilganda til tanlanadi va "Ilovani ochish" tugmasi Mini App'ni ochadi
- Mini App Telegram ichida to'liq ekranda ochiladi, pastki navigatsiya barmoq yetadigan joyda
- Telegram Stars orqali test to'lov o'tkaziladi va PRO darhol faollashadi
- Obuna muddati tugagach yangi skan yopiladi, lekin butun jurnal va progress ochiq qoladi
- Nonushta eslatmasi belgilangan vaqtda botdan keladi
- Terms sahifasida sog'liq bo'yicha ogohlantirish matni to'liq ko'rinadi

## Bu sprintda YO'Q

Bot ichida ovqat kiritish · to'liq bot menyusi (/profile, /progress, /settings) ·
avtomatik takroriy to'lov · admin paneli.

## Hisobot

- 2026-09-22: Telegram Mini App SDK ulandi (tema, orqaga tugmasi, safe area) va bot webhook `/api/bot` qo'shildi, jonli sinov deploy va webhook o'rnatishdan keyin (lib/telegram.ts, app/_components/TelegramUlagich.tsx, app/api/bot/route.ts, lib/services/bot.ts, scripts/bot-webhook.mjs)
- 2026-09-22: backend Railway'ga ko'chirildi, frontend Vercel'da qoldi (DECISIONS 2026-09-16 amalga oshirildi) (next.config.ts, lib/api-asos.ts, lib/services/sessiya.ts, .env.example)
- 2026-09-22: Railway'ga ko'chirish telefonda jonli sinovda tasdiqlandi, bot webhook Railway domeniga o'rnatildi
- 2026-09-22: galereyadan rasm tanlanganda to'liq ekranli E6 yuklash holati va telefondagi nusxa tahlilda ishlatilishi qo'shildi (app/_components/QoshishPaneli.tsx, app/_components/Tahlil.tsx, lib/services/rasm-yuklash.ts)
- 2026-09-22: matn bilan tasvirlash ekranida izoh va placeholder taxminiy miqdor o'rniga og'irlikni (grammda) so'raydi, ruscha/inglizcha tarjimalar yangilandi (app/_components/Tasvirlash.tsx, lib/lugat/sozlar.ts)

## Handoff

Deploy: frontend Vercel, backend Railway (DECISIONS 2026-09-16, amalga oshirildi 2026-09-22): bot webhook,
eslatmalar va fon vazifalari Railway'dagi doimiy jarayonda ishlaydi. Paywall (W1) uchun paywall-tz.md tayyor.
Telefonda jonli sinov va bot webhook o'rnatish bajarildi (2026-09-22); Vercel'da faqat BACKEND_URL qoldi.

Prototip auditidan S5'ga qolgan eslatmalar (2026-09-22):
- F4 (obuna sahifasi): to'lovlar tarixi ro'yxati — har to'lov uchun summa, `sana · usul` va holat belgisi (prototip `screens-profile.jsx:291-307`); hozir faqat "Hozircha to'lov yo'q". To'lov integratsiyasi taskida qurish.
- F5 (hisobni o'chirish, 2-qadam): izoh matni prototipda "O'chirilgach Telegramga qaytariladi va bot orqali bitta xabar yuboriladi." — ilovada vaqtincha "Hisob darhol o'chadi. Ilovani qayta ochsangiz, yangi hisob yaratiladi." Mini App SDK va bot ulangach prototip matniga qaytarish, o'chirishdan keyin ilovani yopish va bot xabari.
- F4 "Obunani bekor qilish" tugmasi va tasdiq varag'i (S4 Handoff'idan).
- Privacy/Terms matnida "18+" bandi: onboarding endi 18 dan kichik yoshni to'smaydi (DECISIONS 2026-09-22) — hujjat matni shunga mos yozilsin yoki qaror qayta ko'rilsin.

Keyingi: 3-task (/start, til tanlash, "Ilovani ochish" tugmasi). Deploydan keyin `scripts/bot-webhook.mjs` bilan webhook o'rnatilishi va jonli sinov kerak; Vercel'da `TELEGRAM_WEBHOOK_SECRET` bo'lishi shart.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
