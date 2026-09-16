# SPRINT 3 — auth

**Maqsad:** Foydalanuvchi Telegram akkaunti bilan kirsin va har rol faqat o'ziga
tegishlisini ko'rsin.

**Savol:** Kim kirdi?

## Tasklar

- [ ] Telegram initData tekshiruvi: server tomonda imzo tasdiqlanadi, Telegram ID bo'yicha `foydalanuvchilar` yozuvi topiladi yoki yaratiladi
- [ ] Sessiya saqlanishi — foydalanuvchi ilovani qayta ochganda qaytadan kirmaydi
- [ ] Onboarding oqimi: Intro -> til -> ism -> maqsad -> yosh, bo'y, joriy vazn, maqsad vazn -> faollik -> ovqat afzalliklari -> ovqatlanish odatlari -> motivatsiya. Javoblar `profillar` jadvaliga yoziladi
- [ ] 18+ katakchasi va Terms qabul qilish onboardingda — belgilanmasa davom etilmaydi
- [ ] Rollar: FREE, PRO va admin. PRD'dagi huquqlar jadvali bo'yicha
- [ ] Himoyalangan API yo'llari: foydalanuvchi faqat o'z jurnalini, o'z profilini va o'z progressini ko'radi
- [ ] Profil sahifasi: avatar, ism, obuna holati, asosiy maqsad, joriy va maqsad vazn, ilovadagi kunlar
- [ ] Sozlamalar sahifasi: til, mavzu, birliklar (kg/lb, sm/ft, kkal/kJ), shaxsiy ma'lumot, hisobni o'chirish (tasdiqlash oynasi bilan)
- [ ] Analitika hodisalari: ro'yxatdan o'tish, onboarding yakunlanishi, birinchi skan, kunlik faollik

## Qabul mezoni

- Telegramdan ochilganda foydalanuvchi hech narsa yozmasdan ichkariga kiradi
- Birinchi kirishda onboarding chiqadi, ikkinchi kirishda to'g'ri Home ochiladi
- Boshqa foydalanuvchining yozuviga API orqali murojaat qilinsa rad javobi keladi
- 18+ katakchasi belgilanmasa "Davom etish" tugmasi ishlamaydi
- Sozlamalarda til rus tiliga o'zgartirilsa interfeys rus tiliga o'tadi
- Hisobni o'chirish tasdiqlash oynasisiz bajarilmaydi

## Bu sprintda YO'Q

Skan limitlari va paywall · to'lov · Nutrition Score · bot · admin paneli.

## Hisobot

<!-- hisobotchi to'ldiradi -->

## Handoff

Onboarding oqimi (O1-O13) uchun onboarding-tz.md, profil va sozlamalar ekranlari
(F1-F5) uchun profil-tz.md tayyor, boshlashda shulardan foydalan.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
