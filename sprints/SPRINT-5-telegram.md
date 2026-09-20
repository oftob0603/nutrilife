# SPRINT 5 — telegram

**Maqsad:** Mahsulot Telegram ichida tabiiy ishlasin, o'zi xabar bersin va to'lovni
qabul qilsin.

**Savol:** Qo'lda turadimi?

## Tasklar

- [ ] Telegram Mini App sifatida to'liq ishlashi: WebApp SDK ulanishi, tema Telegram mavzusiga moslashishi, orqaga tugmasi (S1–S2 ekranlaridagi o'z orqaga tugmasi o'rniga Telegram'niki), xavfsiz maydon (safe area). Pastki navigatsiya S2–S4'da qurilgan — bu yerda faqat Telegram xavfsiz maydoniga moslanadi
- [ ] Bot webhook'i Vercel API yo'li sifatida (`/api/bot`) — doimiy ishlaydigan jarayon yo'q, shuning uchun long polling emas
- [ ] Bot kirish nuqtasi: `/start` — salomlashish, til tanlash (o'zbek, rus, ingliz) va "Ilovani ochish" tugmasi. Bot ichida ovqat kiritish yo'q
- [ ] Paywall va obuna ekrani: uch tarif (39,000 so'm/oy · 170,000 so'm/6 oy · 290,000 so'm/yil), yillik tavsiya belgisi, oylik ekvivalent va tejash ko'rsatilishi, "Hozir emas" tugmasi
- [ ] To'lov integratsiyasi: Click, Payme va Telegram Stars. Kalitlar Vercel Environment Variables'da, qaytish manzillari production domeniga yoziladi. `tolovlar` jadvali, holat zanjiri `boshlandi` -> `to'landi` / `bekor qilindi`
- [ ] Obuna faollashuvi: muvaffaqiyatli to'lovdan keyin `obunalar` yozuvi va PRO huquqlari darhol ochiladi
- [ ] Bildirishnomalar bot orqali: nonushta, tushlik, kechki ovqat va suv eslatmalari; sozlamalarda har biri alohida yoqiladi va o'chiriladi
- [ ] Fon vazifalari (Vercel Cron Jobs orqali — server doimiy ishlamaydi; Hobby tarifidagi kunlik chegara sprint boshida tekshiriladi, yetmasa Railway cron): obuna muddati tugashi va tugashdan oldingi ogohlantirish, PRO kunlik skan limitining yangilanishi, kunlik xulosani yopish
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

<!-- hisobotchi to'ldiradi -->

## Handoff

Deploy Vercel + Railway'da (DECISIONS 2026-09-16): bot webhook, eslatmalar va fon vazifalari
serverless muhitga moslab rejalangan. Paywall (W1) uchun paywall-tz.md tayyor.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
