# SPRINT 3 — auth

**Maqsad:** Foydalanuvchi Telegram akkaunti bilan kirsin va har rol faqat o'ziga
tegishlisini ko'rsin.

**Savol:** Kim kirdi?

## Tasklar

- [x] Telegram initData tekshiruvi: server tomonda imzo tasdiqlanadi, Telegram ID bo'yicha `foydalanuvchilar` yozuvi topiladi yoki yaratiladi. Bot tokeni Vercel Environment Variables'da
- [x] S1 merosini almashtirish: `lib/services/ovqat-yozuvlari.ts` dagi qotirilgan `S1_FOYDALANUVCHI` olib tashlanadi, servislar sessiyadagi foydalanuvchi ID'sini oladi; `ovqat_yozuvlari.foydalanuvchi_id` `foydalanuvchilar` ga tashqi kalit bo'ladi, `s1-sinov` yozuvlari esa birinchi admin hisobiga o'tkaziladi yoki o'chiriladi (o'chirish — faqat ruxsat bilan)
- [x] Sessiya saqlanishi — foydalanuvchi ilovani qayta ochganda qaytadan kirmaydi
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
- 2026-09-20: Sessiya — imzolangan token cookie'da (`nl_sessiya`, 30 kun, har ochilishda yangilanadi); `KirishDarvozasi` ilova ochilganda initData bilan kiradi; sahifalar o'z API'siga cookie'ni `serverdanApi()` orqali uzatadi; production'da sessiyasiz so'rov 401 oladi (lib/services/sessiya.ts, lib/services/foydalanuvchilar.ts, app/api/auth/telegram/route.ts, app/_components/KirishDarvozasi.tsx, app/layout.tsx, lib/api-asos.ts, app/page.tsx, app/jurnal/page.tsx, app/yozuv/[id]/page.tsx, app/qoshildi/[id]/page.tsx, app/tahlil/[rasmId]/page.tsx, .claude/launch.json)

## Handoff

Keyingi: 4-task — onboarding oqimi. Undan oldin foydalanuvchi production'da Telegram ichidan (bot menyu tugmasi) kirib ko'rishi kerak: avvalgi 4 ta yozuv bilan Home chiqishi lozim — haqiqiy initData va telefon WebView'idagi cookie birinchi marta shunda sinaladi. Kirishdan keyin yangi foydalanuvchini onboardingga yo'naltirish hali yo'q: `POST /api/auth/telegram` javobidagi `yangi` va `profillar.onboarding_qadami` 4-taskda shunga ishlatiladi.
Tekshirilmagan: haqiqiy Telegram ichidan kelgan initData (faqat o'zimiz imzolagan soxta initData sinaldi) va production'dagi `/api/auth/telegram` — 3-taskda Telegram ichidan ochib sinaladi; parallel so'rovdagi P2002 tarmog'i (`foydalanuvchilar.ts`) faqat kodda.
Sessiya (3-task): token `<foydalanuvchiId>.<tugash>.<imzo>` (HMAC-SHA256, `SESSION_SECRET`), bazada saqlanmaydi; cookie `nl_sessiya` — `HttpOnly; Secure; SameSite=None; Partitioned` (Telegram Web iframe uchun), evaziga `GET` bo'lmagan so'rovlarda `Origin` tekshiriladi (`begonaManba`). `joriyFoydalanuvchiId()` dagi "birinchi hisob" zaxirasi faqat `NODE_ENV !== "production"` da — lokal brauzerda initData'siz ishlash shunga tayanadi. initData klientda URL hash'dagi `tgWebAppData` dan o'qiladi va `sessionStorage` da saqlanadi (`KirishDarvozasi.tsx`); S5'da to'liq SDK ulanganda shu bitta joy `Telegram.WebApp.initData` ga almashadi. `POST /api/auth/telegram` — kirish, `GET` — sessiya holati, `DELETE` — chiqish (10-task "hisobni o'chirish"da kerak bo'ladi).
Sinov: `TELEGRAM_BOT_TOKEN` `.env` va Vercel'da bor; sinov qatori (telegram_id = 1) ruxsat bilan o'chirildi. Sinov kuni kompyuter DNS'i beqaror edi — Railway'ga ulanish uzilib turdi (P1001, SocketTimeout, MCP'da ETIMEDOUT), bu ilova nuqsoni emas.
Onboarding oqimi (O1-O13) uchun onboarding-tz.md, profil va sozlamalar ekranlari (F1-F5) uchun profil-tz.md tayyor.
Birinchi admin hisobi: `foydalanuvchilar` da bitta qator (id `02756029-b206-4794-a927-99d6318dee00`, egasining Telegram ID'si bilan) — S1–S2 sinov yozuvlari shu hisobda; 6-taskda (rollar) shu hisobga `admin` roli beriladi. Omborda (R2) eski rasmlar kaliti `ovqat/s1-sinov/...` bo'lib qolgan, yangilari `ovqat/<foydalanuvchi-id>/...` — rasm doim bazadagi `kalit` ustuni orqali topiladi.
Sahifalar foydalanuvchiga tegishli ma'lumotni `serverdanApi()` (lib/api-asos.ts) orqali oladi — u kelgan so'rovdagi cookie'ni uzatadi; yangi sahifalarda ham `fetch(apiAsos() + ...)` emas, shu ishlatiladi (`/api/taomlar` kabi egasiz yo'llar bundan mustasno).
2-taskda sinalmagan: `/api/skan` (haqiqiy AI chaqiruvi pul sarflaydi — yangi `foydalanuvchiId` parametri faqat tsc bilan tekshirildi); 401 "Kirish talab qilinadi" tarmog'i (bazada hisob bor, shuning uchun chaqirilmadi). To'liq egalik himoyasi sinovi — 7-taskda.
Dev va production bitta Railway bazasida: migratsiya qo'yilgan zahoti eski production kodi buziladi (2-taskda production Home/Jurnal deploy'gacha bo'sh ko'rindi, yozish FK xatosi berdi) — baza sxemasi o'zgaradigan taskdan keyin darhol commit/push qilinadi.
3-taskda sinalmagan: haqiqiy Telegram ichidan ochish (hash formati va telefon WebView'ida `Partitioned` cookie — faqat o'zimiz yasagan `#tgWebAppData=` havolasi bilan sinaldi); Telegram Web (iframe), ayniqsa Safari — cookie bloklanishi mumkin, S5'da tekshiriladi. Kelishilgan, lekin qoldirilgan: API 401 qaytarsa jimgina qayta kirish o'rami — 7-taskda (himoyalangan API) barcha klient so'rovlariga 401 boshqaruvi bilan birga qilinadi; hozir cookie har ochilishda yangilangani uchun ish o'rtasida sessiya tugashi amalda bo'lmaydi.
Ma'lum chekka holat: hisob o'chirilsa (10-task) boshqa qurilmadagi cookie yaroqli qoladi — token bazaga qaramaydi, o'qish bo'sh qaytadi, yozish FK xatosi beradi; keyingi ochilishda initData bilan yangi hisob yaratiladi. 10-taskda hal qilinadi (masalan, `GET /api/auth/telegram` allaqachon hisob yo'qligida 401 qaytaradi). Birinchi ochilish har doim `/` dan bo'ladi; sessiyasiz chuqur havola (`/yozuv/[id]`, `/tahlil/[rasmId]`) 401 tufayli xato/404 ko'rsatadi.
Sinov usuli: production rejimi lokalda `nutrilife-prod` (launch.json, 3100-port, avval `npm run build`) — dev'da zaxira yo'l borligi uchun 401 tarmoqlari faqat shu yerda ko'rinadi. Imzolangan initData 24 soat yaroqli kirish kaliti — chatga/terminalga chiqarilmaydi; brauzerga scratchpad'dagi yo'naltirgich skripti (302 -> `#tgWebAppData=`) orqali yetkazildi. Claude brauzer panelida orqa fondagi tabda `loading="lazy"` rasmlar yuklanmaydi — ilova nuqsoni emas.
Production: deploy'dan keyin ilova oddiy brauzerda ochilmaydi ("Ilovani Telegram orqali oching") — faqat Telegram ichidan. `SESSION_SECRET` Vercel'da faqat Production muhitida (foydalanuvchi qo'shgan); bot menyu tugmasi `https://nutrilife-khaki.vercel.app` ga ulangan.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
