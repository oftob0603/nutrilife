# PROFIL TZ — profil, sozlamalar va obuna

Pastki paneldagi **Profil** bo'limi ([dizayn-tz.md](dizayn-tz.md) 2-bo'lim, 4-o'rin) va
uning ichidagi ekranlar. Manba: PRD 4-bo'lim (rollar), 8-bo'lim (qoidalar),
[SPRINT-3-auth.md:16-17](sprints/SPRINT-3-auth.md:16).

Vizual qoidalar: [DESIGN.md](DESIGN.md) · Onboarding javoblari: [onboarding-tz.md](onboarding-tz.md)

## 1. Ekranlar

```
F1 Profil
 ├─ F2 Sozlamalar
 │   ├─ F3 Shaxsiy ma'lumot
 │   └─ F5 Hisobni o'chirish
 └─ F4 Obuna
```

### F1 — Profil bosh ekrani · S3

**Vazifasi:** Foydalanuvchi o'zi haqidagi ma'lumotni bir joyda ko'rsin va sozlamalarga
kira olsin.

**Elementlar:**

1. Telegram avatari, ism, ostida "Ilovada 24 kun"
2. **Obuna kartasi** — rolga qarab uch xil:

| Rol | Kartada | Tugma |
|---|---|---|
| FREE | "Bepul reja · 3 tadan 2 ta skan qoldi" | "PRO haqida" (-> paywall) |
| PRO | "PRO · 14-oktabrgacha faol" | "Obunani boshqarish" (-> F4) |
| Muddati tugagan | "PRO muddati tugadi · tarix ochiq qoladi" | "Yangilash" (-> paywall) |

3. Qisqacha ma'lumot: asosiy maqsad · joriy vazn · maqsad vazn · kunlik norma
4. Havolalar ro'yxati: Sozlamalar (F2) · Yordam · Foydalanish shartlari ·
   Maxfiylik siyosati

**Holatlar:** yuklanmoqda — skelet · xato — "Profilni yuklab bo'lmadi" + qayta urinish.

**Muddati tugagan PRO uchun muhim qoida (PRD 8-bo'lim):** butun tarix, jurnal va
progress **o'qish uchun ochiq qoladi**. Faqat yangi AI skan va retseptlarning to'liq
matni yopiladi. Profil ekrani buni ochiq yozadi — foydalanuvchi ma'lumotim yo'qoldi deb
o'ylamasligi kerak.

### F2 — Sozlamalar · S3

Ro'yxat ko'rinishida, har qatorda joriy qiymat o'ngda ko'rinadi.

| Sozlama | Variantlar | Izoh |
|---|---|---|
| Til | O'zbekcha · Русский · English | Tanlangan zahoti interfeys o'zgaradi |
| Mavzu | Yorug' · Qorong'i · Tizim | Standart — tizim |
| Vazn birligi | kg · lb | Faqat ko'rsatish; bazada doim kg |
| Bo'y birligi | sm · ft | Faqat ko'rsatish; bazada doim sm |
| Energiya birligi | kkal · kJ | Faqat ko'rsatish; bazada doim kkal |
| Bildirishnomalar | yoqilgan / o'chirilgan + vaqtlar | S5'da faollashadi |
| Shaxsiy ma'lumot | — | F3 ni ochadi |
| Hisobni o'chirish | — | F5 ni ochadi, qizil matn bilan |

**Birlik qoidasi:** birlik faqat ko'rsatish qatlami. Baza kg, sm va kkal da saqlaydi,
o'girish ekranda bo'ladi. Aks holda eski yozuvlar qaysi birlikda ekani chalkashadi.

### F3 — Shaxsiy ma'lumot · S3

Onboardingda berilgan javoblar shu yerda tahrirlanadi:

- Ism · jins · yosh · bo'y
- Asosiy maqsad · faollik darajasi
- Ovqat afzalliklari · ovqatlanish odatlari
- Maqsad vazn

Tekshiruv qoidalari onboardingdagi bilan **bir xil** ([onboarding-tz.md](onboarding-tz.md)
O5, O6, O7): yosh 18–100, bo'y 120–230, maqsad vazn yo'nalishi tanlangan maqsadga mos
kelishi shart.

**Normaga ta'sir qiladigan maydon o'zgarsa** (jins, yosh, bo'y, maqsad, faollik) —
saqlashdan oldin tasdiq:

> "Kunlik normangiz 2,190 dan 2,240 ga o'zgaradi. Saqlansinmi?"

Tasdiqlangach `rejalar` ga yangi yozuv tushadi. Eski yozuvlar va o'tgan kunlar
**qayta hisoblanmaydi** — o'tgan kun o'sha kundagi norma bilan qoladi.

Joriy vazn bu yerda o'zgartirilmaydi — u Progress bo'limidagi "Vazn qo'shish" orqali
kiritiladi ([progress-tz.md](progress-tz.md) P2), chunki u tarix yozuvi, sozlama emas.

### F4 — Obuna · S4 (to'lov bilan birga)

- Joriy holat, tarif nomi, boshlanish va tugash sanasi
- To'lovlar tarixi: sana, summa, usul (Click / Payme / Telegram Stars), holat
- "Obunani bekor qilish" — qizil, ikkinchi darajali tugma

**Bekor qilish oynasi (PRD 8-bo'lim):** "PRO 14-oktabrgacha ishlaydi. To'langan pul
qaytarilmaydi. Muddat tugagach tarix va jurnal ochiq qoladi, yangi skan va retsept
matni yopiladi." — Tasdiqlash / Bekor qilish.

Avtomatik takroriy to'lov yo'q, shuning uchun "bekor qilish" — bu faqat keyingi
eslatmani o'chirish. Buni matnda aynan shunday tushuntirish kerak.

**Admin qo'lda bergan obuna** ham shu ekranda ko'rinadi, lekin to'lovlar tarixida yozuv
bo'lmaydi — o'rniga "Administrator tomonidan berilgan" qatori ([admin-tz.md](admin-tz.md) A3).

### F5 — Hisobni o'chirish · S3

Ikki qadam:

**Qadam 1 — nima o'chishini ko'rsatish:**

- Profil va shaxsiy ma'lumot · butun ovqat jurnali · barcha rasmlar · vazn tarixi
- Alohida qator: **"Bu amalni qaytarib bo'lmaydi"**
- Faol PRO bo'lsa: "PRO obunangiz tugaydi, pul qaytarilmaydi"

**Qadam 2 — tasdiqlash:**

- Foydalanuvchi "O'CHIRISH" so'zini qo'lda yozadi
- Shundan keyingina tugma faollashadi
- O'chirilgach Telegram'ga qaytariladi va bot orqali bitta xabar yuboriladi

## 2. Holatlar

| Holat | Qachon | Ekranda |
|---|---|---|
| Yuklanmoqda | ma'lumot kelgunicha | Skelet qatorlar |
| Saqlanmoqda | sozlama o'zgartirilganda | Qator o'ngida indikator; qolgan sozlamalar ishlayveradi |
| Xato | saqlanmadi | Qator ostida: "Saqlanmadi. Qayta urinish" — eski qiymat qaytariladi |
| Oflayn | internet yo'q | Sozlamalar o'qish uchun ochiq, o'zgartirish bloklanadi: "Internet yo'q" |
| Bo'sh | to'lovlar tarixi bo'sh (F4) | "Hozircha to'lov yo'q" |

## 3. Bu TZ'da YO'Q

Paywall va narx ekrani (alohida) · to'lov oqimining o'zi · Yordam bo'limining ichki
tarkibi · bot ekranlari (S5) · murabbiy roli.

## 4. Sprint bo'yicha

| Sprint | Nima |
|---|---|
| S3 | F1 (FREE va PRO holatlari), F2, F3, F5 |
| S4 | F4 obuna ekrani, skan limiti hisoblagichi |
| S5 | F2'dagi bildirishnoma sozlamalari faollashadi |

## 5. Ochiq savollar

| # | Savol | Qachon |
|---|---|---|
| 1 | Hisob o'chirilgandan keyin ma'lumot darhol o'chsinmi yoki 30 kun "qaytarish oynasi" bo'lsinmi | Huquqiy tekshiruv bilan (SAVALA 3-sharti) |
| 2 | kJ birligi kerakmi — O'zbekistonda kkal standart, bu maydon bo'sh turishi mumkin | S3 |
| 3 | Ovqat afzalliklari va odatlari S6 gacha hech narsaga ta'sir qilmaydi — F3'da ko'rsatilsinmi yoki yashirilsinmi | S3 |

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
