# SPRINT 3 — auth

**Maqsad:** Foydalanuvchi Telegram akkaunti bilan kirsin va har rol faqat o'ziga
tegishlisini ko'rsin.

**Savol:** Kim kirdi?

## Tasklar

- [x] Telegram initData tekshiruvi: server tomonda imzo tasdiqlanadi, Telegram ID bo'yicha `foydalanuvchilar` yozuvi topiladi yoki yaratiladi. Bot tokeni Vercel Environment Variables'da
- [x] S1 merosini almashtirish: `lib/services/ovqat-yozuvlari.ts` dagi qotirilgan `S1_FOYDALANUVCHI` olib tashlanadi, servislar sessiyadagi foydalanuvchi ID'sini oladi; `ovqat_yozuvlari.foydalanuvchi_id` `foydalanuvchilar` ga tashqi kalit bo'ladi, `s1-sinov` yozuvlari esa birinchi admin hisobiga o'tkaziladi yoki o'chiriladi (o'chirish — faqat ruxsat bilan)
- [ ] Sessiya saqlanishi — foydalanuvchi ilovani qayta ochganda qaytadan kirmaydi
- [ ] Onboarding oqimi: Intro -> til -> ism -> maqsad -> yosh, bo'y, joriy vazn, maqsad vazn -> faollik -> ovqat afzalliklari -> ovqatlanish odatlari -> motivatsiya. Javoblar `profillar` jadvaliga yoziladi
- [ ] Terms qabul qilish katakchasi (O1) va yosh bo'yicha 18+ tekshiruvi (O5) — katakcha belgilanmasa yoki yosh 18 dan kichik bo'lsa davom etilmaydi
- [ ] Rollar: FREE, PRO va admin. PRD'dagi huquqlar jadvali bo'yicha
- [ ] Himoyalangan API yo'llari: foydalanuvchi faqat o'z jurnalini, o'z profilini va o'z progressini ko'radi. Mavjud `/api/ovqat-yozuvlari` (GET, POST) va S2'dagi `[id]` yo'llari (PATCH, DELETE) egasi bo'yicha filtrlanadi; sessiyasiz so'rov rad etiladi
- [ ] Profil sahifasi: avatar, ism, obuna holati, asosiy maqsad, joriy va maqsad vazn, ilovadagi kunlar. Home sarlavhasi ism bilan salomlashadi ("Xush kelibsiz, {ism}" — S1'da faqat "Bugun")
- [ ] Interfeys matnlarini lug'atga chiqarish (o'zbek, rus, ingliz): S1–S2 ekranlaridagi komponent ichida qotirilgan o'zbekcha matnlar, ovqat turlari va sana formati (`yozuv-hisob.ts`) til bo'yicha almashadi — sozlamalardagi til tanlovi shunga tayanadi
- [ ] Sozlamalar sahifasi: til, mavzu (S2'dagi almashtirgich shu yerga ko'chadi), birliklar (kg/lb, sm/ft, kkal/kJ), shaxsiy ma'lumot, hisobni o'chirish (tasdiqlash oynasi bilan)
- [ ] Analitika hodisalari: ro'yxatdan o'tish, onboarding yakunlanishi, birinchi skan, kunlik faollik. North star metrikasi shu yerda tanlanadi (DECISIONS ochiq savol 1) — S1'da analitika qo'yilmagan
- [ ] "Rasm mualliflari" sahifasi (Profil/Sozlamalar ichida) — public/taomlar/MUALLIFLAR.md dagi muallif va litsenziyalarni ko'rsatadi; CC BY / BY-SA talabi, ommaga chiqishdan oldin shart

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

- 2026-09-20: Telegram initData imzosi tekshiriladi va `foydalanuvchilar` yozuvi topiladi/yaratiladi (lib/services/telegram-initdata.ts, lib/services/foydalanuvchilar.ts, app/api/auth/telegram/route.ts)
- 2026-09-20: `S1_FOYDALANUVCHI` olib tashlandi — servislar `foydalanuvchiId` ni parametr sifatida oladi, API yo'llari egani `joriyFoydalanuvchiId()` dan oladi (vaqtincha bazadagi birinchi hisob); 4 jadvalda `foydalanuvchi_id` tashqi kalit bo'ldi; `s1-sinov` yozuvlari (4 yozuv, 12 rasm, 1 skan hisobi) birinchi admin hisobiga ko'chirildi (lib/services/sessiya.ts, lib/services/ovqat-yozuvlari.ts, lib/services/rasmlar.ts, lib/services/skan-hisobi.ts, lib/services/skan.ts, app/api/ovqat-yozuvlari/, app/api/rasmlar/, app/api/skan/route.ts, prisma/schema.prisma, prisma/migrations/20260920163418_s3_foydalanuvchi_tashqi_kalit/)

## Handoff

Keyingi: 3-task — sessiya. `lib/services/sessiya.ts` dagi `joriyFoydalanuvchiId(sorov)` VAQTINCHA bazadagi birinchi hisobni (birinchi admin) qaytaradi — 3-taskda faqat shu funksiyaning ichi sessiyani o'qishga almashadi, servis va route'lar o'zgarmaydi; vaqtinchalik yo'l lokal dev uchun zaxira bo'lib qolishi mumkin. Hozircha hech bir sahifa `/api/auth/telegram` ni chaqirmaydi.
Tekshirilmagan: haqiqiy Telegram ichidan kelgan initData (faqat o'zimiz imzolagan soxta initData sinaldi) va production'dagi `/api/auth/telegram` — 3-taskda Telegram ichidan ochib sinaladi; parallel so'rovdagi P2002 tarmog'i (`foydalanuvchilar.ts`) faqat kodda.
3-task uchun ochiq savollar: initData klientda qayerdan o'qiladi — `telegram-web-app.js` skripti (to'liq SDK ulanishi S5'da) yoki URL hash'dagi `tgWebAppData`; ilova "sessiya tugadi" javobini olsa jimgina qayta kirishga urinadi, bo'lmasa "Ilovani qayta oching" ko'rsatadi (foydalanuvchi bilan kelishilgan); Telegram'dan tashqarida initData yo'q — lokal dev rejimi uchun yechim kerak.
Sinov: `TELEGRAM_BOT_TOKEN` `.env` va Vercel'da bor; sinov qatori (telegram_id = 1) ruxsat bilan o'chirildi. Sinov kuni kompyuter DNS'i beqaror edi — Railway'ga ulanish uzilib turdi (P1001, SocketTimeout, MCP'da ETIMEDOUT), bu ilova nuqsoni emas.
Onboarding oqimi (O1-O13) uchun onboarding-tz.md, profil va sozlamalar ekranlari (F1-F5) uchun profil-tz.md tayyor.
Birinchi admin hisobi: `foydalanuvchilar` da bitta qator (id `02756029-b206-4794-a927-99d6318dee00`, egasining Telegram ID'si bilan) — S1–S2 sinov yozuvlari shu hisobda; 6-taskda (rollar) shu hisobga `admin` roli beriladi. Omborda (R2) eski rasmlar kaliti `ovqat/s1-sinov/...` bo'lib qolgan, yangilari `ovqat/<foydalanuvchi-id>/...` — rasm doim bazadagi `kalit` ustuni orqali topiladi.
Sahifalar (app/page.tsx, jurnal, yozuv/[id], qoshildi/[id], tahlil/[rasmId]) o'z API'siga server tomondan `fetch(apiAsos() + ...)` bilan murojaat qiladi — bu so'rovlar brauzer cookie'sini o'zi olib o'tmaydi; 3-taskda sessiya cookie'da bo'lsa, uni shu so'rovlarga uzatish (yoki sahifalarda servisni to'g'ridan-to'g'ri chaqirish) hal qilinishi kerak.
2-taskda sinalmagan: `/api/skan` (haqiqiy AI chaqiruvi pul sarflaydi — yangi `foydalanuvchiId` parametri faqat tsc bilan tekshirildi); 401 "Kirish talab qilinadi" tarmog'i (bazada hisob bor, shuning uchun chaqirilmadi). To'liq egalik himoyasi sinovi — 7-taskda.
Dev va production bitta Railway bazasida: migratsiya qo'yilgan zahoti eski production kodi buziladi (2-taskda production Home/Jurnal deploy'gacha bo'sh ko'rindi, yozish FK xatosi berdi) — baza sxemasi o'zgaradigan taskdan keyin darhol commit/push qilinadi.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
