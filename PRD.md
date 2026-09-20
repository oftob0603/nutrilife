# PRD — Kalori

## 1. G'oya bir jumlada

O'zbekistondagi kunlik ovqatining kaloriyasini umuman bilmaydigan 18+ smartfon
foydalanuvchilari uchun "bu ovqat qancha kaloriya?" degan savolga rasm orqali
3 soniyada javob beradigan va shu javoblarni kunlik normaga yig'ib boradigan
Telegram Mini App — o'zbek taomlarini taniydigan AI skaneri bilan.

## 2. Muammo va auditoriya

**Auditoriya:** O'zbekistonda yashovchi 18+ Telegram foydalanuvchilari — o'tirib
ishlaydigan ofis xodimlari, vazn kuzatuvchi ayollar va zal bilan shug'ullanuvchilar.
Interfeys tillari: o'zbek, rus, ingliz. Valyuta: so'm.

**Muammo:** Odam bir kosa osh 700 kkal, bitta somsa 350 kkal ekanini tasavvur qilmaydi.
Og'riq "kuzatish qiyin" emas — **bilmaslik**. Bilmagan narsani boshqarib bo'lmaydi.

**Nima uchun mavjud yechimlar ishlamaydi:** xalqaro ilovalar yuklab olinishi,
ro'yxatdan o'tilishi va ingliz tilida ishlatilishi kerak; ularning bazasida osh, manti,
somsa, lag'mon yo'q.

**Asosiy farq:** hech narsa o'rnatilmaydi — Telegram allaqachon ochiq, ilova 2 bosishda
ishlaydi. Ikkinchi farq: o'zbek taomlarini taniydi.

**Pozitsiya:** bu tibbiy xizmat emas. Kasallik aniqlash, davolash, oldini olish va dori
tavsiya qilish yo'q. Barcha raqamlar taxminiy va noto'g'ri bo'lishi mumkin.

## 3. Yurak amal

> **Ko'rish** — foydalanuvchi ilovani ochadi va kunlik normasining qanchasi to'lganini
> bitta doirada ko'radi (masalan 1,240 / 2,190 kkal).

Ilova Home ekrani bilan ochiladi. Ovqat qo'shish — shu doirani to'ldirish uchun vosita,
maqsad emas. Butun mahsulot shu doira atrofida quriladi.

## 4. Rollar va huquqlar

| Rol | Ko'radi | Qila oladi |
|-----|---------|------------|
| **FREE foydalanuvchi** | O'z Home doirasi, o'z jurnali, o'z progressi, retsept sarlavhalari | Umr davomida jami 3 ta AI skan; qo'lda matn bilan cheklovsiz ovqat qo'shish; o'z yozuvini tahrirlash va o'chirish; profil va sozlamalarni o'zgartirish |
| **PRO foydalanuvchi** | Yuqoridagilar + retseptlarning to'liq matni + Nutrition Score + qolgan kaloriyaga mos taom takliflari | Kuniga 20 tagacha AI skan; to'liq tarixni ko'rish; obunani bekor qilish |
| **Admin** | Umumiy statistika, foydalanuvchilar ro'yxati, obunalar, taom takliflari navbati, shikoyatlar | Obunani qo'lda berish va olib qo'yish; taom va retsept bazasini tahrirlash; AI xato tanigan natijalarni tuzatish; foydalanuvchini bloklash va ma'lumotini o'chirish; narxlarni o'zgartirish |

Kirish: Telegram initData orqali avtomatik. Telefon, email, parol so'ralmaydi.
18+ chegarasi: Terms of Use'da yoziladi va onboardingda yosh kiritilganda tekshiriladi —
18 dan kichik bo'lsa oqim davom etmaydi. Hujjat tekshirilmaydi.

## 5. Asosiy oqim

1. Foydalanuvchi botdan yoki havoladan Mini App'ni ochadi — Telegram akkaunti bilan
   avtomatik kiradi.
2. Onboarding: Intro -> til -> ism -> asosiy maqsad -> yosh, bo'y, joriy vazn, maqsad
   vazn -> faollik darajasi -> ovqat afzalliklari -> ovqatlanish odatlari -> motivatsiya.
3. AI reja tayyorlash ekrani (progress va aylanuvchi matnlar).
4. Natija: taxminiy kunlik kaloriya maqsadi va makro maqsadlari, "nega shunday" izohi
   bilan. Barchasi "taxminiy" deb belgilanadi.
5. Paywall: PRO imkoniyatlari va narxlar. "Hozir emas" tugmasi bilan o'tkazib yuborish
   mumkin.
6. Home: kunlik doira, makro chiziqlari, haftalik kun tanlagichi, bugungi ovqatlar,
   qolgan kaloriya bo'yicha taklif, progress qisqacha ko'rinishi.
7. Ovqat qo'shish: kamera, galereya yoki qo'lda matn. Ovozli kiritish yo'q.
8. AI tahlil ekrani -> natija: taom nomi, taxminiy porsiya, kaloriya, oqsil, yog',
   uglevod + "AI taxmini" belgisi va aniqlik ogohlantirishi.
9. Foydalanuvchi tasdiqlaydi yoki tahrirlaydi. **Tasdiqlanmagan natija jurnalga tushmaydi.**
10. Yozuv bugungi jurnalga tushadi, doira va Nutrition Score yangilanadi.
11. Progress: vazn, streak, kuzatilgan kunlar.

## 6. Funksiyalar (v1)

**1. Kunlik norma va jurnal.** Home doirasi, makro chiziqlari, bugungi ovqatlar ro'yxati
(nonushta, tushlik, kechki ovqat, gazak), yozuvni tahrirlash, o'chirish, nusxalash va
porsiyani o'zgartirish. Faqat bugungi kunga yozuv qo'shiladi.

**2. AI ovqat skaneri.** Kamera, galereya va qo'lda matn. AI taomni taniydi va taxminiy
kaloriya hamda makrolarni chiqaradi. Foydalanuvchi tasdiqlaydi yoki tuzatadi. Ishonch
past bo'lsa qiymat uydirilmaydi — "aniq taniy olmadik" + qayta urinish yoki qo'lda
qo'shish taklifi. O'zbek taomlari (osh, manti, somsa, lag'mon, norin, dimlama, mastava,
shurpa, chuchvara, qozonkabob, non) uch tilda taniladi.

**3. Shaxsiy reja.** Onboarding javoblaridan Mifflin-St Jeor formulasi bilan taxminiy
kunlik kaloriya va makro maqsadlari hisoblanadi. Formula kod bilan ishlaydi, AI'ga
topshirilmaydi — natija barqaror bo'lishi uchun.

**Qo'shimcha v1 qamrovi** (asosiy uchtalikdan tashqari, lekin v1'da bor):
obuna va paywall (Click, Payme, Telegram Stars) · retseptlar bo'limi PRO ostida ·
Nutrition Score · uch til va yorug'/qorong'i mavzu · Telegram bot kirish nuqtasi ·
Privacy Policy va Terms of Use sahifalari.

## 7. Ma'lumot modeli

Faqat jadval nomlari va vazifasi. Ustun, tip va migratsiya S2'da yoziladi.

| Jadval | Vazifasi |
|--------|----------|
| `foydalanuvchilar` | Telegram ID, ism, til, mavzu, birliklar, 18+ tasdig'i |
| `profillar` | Yosh, bo'y, jins, faollik darajasi, maqsad, ovqat afzalliklari |
| `vazn_yozuvlari` | Vazn o'lchovlari tarixi va maqsad vazn |
| `rejalar` | Hisoblangan kunlik kaloriya va makro maqsadlari, hisoblangan sana |
| `ovqat_yozuvlari` | Jurnalga tushgan har bir ovqat: taom, porsiya, kaloriya, makrolar, vaqt, ovqat turi |
| `taomlar` | Umumiy taom bazasi — nomi uch tilda, taxminiy kaloriya va makrolar |
| `taom_takliflari` | Foydalanuvchi tuzatishlari, admin tasdiqlash navbati |
| `rasmlar` | Ovqat rasmlari va ular qaysi yozuvga tegishli ekani |
| `skan_hisobi` | AI skan sarfi: FREE umumiy limiti va PRO kunlik limiti |
| `obunalar` | PRO holati, tarif, boshlanish va tugash sanasi |
| `tolovlar` | Click, Payme va Telegram Stars tranzaksiyalari |
| `retseptlar` | Retsept kutubxonasi: nomi, kaloriya, oqsil, tayyorlash vaqti, murakkablik, kategoriya |
| `kunlik_xulosa` | Kunlik jami kaloriya, makrolar va Nutrition Score |
| `bildirishnomalar` | Eslatma sozlamalari va yuborilgan xabarlar |

## 8. Qoidalar

**Narxlar:** 39,000 so'm/oy · 170,000 so'm/6 oy · 290,000 so'm/yil (yillik tavsiya
etiladi, oylik ekvivalenti va tejash ko'rsatiladi).

**To'lov:** Click, Payme va Telegram Stars. Har safar qo'lda to'lanadi — avtomatik
takroriy yechish yo'q. Muddat tugashidan oldin bildirishnoma yuboriladi.

**Bekor qilish:** istalgan vaqt. To'langan pul qaytarilmaydi, PRO muddat oxirigacha
ishlaydi. Muddat tugagach butun tarix, jurnal va progress o'qish uchun ochiq qoladi —
faqat yangi AI skan va retseptlarning to'liq matni yopiladi.

**Limitlar:** FREE — umr davomida jami 3 ta AI skan. PRO — kuniga 20 ta skan
(interfeysda "limitsiz", ichkarida adolatli foydalanish chegarasi).

**Nutrition Score:** formula — kaloriya normaga yaqinlik va makro balans. AI baholamaydi.
Bu axborot xarakteridagi ball, tibbiy baho emas.

**Holatlar zanjiri:**

- Ovqat yozuvi: `tahlil qilinmoqda` -> `tasdiq kutilmoqda` -> `tasdiqlandi` ->
  `tahrirlandi` -> `o'chirildi`. Tasdiqlanmagan yozuv kunlik jamiga qo'shilmaydi.
- AI tahlil: `yuborildi` -> `natija tayyor` yoki `tanib bo'lmadi` yoki `xato`.
- Obuna: `yo'q (FREE)` -> `faol` -> `muddati tugadi`.
- To'lov: `boshlandi` -> `to'landi` yoki `bekor qilindi` / `xato`.
- Taom taklifi: `yuborildi` -> `ko'rib chiqilmoqda` -> `tasdiqlandi` yoki `rad etildi`.

**Oflayn va xato:** internet yo'q yoki AI javob bermasa — xato ekrani va "Qayta urinish".
Rasm oflayn navbatga olinmaydi. Yuklangan rasm AI xatosida o'chirilmaydi — "Qayta urinish"
qayta yuklashsiz ishlaydi; foydalanuvchi bekor qilsa yoki natijani tasdiqlamasa, egasiz
qolgan rasm tozalanadi ([DECISIONS.md](DECISIONS.md), 2026-09-20).

**Ma'lumot va maxfiylik:** ovqat rasmlari doimiy saqlanadi va jurnalda ko'rinadi.
Rasmlar tahlil uchun uchinchi tomon AI xizmatiga yuboriladi — bu Privacy Policy'da ochiq
yoziladi. Hisobni o'chirish tasdiqlash oynasi bilan bo'ladi.

**Yuridik:** YaTT sifatida ro'yxatdan o'tiladi. Qo'llaniladigan qonun — O'zbekiston
Respublikasi.

## 9. Ochiq savollar

| # | Savol | Qachon hal qilamiz |
|---|-------|--------------------|
| 1 | North star metrika tanlanmagan — DAU, PRO obunachilar va 7-kun retention uchalasi ham tanlandi, bittasi asosiy bo'lishi kerak | S1, analitika o'rnatilayotganda |
| 2 | Birlik iqtisodiyoti: bitta AI skan tannarxi qancha va 39,000 so'mlik obuna kuniga 20 ta skanni qoplaydimi | S1, AI provayderi tanlanganda |
| 3 | V2 tarkibi va muddati — haftalik hisobot, eksport, avtomatik to'lov, o'tgan kunlarga yozuv qachon qaytadi | V1 ishga tushgach, birinchi ma'lumotlar asosida |
| 4 | Retseptlarning boshlang'ich soni — admin qo'lda nechta retsept bilan ishga tushadi | Kontent sprintida |
| 5 | Bildirishnoma jadvali — nonushta, tushlik, kechki ovqat va suv eslatmalari qaysi vaqtda yuboriladi | S5, Telegram sprintida |

## 10. V1'ga kirmaydiganlar

- Haftalik hisobot va chuqur progress analitikasi (o'rtacha makrolar, eng ko'p yeyilgan
  taomlar, Score o'rtachasi). V1'da faqat vazn grafigi, streak va kuzatilgan kunlar.
- Ma'lumot eksporti (PDF, CSV).
- Murabbiy va nutritsiolog roli.
- Avtomatik takroriy to'lov (karta tokenizatsiyasi).
- Oflayn navbat — rasmni keyin yuborish.
- O'tgan kunlarga ovqat qo'shish.
- Brauzer versiyasi, App Store va Play Market ilovasi.
- Auditoriya segmentlariga alohida onboarding va copywriting.
- **Ovozli kiritish, mikrofon tugmasi, nutqni matnga aylantirish — hech qachon,
  hech qayerda.** Ovqat kiritish faqat kamera, galereya va qo'lda matn.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
