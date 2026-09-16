# DIZAYN TZ — Yurak oqim ekranlari

Bu hujjat faqat **yurak oqim** uchun yozilgan: foydalanuvchi ilovani ochadi -> kunlik
doirani ko'radi -> ovqat qo'shadi -> doira to'ladi. PRD 3-bo'lim ("Yurak amal") va
5-bo'limning 6–10 qadamlari shu yerda ekranga aylantirilgan.

**Qamrovda YO'Q (ichki tuzilishi bo'yicha):** onboarding, AI reja tayyorlash, paywall va
to'lov, progress sahifasi, retseptlar, sozlamalar, admin paneli, bot ekranlari. Ular
alohida TZ'da yoziladi — lekin pastki paneldagi o'rni 2-bo'limda belgilangan, chunki
navigatsiya skeletini keyin qo'shib bo'lmaydi.

## 1. Oqim xaritasi

```
                       ┌──────────────────┐
                       │  E1  HOME        │◀──────────────┐
                       │  kunlik doira    │               │
                       └──┬────────────┬──┘               │
                  "+" tugma│            │"Bugungi ovqatlar"
                           ▼            ▼                 │
                ┌──────────────┐   ┌──────────────┐       │
                │ E2 MANBA     │   │ E9 JURNAL    │       │
                │ tanlash      │   │ ro'yxat      │       │
                └─┬───┬─────┬──┘   └──────┬───────┘       │
           Kamera │   │     │ Qo'lda      │ yozuvga bosish│
                  │   │     │             ▼               │
                  │   │     │       ┌──────────┐          │
                  │   │     │       │ E10      │──────────┘
                  │   │     │       │ TAHRIR   │
                  │   │     │       └──────────┘
                  ▼   │     ▼
        ┌──────────────┐  ┌──────────────┐
        │ E3 KAMERA    │  │ E4 QIDIRUV   │
        │ rasm olish   │  │ taom ro'yxati│
        └──────┬───────┘  └──────┬───────┘
               │ Galereya │      ▼
               │ (tizim)  │  ┌──────────────┐
               ▼          ▼  │ E5 TAOM      │
        ┌──────────────────┐ │ porsiya      │
        │ E6 AI TAHLIL     │ └──────┬───────┘
        │ yuklanmoqda      │        │
        └──────┬───────────┘        │
               ▼                    │
        ┌──────────────────┐        │
        │ E7 NATIJA        │        │
        │ tasdiq / tahrir  │        │
        └──────┬───────────┘        │
               └────────┬───────────┘
                        ▼
                ┌──────────────┐
                │ E8 QO'SHILDI │──────▶ E1 HOME
                └──────────────┘
```

**Qoida:** jurnalga yozuv faqat E7 yoki E5 dagi tasdiq tugmasidan keyin tushadi.
E6 va E7 dagi natija hali yozuv emas — u `tasdiq kutilmoqda` holatida (PRD 8-bo'lim).

## 2. Global navigatsiya — pastki panel

Suzuvchi pastki panel: **to'rt bo'lim + markazda "+"**. Beshta bo'lim qo'yilmaydi —
"+" bilan birga oltita nishon telefon ekranida bir-biriga tiqiladi.

| O'rin | Bo'lim | Ekran | Kimga |
|---|---|---|---|
| 1 | Home | E1 — kunlik doira | hammaga |
| 2 | Retseptlar | *(alohida TZ, S6)* | FREE sarlavha ko'radi, PRO to'liq matn |
| — | **"+"** | E2 — manba tanlash | hammaga |
| 3 | Progress | *(alohida TZ)* — vazn, streak, kuzatilgan kunlar | hammaga |
| 4 | Profil | *(alohida TZ)* — sozlamalar, til, mavzu, obuna | hammaga |

**Nega Retseptlar alohida bo'lim, "Yana" menyusi ichida emas:** bu mahsulotning asosiy
PRO yuzasi. FREE foydalanuvchi faqat sarlavhalarni ko'radi (PRD 4-bo'lim), ya'ni har
kirish — yumshoq paywall teginishi. Menyu ichiga yashirilsa, obunaga o'tish yo'li
ko'rinmay qoladi.

**Nega Jurnal panelda yo'q:** u Home'ning davomi — E1'dagi "Bugungi ovqatlar -> Hammasi"
orqali ochiladi (E9). Panelda ham Home, ham Jurnal turishi ikkalasini ham zaiflashtiradi.

**Qoidalar:**

- Panel E1, E9 va bo'lim ildiz ekranlarida ko'rinadi. Oqim ichida (E3, E5, E6, E7, E8,
  E10) va bottom sheet ochiq bo'lganda **yashiriladi** — foydalanuvchi oqimdan
  tasodifan chiqib ketmasin.
- "+" qolgan nishonlardan kattaroq va `--siyoh` fonli — ekrandagi yagona doimiy asosiy
  harakat.
- Faol bo'lim `--siyoh`, nofaol `--matn-2`. Nishon ostida yozuv doim bor (yolg'iz ikona
  tushunarsiz).
- Bo'lim almashganda o'tish animatsiyasi yo'q — oniy.
- Hali tayyor bo'lmagan bo'lim panelda **ko'rsatilmaydi** (o'chgan holda ham emas).

**Sprint bo'yicha panel:**

| Sprint | Panel ko'rinishi |
|---|---|
| S1 | Panel yo'q — faqat Home va "+" |
| S2 | Home · [+] · Jurnal (vaqtinchalik, Progress va Retseptlar hali yo'q) |
| S4 | Home · [+] · Progress · Profil |
| S6 | To'liq: Home · Retseptlar · [+] · Progress · Profil |

## 3. Ekranlar

### E1 — Home (kunlik doira) · S1

**Vazifasi:** Foydalanuvchiga bugungi normasining qanchasi to'lganini bitta doirada
ko'rsatish — butun mahsulotning markazi.

**Elementlar:**
- Sarlavha: sana va salomlashish ("Bugun, 13-sentabr")
- **Kunlik doira** — markazda `1,240 / 2,190 kkal`, ostida "qoldi: 950 kkal"
- Uch makro chizig'i: oqsil, yog', uglevod — har biri `hozirgi / maqsad` grammda
- Haftalik kun tanlagichi (Du–Ya, bugungi kun ajratilgan) — S2'da faol bo'ladi
- "Bugungi ovqatlar" bloki: oxirgi 3 yozuv (mitti rasm, taom nomi, vaqt, kkal)
- Qolgan kaloriyaga mos taom taklifi (bitta karta) — S4
- **"+" — asosiy harakat tugmasi.** S1'da panel yo'q, shuning uchun pastda o'ngda
  suzadi; S2'dan boshlab pastki panelning markaziga ko'chadi (2-bo'lim)

**Navigatsiya:**

| Element | Harakat | Qayerga |
|---|---|---|
| "+" tugma | bosish | E2 — manba tanlash |
| "Bugungi ovqatlar" sarlavhasi / "Hammasi" | bosish | E9 — jurnal |
| Ro'yxatdagi bitta yozuv | bosish | E10 — yozuv tahriri |
| Kun tanlagichdagi kun | bosish | E1 o'zi, tanlangan kun ma'lumoti bilan (S2) |
| Doira | bosish | harakat yo'q — u ko'rsatkich, tugma emas |

**Holatlar:**

| Holat | Qachon | Ekranda |
|---|---|---|
| Yuklanmoqda | ilova ochilganda, ma'lumot kelgunicha | Doira va makro chiziqlari skelet ko'rinishida (kulrang, pulsatsiya). Raqam o'rniga `—`. "+" tugma faol emas |
| Bo'sh | bugun hali yozuv yo'q | Doira `0 / 2,190` da to'liq bo'sh. Ovqatlar bloki o'rnida: "Bugun hali hech narsa qo'shilmadi" + "Birinchi ovqatni qo'shish" tugmasi (-> E2) |
| Xato | API javob bermadi | Doira o'rnida xato kartasi: "Ma'lumotni yuklab bo'lmadi" + "Qayta urinish". "+" tugma faolligicha qoladi — foydalanuvchi baribir ovqat qo'sha olsin |
| Oflayn | internet yo'q | Tepada tor chiziq: "Internet yo'q — oxirgi ma'lumot ko'rsatilmoqda". Doira keshdagi son bilan chiqadi |

---

### E2 — Ovqat qo'shish: manba tanlash · S1

**Vazifasi:** Ovqatni qanday qo'shishni tanlash — rasmga olish, galereyadan olish yoki
qo'lda yozish.

**Elementlar:**
- Pastdan chiqadigan panel (bottom sheet), yuqorisida tortish chizig'i
- Uch katta tugma: **Kamera** · **Galereya** · **Qo'lda qo'shish**
- Har tugma ostida bitta qator izoh ("Ovqatni rasmga oling")
- FREE foydalanuvchi uchun skan hisoblagichi: "3 tadan 2 ta skan qoldi" — S4
- "Bekor qilish" / panelni pastga surish

**Navigatsiya:**

| Element | Harakat | Qayerga |
|---|---|---|
| Kamera | bosish | E3 — kamera ekrani |
| Galereya | bosish | Tizim rasm tanlagichi -> tanlangach E6 |
| Qo'lda qo'shish | bosish | E4 — taom qidiruvi |
| Bekor qilish / fon | bosish | E1 — Home |

**Holatlar:**

| Holat | Qachon | Ekranda |
|---|---|---|
| Yuklanmoqda | yo'q — panel darhol ochiladi | — |
| Bo'sh | yo'q | — |
| Xato | kameraga ruxsat berilmagan | "Kamera" bosilganda: "Kameraga ruxsat yo'q" + "Sozlamalarni ochish" + "Galereyadan tanlash" |
| Limit tugagan | FREE 3 ta skanni sarflagan (S4) | Kamera va Galereya tugmalari o'chgan, ostida: "Bepul skanlar tugadi. Qo'lda qo'shish cheklovsiz." + "PRO haqida" havolasi. Qo'lda qo'shish faol qoladi |

---

### E3 — Kamera · S2

**Vazifasi:** Ovqatni rasmga olish va tahlilga yuborishdan oldin ko'rib chiqish.

**Elementlar:**
- To'liq ekran kamera ko'rinishi
- Markazda yengil ramka va maslahat: "Taomni tepadan, to'liq ko'rinishda oling"
- Deklanshator tugmasi, galereya yorlig'i, orqaga tugmasi
- Rasm olingandan keyin: rasm ko'rinishi + "Qayta olish" va "Tahlil qilish"

**Navigatsiya:**

| Element | Harakat | Qayerga |
|---|---|---|
| Deklanshator | bosish | Shu ekranning ko'rib chiqish holati |
| Tahlil qilish | bosish | E6 — AI tahlil |
| Qayta olish | bosish | E3 — kamera ko'rinishi |
| Orqaga | bosish | E1 — Home |

**Holatlar:**

| Holat | Qachon | Ekranda |
|---|---|---|
| Yuklanmoqda | kamera ishga tushayotganda | Qora ekran + aylanuvchi indikator |
| Bo'sh | yo'q | — |
| Xato | kamera ochilmadi yoki ruxsat yo'q | Qora ekran o'rtasida: "Kamerani ocholmadik" + "Qayta urinish" + "Galereyadan tanlash" |

---

### E4 — Qo'lda qo'shish: taom qidiruvi · S1

**Vazifasi:** Taom bazasidan taom topish va uni jurnalga qo'shishga o'tish — AI'siz,
limitsiz yo'l.

**Elementlar:**
- Yuqorida qidiruv maydoni ("Osh, manti, somsa…")
- Taomlar ro'yxati: nomi, 100 g yoki 1 porsiyaga kaloriya, mitti rasm
- "Oxirgi qo'shilganlar" bo'limi (S2)
- "Matn bilan tasvirlash" havolasi — erkin matnni AI'ga yuborish (S2, `POST /api/skan`)
- Orqaga tugmasi

**Navigatsiya:**

| Element | Harakat | Qayerga |
|---|---|---|
| Ro'yxatdagi taom | bosish | E5 — taom detali |
| Matn bilan tasvirlash | matn yozib yuborish | E6 — AI tahlil |
| Orqaga | bosish | E1 — Home |

**Holatlar:**

| Holat | Qachon | Ekranda |
|---|---|---|
| Yuklanmoqda | ro'yxat kelgunicha | 6 ta skelet qator |
| Bo'sh (baza bo'sh) | taom bazasi hali to'lmagan | "Taom bazasi tayyorlanmoqda" + "Matn bilan tasvirlash" tugmasi |
| Bo'sh (qidiruv natijasiz) | so'rovga mos taom yo'q | "«shashlik» topilmadi" + ikki chiqish yo'li: "Matn bilan tasvirlash" va "Rasmga olish" (-> E3) |
| Xato | ro'yxat yuklanmadi | "Taomlarni yuklab bo'lmadi" + "Qayta urinish" |

---

### E5 — Taom detali va porsiya · S1

**Vazifasi:** Porsiyani tanlash va shu porsiyaga mos kaloriyani ko'rib, jurnalga
qo'shish.

**Elementlar:**
- Taom nomi va rasmi
- Porsiya tanlagich: tayyor variantlar (150 g / 250 g / 350 g) + "Boshqa" -> grammni
  qo'lda kiritish
- Tanlangan porsiyaga qarab **jonli qayta hisoblanadigan** kaloriya (katta raqam)
- Uch makro: oqsil, yog', uglevod (grammda)
- Ovqat turi tanlagich: nonushta / tushlik / kechki ovqat / gazak
- **"Jurnalga qo'shish"** — asosiy tugma
- Orqaga tugmasi

**Navigatsiya:**

| Element | Harakat | Qayerga |
|---|---|---|
| Porsiya varianti | bosish | Shu ekran, raqamlar qayta hisoblanadi |
| Jurnalga qo'shish | bosish | E8 — qo'shildi |
| Orqaga | bosish | E4 — qidiruv |

**Holatlar:**

| Holat | Qachon | Ekranda |
|---|---|---|
| Yuklanmoqda | "Jurnalga qo'shish" bosilgach saqlanayotganda | Tugma ichida indikator, tugma qayta bosilmaydi |
| Bo'sh | yo'q — bu ekran doim to'la | — |
| Xato | saqlash amalga oshmadi | Pastda qizil chiziq: "Saqlanmadi. Qayta urinish" — kiritilgan ma'lumot joyida qoladi, ekran yopilmaydi |

---

### E6 — AI tahlil · S2

**Vazifasi:** Rasm yoki matn AI'ga yuborilganini va javob kutilayotganini ko'rsatish.

**Elementlar:**
- Yuborilgan rasm (xiralashtirilgan fon sifatida)
- Aylanuvchi indikator
- Sarlavha: "Ovqatingiz tahlil qilinmoqda…"
- Ostida almashinuvchi matnlar: "Taom aniqlanmoqda" -> "Porsiya baholanmoqda" ->
  "Kaloriya hisoblanmoqda"
- "Bekor qilish" havolasi

**Navigatsiya:**

| Element | Harakat | Qayerga |
|---|---|---|
| Javob keldi | avtomatik | E7 — natija |
| Bekor qilish | bosish | E1 — Home (yozuv yaratilmaydi) |

**Holatlar:**

| Holat | Qachon | Ekranda |
|---|---|---|
| Yuklanmoqda | asosiy holat — butun ekran shu | Yuqoridagi tarkib |
| Uzoq kutish | 10 soniyadan oshdi | Qo'shimcha qator: "Biroz cho'zilmoqda, kutamiz…" |
| Xato | tarmoq yo'q yoki AI javob bermadi | Ekran xato holatiga o'tadi: "Tahlil qilib bo'lmadi" + "Qayta urinish" + "Qo'lda qo'shish" (-> E4). PRD: rasm navbatga olinmaydi va saqlanmaydi |
| Tanib bo'lmadi | AI ishonchi past | "Taomni aniq taniy olmadik" + uch yo'l: "Boshqa rasm olish" (-> E3), "Qo'lda qo'shish" (-> E4), "Baribir tahrirlab kiritish" (-> E7, maydonlar bo'sh). **Qiymat uydirilmaydi** |

---

### E7 — AI natijasi: tasdiqlash va tahrirlash · S2

**Vazifasi:** AI taxminini ko'rsatish va foydalanuvchi tasdiqlagandan keyingina jurnalga
yozish — bu oqimning eng muhim nazorat nuqtasi.

**Elementlar:**
- Rasm (kichik, tepada)
- **"AI taxmini"** belgisi va bitta qator ogohlantirish: "Raqamlar taxminiy, tahrirlash
  mumkin"
- Taom nomi — tahrirlanadigan maydon
- Porsiya (gramm) — tahrirlanadigan, o'zgarganda kaloriya qayta hisoblanadi
- Kaloriya, oqsil, yog', uglevod — har biri tahrirlanadigan
- Ovqat turi tanlagich: nonushta / tushlik / kechki ovqat / gazak
- **"Tasdiqlash va qo'shish"** — asosiy tugma
- "Bekor qilish" — yozuvsiz chiqish

**Navigatsiya:**

| Element | Harakat | Qayerga |
|---|---|---|
| Tasdiqlash va qo'shish | bosish | E8 — qo'shildi |
| Bekor qilish | bosish | E1 — Home, doira o'zgarmaydi |
| Qiymatni tahrirlash | yozish | Shu ekran; tahrir qilingani belgilanadi (S6'dagi taom takliflari navbati uchun) |

**Holatlar:**

| Holat | Qachon | Ekranda |
|---|---|---|
| Yuklanmoqda | tasdiq bosilib, saqlanayotganda | Tugma ichida indikator, maydonlar bloklanadi |
| Bo'sh | "tanib bo'lmadi" dan kelingan | Maydonlar bo'sh, "AI taxmini" belgisi yo'q, tepada: "Ma'lumotni o'zingiz kiriting" |
| Xato | saqlanmadi | Pastda: "Yozuv saqlanmadi. Qayta urinish" — tahrirlar yo'qolmaydi |
| Tekshiruv xatosi | kaloriya bo'sh yoki 0 dan kichik | Maydon ostida qizil izoh, tasdiq tugmasi o'chgan |

---

### E8 — Qo'shildi (tasdiq) · S1

**Vazifasi:** Yozuv jurnalga tushganini va doira qanchaga to'lganini darhol ko'rsatib,
foydalanuvchini Home'ga qaytarish.

**Elementlar:**
- Yashil belgi va "Jurnalga qo'shildi"
- Qo'shilgan yozuv qisqacha: taom nomi, porsiya, kaloriya
- **Yangilangan doira** — animatsiya bilan eski qiymatdan yangisiga to'ladi
  (masalan `0 / 2,190` -> `620 / 2,190`)
- "Home'ga qaytish" tugmasi
- "Yana qo'shish" havolasi

**Navigatsiya:**

| Element | Harakat | Qayerga |
|---|---|---|
| Home'ga qaytish | bosish | E1 — Home |
| Yana qo'shish | bosish | E2 — manba tanlash |
| Hech narsa bosilmadi | 2 soniyadan keyin avtomatik | E1 — Home |

**Holatlar:** bu ekran faqat muvaffaqiyatli saqlashdan keyin ochiladi — bo'sh, yuklanish
va xato holatlari yo'q. Xato oldingi ekranda (E5 / E7) ushlanadi.

---

### E9 — Jurnal (bugungi ovqatlar) · S2

**Vazifasi:** Kun davomida qo'shilgan barcha yozuvlarni bir joyda ko'rish va ularni
boshqarish.

**Elementlar:**
- Tepada kunlik jami: kaloriya va uch makro
- Sana tanlagich (bugun / orqaga)
- Yozuvlar ovqat turi bo'yicha guruhlangan: nonushta, tushlik, kechki ovqat, gazak
- Har yozuv: rasm, taom nomi, porsiya, vaqt, kaloriya
- "AI taxmini" belgisi — AI orqali kirgan yozuvlarda
- "+" tugma

**Navigatsiya:**

| Element | Harakat | Qayerga |
|---|---|---|
| Yozuv | bosish | E10 — yozuv tahriri |
| Yozuvni chapga surish | surish | Tezkor amallar: o'chirish, nusxalash |
| "+" | bosish | E2 — manba tanlash |
| Orqaga | bosish | E1 — Home |

**Holatlar:**

| Holat | Qachon | Ekranda |
|---|---|---|
| Yuklanmoqda | ro'yxat kelgunicha | Jami qatori va 3 ta yozuv skeleti |
| Bo'sh | shu kunda yozuv yo'q | Markazda mitti rasm + "Bu kunda yozuv yo'q" + "Ovqat qo'shish" tugmasi (-> E2). Bugundan oldingi kun bo'lsa tugma yo'q, faqat matn |
| Xato | ro'yxat yuklanmadi | "Jurnalni yuklab bo'lmadi" + "Qayta urinish" |

---

### E10 — Yozuv tahriri · S2

**Vazifasi:** Jurnaldagi mavjud yozuvni tuzatish, nusxalash yoki o'chirish.

**Elementlar:**
- Rasm, taom nomi, porsiya, kaloriya, makrolar — hammasi tahrirlanadi
- Ovqat turi va vaqt
- "Saqlash" — asosiy tugma
- "Nusxalash" — shu yozuvni yana bir marta qo'shadi
- "O'chirish" — qizil, tasdiqlash oynasi bilan

**Navigatsiya:**

| Element | Harakat | Qayerga |
|---|---|---|
| Saqlash | bosish | Kelingan ekran (E1 yoki E9), doira yangilanadi |
| Nusxalash | bosish | E8 — qo'shildi |
| O'chirish -> Tasdiqlash | bosish | Kelingan ekran, doira kamayadi + "Bekor qilish" taklifi 5 soniya |
| Orqaga | bosish | Kelingan ekran, o'zgarishsiz |

**Holatlar:**

| Holat | Qachon | Ekranda |
|---|---|---|
| Yuklanmoqda | saqlash yoki o'chirish davom etayotganda | Tugma ichida indikator |
| Bo'sh | yo'q | — |
| Xato | amal bajarilmadi | "O'zgarish saqlanmadi. Qayta urinish" — ekran yopilmaydi |

## 4. Umumiy holat qoidalari

Bu qoidalar barcha ekranga baravar tegishli — har ekranda qaytarilmaydi.

| Qoida | Tafsilot |
|---|---|
| **Yuklanmoqda** | Butun ekranni bekitadigan indikator ishlatilmaydi. Ma'lumot joyida skelet bilan ko'rsatiladi; tugma bosilganda esa indikator tugmaning o'zi ichida bo'ladi va tugma ikkinchi marta bosilmaydi |
| **Bo'sh** | Har bo'sh holatda uch narsa bo'ladi: nima yo'qligi, nega yo'qligi va bitta harakat tugmasi. Quruq "Ma'lumot yo'q" yozuvi yaroqsiz |
| **Xato** | Texnik matn ko'rsatilmaydi (kod, stack, "500"). Odam tilida sabab + "Qayta urinish". Xato ekranida ham chiqish yo'li bo'ladi — foydalanuvchi tupikda qolmaydi |
| **Saqlash xatosi** | Foydalanuvchi kiritgan ma'lumot hech qachon yo'qotilmaydi — ekran yopilmaydi, maydonlar tozalanmaydi |
| **Oflayn** | Tepada doimiy tor chiziq. Rasm navbatga olinmaydi (PRD 8-bo'lim) — bu ochiq aytiladi: "Internet kelganda qayta urinib ko'ring" |
| **Taxminiylik** | Raqam ko'rsatilgan har joyda "taxminiy" ekani ko'rinadi. AI chiqargan qiymat yonida "AI taxmini" belgisi doimiy |
| **Tasdiqlanmagan yozuv** | Hech qachon doiraga qo'shilmaydi. Foydalanuvchi E6 yoki E7 dan chiqib ketsa, hech narsa saqlanmaydi |
| **Orqaga tugmasi** | Har ekranda bor va oqimning bir qadam orqasiga qaytaradi; E8 dan orqaga qaytish yo'q |
| **Mavzu** | Har ekran yorug' va qorong'i mavzuda tekshiriladi (S2) |
| **Til** | Barcha matn uch tilda: o'zbek, rus, ingliz. Kodda qotirilgan matn yo'q |

## 5. Sprint bo'yicha bo'linish

| Sprint | Ekranlar |
|---|---|
| **S1 — kesim** | E1 (soddalashtirilgan: qotirilgan norma, kun tanlagichsiz), E2 (faqat "Qo'lda qo'shish" faol), E4, E5, E8 |
| **S2 — xotira** | E3, E6, E7, E9, E10 + E1 to'ldiriladi (rasm, kun tanlagich, mavzu) |
| **S4 — chuqurlik** | E2'ga skan limiti holati, E1'ga Nutrition Score va taom taklifi |

## 6. Hal qilinmagan dizayn savollari

| # | Savol | Qachon |
|---|---|---|
| 1 | E8 alohida ekran bo'lsinmi yoki Home'ga qaytib, doira ustida animatsiya + toast bo'lsinmi? Ikkinchisi bir bosishni tejaydi | S1, birinchi prototipdan keyin |
| 2 | Ovqat turi (nonushta/tushlik/kechki) vaqt bo'yicha avtomatik tanlansinmi yoki doim qo'lda? | S2 |
| 3 | E5'da porsiya variantlari har taom uchun alohida yoziladimi yoki umumiy shablon (kichik/o'rta/katta)? | S1, taom bazasi seed qilinayotganda |
| 4 | E1'dagi doira bosilganda batafsil ko'rinish ochilsinmi (makrolar, qolgan kaloriya tarixi)? | S4 |

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
