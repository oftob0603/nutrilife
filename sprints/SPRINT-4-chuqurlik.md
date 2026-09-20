# SPRINT 4 — chuqurlik

**Maqsad:** Biznes qoidalari, holatlar va chegaraviy holatlar haqiqiy foydalanishda
to'g'ri ishlasin.

**Savol:** Haqiqiy hayotda chidaydimi?

## Tasklar

- [ ] Mifflin-St Jeor formulasi: onboarding javoblaridan BMR, faollik koeffitsienti va maqsadga qarab tuzatish. Natija — taxminiy kunlik kaloriya va makro maqsadlari, `rejalar` jadvaliga yoziladi. `lib/norma.ts` dagi qotirilgan S1 normasi (2,190 kkal · 120 / 70 / 240 g) olib tashlanadi — Home doirasi, makro chiziqlari va E8 foydalanuvchining o'z rejasidan o'qiydi
- [ ] Natija oqimi (2 qadam): AI tahlil xulosasi -> "Rejangiz tayyor" ekrani, "nega shunday" izohi va profil ro'yxati bilan. Har joyda "taxminiy" belgisi
- [ ] Nutrition Score formulasi: kaloriya normaga yaqinlik + makro balans, natija `kunlik_xulosa` jadvaliga. Izoh matni: axborot xarakteridagi ball
- [ ] Skan limitlari: FREE — umr davomida 3 ta, PRO — kuniga 20 ta. `skan_hisobi` jadvali, limit tugaganda tegishli ekran. E2 panelida hisoblagich ("3 tadan 2 ta skan qoldi") va limit tugagan holat: Kamera va Galereya o'chadi, Qo'lda qo'shish ochiq qoladi
- [ ] Holatlar zanjiri: ovqat yozuvi (`tahlil qilinmoqda` -> `tasdiq kutilmoqda` -> `tasdiqlandi` -> `tahrirlandi` -> `o'chirildi`) va obuna (`FREE` -> `faol` -> `muddati tugadi`). `ovqat_yozuvlari` ga `holat` ustuni qo'shiladi; S1–S2'da qo'lda qo'shilgan mavjud yozuvlar `tasdiqlandi` deb belgilanadi
- [ ] AI ishonchi past holati: qiymat uydirilmaydi, "Bu taomni aniq taniy olmadik" + "Boshqa rasm" va "Qo'lda qo'shish" tugmalari
- [ ] Xato va chegaraviy holatlar: internet yo'q, AI xizmati javob bermadi, kamera ruxsati berilmadi, bo'sh jurnal, noto'g'ri qiymat kiritildi, o'chirishni tasdiqlash. S1'dan ochiq qolganlari: Home xato kartasiga "Qayta urinish" tugmasi, tepadagi oflayn chizig'i, E5'dagi "Boshqa" porsiya maydonida tekshiruv (S1'da ataylab tekshiruvsiz — nol va manfiy son o'tadi), `POST /api/ovqat-yozuvlari` da qiymat chegaralari
- [ ] Progress sahifasi: joriy va maqsad vazn, vazn grafigi, streak, kuzatilgan kunlar. Tibbiy xulosa va BMI talqini yo'q. Pastki panel Home · [+] · Progress · Profil ko'rinishiga o'tadi (S2'dagi vaqtinchalik Jurnal bo'limi o'rniga)
- [ ] Qolgan kaloriya bo'yicha taom taklifi: "Bugun taxminan 650 kkal qoldi" + mos taom variantlari. E5'da shu hisobga tayangan tavsiya porsiya kartasi (prototipdagi `portionAdvice`, PRO) — Home'dagi "qoldi" qiymati bilan bir manbadan

## Qabul mezoni

- Onboardingdan o'tgan yangi foydalanuvchiga taxminiy kunlik maqsad chiqadi va u `rejalar` jadvalida saqlanadi
- FREE foydalanuvchi 4-marta skan qilmoqchi bo'lsa paywall chiqadi, qo'lda matn bilan qo'shish ochiq qoladi
- Ataylab tanib bo'lmaydigan rasm yuborilsa hech qanday kaloriya ko'rsatilmaydi
- Internetni o'chirib skan qilinsa xato ekrani va "Qayta urinish" chiqadi
- Yozuv o'chirilganda tasdiqlash oynasi chiqadi va doira qayta hisoblanadi
- Nutrition Score kun davomida yozuv qo'shilgani sayin o'zgaradi

## Bu sprintda YO'Q

To'lov integratsiyasi · bot · admin paneli · retseptlar kutubxonasi.

## Hisobot

<!-- hisobotchi to'ldiradi -->

## Handoff

Progress sahifasi (P1-P3, streak va kuzatilgan kun ta'riflari) uchun progress-tz.md,
paywall ekrani (W1) uchun paywall-tz.md, obuna ekrani (F4) uchun profil-tz.md tayyor.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
