# ONBOARDING TZ — birinchi kirish savollari

Foydalanuvchi Telegramdan ilovani birinchi marta ochganidan Home ekraniga yetguncha
bo'lgan yo'l. PRD 5-bo'limning 2–5 qadamlari shu yerda ekranga aylantirilgan.

**Nega hozir yozilyapti:** javoblar `profillar` va `vazn_yozuvlari` jadvallariga tushadi,
bu jadvallar esa **S2'da** migratsiya qilinadi. Savollar va variantlar S2'dan oldin
qotmasa, S3'da sxemani qayta o'zgartirishga to'g'ri keladi.

Ekranlar S3'da quriladi ([SPRINT-3-auth.md](sprints/SPRINT-3-auth.md)), norma hisobi
S4'da ([SPRINT-4-chuqurlik.md](sprints/SPRINT-4-chuqurlik.md)).

Vizual qoidalar: [DESIGN.md](DESIGN.md) · Yurak oqim ekranlari: [dizayn-tz.md](dizayn-tz.md)

## 1. Oqim

```
O1 Intro + Terms -> O2 Til -> O3 Ism -> O4 Maqsad -> O5 Jins va yosh
-> O6 O'lchovlar -> O7 Faollik -> O8 Ovqat afzalliklari -> O9 Ovqatlanish odatlari
-> O10 Motivatsiya -> O11 Reja tayyorlanmoqda -> O12 Natija (2 qadam)
-> O13 Paywall -> E1 Home
```

**Qoidalar:**

- Har javob **darhol saqlanadi**. Foydalanuvchi yarmida chiqib ketsa, qaytib kirganda
  o'sha qadamdan davom etadi — noldan boshlamaydi.
- Har ekranda: yuqorida progress chizig'i (`13 dan 4`), chapda orqaga tugmasi, pastda
  bitta asosiy tugma.
- Orqaga qaytish har doim mumkin, javob saqlanib qoladi.
- O'tkazib yuborish faqat O8, O9, O10 da (ular normaga ta'sir qilmaydi).
- Bitta ekranda bitta savol. Istisno — O5 va O6 (bog'liq maydonlar birga).
- Onboarding tugamaguncha Home ochilmaydi. Ikkinchi kirishda to'g'ri Home ochiladi.
- Klaviatura ochilganda asosiy tugma uning ustida qoladi.

## 2. Ekranlar

### O1 — Intro va shartlar

**Vazifasi:** Ilova nima qilishini bir jumlada aytish va 18+ hamda shartlarni tasdiqlatish.

- Sarlavha: "Ovqatingiz qancha kaloriya — rasmga oling, bilib oling"
- Ostida uch qator: rasmdan taniydi · o'zbek taomlarini biladi · kunlik normani yig'adi
- Katakcha: "Foydalanish shartlari va Maxfiylik siyosatini qabul qilaman" (ikkalasi havola)
- Tugma: "Boshlash" — **katakcha belgilanmaguncha o'chgan**

| Ustun | Qiymat |
|---|---|
| `foydalanuvchilar.shartlar_qabul` | sana va vaqt + hujjat versiyasi |

Shartlar **ma'lumot yig'ishdan oldin** qabul qilinadi — rasm va shaxsiy ma'lumot
keyinroq so'raladi, shuning uchun bu ekran birinchi.

**18+ katakchasi bu yerda yo'q.** Yosh O5'da raqam bilan so'raladi va 18 dan kichik
kiritilsa oqim davom etmaydi — bitta tasdiqning ikki joyda takrorlanishi ortiqcha.
18 yosh chegarasi Foydalanish shartlarida yozilgan, katakcha esa o'sha shartlarni
qamrab oladi.

### O2 — Til

**Savol:** "Qaysi tilda davom etamiz?"

- Variantlar: O'zbekcha · Русский · English
- Telegram `language_code` dan **oldindan tanlangan** holda keladi
- Tanlangan zahoti interfeys o'sha tilga o'tadi, tugma bosish shart emas

`foydalanuvchilar.til` · Keyin Sozlamalardan o'zgartiriladi.

### O3 — Ism

**Savol:** "Sizni qanday chaqiraylik?"

- Bitta maydon, Telegram profilidan **oldindan to'ldirilgan** (`first_name`)
- Tekshiruv: 1–40 belgi, bo'sh bo'lmasin
- Izoh: "Bu faqat salomlashish uchun"

`profillar.ism`

### O4 — Asosiy maqsad

**Savol:** "Nimaga erishmoqchisiz?"

| Variant | Norma tuzatishi |
|---|---|
| Vazn tashlash | −15% |
| Vaznni saqlash | 0 |
| Vazn ortdirish | +12% |
| Mushak yig'ish | +10%, oqsil ulushi oshadi |

Bitta tanlov. Profil sahifasida ko'rinadi va keyin o'zgartiriladi.

Bu tanlov **O6'dagi maqsad vaznni chegaralaydi**: "vazn tashlash" tanlagan odam joriy
vazndan katta maqsad kirita olmaydi va aksincha. "Vaznni saqlash" tanlansa, O6'da
maqsad vazn maydoni umuman ko'rsatilmaydi.

`profillar.maqsad`

### O5 — Jins va yosh

**Savol:** "Hisob to'g'ri chiqishi uchun bir-ikki raqam kerak"

- Jins: Erkak · Ayol · Aytishni xohlamayman
- Yosh: raqam, 18–100

Izoh ostida: "Jins va yosh faqat kaloriya formulasi uchun ishlatiladi" — Mifflin-St Jeor
formulasi busiz ishlamaydi, shuning uchun so'raladi.

"Aytishni xohlamayman" tanlansa — ikki formulaning o'rtachasi olinadi va natija ekranida
"taxmin kengroq" izohi chiqadi.

| Ustun | Tekshiruv |
|---|---|
| `profillar.jins` | uch qiymatdan biri |
| `profillar.yosh` | 18–100. **18 dan kichik kiritilsa davom etilmaydi** — ilova 18+ |
| `foydalanuvchilar.18plus_tasdiq` | yosh qabul qilinganda sana va vaqt yoziladi |

**18+ tasdig'i shu ekranda beriladi**, O1'dagi katakcha bilan emas. Kiritilgan yosh
katakchadan kuchliroq dalil, ikkalasini so'rash esa bir ishni ikki marta qilish.
18 dan kichik kiritilsa: "Ilovadan 18 yoshdan katta foydalanuvchilar foydalanishi
mumkin" va tugma o'chadi.

### O6 — O'lchovlar

**Savol:** "Bo'yingiz va vazningiz?"

- Bo'y: sm (120–230)
- Joriy vazn: kg (30–300)
- Maqsad vazn: kg (30–300) — "Vaznni saqlash" tanlanganda ko'rsatilmaydi
- Birlik almashtirgich: kg/lb, sm/ft — tanlov `foydalanuvchilar.birliklar` ga yoziladi

**Tekshiruvlar uch xil va ular aralashtirilmaydi** — har biri o'z maydoni ostida,
o'z matni bilan chiqadi.

**1. Yo'nalish tekshiruvi (to'sadi).** Maqsad vazn O4'da tanlangan maqsadga mos
kelishi shart:

| O4'dagi maqsad | Talab | Mos kelmasa |
|---|---|---|
| Vazn tashlash | maqsad < joriy | "Vazn tashlashni tanlagansiz, lekin maqsad vazn joriysidan katta" |
| Vazn ortdirish · Mushak yig'ish | maqsad > joriy | "Vazn ortdirishni tanlagansiz, lekin maqsad vazn joriysidan kichik" |
| Vaznni saqlash | maydon ko'rsatilmaydi | — |

Xabar ostida **ikki chiqish yo'li**: "Raqamni to'g'rilash" (maydonga qaytadi) va
"Maqsadni o'zgartirish" (O4'ga qaytaradi, qolgan javoblar saqlanadi). Ilova maqsadni
o'zi almashtirmaydi — qaysi biri xato ekanini faqat foydalanuvchi biladi.

Ikki vazn orasidagi farq 1 kg dan kam bo'lsa: "Bu maqsad joriy vaznga juda yaqin —
'Vaznni saqlash' to'g'riroq bo'lishi mumkin" + O4'ga havola. To'smaydi.

**2. Joriy vazn haqiqiyligi (to'smaydi, joriy vazn maydoni ostida).** Bo'y va joriy
vazndan hisoblangan TMI 16 dan past yoki 50 dan yuqori bo'lsa: "Bu raqam odatdagidan
juda uzoq — tekshirib ko'ring". Bu **terish xatosi** haqida, maqsad haqida emas.

**3. Maqsad xavfsizligi (to'smaydi, maqsad vazn maydoni ostida).** Maqsad vazn bo'yicha
hisoblangan TMI 18,5 dan past bo'lsa yoki maqsad joriy vazndan 25% dan ko'proq past
bo'lsa: "Bu maqsad juda past ko'rinadi. Ilova tibbiy xizmat emas, shifokor bilan
maslahatlashing." Davom etish to'silmaydi, lekin hisoblangan norma pastki chegaradan
o'tmaydi (5-bo'lim).

Ogohlantirish **faqat o'zi tegishli maydon ostida** turadi. Joriy vazn haqiqatga
o'xshamaganda "maqsadingiz past" deyilsa — foydalanuvchi qaysi raqamni tuzatishni
bilmaydi.

| Ustun | Izoh |
|---|---|
| `profillar.boyi` | sm da saqlanadi, ko'rsatishda o'giriladi |
| `vazn_yozuvlari` | joriy vazn **birinchi yozuv** sifatida tushadi |
| `vazn_yozuvlari.maqsad` | maqsad vazn |

Vazn `profillar` ga emas, `vazn_yozuvlari` ga yoziladi — progress grafigi shu jadvaldan
o'qiydi va birinchi nuqta onboardingdan kelishi kerak.

### O7 — Faollik darajasi

**Savol:** "Kuningiz qanday o'tadi?"

| Variant | Tavsif | Koeffitsient |
|---|---|---|
| Kam harakat | Asosan o'tirib ishlayman | 1,2 |
| Yengil faol | Haftada 1–3 kun harakat | 1,375 |
| O'rtacha faol | Haftada 3–5 kun mashq | 1,55 |
| Juda faol | Haftada 6–7 kun mashq yoki og'ir jismoniy ish | 1,725 |

Tavsiflar auditoriyaga moslangan: ofis xodimi birinchisini, zalga boruvchi uchinchi yoki
to'rtinchisini tanlaydi.

`profillar.faollik`

### O8 — Ovqat afzalliklari · *o'tkazib yuborish mumkin*

**Savol:** "Ovqatda cheklovingiz bormi?"

- Ko'p tanlovli: Cheklov yo'q · Vegetarian · Go'shtni kam yeyman · Laktoza yo'q ·
  Glyuten yo'q · Shakarni cheklayman
- "Cheklov yo'q" tanlansa qolganlari o'chadi

**Normaga ta'sir qilmaydi.** S4'dagi taom takliflari va S6'dagi retseptlar filtri uchun
yig'iladi. S2'da ustun yaratiladi, lekin hech narsa o'qimaydi — bu normal.

`profillar.ovqat_afzalliklari` (ro'yxat)

### O9 — Ovqatlanish odatlari · *o'tkazib yuborish mumkin*

**Savol:** "Odatda qanday ovqatlanasiz?"

- Kuniga necha mahal: 2 · 3 · 4 va undan ko'p
- Asosan qayerda: Uyda · Ishda yoki tashqarida · Aralash

S5'dagi eslatma vaqtlari shu javobdan chiqadi — kuniga 2 mahal ovqatlanadigan odamga
uchta eslatma yuborilmaydi.

`profillar.ovqatlanish_odati`

### O10 — Motivatsiya · *o'tkazib yuborish mumkin*

**Savol:** "Nima sizni harakatga undaydi?"

- Sog'lig'im · Tashqi ko'rinishim · Ko'proq energiya · Shifokor tavsiyasi ·
  Sport natijasi

V1'da faqat eslatma va bo'sh holat matnlarini tanlash uchun ishlatiladi. Boshqa hech
narsaga ta'sir qilmaydi.

`profillar.motivatsiya`

### O11 — Reja tayyorlanmoqda

**Vazifasi:** Hisob ketayotganini ko'rsatish va natijaga tayyorlash.

- Progress chizig'i, 2–4 soniya
- Aylanuvchi matnlar: "Javoblaringiz yig'ilmoqda" -> "Kunlik norma hisoblanmoqda" ->
  "Makrolar taqsimlanmoqda"
- Orqaga tugmasi yo'q

**Muhim:** bu ekranda "AI hisoblamoqda" deyilmaydi. Norma Mifflin-St Jeor formulasi
bilan, kod ichida hisoblanadi — bu [DECISIONS.md:46](DECISIONS.md:46) da qaror sifatida
yozilgan. Bo'lmagan AI'ni ko'rsatish mahsulotning "barcha raqamlar taxminiy va halol"
pozitsiyasini buzadi.

Hisob 100 ms da tugaydi. Kutish — psixologik, natijaga vazn berish uchun. 4 soniyadan
oshmaydi.

### O12 — Natija (ikki qadam)

**Qadam 1 — kunlik norma:**

- Katta raqam: `2,190 kkal` + ostida "kunlik taxminiy maqsadingiz"
- "Nega shunday?" — ochiladigan izoh: bo'y, vazn, yosh, jins va faollikdan BMR
  hisoblangani, maqsadga qarab tuzatilgani
- "Taxminiy" so'zi yo'qolmaydi
- Tugma: "Davom etish"

**Qadam 2 — makrolar:**

- Uch karta: oqsil, yog', uglevod — grammda va foizda
- Bitta qator prognoz: "Shu sur'atda maqsad vaznga taxminan 14 haftada yetasiz"
  (faqat vazn tashlash yoki ortdirish tanlanganda)
- Pastda mayda matn: "Bu tibbiy tavsiya emas. Qiymatlar taxminiy."
- Tugma: "Boshlaymiz"

| Ustun | Izoh |
|---|---|
| `rejalar` | hisoblangan kaloriya, uch makro, hisoblangan sana |

Norma keyin faqat ikki holatda qayta hisoblanadi: profil o'zgarsa yoki yangi vazn
yozuvi qo'shilsa.

### O13 — Paywall

Ichki tuzilishi bu TZ'da yo'q — alohida yoziladi. Bu yerda faqat oqimdagi o'rni:

- Onboardingdan keyin **bir marta** ko'rsatiladi
- "Hozir emas" tugmasi doim bor va u bilan Home'ga o'tiladi (PRD 5-bo'lim)
- FREE foydalanuvchi hech narsa yo'qotmaydi — 3 ta skan va cheksiz qo'lda kiritish
  ishlaydi

## 3. Holatlar

| Holat | Qachon | Ekranda |
|---|---|---|
| Yuklanmoqda | javob saqlanayotganda | Tugma ichida indikator; maydon bloklanmaydi |
| Xato | javob saqlanmadi | Pastda: "Saqlanmadi. Qayta urinish" — javob yo'qolmaydi, ekran o'zgarmaydi |
| Oflayn | internet yo'q | "Davom etish" bosilganda: "Internet yo'q. Ulanishni tekshiring" |
| Yarmida chiqib ketish | ilova yopildi | Qaytib kirganda o'sha qadamdan davom etadi |
| Tekshiruv xatosi | yosh 18 dan kichik, bo'y/vazn chegaradan tashqarida | Maydon ostida qizil izoh, tugma o'chgan |
| Bo'sh | — | Onboardingda bo'sh holat yo'q, har ekranda savol bor |

## 4. Ma'lumot xaritasi

| Ekran | Ustun | Kim o'qiydi |
|---|---|---|
| O1 | `foydalanuvchilar.shartlar_qabul` | yuridik talab |
| O2 | `foydalanuvchilar.til` | butun interfeys |
| O3 | `profillar.ism` | Home salomlashishi, Profil |
| O4 | `profillar.maqsad` | norma tuzatishi (S4), Profil |
| O5 | `profillar.jins`, `.yosh`, `foydalanuvchilar.18plus_tasdiq` | Mifflin formulasi (S4), yuridik talab |
| O6 | `profillar.boyi`, `vazn_yozuvlari` | Mifflin formulasi, Progress grafigi |
| O7 | `profillar.faollik` | faollik koeffitsienti (S4) |
| O8 | `profillar.ovqat_afzalliklari` | taom takliflari (S4), retseptlar (S6) |
| O9 | `profillar.ovqatlanish_odati` | eslatma vaqtlari (S5) |
| O10 | `profillar.motivatsiya` | eslatma matnlari (S5) |
| O12 | `rejalar` | Home doirasining maxraji |

**S2 uchun xulosa:** `profillar` jadvalida kamida shu ustunlar bo'lishi kerak — `ism`,
`jins`, `yosh`, `boyi`, `maqsad`, `faollik`, `ovqat_afzalliklari`, `ovqatlanish_odati`,
`motivatsiya`, `onboarding_qadami` (qayerda to'xtagani).

## 5. Formula (S4'da yoziladi, bu yerda qotiriladi)

**BMR — Mifflin-St Jeor:**

- Erkak: `10 × vazn(kg) + 6,25 × bo'y(sm) − 5 × yosh + 5`
- Ayol: `10 × vazn(kg) + 6,25 × bo'y(sm) − 5 × yosh − 161`
- Aytilmagan: ikkalasining o'rtachasi

**Kunlik norma:** `BMR × faollik koeffitsienti × maqsad tuzatishi`

**Pastki chegara — majburiy:** erkak uchun 1,500 kkal, ayol uchun 1,200 kkal. Hisob
shundan past chiqsa, chegara qiymati beriladi va natija ekranida bitta qator izoh
chiqadi. Bu chegarasiz ilova ochlik rejimini tavsiya qilib qo'yishi mumkin — mahsulot
esa tibbiy xizmat emas (PRD 2-bo'lim).

**Makro taqsimoti (boshlang'ich):** oqsil 25% · yog' 30% · uglevod 45%.
"Mushak yig'ish" tanlansa: oqsil 30% · yog' 25% · uglevod 45%.

## 6. Bu TZ'da YO'Q

Paywall ichki tuzilishi va narx ekrani · to'lov oqimi · botdagi til tanlash (S5) ·
Profil va Sozlamalar sahifalari (S3, alohida) · normani qayta hisoblash ekranlari.

## 7. Ochiq savollar

| # | Savol | Qachon |
|---|---|---|
| 1 | 13 ta ekran ko'pmi? Qaysi biri kesilsa konversiya oshadi — O10 motivatsiya eng zaif nomzod | S3, birinchi foydalanuvchilardan keyin |
| 2 | "Aytishni xohlamayman" jinsi uchun o'rtacha formula to'g'rimi, yoki jinsni majburiy qilamizmi | S2'dan oldin |
| 3 | Maqsad tuzatishi foizda (−15%) yoki qat'iy sonda (−500 kkal) bo'lsinmi | S4 |
| 4 | Prognoz qatori ("14 haftada yetasiz") va'da bo'lib qolmaydimi — huquqiy tomoni | S4, shartlar yozilayotganda |
| 5 | O8 va O9 javoblari S6 gacha hech narsaga ta'sir qilmaydi — ularni hozir so'rash kerakmi yoki keyinroq, kerak bo'lganda so'ralsinmi | S3 |

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
