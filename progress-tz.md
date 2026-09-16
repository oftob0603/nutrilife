# PROGRESS TZ — vazn, streak va kuzatilgan kunlar

Pastki paneldagi **Progress** bo'limi ([dizayn-tz.md](dizayn-tz.md) 2-bo'lim, 3-o'rin).
Manba: PRD 5-bo'lim 11-qadam va [SPRINT-4-chuqurlik.md:17](sprints/SPRINT-4-chuqurlik.md:17).

**Cheklov (PRD'dan):** tibbiy xulosa, BMI talqini va sog'liq bahosi **yo'q**. Sahifa
faqat foydalanuvchining o'z raqamlarini ko'rsatadi, ularni izohlamaydi.

Vizual qoidalar: [DESIGN.md](DESIGN.md)

## 1. Ta'riflar — kodga kirishdan oldin qotiriladi

Bu uch ta'rif keyin o'zgartirilsa, foydalanuvchining streak raqami "o'z-o'zidan"
o'zgarib ketadi. Shuning uchun hozir belgilanadi.

| Tushuncha | Ta'rif |
|---|---|
| **Kuzatilgan kun** | Shu kunda kamida **bitta tasdiqlangan** ovqat yozuvi bor. Tasdiq kutayotgan yoki bekor qilingan natija hisoblanmaydi |
| **Streak** | Ketma-ket kuzatilgan kunlar soni. Bugungi kun yozuv bo'lmasa ham streakni **uzmaydi** — kun tugamagan |
| **Streak uzilishi** | Kun yarim tunda tugaydi va shu kunda yozuv bo'lmasa, ertasiga streak 0 dan boshlanadi |
| **Jami kuzatilgan kunlar** | Ro'yxatdan o'tgandan beri kuzatilgan kunlarning umumiy soni (ketma-ketlik shart emas) |

**Vaqt mintaqasi:** hisob `Asia/Tashkent` bo'yicha yuritiladi. Telegram foydalanuvchining
mintaqasini bermaydi, auditoriya esa O'zbekistonda (PRD 2-bo'lim). Chet elda bo'lgan
foydalanuvchi uchun kun chegarasi siljiydi — bu qabul qilingan cheklov, 7-bo'limdagi
ochiq savol.

Streak "ertaga uziladi" degan ogohlantirish yuborilmaydi. Bu bosim o'tkazish bo'ladi,
mahsulot esa bilim beradi, qo'rqitmaydi.

## 2. Ekranlar

### P1 — Progress bosh ekrani · S4

**Vazifasi:** Foydalanuvchiga vazni qayoqqa ketayotganini va qancha kun kuzatganini
ko'rsatish.

**Elementlar (yuqoridan pastga):**

1. **Vazn kartasi** — joriy vazn katta raqamda, yonida o'zgarish (`−1,4 kg` boshlanishdan
   beri). Ostida: maqsad vazn va unga qolgan farq
2. **"Vazn qo'shish"** — asosiy tugma (P2 ni ochadi)
3. **Vazn grafigi** — oralig'i tanlanadi: 30 kun · 90 kun · Hammasi. Maqsad vazn
   punktir chiziq bilan ko'rsatiladi
4. **Streak kartasi** — joriy streak (`7 kun`) va eng uzun streak
5. **Kuzatilgan kunlar** — jami son va oxirgi 30 kunning katakli ko'rinishi
   (kuzatilgan kun — `--aksent`, bo'sh kun — `--chegara`)
6. **"Vazn tarixi"** havolasi (P3)

**Navigatsiya:**

| Element | Qayerga |
|---|---|
| Vazn qo'shish | P2 — vazn kiritish paneli |
| Grafikdagi nuqta | Ushbu o'lchov sanasi va qiymati (tooltip, ekran almashmaydi) |
| Vazn tarixi | P3 — o'lchovlar ro'yxati |
| Katakdagi kuzatilgan kun | E9 — jurnal, o'sha kun bilan |

**Holatlar:**

| Holat | Qachon | Ekranda |
|---|---|---|
| Yuklanmoqda | ma'lumot kelgunicha | Kartalar skelet ko'rinishida |
| Bo'sh — bitta nuqta | onboardingdan keyin, ikkinchi o'lchov yo'q | Grafik o'rnida: "Ikkinchi o'lchovdan keyin grafik chiziladi" + "Vazn qo'shish" tugmasi. Vazn kartasi joriy vaznni ko'rsatadi |
| Bo'sh — streak yo'q | hali bitta ham yozuv yo'q | Streak kartasida `0 kun` + "Birinchi ovqatni qo'shing" (-> E2) |
| Xato | yuklanmadi | "Ma'lumotni yuklab bo'lmadi" + qayta urinish |

### P2 — Vazn qo'shish · S4

**Vazifasi:** Yangi vazn o'lchovini kiritish — bu oqim hech qayerda yozilmagan edi,
holbuki busiz grafik bir nuqtada qotib qoladi.

**Elementlar:**

- Pastdan chiqadigan panel (radius 28)
- Raqam maydoni, joriy birlikda (kg yoki lb), oxirgi vazn oldindan qo'yilgan
- Sana: **faqat bugun**. O'tgan kunga vazn qo'shilmaydi (PRD 10-bo'lim — o'tgan kunlarga
  yozuv v1'da yo'q)
- Tugma: "Saqlash"

**Qoidalar:**

- Kuniga bitta yozuv. Bugun allaqachon kiritilgan bo'lsa — yangi yozuv yaratilmaydi,
  mavjudi yangilanadi va panel sarlavhasi "Bugungi vaznni yangilash" bo'ladi
- Tekshiruv: 30–300 kg. Oldingi o'lchovdan 5 kg dan ko'proq farq qilsa — tasdiq so'raladi:
  "Oldingi o'lchovdan 6 kg farq qilyapti. To'g'rimi?" (terish xatosini ushlaydi, to'smaydi)
- Saqlangandan keyin **kunlik norma qayta hisoblanadi** (`rejalar` ga yangi yozuv) va
  panel yopilgach bitta qator xabar chiqadi: "Kunlik normangiz yangilandi: 2,190 -> 2,150"

Norma qayta hisoblanishi [onboarding-tz.md](onboarding-tz.md) 5-bo'limdagi formula bilan,
o'sha pastki chegaralar saqlanadi.

**Holatlar:** yuklanmoqda — tugma ichida indikator · xato — "Saqlanmadi. Qayta urinish",
kiritilgan raqam joyida qoladi.

### P3 — Vazn tarixi · S4

- Ro'yxat: sana, vazn, oldingi o'lchovdan farq
- Har yozuvda: tahrirlash va o'chirish
- O'chirishda tasdiq so'raladi. **Onboardingdagi birinchi yozuv o'chirilmaydi** — u
  grafikning boshlang'ich nuqtasi
- Yozuv o'zgarsa yoki o'chsa, norma qayta hisoblanadi

**Holatlar:** bo'sh — bo'lmaydi, kamida bitta yozuv doim bor (onboardingdan).

## 3. Nima ko'rsatilmaydi

| Ko'rsatilmaydi | Sabab |
|---|---|
| BMI raqami va uning talqini ("ortiqcha vazn", "normal") | PRD: tibbiy baho yo'q |
| "Sog'lom vazn oralig'i" chizig'i | O'sha sabab |
| Haftalik o'rtacha makrolar, eng ko'p yeyilgan taomlar, Score o'rtachasi | PRD 10-bo'lim — v2 |
| Boshqa foydalanuvchilar bilan solishtirish, reyting | Mahsulotda musobaqa yo'q |
| Vazn prognozi grafikda | Onboardingda bir marta aytiladi, keyin takrorlanmaydi |

## 4. Sprint bo'yicha

| Sprint | Nima |
|---|---|
| S4 | P1, P2, P3 to'liq. Panelda Progress bo'limi paydo bo'ladi |
| S5 | Streak eslatmasi **yo'q** — faqat ovqat eslatmalari |

## 5. Ochiq savollar

| # | Savol | Qachon |
|---|---|---|
| 1 | Vaqt mintaqasi `Asia/Tashkent` ga qotirilsinmi yoki Sozlamalarga qo'shilsinmi | S4 |
| 2 | Streak faqat ovqat yozuvidan hisoblansinmi yoki vazn kiritish ham kun kuzatilgan hisoblasinmi | S4 |
| 3 | Grafik faqat vaznnimi yoki kunlik kaloriya chizig'i ham qo'shilsinmi | S4, birinchi foydalanuvchilardan keyin |

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
