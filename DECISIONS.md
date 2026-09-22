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

## 2026-09-20 — rasm ombori va taom rasmlari

**2026-09-20 · `rasmlar` jadvalida to'liq URL emas, R2 obyekt kaliti saqlanadi; rasm 1 soatlik imzoli havola orqali o'qiladi, bucket yopiq.**
*Sabab:* Ovqat rasmlari shaxsiy ma'lumot; yopiq bucket'da havolalar eskiradi, shuning uchun URL'ni bazaga yozib bo'lmaydi. (Foydalanuvchi avval "faqat URL" degan, tushuntirishdan keyin kalitga rozi bo'ldi.)

**2026-09-20 · Rasm chegarasi: faqat JPEG/PNG/WebP, 4 MB gacha (avval 3 MB edi).**
*Sabab:* Vercel funksiyasi 4,5 MB dan katta tanani olmaydi, shuning uchun chegara bundan oshirilmaydi; klient rasmni yuborishdan oldin 1600px gacha siqadi.

**2026-09-20 · R2 uchun aws4fetch tanlandi, @aws-sdk/client-s3 emas.**
*Sabab:* Faqat so'rov imzolash kerak; aws4fetch ~2,5 KB va dependency'siz, rasmiy SDK o'nlab paket tortadi.

**2026-09-20 · Taom rasmlari Wikimedia Commons'dan, public/taomlar/ da statik fayl — R2'ga bog'liq emas.**
*Sabab:* Foydalanuvchi qarori; statik fayl bo'lgani uchun taom rasmlari R2 sozlanmagan muhitda ham ishlaydi.
Oqibati: CC BY / BY-SA litsenziyalari muallifni ko'rsatishni talab qiladi — hozircha ro'yxat public/taomlar/MUALLIFLAR.md da, ilova ichidagi "Rasm mualliflari" sahifasi ommaga chiqishdan oldin kerak (S3'ga task qilib yozildi).

**2026-09-20 · `taomlar.nomi` o'zbekcha nom bo'lib qoldi, `nomi_ru`/`nomi_en` yoniga qo'shildi (nomi_uz ga qayta nomlanmadi).**
*Sabab:* S1 kodi va jurnaldagi taom_nomi buzilmasin; ru/en hozircha faqat qidiruv uchun.

**2026-09-20 · Klientdagi rasm siqish yumshatildi: 1600 px / 85% o'rniga 2560 px / 90% (natija odatda 0,8–1,5 MB). "4 MB ga yaqin sifat" va "kichik rasmni siqmaslik" variantlari rad etildi.**
*Sabab:* Foydalanuvchi sifatni oshirmoqchi edi. 4 MB li rasmlar yuklashni sekinlashtiradi, jurnalni og'irlashtiradi va AI aniqligiga foyda bermaydi; siqmaslik esa EXIF'dagi GPS va vaqtni R2'ga hamda AI xizmatiga o'tkazib yuboradi — qayta chizish ularni tozalaydi.
Ochiq qoldi: ilova ichidagi kamera suratni video kadrdan oladi (odatda 1280×720), shuning uchun bu o'zgarish faqat galereya rasmlariga ta'sir qiladi.

## 2026-09-20 — AI skan API

**2026-09-20 · AI provayderi hozircha Claude API (claude-haiku-4-5), asosiy provayder keyin Gemini bo'ladi; provayder faqat `lib/services/ai.ts` da, SDK'siz `fetch`.**
*Sabab:* Foydalanuvchi qarori; provayder almashganda dependency qolmasligi kerak.

**2026-09-20 · AI 100 g uchun qiymat (kaloriya, oqsil, yog', uglevod) va porsiya grammini qaytaradi, jami kodda hisoblanadi.**
*Sabab:* Porsiya o'zgarganda AI qayta chaqirilmaydi, natija barqaror.

**2026-09-20 · AI xatosida yuklangan rasm o'chirilmaydi — "Qayta urinish" qayta yuklashsiz ishlaydi.**
*Sabab:* Foydalanuvchi tasdiqladi. PRD 8-bo'limdagi "xatoda rasm saqlanmaydi" qoidasidan ongli chekinish; yetim rasmlarni tozalash keyingi taskdagi bekor qilish oqimi bilan birga qilinadi.

**2026-09-20 · Umumiy kunlik skan chegarasi (`SKAN_KUNLIK_CHEGARA`, standart 50) S3'gacha zaxira himoya sifatida qo'shildi.**
*Sabab:* Foydalanuvchi so'rovi; S4'da FREE/PRO limitlari shu jadval ustiga qurilib, umumiy chegara o'rnini oladi.

## 2026-09-20 — AI tahlil ekrani

**2026-09-20 · E6 va E7 alohida sahifa emas, bitta klient komponentning holatlari; AI natijasi faqat React holatida turadi.**
*Sabab:* Tasdiqlanmagan natija hech qayerga saqlanmasligi kerak (dizayn-tz: tasdiqlanmagan yozuv), va ekranlar orasida natijani uzatish uchun URL/xotira kerak bo'lmaydi.

**2026-09-20 · Tasdiqlanmay qolgan rasm foydalanuvchi voz kechganda darhol o'chiriladi (DELETE /api/rasmlar/[id], faqat yozuvga bog'lanmagan rasm); sahifani yopib ketgandagi yetimlar S5 fon vazifasida tozalanadi.**

## 2026-09-20 — mavzu tizimi

**2026-09-20 · Mavzu tanlovi cookie'da emas, localStorage'da saqlanadi va <head> dagi inline skript bilan qo'llanadi. `MavzuTanlagich` S2'da ekranga qo'yilmadi, S3'da Sozlamalarga ulanadi (foydalanuvchi qarori).**
*Sabab:* Cookie ildiz layout'da o'qilsa barcha sahifa majburan dinamik bo'ladi (/kamera va 404 hozir statik), foydalanuvchi uchun ko'rinishda farq yo'q; S3'da tanlov foydalanuvchilar.mavzu ga ham yoziladi, localStorage tez ochilish uchun kesh bo'lib qoladi.

## 2026-09-20 — Home va navigatsiya

**2026-09-20 · Interfeysda "Home" so'zi ishlatilmaydi — bo'lim va tugmalarda "Asosiy" ("Asosiyga qaytish"); prototipda yo'q dizayn elementi qo'shilmaydi (Home'da hafta strelkalari va "Bugunga qaytish" yo'q).**
*Sabab:* qolgan yozuvlar o'zbekcha, "Home" bilan panel aralash tilda ko'rinadi (prototipda ham keyinroq "Asosiy" ga o'zgartirilgan); foydalanuvchi qarori.

## 2026-09-20 — Telegram initData tekshiruvi

**2026-09-20 · initData `auth_date` yaroqlilik muddati 24 soat.**
*Sabab:* Imzoning o'zida muddat yo'q — o'g'irlangan initData abadiy ishlamasligi kerak; har ochilishda Telegram yangi initData beradi, kirgandan keyin esa sessiya (3-task) ushlab turadi, shuning uchun bu muddat foydalanuvchiga sezilmaydi.

## 2026-09-20 — S1 merosini almashtirish

**2026-09-20 · Egani aniqlash bitta joyda — `lib/services/sessiya.ts` dagi `joriyFoydalanuvchiId()`; servislar `foydalanuvchiId` ni har doim birinchi parametr sifatida oladi, o'zlari sessiyani o'qimaydi.**
*Sabab:* 2-task (meros) sessiyadan (3-task) oldin keladi — bitta nuqta tufayli 3-taskda faqat shu funksiya almashadi; servislar sof va sinaladigan bo'lib qoladi.

**2026-09-20 · `s1-sinov` yozuvlari o'chirilmadi, birinchi admin hisobiga ko'chirildi (foydalanuvchi qarori); `ovqat_yozuvlari`, `rasmlar`, `kunlik_xulosa`, `skan_hisobi` dagi `foydalanuvchi_id` `ON DELETE CASCADE` bilan tashqi kalit bo'ldi.**
*Sabab:* Hech narsa yo'qolmaydi, egasi Telegram'dan kirganda yozuvlarini ko'radi; kaskad — 10-taskdagi "hisobni o'chirish" uchun (ombordagi fayllarni esa o'sha servis o'zi tozalashi kerak). Ma'lumot ko'chirish migratsiya fayliga kiritilmadi (Telegram ID repoga tushmasin) — migratsiya faqat DDL.

## 2026-09-20 — sessiya

**2026-09-20 · Sessiya — bazasiz imzolangan token, cookie'da; 30 kun, har ochilishda yangilanadi; kutubxonasiz (`node:crypto`).**
*Sabab:* Auth kutubxonasi qo'shilmaydi (CLAUDE.md), sessiyalar jadvali ortiqcha — Telegram har ochilishda yangi initData beradi, shuning uchun sessiyani istalgan payt qayta tiklash mumkin. Cookie `SameSite=None; Partitioned` — Telegram Web Mini App'ni iframe'da ochadi; CSRF xavfi `Origin` tekshiruvi bilan yopiladi.

**2026-09-20 · initData klientda URL hash'dan o'qiladi, `telegram-web-app.js` S3'da ulanmaydi; production'da Telegram'dan tashqarida ilova ochilmaydi ("Ilovani Telegram orqali oching"), lokal dev'da esa sessiyasiz so'rov birinchi hisob nomidan o'tadi.**
*Sabab:* To'liq SDK S5 taski; kanal faqat Telegram Mini App (2026-09-13 qarori); lokal ishlab chiqish brauzerda qolishi kerak.

## 2026-09-20 — onboarding oqimi (4-task)

**2026-09-20 · Onboarding yakuni alohida `profillar.onboarding_tugadi` (vaqt) ustunida, qadam raqamida emas.**
*Sabab:* S4'da O11–O13 qo'shilganda qadamlar soni o'zgaradi — tugatgan foydalanuvchi qayta onboardingga tushmasligi kerak; vaqt 11-taskdagi "onboarding yakunlanishi" hodisasiga ham kerak.

**2026-09-20 · S3'da onboarding O1–O10 bilan tugaydi va Home ochiladi; O11–O13 (norma formulasi va paywall) S4'da. O6'dagi kg/lb · sm/ft almashtirgichi hozir qilindi (A varianti) — bazada har doim kg va sm saqlanadi, `foydalanuvchilar.birliklar` faqat ko'rsatish tanlovi.**
*Sabab:* Foydalanuvchi qarori.

**2026-09-20 · 18 dan kichik yoshni to'sish 4-taskda, O5 maydonining chegara tekshiruvi sifatida qilindi (5-taskdan oldin).**
*Sabab:* 18 dan kichik yoshni bazaga o'tkazib yuborish noto'g'ri bo'lardi; 5-taskda faqat `tasdiq_18plus` vaqti va Terms katakchasi qoladi.

---

## 2026-09-20 — onboarding ko'rinishini prototipga moslash

**2026-09-20 · Onboardingda til tanlash ekrani yo'q — 9 qadam (S4'da 12). Til Telegram'dan olinadi: hisob yaratilganda `language_code`, S5'dan boshlab botdagi `/start` da chiqadigan uch tilli tanlov; keyin ilova Sozlamalaridan o'zgartiriladi.**
*Sabab:* Til botda tanlanadi, ilova shu tilda ochiladi — onboardingda qayta so'rash ortiqcha. onboarding-tz.md dagi O2 va sprint faylidagi "til" qadami shu qaror bilan bekor.

**2026-09-20 · O1'da Terms katakchasi yo'q: "«Boshlash»ni bosish orqali Ommaviy oferta shartlarini qabul qilasiz" matni turadi, havola loyiha oxirida qo'shiladi.**
*Sabab:* Prototipdagi yechim — bitta bosish kam, qabul baribir qayd etiladi (5-taskda `shartlar_qabul` + versiya). Sprintning 5-taski va "katakcha belgilanmasa Boshlash ishlamaydi" qabul mezoni 5-taskda shunga moslab tuzatiladi.

**2026-09-20 · O1 foydalanuvchi bergan poster bilan, prototipdagidek (`public/onboarding/intro.png`): to'liq ekranli rasm, yashil pastki panel, lime "Boshlash". Bu DESIGN.md tizimidan yagona istisno — beshta `--o1-*` rang, 32px burchak va soya faqat shu ekranda (DESIGN.md "O1 istisnosi").**
*Sabab:* Posterdagi "NutriLiferobot" brendi va 3D uslub tizimga mos emasligi prototip README'sida qayd etilgan — foydalanuvchi shu rasmni qoldirdi.

**2026-09-20 · O'lchovlar ekranidagi izohlar prototip tahriri bo'yicha (onboarding-tz.md dagidan keyingi qaror): joriy vazn uchun "tekshirib ko'ring" ogohlantirishi yo'q; "Vaznni saqlash"da joriy vazn ostida bo'yga nisbatan eslatma; maqsad vazn uchun yo'nalishga qarab "pastroq" / "yuqoriroq" eslatmasi (TMI 18,5–25), "Bu tibbiy maslahat emas." bilan — undov belgisisiz (DESIGN.md, 7-bo'lim).**
*Sabab:* Yosh, bo'y va vaznlar matn maydoni emas, aylanuvchi g'ildirak — foydalanuvchi qarori.

## 2026-09-20 — shartlar qabuli va 18+ tasdig'i (5-task)

**2026-09-20 · `shartlar_qabul`, `shartlar_versiyasi` va `tasdiq_18plus` faqat birinchi marta yoziladi — qayta saqlashda o'zgarmaydi.**
*Sabab:* Yuridik dalil — dastlabki rozilik vaqti muhim.

## 2026-09-21 — rollar va obunalar (6-task)

**2026-09-21 · FREE/PRO bazada rol sifatida saqlanmaydi, `obunalar` jadvalidan hisoblanadi; bazada faqat `rol` = foydalanuvchi | admin.**
*Sabab:* PRO muddatli — saqlangan holatni cron qaytarishi kerak bo'lardi, cron ishlamasa PRO cheksiz qoladi; `tugash > hozir` sharti o'zi to'g'ri ishlaydi; profil kartasiga (8-task) tugash sanasi baribir kerak. Shuning uchun `obunalar` jadvali S5'ni kutmasdan S3'da ochildi.

**2026-09-21 · Admin roli PRO huquqlarini bermaydi — egasi PRO imkoniyatlarini sinash uchun o'ziga qo'lda obuna beradi.**
*Sabab:* Foydalanuvchi qarori — rollar aralashmaydi, admin oddiy foydalanuvchi ko'rganini ko'radi.

**2026-09-21 · To'liq tarix FREE'ga ham ochiq — tarix bo'yicha FREE/PRO farqi yo'q.**
*Sabab:* PRD'da PRO uchun "to'liq tarixni ko'rish" yozilgan edi, lekin FREE chegarasi hech qayerda aniqlanmagan; foydalanuvchi FREE ham PRO'dek to'liq tarixni ko'rsin dedi. PRD 4-bo'lim jadvali shunga moslandi.

## 2026-09-21 — himoyalangan API yo'llari (7-task)

**2026-09-21 · Begona yozuv/rasmga murojaat 403 emas, 404 qaytaradi; klient 401 da bir marta jimgina qayta kiradi.**
*Sabab:* 404 yozuv mavjudligini oshkor qilmaydi; qayta kirish — initData 24 soat yaroqli, foydalanuvchi ish o'rtasida "Saqlanmadi" ko'rmasin.

## 2026-09-21 — profil sahifasi (8-task)

**2026-09-21 · Sozlamalar alohida sahifa emas — prototipdagidek Profil sahifasidagi qatorlar, pastdan chiqadigan panelda ochiladi (10-taskda quriladi).**
*Sabab:* profil-tz F2 rejasidan chekinish — prototip shunday ko'rsatadi, umumiy qoida (pastda) bo'yicha prototip ustun turadi.

**2026-09-21 · Pastki panel prototipdagidek to'rt bo'lim: Asosiy, Retseptlar, Statistika, Profil. Sahifasi hali yo'q ikkitasi (Retseptlar, Statistika) ko'rinadi, lekin o'chiq; Jurnal panelda emas.**
*Sabab:* dizayn-tz'dagi "S2–S4 vaqtinchalik tarkib" jadvali o'rniga foydalanuvchi qarori.

**2026-09-21 · Avatar — Telegram profil rasmi avtomatik (initData `photo_url`), yo'q bo'lsa ismning bosh harfi. Rasm bizda saqlanmaydi, to'g'ridan-to'g'ri Telegram serveridan ko'rsatiladi.**
*Sabab:* Qo'shimcha saqlash xarajati va maxfiylik yuki shart emas — Telegram o'zi manba.

**2026-09-21 · Hali qurilmagan ekranlarga olib boradigan tugma/havolalar ("PRO haqida", "Obunani boshqarish", Yordam, Foydalanish shartlari, Maxfiylik siyosati, skan hisoblagichi, "Kunlik norma") hozircha chizilmaydi — har biri o'z ekrani qurilgan taskda qo'shiladi.**
*Sabab:* Ishlamaydigan tugma ko'rsatish o'rniga, ekran tayyor bo'lganda birga qo'shiladi.

**2026-09-21 · UMUMIY QOIDA: ko'rinishda prototip DESIGN.md yoki TZ bilan zid kelsa — prototipdagisi tanlanadi, so'ralmaydi; prototipda bor, DESIGN.md'da yo'q token DESIGN.md va globals.css ga qo'shiladi.**
*Sabab:* Foydalanuvchi PRO belgisi lime rangda chizilganini tuzatdi — "ikkita tanlash kelsa prototipdagini tanlaysan".

## 2026-09-21 — interfeys lug'ati (9-task)

**2026-09-21 · Interfeys lug'ati kaliti — o'zbekcha matnning o'zi (prototip i18n.js qolipi), TypeScript turi bilan tekshiriladi; til cookie (`nl_til`) — bazadagi `foydalanuvchilar.til` ning nusxasi; jurnal yozuvidagi taom nomi qo'shilgan paytdagi tilda saqlanadi, AI skan nomni interfeys tilida qaytaradi.**
*Sabab:* Kalit sifatida o'zbekcha matn ishlatish kod ichida o'qishni osonlashtiradi va `tsc` yetishmagan tarjimani ushlaydi; cookie serverda tez o'qish uchun, haqiqiy manba baribir baza; taom nomini saqlash tilida qoldirish tarixiy yozuvni o'zgartirmaydi.

## 2026-09-21 — sozlamalar (10-task)

**2026-09-21 · kJ energiya birligi qo'shilmaydi — O'zbekistonda kkal standart.**
*Sabab:* profil-tz ochiq savol 2 yopildi; Profilda "Energiya birligi" qatori yo'q.

**2026-09-21 · Birliklar ikki alohida sozlama: `foydalanuvchilar.vazn_birligi` (kg/lb) va `boy_birligi` (sm/ft), eski `birliklar` ustuni olib tashlandi.**
*Sabab:* Prototipdagi ikki alohida qatorga mos.

**2026-09-21 · Hisobni o'chirish darhol va qaytarib bo'lmaydigan — 30 kunlik qaytarish oynasi yo'q.**
*Sabab:* profil-tz ochiq savol 1; huquqiy tekshiruvda qayta ko'riladi.

**2026-09-21 · North star metrika — 7-kun retention: ro'yxatdan o'tganlarning necha foizi 7-kuni ilovani qayta ochadi. DAU va PRO obunachilar yordamchi metrika.**
*Sabab:* Ishga tushish bosqichida asosiy savol — mahsulot odamni ushlab qolyaptimi; DAU kichik bazada sun'iy o'sadi, PRO esa to'lov (S5) kelguncha nol turadi. Ochiq savol 1 yopildi.

**2026-09-21 · Analitika tashqi xizmatsiz, o'z bazamizdagi `hodisalar` jadvalida: `royxat`, `onboarding_tugadi`, `birinchi_skan` (hisobga bir marta) va `kunlik_faollik` (kuniga bitta qator, ilova ochilganda).**
*Sabab:* To'rt hodisa uchun yangi dependency va uchinchi tomonga ma'lumot uzatish kerak emas. Hisob o'chirilsa qator qoladi, egasi bo'shaydi (`ON DELETE SET NULL`) — sonlar saqlanadi, shaxs bilan bog'lanish uziladi.

## 2026-09-21 — norma va reja natijasi (S4, 1–4-qadamlar)

**2026-09-21 · O12 natija ekranida maqsad vaznga yetish muddati prognozi ("taxminan 14 haftada yetasiz") ko'rsatilmaydi; o'rniga intizom matni: "Natijaning sabablaridan biri — har kungi intizom. Bugungi kichik qadam — ertangi katta o'zgarish."**
*Sabab:* Foydalanuvchi qarori — muddat va'da bo'lib qolmasin (onboarding-tz 7-bo'lim, 4-ochiq savol shu bilan yopildi); matn barcha maqsadlarda ko'rsatiladi.

**2026-09-21 · Norma formulasi koeffitsientlari prototipdan: maqsad tuzatishi foizda (−15%/0/+12%/+10%), faollik 1.2/1.375/1.55/1.725; jins aytilmagan bo'lsa pastki chegara 1,500 kkal.**
*Sabab:* onboarding-tz 3-ochiq savol (foiz yoki qat'iy son) prototip foydasiga hal qilindi — prototip ustun.

**2026-09-21 · `onboarding_tugadi` 9-savolda yoziladi; O11–O13 ko'rsatuv ekranlari, serverga qadam sifatida saqlanmaydi.**
*Sabab:* O'sha lahzada hamma javob bor va reja yozilgan; yarmida chiqib ketgan foydalanuvchi ma'lumot yo'qotmaydi, faqat natija ekranini qayta ko'rmaydi; server va sxema o'zgarmaydi.

## 2026-09-21 — holatlar zanjiri (S4, 5–6-qadamlar)

**2026-09-21 · `ovqat_yozuvlari` ga `holat` ustuni qo'shildi, lekin unda faqat uch qiymat: `tasdiqlandi`, `tahrirlandi`, `ochirildi`. PRD zanjiridagi `tahlil qilinmoqda` va `tasdiq kutilmoqda` bazaga tushmaydi — klient holatida qoladi. 2026-09-20 dagi "`holat` ustuni qo'shilmadi" qarori shu bilan almashtirildi.**
*Sabab:* Tasdiqlanmagan AI natijasi jadvalga tushmasligi haqidagi qaror (2026-09-13) kuchda qoladi; ustun esa o'chirilgan yozuvni saqlab qolish uchun kerak — qator o'chsa streak va Nutrition Score tarixi o'zgarib qolardi. O'chirilgan yozuvning rasmi saqlanmaydi (bazadan ham, R2'dan ham o'chadi): foydalanuvchi o'chirgan surat omborda yotmasligi kerak, tarix uchun raqamlar yetarli.

**2026-09-21 · F4 "Obuna" ekrani S4'da to'lovsiz, faqat o'qish uchun qurildi: "Obunani bekor qilish" tugmasi S5'ga qoldirildi; FREE va muddati tugagan hisob F4'ga kirmaydi.**
*Sabab:* Avtomatik takroriy to'lov yo'q — "bekor qilish" faqat keyingi eslatmani o'chiradi, eslatmalar esa S5'da (bot). Hech narsa qilmaydigan qizil tugma foydalanuvchini chalg'itadi. Prototipda ham F4'ga faqat faol PRO'dan kiriladi.

**2026-09-21 · Skan limitidan faqat tanilgan taom yeyiladi; "tanib bo'lmadi" urinishi qaytariladi, lekin `skan_hisobi.tanilmagan` da sanaladi va kuniga cheklanadi: FREE 5 ta, PRO 20 ta. Kamera, galereya va matnli "Tasvirlash" — bitta limit. S2'dagi "tanib bo'lmadi ham hisobga kiradi" qoidasi shu bilan almashtirildi.**
*Sabab:* Foydalanuvchi AI taniy olmagan rasm uchun umrbod 3 ta skanidan birini yo'qotmasligi kerak; lekin qaytarish cheksiz bo'lsa, tanib bo'lmaydigan rasmlarni ketma-ket yuborib AI xarajatini cheksiz oshirish mumkin edi — kunlik chegara shuni yopadi. Matnli tasvir ham AI chaqiradi, shuning uchun alohida limit berilmadi. Limit tekshiruvi hisob bo'yicha qulf ostida bitta tranzaksiyada: parallel so'rovlar limitdan o'tib ham ketmaydi, oxirgi skanni nohaq rad ham etmaydi.

**2026-09-21 · W1 va O13 dagi PRO imkoniyatlari ro'yxati prototipdagi 9 ta (paywall-tz va PRD'dagi 4 ta emas), bitta faylda — `lib/pro-imkoniyatlar.ts`. Shartlar va maxfiylik havolalari ham prototipdagidek turadi.**
*Sabab:* Foydalanuvchi qarori: "prototipdagidek bo'ladi" — prototip ekran mazmuni bo'yicha ham ustun. Ro'yxat bitta joyda tursa, W1 va O13 hech qachon ikki xil gapirmaydi. Ochiq qoladi: 9 tadan 5 tasi ilovada hali PRO sifatida yopilmagan — har biri o'z qadamida hal qilinadi.

**2026-09-21 · Tarif narxlari S6'gacha `lib/tariflar.ts` da, lekin ekran ularni `GET /api/tariflar` orqali oladi; oylik qiymat va tejash foizi narxdan hisoblanadi. W2 yo'qligi uchun "Davom etish" vaqtincha "To'lov tez orada" varag'ini ochadi.**
*Sabab:* paywall-tz narxlar admin panelidan kelishini talab qiladi (A12, S6) — API qatlami hozirdan tursa, S6'da faqat manba almashadi, ekran o'zgarmaydi. To'lov integratsiyasi S4'ga kirmaydi; o'chiq yoki hech narsa qilmaydigan tugma o'rniga foydalanuvchiga holat ochiq aytiladi, "Hozir emas" esa doim ishlaydi.

**2026-09-21 · AI ishonch bahosi (0–100) 60 dan past bo'lsa natija ko'rsatilmaydi — "taniy olmadik". Qaror kodda (`ISHONCH_CHEGARASI`), AI'da emas.**
*Sabab:* Foydalanuvchi qarori — natija baribir tasdiqdan o'tadi, qattiqroq chegara bekorga qo'lda kiritishga majbur qiladi. Baho aniq o'lchov emas, chegara logdagi jonli qiymatlarga qarab suriladi.

**2026-09-21 · PRO muddati tugasa Nutrition Score ham qulflanadi. Ball esa har doim (FREE'da ham) `kunlik_xulosa` ga yoziladi.**
*Sabab:* Foydalanuvchi qarori — "muddati tugagan PRO — FREE huquqlari" qoidasi bitta bo'lsin; tarix saqlangani uchun PRO tiklanganda ball tarixi joyida turadi.

**2026-09-21 · Bitta ovqat yozuvi chegaralari: 5000 kkal, har makro 500 g, porsiya 5000 g/ml yoki 50 dona. Klient va server bitta moduldan o'qiydi.**
*Sabab:* Foydalanuvchi qarori — maqsad xato terishdan himoya ("2500" o'rniga "25000"), oddiy ovqat bu chegaralarga yetmaydi.

## 2026-09-21 — progress sahifasi asoslari (S4, 16-qadam)

**2026-09-21 · Vaqt mintaqasi `Asia/Tashkent` ga qotirildi — Sozlamalarga qo'shilmaydi.**
*Sabab:* progress-tz ochiq savol 1 yopildi; O'zbekistonda yozgi vaqt yo'q, qat'iy siljish yetarli (2026-09-20 dagi UTC+5 qaroriga mos).

**2026-09-21 · Streak faqat ovqat yozuvidan hisoblanadi — vazn kiritish kunni "kuzatilgan" qilmaydi.**
*Sabab:* progress-tz ochiq savol 2 yopildi; "kuzatilgan kun" ta'rifi `kunlik_xulosa` (faol ovqat yozuvi bor kun) bilan bir xil turadi, ikki xil mezon chalkashtirmaydi.

## 2026-09-22 — progress sahifasi doirasi (S4, 17–19-qadam)

**2026-09-22 · P1'dagi "Batafsil statistika" va "Haftalik hisobot" bo'limlari V1'da qurilmaydi, qulf kartasi ham ko'rsatilmaydi.**
*Sabab:* Foydalanuvchi qarori — PRD 10-bo'lim bo'yicha V1'da yo'q imkoniyatlarga qulf ko'rsatish aldov bo'lardi; W1 ro'yxatidagi farq Handoff'da qayd etilgan.

## 2026-09-22 — taom taklifi (S4, 20-qadam)

**2026-09-22 · Qolgan kaloriya bo'yicha taom taklifi formulasi prototipdagidek qoladi — bitta ovqat uchun kaloriya chegarasi (masalan norma/3) qo'shilmaydi.**
*Sabab:* Foydalanuvchi qarori — qolgan kaloriya katta bo'lganda taklif eng kaloriyali taomga (Qozonkabob 400 g · 940 kkal) tushishi prototip formulasining tabiiy natijasi.

**2026-09-22 · Home'dagi "Qolgan kaloriyaga mos" taklif bo'limi faqat bugun ko'rsatiladi, o'tgan kunlarda chiqmaydi.**
*Sabab:* O'tgan kunga "nima yeysiz" taklifining ma'nosi yo'q.

## 2026-09-22 — PRO qulflari (S4, 21-qadam)

**2026-09-22 · PRO'da beriladigan imkoniyat FREE'ga berilmaydi: makro kuzatish (Home va Jurnaldagi kunlik oqsil/yog'/uglevod chiziqlari) va porsiya tavsiyasi (E5 va E7) ham prototip `pro.js` reyestridagidek PRO'ga yopildi. Muddati tugagan PRO — FREE huquqlari, prototipdagi `readable` istisnosi yo'q.**
*Sabab:* Foydalanuvchi qarori — W1 va O13 e'lon qilgan 9 ta imkoniyatdan ilovada bor bo'lganlarining hammasi qulf ostida tursin; "muddati tugagan PRO — FREE" qoidasi (2026-09-21) bitta bo'lib qoladi. Bitta taomning o'z makrolari E5/E7'da ochiq qoladi — u kiritish maydoni, kuzatish emas (prototipda ham qulfsiz). Statistika va haftalik hisobot V1'da hech kimga yo'q (2026-09-22 qarori), retsept va sevimlilar S6'da.

## OCHIQ SAVOLLAR

| # | Savol | Qachon hal qilamiz |
|---|-------|--------------------|
| 1 | North star metrika qaysi biri — DAU, PRO obunachilar yoki 7-kun retention | Hal qilindi 2026-09-21: 7-kun retention |
| 2 | Bitta AI skan tannarxi qancha va 39,000 so'mlik obuna kuniga 20 ta skanni qoplaydimi | S2, AI provayderi tanlanganda — birinchi o'lchov: matnli skan ≈ $0,001 (Haiku 4.5, ~716 kirish + ~70 chiqish token), rasmli hali o'lchanmagan |
| 3 | V2 tarkibi va muddati — haftalik hisobot, eksport, avtomatik to'lov qachon qaytadi | V1 ishga tushgach |
| 4 | Retseptlarning boshlang'ich soni — nechta retsept bilan ishga tushamiz | S6, kontent kiritilganda |
| 5 | Bildirishnoma jadvali — eslatmalar qaysi vaqtda va qanchalik tez-tez yuboriladi | S5, Telegram sprintida |

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
