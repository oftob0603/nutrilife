# Qovurdoq xulosasi

Sana: 2026-09-13

G'oya: O'zbekistondagi 18+ foydalanuvchilar uchun "bu ovqat qancha kaloriya?" savoliga
rasm orqali 3 soniyada javob beradigan va javoblarni kunlik normaga yig'adigan
Telegram Mini App — o'zbek taomlarini taniydigan AI skaneri bilan.

---

## 1. Mahsulot mohiyati

- Yurak amal: kunlik normani ko'rish. Ilova Home ekrani bilan ochiladi — markazda
  kunlik kaloriya doirasi (masalan 1,240 / 2,190 kkal).
- Kanal: faqat Telegram Mini App. Brauzer versiyasi, App Store, Play Market — yo'q.
- Asosiy farq: o'rnatishsiz ishlaydi. Telegram allaqachon ochiq, 2 bosishda kiradi.
  Ikkinchi darajali farq: o'zbek taomlarini taniydi (osh, manti, somsa, lag'mon, norin).
- Muvaffaqiyat o'lchovi: kunlik faol foydalanuvchi (DAU), PRO obunachilar soni va
  7-kunlik retention — uchalasi ham kuzatiladi. Asosiy north star tanlanmagan (ochiq savol).
- Birinchi 10 foydalanuvchi: Telegram va Instagram pulli reklama orqali.
- Pozitsiya: tibbiy xizmat emas. Barcha qiymatlar "taxminiy" deb ko'rsatiladi.

## 2. Foydalanuvchilar va rollar

- Rollar: FREE foydalanuvchi -> PRO foydalanuvchi -> admin.
- Kirish: Telegram initData orqali avtomatik. Telefon, email, parol so'ralmaydi.
- 18+ tekshiruvi: Terms of Use'da yoziladi + onboardingda katakcha belgilanadi.
  Hujjat tekshirilmaydi.
- FREE chegarasi: umr davomida jami 3 ta AI skan. Tugagach faqat qo'lda matn kiritish.
  Retseptlarni to'liq o'qish ham PRO talab qiladi.
- PRO chegarasi: kuniga 20 ta skan (interfeysda "limitsiz", ichkarida adolatli foydalanish).
- Admin: to'liq nazorat — statistika, foydalanuvchilar, obunani qo'lda berish/olib qo'yish,
  taom va retsept bazasini tahrirlash, foydalanuvchini bloklash, ma'lumotini o'chirish,
  shikoyatlar, narxlarni o'zgartirish.
- AI tuzatishlari: foydalanuvchi AI natijasini tuzatsa, tuzatish admin tasdiqlaydigan
  navbatga tushadi. Tasdiqlangach umumiy taom bazasiga qo'shiladi.

## 3. Asosiy oqim

Onboarding: Intro -> til -> ism -> maqsad -> shaxsiy ma'lumot (yosh, bo'y, vazn, maqsad vazn)
-> faollik darajasi -> ovqat afzalliklari -> ovqatlanish odatlari -> motivatsiya ->
AI reja tayyorlash -> natija (2 qadam) -> paywall -> Home.

- Paywall: "Hozir emas" tugmasi bilan o'tkazib yuborish mumkin. Majburiy emas.
- Kunlik norma: Mifflin-St Jeor formulasi (BMR) x faollik koeffitsienti, maqsadga qarab
  tuzatish. Kod bilan hisoblanadi, AI'ga topshirilmaydi. Natija "taxminiy maqsad" deb beriladi.
- Ovqat qo'shish: kamera, galereya, qo'lda matn. Ovozli kiritish hech qayerda yo'q.
- AI natijasi: taom nomi, taxminiy porsiya, kaloriya, oqsil, yog', uglevod + "AI taxmini"
  belgisi va aniqlik bo'yicha ogohlantirish. Foydalanuvchi tasdiqlaydi yoki tahrirlaydi.
  Tasdiqlanmagan natija jurnalga tushmaydi.
- AI ishonchi past bo'lsa: qiymat uydirilmaydi. "Aniq taniy olmadik" + boshqa rasm yoki
  qo'lda qo'shish taklifi.
- Jurnal: faqat bugungi kunga yozuv qo'shiladi. O'tgan kunlar faqat o'qish uchun.
- Nutrition Score: formula — kaloriya normaga yaqinlik + makro balans. AI baholamaydi.
- Retseptlar bazasi: admin qo'lda kiritadi, o'zbek taomlari ustunlik qiladi.
- Internet yo'q yoki AI javob bermasa: xato ekrani + "Qayta urinish". Navbat yo'q,
  rasm saqlanmaydi.
- Telegram bot: faqat kirish nuqtasi — /start, til tanlash (o'zbek, rus, ingliz) va
  "Ilovani ochish" tugmasi. Bildirishnomalar bot orqali yuboriladi. Bot ichida
  ovqat kiritish yo'q, ovoz funksiyasi yo'q.

## 4. Pul va qoidalar

- Narxlar: 39,000 so'm/oy · 170,000 so'm/6 oy · 290,000 so'm/yil (yillik tavsiya etiladi).
- To'lov usullari: Click, Payme, Telegram Stars — uchalasi v1'da.
- To'lov modeli: har safar qo'lda. Avtomatik takroriy yechish (recurring) yo'q.
  Muddat tugashidan oldin bildirishnoma yuboriladi.
- Bekor qilish: istalgan vaqt. To'langan pul qaytarilmaydi, muddat oxirigacha PRO ishlaydi.
- Muddat tugagach: butun tarix, jurnal va progress o'qish uchun ochiq qoladi.
  Faqat yangi AI skan va retseptlarni to'liq o'qish yopiladi.
- Yuridik shaxs: YaTT (yakka tartibdagi tadbirkor) sifatida ro'yxatdan o'tiladi.
- Qo'llaniladigan qonun: O'zbekiston Respublikasi.

## 5. Chegaralar va xavflar

V1'ga KIRMAYDI:
- Haftalik hisobot va chuqur progress analitikasi (o'rtacha makrolar, eng ko'p yeyilgan
  taomlar, Score o'rtachasi). V1'da faqat vazn grafigi, streak va kuzatilgan kunlar qoladi.
- Ma'lumot eksporti (PDF, CSV).
- Murabbiy / nutritsiolog roli.
- Avtomatik takroriy to'lov.
- Oflayn navbat (rasmni keyin yuborish).
- O'tgan kunlarga ovqat qo'shish.
- Retseptlar bo'limi V1'DA QOLADI — PRO ostida. Boshlang'ich to'plam admin tomonidan
  qo'lda kiritiladi.

Eng katta xavflar:
1. AI o'zbek taomini yetarli aniq tanimaydi — osh va manti farqini bilmasa, butun
   qiymat taklifi qulaydi.
2. Talab yo'q — odamlar kaloriya sanashni xohlamaydi, 2-3 kunda tashlab yuboradi.

Maxfiylik va ma'lumot:
- Ovqat rasmlari doimiy saqlanadi va jurnalda ko'rinadi. Bu saqlash xarajati va
  maxfiylik mas'uliyatini oshiradi — Privacy Policy'da aniq yozilishi shart.
- Maxfiy ma'lumotlar: ovqat rasmlari, vazn tarixi, ovqatlanish jurnali, Telegram ID.
- Rasmlar uchinchi tomon AI xizmatiga yuboriladi — bu Privacy'da ochiq aytiladi.
- Hisobni o'chirish tasdiqlash oynasi bilan bo'ladi.

Sog'liq bo'yicha chegara:
- Kasallik aniqlash, davolash, oldini olish, dori tavsiya qilish — yo'q.
- Shifokor yoki dietologni almashtirmaydi. Barcha qiymatlar taxminiy va noto'g'ri bo'lishi mumkin.
- Agressiv vazn tashlash chaqiriqlari va soxta tibbiy statistika ishlatilmaydi.

---

## OCHIQ SAVOLLAR (keyin hal qilamiz)

1. North star metrika tanlanmagan — DAU, PRO obunachilar va 7-kun retention uchalasi ham
   tanlandi. Bittasi asosiy qilib belgilanishi kerak.
   Mo'ljal: S1, analitika o'rnatilayotganda.
2. Birlik iqtisodiyoti hisoblanmagan — bitta AI skan tannarxi qancha va 39,000 so'mlik
   oylik obuna kuniga 20 ta skanni qoplaydimi.
   Mo'ljal: S1, AI provayderi tanlanganda.
3. V2 tarkibi va muddati aniqlanmagan — haftalik hisobot, eksport, avtomatik to'lov,
   o'tgan kunlarga yozuv qachon qaytadi.
   Mo'ljal: v1 ishga tushgach, birinchi ma'lumotlar asosida.
4. Retseptlarning boshlang'ich soni aniqlanmagan — admin qo'lda nechta retsept bilan
   ishga tushadi.
   Mo'ljal: kontent sprintida.
5. Bildirishnoma jadvali aniqlanmagan — nonushta, tushlik, kechki ovqat, suv eslatmalari
   qaysi vaqtda va qanchalik tez-tez yuboriladi.
   Mo'ljal: bildirishnoma sprintida.
