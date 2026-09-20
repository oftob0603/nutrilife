# SPRINT 3 — auth

**Maqsad:** Foydalanuvchi Telegram akkaunti bilan kirsin va har rol faqat o'ziga
tegishlisini ko'rsin.

**Savol:** Kim kirdi?

## Tasklar

- [ ] Telegram initData tekshiruvi: server tomonda imzo tasdiqlanadi, Telegram ID bo'yicha `foydalanuvchilar` yozuvi topiladi yoki yaratiladi. Bot tokeni Vercel Environment Variables'da
- [ ] S1 merosini almashtirish: `lib/services/ovqat-yozuvlari.ts` dagi qotirilgan `S1_FOYDALANUVCHI` olib tashlanadi, servislar sessiyadagi foydalanuvchi ID'sini oladi; `ovqat_yozuvlari.foydalanuvchi_id` `foydalanuvchilar` ga tashqi kalit bo'ladi, `s1-sinov` yozuvlari esa birinchi admin hisobiga o'tkaziladi yoki o'chiriladi (o'chirish — faqat ruxsat bilan)
- [ ] Sessiya saqlanishi — foydalanuvchi ilovani qayta ochganda qaytadan kirmaydi
- [ ] Onboarding oqimi: Intro -> til -> ism -> maqsad -> yosh, bo'y, joriy vazn, maqsad vazn -> faollik -> ovqat afzalliklari -> ovqatlanish odatlari -> motivatsiya. Javoblar `profillar` jadvaliga yoziladi
- [ ] Terms qabul qilish katakchasi (O1) va yosh bo'yicha 18+ tekshiruvi (O5) — katakcha belgilanmasa yoki yosh 18 dan kichik bo'lsa davom etilmaydi
- [ ] Rollar: FREE, PRO va admin. PRD'dagi huquqlar jadvali bo'yicha
- [ ] Himoyalangan API yo'llari: foydalanuvchi faqat o'z jurnalini, o'z profilini va o'z progressini ko'radi. Mavjud `/api/ovqat-yozuvlari` (GET, POST) va S2'dagi `[id]` yo'llari (PATCH, DELETE) egasi bo'yicha filtrlanadi; sessiyasiz so'rov rad etiladi
- [ ] Profil sahifasi: avatar, ism, obuna holati, asosiy maqsad, joriy va maqsad vazn, ilovadagi kunlar. Home sarlavhasi ism bilan salomlashadi ("Xush kelibsiz, {ism}" — S1'da faqat "Bugun")
- [ ] Interfeys matnlarini lug'atga chiqarish (o'zbek, rus, ingliz): S1–S2 ekranlaridagi komponent ichida qotirilgan o'zbekcha matnlar, ovqat turlari va sana formati (`yozuv-hisob.ts`) til bo'yicha almashadi — sozlamalardagi til tanlovi shunga tayanadi
- [ ] Sozlamalar sahifasi: til, mavzu (S2'dagi almashtirgich shu yerga ko'chadi), birliklar (kg/lb, sm/ft, kkal/kJ), shaxsiy ma'lumot, hisobni o'chirish (tasdiqlash oynasi bilan)
- [ ] Analitika hodisalari: ro'yxatdan o'tish, onboarding yakunlanishi, birinchi skan, kunlik faollik. North star metrikasi shu yerda tanlanadi (DECISIONS ochiq savol 1) — S1'da analitika qo'yilmagan

## Qabul mezoni

- Telegramdan ochilganda foydalanuvchi hech narsa yozmasdan ichkariga kiradi
- Birinchi kirishda onboarding chiqadi, ikkinchi kirishda to'g'ri Home ochiladi
- Boshqa foydalanuvchining yozuviga API orqali murojaat qilinsa rad javobi keladi
- Terms katakchasi belgilanmasa "Boshlash" tugmasi ishlamaydi
- Yosh 17 kiritilsa "Davom etish" tugmasi ishlamaydi va sabab ko'rsatiladi
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
