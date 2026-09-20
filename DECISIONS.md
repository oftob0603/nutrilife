# DECISIONS — Kalori

Qarorlar jurnali. Format: `sana · qaror · sabab`.
Yangi qaror qabul qilinganda shu faylga bitta qator qo'shiladi, eskisi o'chirilmaydi.

---

## 2026-09-13 — boshlang'ich qarorlar

**2026-09-13 · Stack qotirildi: Next.js + TypeScript + PostgreSQL + Prisma + Tailwind.**
*Sabab:* Kurs pozitsiyasi — o'ylash stackka emas, mahsulotga sarflanadi. Batafsil
[STACK.md](STACK.md) faylida.

**2026-09-13 · Arxitektura API-first.**
*Sabab:* Mahsulot Telegram Mini App sifatida quriladi; mantiq API ichida yashasa,
kelajakda yangi mijoz qo'shilganda backend qayta yozilmaydi.

**2026-09-13 · Yurak amal — "ko'rish": kunlik normaning qanchasi to'lganini bitta doirada
ko'rish.**
*Sabab:* Blok 1. Ilova Home ekrani bilan ochiladi, ovqat qo'shish shu doirani to'ldirish
uchun vosita.

**2026-09-13 · Kanal faqat Telegram Mini App. Brauzer versiyasi, App Store va Play Market
ilovasi yo'q.**
*Sabab:* Blok 1 — asosiy farqlovchi xususiyat aynan "o'rnatishsiz, 2 bosishda ishlaydi".

**2026-09-13 · Kirish Telegram initData orqali avtomatik. Telefon, email va parol
so'ralmaydi.**
*Sabab:* Blok 2 — ro'yxatdan o'tish to'sig'i eng past bo'lishi kerak.

**2026-09-13 · 18+ chegarasi faqat Terms of Use va onboarding katakchasi bilan. Hujjat
tekshirilmaydi.**
*Sabab:* Blok 2 — hujjat talab qilish ro'yxatdan o'tishni keskin pasaytiradi.

**2026-09-13 · FREE limiti — umr davomida jami 3 ta AI skan. Retseptlarning to'liq matni
ham PRO ostida.**
*Sabab:* Blok 2 — konversiya yuqori bo'lishi uchun qattiq chegara tanlandi.

**2026-09-13 · PRO limiti — kuniga 20 ta skan. Interfeysda "limitsiz" deb ko'rsatiladi.**
*Sabab:* Blok 4 — har skan AI xarajatiga tushadi, adolatli foydalanish chegarasi
xarajatni nazoratda ushlaydi.

**2026-09-13 · Paywall majburiy emas — "Hozir emas" tugmasi bilan o'tkazib yuboriladi.**
*Sabab:* Blok 3 — foydalanuvchi 3 ta bepul skan bilan mahsulotni sinab ko'rishi kerak.

**2026-09-13 · Kunlik kaloriya normasi Mifflin-St Jeor formulasi bilan, kod ichida
hisoblanadi. AI'ga topshirilmaydi.**
*Sabab:* Blok 3 — natija barqaror va tushuntirib beriladigan bo'lishi kerak; AI har
safar boshqacha raqam berishi mumkin.

**2026-09-13 · Nutrition Score formula bilan hisoblanadi: kaloriya normaga yaqinlik +
makro balans. AI baholamaydi.**
*Sabab:* Blok 3 — barqarorlik va xarajat. Ball axborot xarakterida, tibbiy baho emas.

**2026-09-13 · Jurnalga faqat bugungi kunga yozuv qo'shiladi. O'tgan kunlar o'zgarmaydi.**
*Sabab:* Blok 3 — streak va hisobot halol bo'lishi uchun.

**2026-09-13 · Tasdiqlanmagan AI natijasi jurnalga tushmaydi. Ishonch past bo'lsa qiymat
uydirilmaydi.**
*Sabab:* Mahsulot talabi — noto'g'ri tanish to'g'ridan-to'g'ri jurnalga kirmasligi kerak.

**2026-09-13 · Foydalanuvchi tuzatishlari admin tasdiqlaydigan navbatga tushadi,
avtomatik umumiy bazaga qo'shilmaydi.**
*Sabab:* Blok 2 — AI vaqt o'tib aniqlashadi, lekin noto'g'ri ma'lumot bazaga kirmaydi.

**2026-09-13 · Internet yo'q yoki AI javob bermasa — xato ekrani va qayta urinish. Oflayn
navbat yo'q.**
*Sabab:* Blok 3 — v1 sodda bo'lishi kerak.

**2026-09-13 · To'lov har safar qo'lda. Avtomatik takroriy yechish yo'q.**
*Sabab:* Blok 4 — karta tokenizatsiyasi qo'shimcha shartnoma va texnik ish talab qiladi,
v1 tez ishga tushishi kerak.

**2026-09-13 · To'lov tizimlari: Click, Payme va Telegram Stars — uchalasi v1'da.**
*Sabab:* Blok 4 — qamrov to'liq bo'lishi kerak, Telegram Stars Mini App uchun tabiiy yo'l.

**2026-09-13 · Bekor qilish istalgan vaqt, pul qaytarilmaydi, PRO muddat oxirigacha
ishlaydi.**
*Sabab:* Blok 4 — eng ko'p tarqalgan va suiiste'molga yopiq model.

**2026-09-13 · Obuna muddati tugagach butun tarix o'qish uchun ochiq qoladi.**
*Sabab:* Blok 4 — foydalanuvchi ma'lumotini yo'qotmasa, qaytib kelishga moyil bo'ladi.

**2026-09-13 · Ovqat rasmlari doimiy saqlanadi va jurnalda ko'rinadi.**
*Sabab:* Blok 5. Bu saqlash xarajati va maxfiylik mas'uliyatini oshiradi — Privacy
Policy'da ochiq yozilishi shart.

**2026-09-13 · Retseptlar bazasi admin tomonidan qo'lda kiritiladi, AI generatsiya
qilmaydi.**
*Sabab:* Blok 3 — kaloriya aniqligi nazorat ostida bo'lishi kerak.

**2026-09-13 · Telegram bot faqat kirish nuqtasi: /start, til tanlash va "Ilovani ochish"
tugmasi. Bot ichida ovqat kiritish yo'q.**
*Sabab:* Blok 5 — ikki karra ish qilinmaydi, bot Mini App'ga yo'naltiradi.

**2026-09-13 · Ovozli kiritish, mikrofon va nutqni matnga aylantirish hech qayerda
bo'lmaydi — ilovada ham, botda ham.**
*Sabab:* Mahsulot talabining qat'iy qoidasi. Ovqat kiritish faqat kamera, galereya va
qo'lda matn.

**2026-09-13 · Yuridik shaxs — YaTT. Qo'llaniladigan qonun: O'zbekiston Respublikasi.**
*Sabab:* Blok 5 — Click va Payme shartnoma talab qiladi, YaTT tezroq va arzonroq.

**2026-09-13 · V1 chegarasi belgilandi.**
*Sabab:* Blok 5. V1'ga kirmaydiganlar: haftalik hisobot va chuqur analitika, PDF/CSV
eksport, murabbiy roli, avtomatik to'lov, oflayn navbat, o'tgan kunlarga yozuv.
To'liq ro'yxat [PRD.md](PRD.md) 10-bo'limida.

---

## 2026-09-13 — savala raundidan keyingi qarorlar

**2026-09-13 · FREE limiti o'zgartirildi: umr davomida jami 3 ta skan EMAS, kuniga
1 ta bepul skan.**
*Sabab:* O'sish marketologi e'tirozi — birinchi foydalanuvchilar pulli reklamadan
keladi, 3 ta skan tugagach o'sha kuni ketib qoladi va reklama puli qaytmaydi.
Kunlik limit odat shakllanishiga imkon beradi. Bu [PRD.md](PRD.md) 8-bo'limidagi
"Limitlar" qoidasini bekor qiladi.

**2026-09-13 · To'lov API orqali avtomatik tasdiqlanadi va PRO darhol faollashadi.**
*Sabab:* Operatsion direktor e'tirozi — qo'lda tekshirish kunlik yuk bo'lardi.
Foydalanuvchi to'lovni o'zi boshlaydi (avtomatik takroriy yechish hamon yo'q), lekin
tasdiqlash va tarif yoqilishi qo'l aralashuvisiz ketadi.

**2026-09-13 · Telefon raqam va email umuman yig'ilmaydi.**
*Sabab:* Yurist-riskchi e'tirozi — yig'ilmagan ma'lumot uchun javobgarlik ham,
saqlash yuki ham yo'q. Aloqa kanali — Telegram akkaunti.

**2026-09-13 · Skan natijasida foydalanuvchi ovqat vaznini va qo'shimcha ma'lumotni
kiritib aniqroq javob olishi mumkin.**
*Sabab:* CTO e'tirozi — rasmdan porsiya og'irligini baholash kompyuter ko'rishning eng
zaif nuqtasi. Foydalanuvchi kiritgan vazn AI taxminidan ustun turadi.

**2026-09-13 · Terms of Use'da javobgarlik chegarasi aniq yoziladi: ilova tibbiy xizmat
emas, foydalanish ixtiyoriy, noqulay holat va kasallikda shifokor bilan maslahatlashish
tavsiya etiladi, ilova faqat taxminiy kaloriya o'lchaydi va retsept tavsiya qiladi.**
*Sabab:* Yurist-riskchi e'tirozi va YaTT sifatida shaxsiy javobgarlik.

**2026-09-13 · AI aniqlik testi S1'dan OLDIN o'tkaziladi.**
*Sabab:* CTO e'tirozi — 20 ta o'zbek taomi rasmi bilan bir kunlik test butun texnik
garovni tekshiradi. 6 sprint qurib, keyin model oshni shavladan ajratmasligini bilish
eng qimmat yo'l. Test paytida bitta skan tannarxi ham o'lchanadi.

**2026-09-13 · Dizayn tizimi uchun "A — qat'iy asbob" varianti tanlandi: monoxrom asos
(#0B0B0C / #F2F2F3 / #FFFFFF) + bitta lime aksent (#C6F04C), Inter Tight + Inter.**
*Sabab:* Foydalanuvchi tanlovi — uch variant orasidan eng qat'iy va aksent bilan
ishlaydigan yo'nalish tanlandi, DESIGN.md shu asosda yozildi.

---

## 2026-09-16 — onboarding aniqlashtirish

**2026-09-16 · 18+ tasdig'i onboardingning birinchi ekranidagi katakcha bilan emas,
yosh kiritish qadamida (O5) beriladi — yosh 18 dan kichik bo'lsa oqim davom etmaydi.**
*Sabab:* Kiritilgan yosh katakchadan kuchliroq dalil, ikkalasini so'rash bir ishni
ikki marta qilish. Batafsil [onboarding-tz.md](onboarding-tz.md) O5 bo'limida.

## 2026-09-16 — loyiha skeleti

**2026-09-16 · GitHub repo nomi `nutrilife` (avvalgi `kalori` qayta nomlandi).**
*Sabab:* Foydalanuvchi qarori; qayta nomlash commit tarixini saqlaydi.

**2026-09-16 · Versiyalar: Next.js 16.3.5, Prisma 7.10.0, Tailwind 4.3, TypeScript 6.0, ESLint 9.**
*Sabab:* Prisma'ning `latest` tegi 8.0 RC — barqaror emas. TypeScript 7 va ESLint 10
`eslint-config-next` bilan hali ishlamaydi (lint yiqildi), shuning uchun oldingi barqaror liniyalar olindi.

**2026-09-16 · Deploy: frontend Vercel, backend Railway, PostgreSQL Railway. Docker va Docker Compose ishlatilmaydi.**
*Sabab:* Foydalanuvchi qarori. Production sirlari platformalarning Environment Variables orqali beriladi;
lokal ishlashda ham Railway bazasiga public URL orqali ulaniladi. STACK.md'dagi Hetzner/Caddy qatorlari eskirdi.

**2026-09-16 · "baza" MCP serveri SDK'siz, mavjud `pg` bilan yozildi; DELETE/DROP/TRUNCATE alohida `xavfli_sorov` vositasida va har safar ruxsat so'raladi.**
*Sabab:* Yangi dependency qo'shmaslik; o'chirish faqat aniq ruxsat bilan bo'lishi qoidasini sozlama darajasida ta'minlash.

## 2026-09-20 — prototip va taomlar jadvali

**2026-09-20 · Prototip (Claude Design paketi) `prototip/` papkasida saqlanadi va ekranlar uning kodiga tayanib quriladi.**
*Sabab:* Foydalanuvchi qarori: reja bilan prototip dizayni zid kelsa, prototip ustun. CLAUDE.md'dagi
"prototip kodi ko'chirilmaydi" qoidasi shu bilan yumshatildi; papka lint va tsconfig tekshiruvidan chiqarilgan.

**2026-09-20 · `taomlar` jadvali maydonlari prototipdagi FOODS tuzilmasidan olindi: bitta "porsiya grammi" o'rniga o'lchov miqdori, o'lchov birligi va porsiyalar ro'yxati. Seed 4 ta emas, 8 ta taom.**
*Sabab:* Prototipda taomlar ikki xil o'lchanadi (osh grammda, manti va somsa donada); sprintdagi minimal
tavsif buni ifodalay olmasdi.

**2026-09-20 · Klient komponent ishlatadigan sof hisob bazaga ulanadigan servisdan ajratiladi (`taom-hisob.ts`, `yozuv-hisob.ts` va `taomlar.ts`, `ovqat-yozuvlari.ts`).**
*Sabab:* `"use client"` komponent `lib/db.ts` ga ulangan modulni import qilsa, Turbopack `pg` ni brauzer
bandliga tortadi va build `dns`, `fs`, `net` topolmay yiqiladi.

**2026-09-20 · Kun chegarasi UTC+5 (Toshkent) bo'yicha qo'lda hisoblanadi, kutubxonasiz.**
*Sabab:* Vercel serveri UTC'da ishlaydi; "bugungi kaloriya" server mintaqasiga bog'liq bo'lib qolmasligi kerak.
O'zbekistonda yozgi vaqt yo'q, shuning uchun qat'iy siljish yetarli va yangi dependency shart emas.

**2026-09-20 · S1'da kunlik norma `lib/norma.ts` da qotirilgan (2,190 kkal · 120 / 70 / 240 g), yozuvlar `s1-sinov` degan qotirilgan foydalanuvchiga yoziladi.**
*Sabab:* Vertikal kesim uchun onboarding ham, auth ham kerak emas; ikkalasi bitta joyda turadi va
S3'da rejadan hamda real foydalanuvchi ID'sidan keladi.

**2026-09-20 · E5'dagi "Jurnalga qo'shish" tugmasi `--siyoh` rangida (DESIGN.md'da lime deb yozilgan).**
*Sabab:* Prototipdagi FoodScreen `primary` tugmani ishlatadi va zid kelganda prototip ustun turadi;
lime E8'dagi doira va tasdiq belgisida qoladi.

**2026-09-20 · S1 task ro'yxati prototip va dizayn-tz bo'yicha kengaytirildi (7 tadan 11 taga), deploy Hetzner+Caddy o'rniga Vercel+Railway.**
*Sabab:* Foydalanuvchi qarori: prototipda bor, sprintda yozilmay qolgan narsalar S1'ga qo'shilsin.
Deploy esa 2026-09-16 dagi qarorga moslandi; STACK.md ham shunga qarab tuzatildi.

**2026-09-20 · S2–S6 tasklari S1 qoldirgan holatga moslandi: qotirilgan norma va `s1-sinov` egasi qaysi sprintda almashishi, E2/E4'dagi "S2'da ochiladi" joylari, pastki panel bosqichlari, Vercel'ga xos cheklovlar (rasm ombori, bot webhook, cron) tasklarga yozildi.**
*Sabab:* Foydalanuvchi so'rovi; sprint rejalari Hetzner davrida yozilgan va S1'da yozilmagan qarorlarni bilmas edi.

**2026-09-20 · Rasm ombori — Cloudflare R2 (yoki shu Cloudflare ekotizimidagi xizmat).**
*Sabab:* Foydalanuvchi qarori. Vercel'da doimiy disk yo'q, R2 esa S3-mos va chiqish trafigi uchun haq olmaydi.
S2'dagi rasm yuklash taski shunga moslandi.

**2026-09-20 · `rasmlar` va `kunlik_xulosa`da `foydalanuvchi_id` hozircha matn (FK emas), `s1-sinov` bilan yoziladi; `profillar`, `vazn_yozuvlari`, `rejalar`da darhol haqiqiy FK (`onDelete Cascade`). Barchasi S3'da `ovqat_yozuvlari` bilan birga FK'ga aylanadi.**
*Sabab:* `foydalanuvchilar` jadvali S3'gacha bo'sh, `s1-sinov` esa unda qator emas — haqiqiy FK qo'yilsa S2'dagi har bir yozuv rad etilardi.

**2026-09-20 · `rasmlar.ovqat_yozuvi_id` nullable, `onDelete SetNull`: rasm avval yuklanadi, yozuv tasdiqdan keyin yaratiladi. `ovqat_yozuvlari`ga `holat` ustuni qo'shilmadi.**
*Sabab:* Tasdiqlanmagan AI natijasi jadvalga umuman tushmasligi kerak (2026-09-13 qaroriga mos).

**2026-09-20 · `ism` `profillar` jadvalida turadi, PRD 7-bo'limdagi `foydalanuvchilar.ism` emas.**
*Sabab:* onboarding-tz.md 4-bo'limi yangiroq hujjat, shunga ergashildi.

**2026-09-20 · Ustun nomi `18plus_tasdiq` emas, `tasdiq_18plus`.**
*Sabab:* Raqam bilan boshlanadigan ustun nomi SQL'da doim qo'shtirnoq talab qiladi.

**2026-09-20 · Yangi jadvallardagi matn qiymatlar (masalan `manba`) enum emas, `String` — mavjud `ovqat_turi` uslubiga mos.**
*Sabab:* Qiymatlar servis qatlamida tekshiriladi, Prisma enum migratsiyasini murakkablashtirmaslik uchun.

---

## OCHIQ SAVOLLAR

| # | Savol | Qachon hal qilamiz |
|---|-------|--------------------|
| 1 | North star metrika qaysi biri — DAU, PRO obunachilar yoki 7-kun retention | S3, analitika o'rnatilayotganda (S1'da qo'yilmadi) |
| 2 | Bitta AI skan tannarxi qancha va 39,000 so'mlik obuna kuniga 20 ta skanni qoplaydimi | S2, AI provayderi tanlanganda |
| 3 | V2 tarkibi va muddati — haftalik hisobot, eksport, avtomatik to'lov qachon qaytadi | V1 ishga tushgach |
| 4 | Retseptlarning boshlang'ich soni — nechta retsept bilan ishga tushamiz | S6, kontent kiritilganda |
| 5 | Bildirishnoma jadvali — eslatmalar qaysi vaqtda va qanchalik tez-tez yuboriladi | S5, Telegram sprintida |

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
