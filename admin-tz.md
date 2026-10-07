# ADMIN TZ — boshqaruv paneli

Mahsulot egasi kod yozmasdan boshqarishi uchun kerak bo'lgan ekranlar. Manba:
PRD 4-bo'lim (rollar jadvali) va [SPRINT-6-admin.md](sprints/SPRINT-6-admin.md).

Vizual qoidalar: [DESIGN.md](DESIGN.md) — bir xil tokenlar, lekin kengroq ekran uchun.

## 1. Asosiy qarorlar

**Admin paneli — alohida veb sahifa, Telegram Mini App ichida emas.** Yo'l: `/admin`.
Sabab: retsept matni, uch tilda taom nomi va statistika jadvali telefon ekranida
kiritilmaydi. Panel kamida 1024px kenglikka mo'ljallanadi, telefonda ochilsa faqat
o'qish uchun ko'rinadi.

**Kirish — Telegram Login Widget orqali.** Mahsulotda parol yo'q (PRD 4-bo'lim), lekin
`initData` faqat Mini App ichida mavjud. Shuning uchun brauzerdagi panel Telegram Login
Widget bilan kiradi, server imzoni tekshiradi va `foydalanuvchilar.rol = admin` ekanini
qaraydi. **Bu PRD'da yozilmagan — yangi qaror, tasdiqlash kerak.**

**Panel interfeysi faqat o'zbekcha.** Uni bir kishi — egasi ishlatadi, uch tilga
tarjima qilish ortiqcha ish. Lekin **kontent** (taom nomi, retsept) uch tilda kiritiladi.

**Har o'zgartirish jurnalga yoziladi.** PRD'da yo'q, lekin admin begona ma'lumotga
tegadi: PRO berish, bloklash, o'chirish, narx o'zgartirish — hammasi `admin_amallari`
jadvaliga tushadi (kim, qachon, nimaga, eski va yangi qiymat). Busiz "PRO qayerdan
paydo bo'ldi?" degan savolga javob yo'q. Jadval S2 ma'lumot modeliga qo'shilishi kerak.

## 2. Navigatsiya

Chap tomonda doimiy panel:

| Bo'lim | Ekran | Nima uchun kiriladi |
|---|---|---|
| Boshqaruv paneli | A1 | Kunlik holat, navbatda nima turibdi |
| Foydalanuvchilar | A2 → A3 | Qidirish, obuna berish, bloklash |
| Taomlar bazasi | A6 → A7 | Kontent kiritish |
| Retseptlar | A8 → A9 | PRO kontenti |
| Statistika | A10 | Mahsulot qanday ketyapti |
| Narxlar | A12 | Tarif o'zgartirish |

Navbatda kutayotgan element bo'lsa, bo'lim yonida son turadi.

A4/A5 taom takliflari navbati olib tashlangan (DECISIONS 2026-10-07): foydalanuvchi tuzatishi
faqat o'z jurnalida qoladi, admin ko'rmaydi. A11 shikoyatlar bo'limi ham olib tashlangan
(DECISIONS 2026-10-07): murojaatlar ilovadagi "Yordam" orqali admin Telegram lichkasiga keladi,
panelda alohida navbat yo'q.

## 3. Ekranlar

### A0 — Kirish va rad javobi

- Telegram Login Widget tugmasi, boshqa hech narsa
- Admin bo'lmagan foydalanuvchi `/admin` ga kirsa: "Bu sahifaga ruxsatingiz yo'q" —
  panel tuzilishi, bo'lim nomlari va sonlar **ko'rsatilmaydi**
- Server ham tekshiradi: har `/api/admin/*` so'rovi rolni qaytadan qaraydi

### A1 — Boshqaruv paneli

**Vazifasi:** Bir qarashda bugun nima bo'layotganini va qayerda ish kutayotganini ko'rish.

- Yuqorida to'rt raqam: bugungi yangi foydalanuvchilar · kunlik faol · bugungi skanlar ·
  faol PRO obunalar
- Ish navbatlari: 7 kun ichida tugaydigan obunalar soni (shikoyatlar navbati yo'q — A11
  olib tashlangan)
- Oxirgi 10 ta admin amali (jurnaldan)

**Holatlar:** yuklanmoqda — skelet raqamlar · xato — "Statistikani yuklab bo'lmadi" +
qayta urinish, qolgan bo'limlar ishlayveradi.

### A2 — Foydalanuvchilar ro'yxati

- Qidiruv: Telegram ID, ism yoki username bo'yicha
- Filtr: hammasi · FREE · PRO · bloklangan
- Jadval ustunlari: ism, Telegram ID, rol, obuna holati va tugash sanasi, ro'yxatdan
  o'tgan sana, oxirgi faollik, skanlar soni
- Sahifalash: 50 tadan

**Holatlar:** bo'sh (qidiruv natijasiz) — "«...» bo'yicha foydalanuvchi topilmadi" ·
yuklanmoqda — 10 qator skelet · xato — qayta urinish.

### A3 — Foydalanuvchi kartasi

**Vazifasi:** Bitta foydalanuvchi bo'yicha hamma narsani ko'rish va unga nisbatan amal
bajarish.

- Profil: ism, Telegram ID, til, ro'yxatdan o'tgan sana, rol
- Obuna: joriy holat, tarif, tugash sanasi, to'lovlar tarixi
- Faollik: jami skanlar, qolgan limit, oxirgi 10 ta ovqat yozuvi
- Amallar: **PRO berish** · **Muddatni uzaytirish** · **PRO ni olib qo'yish** ·
  **Bloklash** (bloklanganda — **Blokni yechish**) · **Ma'lumotini o'chirish**

**PRO berish oynasi:** tarif (oylik / 6 oy / yillik / boshqa muddat) + sabab maydoni
(majburiy: "test", "kompensatsiya", "sovg'a"). Qo'lda berilgan obuna `obunalar` da
**`manba = qolda`** deb belgilanadi — aks holda daromad statistikasi buziladi
(`tolovlar` da yozuv yo'q).

**Bloklash va o'chirish farqi:**

| Amal | Nima bo'ladi | Qaytariladimi |
|---|---|---|
| Bloklash | Kirish yopiladi, ma'lumot joyida qoladi | ha |
| Ma'lumotini o'chirish | Profil, jurnal, rasmlar o'chadi | **yo'q** |

O'chirishda tasdiq oynasi: oqibat matni + foydalanuvchi ismini qo'lda yozish talab
qilinadi (ismsiz hisobda — Telegram ID). Ikkala amal ham jurnalga tushadi, sabab majburiy.
Bloklangan hisob: sessiyasi darhol kuchdan qoladi (har so'rovda `bloklangan` tekshiriladi),
ilova "Hisobingiz bloklangan" ekranini admin Telegram havolasi bilan ko'rsatadi. O'chirilgan
foydalanuvchiga bot orqali "hisobingiz o'chirildi" xabari ketadi (o'zi o'chirgandagi xabar).
Admin hisobini bloklab yoki o'chirib bo'lmaydi — na o'zini, na boshqa adminni.

### A4 / A5 — olib tashlandi

Taom takliflari navbati va taklifni ko'rib chiqish ekranlari 2026-10-07 qarori bilan olib
tashlandi. Raqamlash qolgan ekranlar uchun o'zgarmaydi.

### A6 — Taomlar bazasi

- Jadval: nomi (uch til ustuni), porsiya grammi, kaloriya, makrolar, rasm bor-yo'qligi,
  qo'shilgan sana
- Qidiruv va til bo'yicha filtr: "tarjimasi yo'q" filtri alohida
- "Yangi taom" tugmasi

### A7 — Taom tahrirlash

- Nomi: o'zbekcha, ruscha, inglizcha — **uchalasi ham majburiy**
- Standart porsiya (gramm), 100 g uchun kaloriya, oqsil, yog', uglevod
- Rasm yuklash
- Kategoriya (birinchi taom, ikkinchi taom, non, salat, shirinlik, ichimlik)
- Tekshiruv: makrolardan hisoblangan kaloriya kiritilgan kaloriyadan 20% dan ko'p farq
  qilsa ogohlantirish — `4×oqsil + 9×yog' + 4×uglevod` taxminan to'g'ri kelishi kerak

### A8 — Retseptlar ro'yxati

- Jadval: nomi, kategoriya, kaloriya, tayyorlash vaqti, murakkablik, holat
  (qoralama / chop etilgan)
- Filtr: kategoriya, holat
- "Yangi retsept" tugmasi

**Qoralama holati kerak:** yarim yozilgan retsept foydalanuvchiga ko'rinmasligi kerak.

### A9 — Retsept tahrirlash

- Nomi uch tilda, rasm, kategoriya
- Kaloriya, oqsil, tayyorlash vaqti (daqiqa), murakkablik (oson / o'rta / qiyin)
- Masalliqlar ro'yxati va tayyorlash qadamlari — uch tilda
- **Sarlavha va tayyorlash vaqti FREE'ga ko'rinadi, qolgani PRO ostida** — tahrirlash
  ekranida qaysi maydon ochiq ekani ko'rsatib turiladi
- "Saqlash (qoralama)" va "Chop etish" — ikki alohida tugma

### A10 — Statistika

- Vaqt oralig'i tanlagich: 7 kun · 30 kun · 90 kun
- Grafiklar: yangi foydalanuvchilar · kunlik faol · skanlar soni · PRO obunachilar ·
  7-kun retention
- Daromad bo'limi: umumiy · bugungi · so'nggi 7 kun · joriy oy kartalari, oylik va kunlik
  ustunlar. Summalar obunalar jadvalidan tarif narxi bo'yicha, admin qo'lda bergan PRO ham
  sanaladi (DECISIONS 2026-10-07); to'lov API'lari kelganda to'lov jurnaliga o'tadi
- Skan tannarxi bo'limi (davr ichidagi skanlar soni va taxminiy xarajat, SAVALA 2-sharti) —
  keyinga qoldirildi, egasi hozircha kerak emas dedi (DECISIONS 2026-10-07)

North star — 7-kun retention (DECISIONS 2026-09-21); kunlik faol va PRO obunachilar yordamchi,
sarlavha izohida shu yoziladi.

### A11 — olib tashlandi

Shikoyatlar navbati 2026-10-07 qarori bilan olib tashlandi: ilovada alohida suhbat tizimi
yo'q (F6 "Yordam" ekrani qurilmaydi, DECISIONS 2026-09-23), murojaatlar admin Telegram
lichkasiga keladi. Raqamlash qolgan ekranlar uchun o'zgarmaydi.

### A12 — Narxlar

- Uch tarif: oylik, 6 oylik, yillik — narx so'mda (`tariflar` jadvali; muddat va "Tavsiya
  etiladi" belgisi o'zgarmaydi, faqat narx)
- Saqlashda tasdiq oynasi: har tarif uchun eski → yangi, o'zgarmagani xira; sabab so'ralmaydi
- **Qoida: narx o'zgarishi mavjud obunalarga ta'sir qilmaydi.** Faol obuna o'z narxi
  bilan muddati tugaguncha ishlaydi, yangi narx faqat yangi to'lovlarga qo'llanadi.
  Bu tasdiq oynasida ochiq yoziladi. Texnik: obuna qatori olingan paytdagi narxni
  (`obunalar.narx`) saqlaydi, daromad (A10) shu ustundan hisoblanadi.
- Har o'zgarish jurnalga tushadi: eski narx, yangi narx, sana (`narx_ozgartirish`)
- Chegara: 1 000 dan 99 999 999 so'mgacha, butun son; hech biri o'zgarmagan bo'lsa saqlanmaydi

## 4. Umumiy qoidalar

| Qoida | Tafsilot |
|---|---|
| Xavfli amal | Qaytarib bo'lmaydigan har amal (o'chirish, narx, PRO olib qo'yish) tasdiq oynasi bilan; oynada oqibat yozilgan bo'ladi |
| Jurnal | Ma'lumotni o'zgartiradigan har amal `admin_amallari` ga yoziladi. Jurnal tahrirlanmaydi va o'chirilmaydi |
| Sabab maydoni | PRO berish, bloklash va o'chirishda sabab majburiy — keyin o'zingiz eslay olasiz |
| Shaxsiy ma'lumot | Panelda foydalanuvchi rasmlari ko'rinmaydi. Jurnal rasmlarini ko'rish kerak emas |
| Bo'sh holat | Har ro'yxatda bo'sh holat matni bor; bo'sh navbat — muvaffaqiyat, xato emas |
| Yuklanmoqda | Jadvallarda skelet qatorlar |
| Xato | "Yuklab bo'lmadi" + qayta urinish; bitta bo'lim ishlamasa qolgani ishlayveradi |

## 5. Bu TZ'da YO'Q

To'lov tizimi sozlamalari · bot xabarlarini panel orqali yuborish · murabbiy roli ·
eksport (PDF, CSV) · ikkinchi admin qo'shish · A/B testlar.

## 6. Ochiq savollar

| # | Savol | Qachon |
|---|---|---|
| 1 | Admin kirishi Telegram Login Widget bilanmi yoki panel Mini App ichida bo'lsinmi | S6'dan oldin, PRD'ga yozilishi kerak |
| 2 | `admin_amallari` jadvali S2 migratsiyasiga qo'shilsinmi yoki S6'da alohidami | S2'dan oldin |
| 3 | Ikkinchi admin (yordamchi) kerak bo'lsa, huquqlari cheklanadimi — masalan kontent kirita oladi, lekin o'chira olmaydi | v2 |
| 4 | Taklif tasdiqlanganda taom nomini uch tilga admin qo'lda tarjima qiladimi yoki AI taklif qiladimi | Bekor: navbat olib tashlandi 2026-10-07 |
| 5 | Foydalanuvchi ma'lumotini o'chirish qonun bo'yicha necha kun ichida bajarilishi shart | Huquqiy tekshiruv bilan birga (SAVALA 3-sharti) |

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
