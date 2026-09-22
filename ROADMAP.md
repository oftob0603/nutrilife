# ROADMAP — Kalori

## 1. Magistral

| Sprint | Savol | Natija (shu loyihada) |
|--------|-------|------------------------|
| **S1 — kesim** ✅ 2026-09-20 | Ishlaydimi? | Home ekranida kunlik doira ko'rinadi; qo'lda matn bilan ovqat qo'shilganda doira to'ladi; yozuv PostgreSQL'ga tushadi; mahsulot o'z domenida jonli |
| **S2 — xotira** ✅ 2026-09-20 | Eslab qoladimi? | To'liq ma'lumot modeli; taom bazasi o'zbek taomlari bilan; rasm yuklash va ombor; AI skan oqimi — rasm -> tahlil -> tasdiq -> jurnal; jurnal ro'yxati filtr bilan |
| **S3 — auth** ✅ 2026-09-21 | Kim kirdi? | Telegram initData orqali kirish; FREE, PRO va admin rollari; har foydalanuvchi faqat o'z jurnalini ko'radi; himoyalangan API yo'llari |
| **S4 — chuqurlik** ✅ 2026-09-22 | Haqiqiy hayotda chidaydimi? | Mifflin-St Jeor normasi; Nutrition Score formulasi; skan limitlari (FREE 3, PRO kuniga 20); holatlar zanjiri; AI ishonchi past bo'lgan holat; chegaraviy holatlar |
| **S5 — telegram** | Qo'lda turadimi? | Mini App sifatida to'liq ishlashi; bot kirish nuqtasi va til tanlash; ovqat eslatmalari; fon vazifalari — obuna muddati va kunlik limit yangilanishi |
| **S6 — admin** | Boshqarib bo'ladimi? | Admin paneli; taom takliflari navbati; retsept kiritish; obunani qo'lda berish; statistika; foydalanuvchini bloklash |

## 2. Tarmoqlar

Magistraldan chiqadigan ishlar. Har biri qovurdoq javobidan kelib chiqadi.

- **To'lov integratsiyasi — Click, Payme, Telegram Stars**
  *Sabab:* Blok 4'da uchchala to'lov tizimi ham v1'da bo'lishi aytilgan.
  *Qachon:* S4 dan keyin, S5 bilan parallel.

- **Paywall va obuna ekrani**
  *Sabab:* Blok 3'da paywall "Hozir emas" bilan o'tkazib yuboriladigan qilib belgilangan.
  *Qachon:* To'lov integratsiyasi bilan birga.

- **Obuna muddati tugashi mantig'i**
  *Sabab:* Blok 4 — muddat tugagach butun tarix o'qish uchun ochiq qoladi, faqat yangi
  skan va retsept matni yopiladi.
  *Qachon:* S4, holatlar zanjiri bilan birga.

- **Retseptlar kutubxonasi (PRO ostida)**
  *Sabab:* Blok 2 va 5 — retseptlarni o'qish uchun PRO kerak, baza admin tomonidan
  qo'lda to'ldiriladi.
  *Qachon:* S6, admin paneli bilan birga (kontent kiritish shu yerdan boradi).

- **Taom takliflari navbati**
  *Sabab:* Blok 2 — foydalanuvchi AI natijasini tuzatsa, tuzatish admin tasdiqlaydigan
  navbatga tushadi.
  *Qachon:* S6.

- **Uch til (o'zbek, rus, ingliz)**
  *Sabab:* Blok 1 va 5 — interfeys va taom nomlari uch tilda, bot ham til tanlaydi.
  *Qachon:* S2 dan boshlab bosqichma-bosqich, S5'da bot bilan yakunlanadi.

- **Yorug', qorong'i va tizim mavzusi**
  *Sabab:* Mahsulot talabida barcha ekranlarda mavzu qo'llab-quvvatlanishi belgilangan.
  *Qachon:* S2, interfeys kengayganda.

- **Privacy Policy va Terms of Use sahifalari**
  *Sabab:* Blok 5 — ovqat rasmlari doimiy saqlanadi va uchinchi tomon AI xizmatiga
  yuboriladi; 18+ chegarasi faqat shartnomada yoziladi.
  *Qachon:* S3 dan keyin, to'lovdan oldin. To'lov tizimlari shartnomasiz ulanmaydi.

- **Analitika va north star metrikasi**
  *Sabab:* Blok 1 — DAU, PRO obunachilar va 7-kun retention kuzatiladi.
  *Qachon:* S3'da qo'yiladi (foydalanuvchi ID'si paydo bo'lgach), keyin to'ldiriladi. S1'da qo'yilmadi — kesimda foydalanuvchi yo'q edi. S3'da qo'yildi: `hodisalar` jadvali, north star — 7-kun retention; ko'rsatkichlar ekrani S6 admin panelida.

## 3. Kelajak (v2+)

- Eng ko'p yeyilgan taomlar tahlili (batafsil statistika va haftalik hisobot V1'ga
  o'tdi, DECISIONS 2026-09-22)
- Ma'lumot eksporti: PDF va CSV
- Avtomatik takroriy to'lov (karta tokenizatsiyasi)
- O'tgan kunlarga ovqat qo'shish
- Oflayn navbat — internet kelganda rasmni avtomatik yuborish
- Murabbiy va nutritsiolog roli — mijoz jurnalini ko'rish va izoh yozish
- Auditoriya segmentatsiyasi: ofis xodimi, zal, vazn kuzatuvchi — har biriga alohida
  onboarding va copywriting
- To'liq bot menyusi: /profile, /progress, /settings va bot ichida natija ko'rish

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
