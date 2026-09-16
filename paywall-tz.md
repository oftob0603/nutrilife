# PAYWALL TZ — obuna tariflari va to'lov

PRO obunaga o'tish yo'li: tariflar ekrani, to'lov usuli, to'lov natijasi. Manba:
PRD 8-bo'lim (narxlar, to'lov, bekor qilish, holatlar zanjiri) va ROADMAP tarmoqlari.

Bu hujjat [onboarding-tz.md](onboarding-tz.md) O13 va [profil-tz.md](profil-tz.md) F1
havola qiladigan ekranlarni yopadi.

## 1. Kirish nuqtalari

Paywall to'rt joydan ochiladi va **har biriga sarlavha moslashadi**:

| Qayerdan | Sarlavha | Izoh |
|---|---|---|
| Onboarding oxiri (O13) | "Kalori PRO bilan ko'proq" | Bir marta, majburiy emas |
| Profil kartasi (F1) | "Kalori PRO" | Foydalanuvchi o'zi kelgan |
| Skan limiti tugadi (E2) | "Bepul skanlar tugadi" | Eng kuchli lahza — odam aynan skan qilmoqchi edi |
| Retsept to'liq matni (S6) | "Retseptlar PRO ichida" | Retsept sarlavhasi ochiq qoladi |

**"Hozir emas" tugmasi hamma joyda bor** (PRD 5-bo'lim). Paywall hech qachon
tupik bo'lmaydi — FREE foydalanuvchi qo'lda kiritish bilan mahsulotdan to'liq
foydalanaveradi.

## 2. Ekranlar

### W1 — Tariflar

**Vazifasi:** PRO nima berishini ko'rsatish va tarif tanlatish.

**Elementlar:**

1. Sarlavha — kirish nuqtasiga qarab (yuqoridagi jadval)
2. PRO nima beradi — to'rt qator, belgisi bilan:
   - Kuniga 20 tagacha AI skan (FREE: umr bo'yi 3 ta)
   - Retseptlarning to'liq matni
   - Nutrition Score
   - Qolgan kaloriyaga mos taom takliflari
3. **Uch tarif kartasi:**

| Tarif | Narx | Kartada ko'rsatiladi |
|---|---|---|
| Oylik | 39,000 so'm | "39,000 so'm / oy" |
| 6 oylik | 170,000 so'm | "≈28,300 so'm / oy · 27% tejash" |
| Yillik | 290,000 so'm | "≈24,200 so'm / oy · 38% tejash" · **"Tavsiya etiladi"** belgisi |

4. Mayda matn: "Avtomatik yechish yo'q. Muddat tugagach o'zingiz uzaytirasiz."
5. Havolalar: Foydalanish shartlari · Maxfiylik siyosati
6. Asosiy tugma: "Davom etish" · Ikkinchi darajali: "Hozir emas"

**Qoidalar:**

- Narxlar **admin panelidan keladi** ([admin-tz.md](admin-tz.md) A12), kodda qotirilmaydi
- Yillik tarif oldindan tanlangan holda keladi (PRD 8-bo'lim — yillik tavsiya etiladi)
- Tejash foizi narxlardan **hisoblanadi**, qo'lda yozilmaydi — narx o'zgarsa foiz ham
  o'zgaradi
- Muddati tugagan PRO uchun sarlavha: "PRO ni tiklash"

**Navigatsiya:** Davom etish -> W2 · Hozir emas -> kelingan ekran (Home yoki Profil).

**Holatlar:** yuklanmoqda (narxlar kelgunicha) — tarif kartalari skelet · xato —
"Tariflarni yuklab bo'lmadi" + qayta urinish, "Hozir emas" ishlayveradi.

### W2 — To'lov usuli

**Vazifasi:** Uch to'lov usulidan birini tanlash.

- Tepada tanlangan tarif va summa: "Yillik · 290,000 so'm"
- Uch tugma: **Click** · **Payme** · **Telegram Stars**
- Har birida logotip va bir qator izoh
- Pastda: "To'langan pul qaytarilmaydi" + shartlarga havola
- Orqaga — W1 ga (tarif o'zgartirish uchun)

**Telegram Stars haqida ogohlantirish:** Stars narxi so'mda emas, `XTR` birligida
belgilanadi. Ya'ni 290,000 so'm uchun Stars miqdori alohida kiritilishi kerak — bu
narxlar jadvalida **to'rtinchi ustun** bo'ladi (admin panelda A12). Kursni koddan
hisoblash ishonchsiz: Stars kursi o'zgaradi. **Ochiq savol №1.**

### W3 — To'lov jarayoni

- Click va Payme: tashqi to'lov sahifasi ochiladi
- Telegram Stars: Telegram'ning o'z to'lov oynasi ochiladi
- Ilova tomonida kutish ekrani: "To'lov tasdiqlanmoqda…" + bekor qilish havolasi

**Holatlar zanjiri (PRD 8-bo'lim):** `boshlandi` -> `to'landi` yoki
`bekor qilindi` / `xato`.

| Holat | Qachon | Ekranda |
|---|---|---|
| Tasdiqlanmoqda | to'lov tizimi javobini kutyapti | "To'lov tasdiqlanmoqda…" — 60 soniyagacha |
| Uzoq kutish | 60 soniyadan oshdi | "Bu biroz cho'zilmoqda. To'lov o'tgan bo'lsa, PRO avtomatik faollashadi — ilovani yopib turishingiz mumkin." + Home'ga qaytish |
| To'landi | tasdiq keldi | W4 |
| Bekor qilindi | foydalanuvchi oynani yopdi | W5, yumshoq matn bilan |
| Xato | to'lov tizimi rad etdi | W5, sabab bilan |

**Takroriy to'lovdan himoya:** bitta foydalanuvchida bir vaqtda faqat bitta boshlangan
to'lov bo'ladi. Ikkinchisi boshlansa — birinchisi bekor qilinadi. Bo'lmasa odam ikki
marta to'lab qo'yishi mumkin.

### W4 — To'lov muvaffaqiyatli

- Yashil belgi, "PRO faollashdi"
- Muddat: "14-oktabrgacha faol"
- Nima ochilgani — uch qator (skan limiti, retseptlar, Score)
- Tugma: "Davom etish" -> kirish nuqtasiga qaytaradi (skan limitidan kelgan bo'lsa,
  to'g'ridan-to'g'ri kameraga)

### W5 — To'lov amalga oshmadi

- Sarlavha sababga qarab: "To'lov bekor qilindi" yoki "To'lov amalga oshmadi"
- Matn: "Hisobingizdan pul yechilmadi" (bekor qilinganda — bu eng muhim jumla)
- Ikki tugma: "Qayta urinish" (-> W2) · "Hozir emas" (-> kelingan ekran)
- Texnik xato kodi ko'rsatilmaydi

## 3. Obuna qoidalari

Bu qoidalar PRD 8-bo'limdan keladi va ekranlarda ochiq yoziladi:

| Qoida | Qayerda ko'rsatiladi |
|---|---|
| Avtomatik takroriy to'lov yo'q | W1 mayda matni, W4 |
| To'langan pul qaytarilmaydi | W2, bekor qilish oynasi (F4) |
| Bekor qilinsa PRO muddat oxirigacha ishlaydi | F4 bekor qilish oynasi |
| Muddat tugagach tarix va jurnal ochiq qoladi | F1 kartasi, F4 |
| Muddat tugashidan oldin eslatma | Bot orqali, S5 |
| PRO limiti kuniga 20 skan | W1'da "Kuniga 20 tagacha" deb aniq yoziladi |

**"Limitsiz" so'zi ishlatilmaydi.** PRD interfeysda "limitsiz" deyish mumkinligini
aytadi, lekin ichkarida kuniga 20 ta chegara bor. 21-skanda "limit tugadi" degan xabar
chiqsa, "limitsiz" deb sotilgan mahsulot yolg'on bo'lib qoladi. Aniq son yozilsa,
keyin shikoyat ham bo'lmaydi.

## 4. Sprint bo'yicha

| Sprint | Nima |
|---|---|
| S4 | Skan limitlari ishlaydi; limit tugaganda paywall ochiladi (hozircha faqat W1, to'lovsiz) |
| To'lov tarmog'i (S4 dan keyin, S5 bilan parallel) | W2, W3, W4, W5 — Click, Payme, Telegram Stars |
| S5 | Muddat tugashi eslatmasi bot orqali |
| S6 | Retsept to'liq matni uchun kirish nuqtasi |

**Huquqiy shart:** Click va Payme shartnomasi Privacy Policy va Terms of Use'siz
tuzilmaydi (ROADMAP, SAVALA 3-sharti). Ya'ni hujjatlar **to'lov integratsiyasidan
oldin** tayyor bo'lishi kerak.

## 5. Bu TZ'da YO'Q

Admin paneldagi narx o'zgartirish (A12'da) · to'lov tizimlari bilan texnik
integratsiya tafsilotlari · chek va soliq masalalari · promo-kod va chegirmalar.

## 6. Ochiq savollar

| # | Savol | Qachon |
|---|---|---|
| 1 | Telegram Stars narxi qanday belgilanadi — admin panelda alohida ustunmi yoki kurs orqali hisoblanadimi | To'lov sprintidan oldin |
| 2 | Promo-kod v1'da kerakmi — birinchi 100 foydalanuvchi uchun chegirma rejalashtirilganmi | To'lov sprintida |
| 3 | Chek (fiskal hujjat) YaTT uchun majburiymi — Click va Payme buni o'zi beradimi | Huquqiy tekshiruv bilan |
| 4 | Skan limiti tugaganda paywall darhol ochilsinmi yoki avval "qo'lda qo'shish" taklif qilinsinmi | S4, birinchi foydalanuvchilardan keyin |

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
