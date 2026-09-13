# DESIGN — Kalori

Ish hujjati. Tanlangan yo'nalish: **A — qat'iy asbob**. Monoxrom asos, bitta lime aksent,
soyasiz yuzalar. Ovqat rasmi ekrandagi yagona rangli element bo'lib qolishi kerak —
interfeys u bilan urushmaydi.

Ekranlar va oqim: [dizayn-tz.md](dizayn-tz.md).

## 1. Ranglar

### Yorug' mavzu

| Token | Hex | Qayerda |
|---|---|---|
| `--siyoh` | `#0B0B0C` | Asosiy matn, katta raqamlar, asosiy tugma foni |
| `--aksent` | `#C6F04C` | Kunlik doira yoyi, "AI taxmini" belgisi, faol holat |
| `--fon` | `#F2F2F3` | Sahifa foni |
| `--karta` | `#FFFFFF` | Karta va panel yuzasi |
| `--matn-2` | `#6B6B70` | Ikkilamchi matn, izoh, birlik ("kkal", "g") |
| `--matn-3` | `#A1A1A6` | Placeholder, o'chgan holat |
| `--chegara` | `#E3E3E5` | 1px hairline, doiraning to'lmagan qismi |
| `--xato` | `#D93A3A` | Xato matni va tekshiruv xatosi |

Aksent ustidagi matn — `#2E3D07` (o'sha oilaning to'q soyasi). Qora ham, oq ham emas.

### Qorong'i mavzu

| Token | Hex |
|---|---|
| `--siyoh` | `#F2F2F3` |
| `--aksent` | `#C6F04C` (o'zgarmaydi) |
| `--fon` | `#0B0B0C` |
| `--karta` | `#161618` |
| `--matn-2` | `#8A8A8F` |
| `--matn-3` | `#5C5C61` |
| `--chegara` | `#26262A` |
| `--xato` | `#FF6B6B` |

Har rang faqat token orqali chaqiriladi. Kodda qotirilgan hex bo'lmaydi — aks holda
qorong'i mavzu S2'da sinadi.

### Aksent qoidasi

**Bitta ekranda bitta lime to'ldirilgan element.** Home'da bu — doira yoyi; E5 va E7'da —
tasdiq tugmasi. Lime matn rangi sifatida ishlatilmaydi (oq fonda kontrast yetmaydi).

Rang holatni yolg'iz o'zi bildirmaydi — yonida doim matn yoki belgi turadi
(rang ko'rmaydigan foydalanuvchi uchun).

## 2. Shriftlar

**Inter Tight** — sarlavha va raqam · **Inter** — matn. Ikkalasi kirill va lotinni
qoplaydi (ruscha interfeys uchun shart). `latin`, `latin-ext`, `cyrillic` subsetlari
yuklanadi, boshqasi emas.

| Rol | O'lcham / qalinlik | Izoh |
|---|---|---|
| Doira raqami | 44 / 600 | Inter Tight, `letter-spacing: -0.03em` |
| Ekran sarlavhasi | 24 / 600 | Inter Tight, `-0.02em` |
| Karta sarlavhasi | 17 / 600 | |
| Asosiy matn | 15 / 400 | `line-height: 1.5` |
| Izoh va birlik | 13 / 400 | `--matn-2` |
| Belgi (badge) | 11 / 500 | katta harf emas, oddiy yozuv |

**Qalinlik faqat uchta: 400, 500, 600.** 700 ishlatilmaydi — og'ir ko'rinadi.

Barcha raqamda `font-variant-numeric: tabular-nums`. Busiz doira yangilanganda son
sakraydi va animatsiya titraydi.

Matn **gap boshi** uslubida: "Jurnalga qo'shish", "Ovqat qo'shish" — "Jurnalga Qo'shish"
emas, KATTA HARF ham emas.

## 3. Burchak radiusi

| Qiymat | Qayerda |
|---|---|
| `12px` | Chip, kichik belgi, rasm mitti ko'rinishi |
| `20px` | Karta, ro'yxat elementi, kiritish maydoni |
| `28px` | Bottom sheet, modal |
| `999px` | Tugma, tabletka shaklidagi belgi |

Oraliq qiymat yo'q — 16 yoki 24 ishlatilmaydi. Ichma-ich joylashganda ichkarisi
tashqarisidan 8 kichik bo'ladi (karta 20 -> ichidagi rasm 12).

## 4. Bo'shliq

Asos — **4px**. Ruxsat etilgan qiymatlar: `4 · 8 · 12 · 16 · 24 · 32 · 48`.
Boshqa son yozilmaydi (6, 10, 14, 18 yo'q).

| Qoida | Qiymat |
|---|---|
| Ekran chekkasi (chap va o'ng) | 16 |
| Karta ichidagi to'ldirish | 16 |
| Ikki karta orasi | 12 |
| Ikki blok orasi (masalan doira va ovqatlar ro'yxati) | 24 |
| Sarlavha va uning tarkibi orasi | 8 |
| Matn va uning izohi orasi | 4 |
| Pastki panel ustidagi bo'sh joy | 24 + xavfsiz zona |

**Bosish maydoni kamida 44 × 44 px.** Ikona 20px bo'lsa ham atrofidagi bosiladigan joy
44 gacha kengaytiriladi.

## 5. Yuzalar va chuqurlik

Soya **ishlatilmaydi**. Chuqurlik uch narsadan chiqadi: fon va karta rangi farqi,
1px `--chegara` chizig'i, bo'shliq.

Yagona istisno — suzuvchi pastki panel va "+" tugmasi: `0 4px 16px rgba(0,0,0,0.08)`.

Gradient, blur, neon, uch o'lchovli effekt yo'q.

## 6. Komponent qoidalari

**Kunlik doira.** Qalinligi 14px, uchlari yumaloq, soat 12 dan boshlanadi va soat yo'nalishi
bo'yicha to'ladi. To'lmagan qismi `--chegara`. Markazda ikki qator: katta raqam va ostida
`2,190 dan` (13/400, `--matn-2`). Normadan oshsa yoy `--xato` rangiga o'tadi va tagida
bitta qator izoh chiqadi — hech qanday ogohlantirish oynasi yo'q.

**Tugmalar.** Asosiy — `--siyoh` fon, oq matn, radius 999, balandligi 52. Ikkilamchi —
shaffof fon, 1px chegara. Uchinchi daraja — faqat matn. Ekranda bitta asosiy tugma.
Bosilganda `scale(0.98)`.

**Kartalar.** `--karta` fon, radius 20, to'ldirish 16, chegara faqat yorug' mavzuda.

**"AI taxmini" belgisi.** Lime fon, `#2E3D07` matn, radius 999, 11/500. AI chiqargan har
qanday raqam yonida turadi — jurnalda ham, tahrir ekranida ham.

**Skeletlar.** `--chegara` rangida, radius o'z komponentiniki, 1.5 s pulsatsiya. Aylanuvchi
indikator faqat tugma ichida va kamera ekranida.

**Rasm.** Nisbat 4:3, radius 12, yuklanmaguncha `--chegara` fonli joy egallab turadi —
ro'yxat sakramasligi uchun.

## 7. Ohang

Interfeys matni — sokin, aniq, ortiqcha quvonchsiz.

| Shunday | Bunday emas |
|---|---|
| "Jurnalga qo'shildi" | "Ajoyib! Muvaffaqiyatli qo'shildi 🎉" |
| "Taomni aniq taniy olmadik" | "Xatolik yuz berdi (500)" |
| "Bugun hali hech narsa qo'shilmadi" | "Ma'lumot yo'q" |
| "Raqamlar taxminiy" | "Aniq hisoblangan" |

- Undov belgisi ishlatilmaydi. Emoji interfeysda yo'q (ovqat rasmi bor).
- Texnik matn foydalanuvchiga ko'rsatilmaydi: kod, stack, "error", "null".
- Har xato matni ikki qismdan: nima bo'ldi + nima qilish kerak.
- Foydalanuvchi ayblanmaydi: "Rasm noto'g'ri" emas, "Bu rasmdan taomni ajrata olmadik".
- Raqam ko'rsatilgan joyda "taxminiy" so'zi yo'qolmaydi — mahsulot pozitsiyasi shunga
  bog'liq (PRD 2-bo'lim).

## 8. Harakat

Qisqa va kam. `--tez: 150ms`, `--asos: 250ms`, egri chiziq `cubic-bezier(0.2, 0, 0, 1)`.

Animatsiya faqat uch joyda: doiraning to'lishi (600ms, E8'dagi asosiy lahza), bottom
sheet ochilishi, sahifa o'tishi. Qolgan hamma joyda oniy.

`prefers-reduced-motion` hurmat qilinadi — doira raqami animatsiyasiz darhol yangilanadi.

## 9. Tekshiruv ro'yxati

Har ekran topshirilishidan oldin:

- [ ] Yorug' va qorong'i mavzuda ochib ko'rildi
- [ ] Uch tilda matn sig'di — ruscha matn o'zbekchadan ~20% uzun bo'ladi
- [ ] Barcha bosiladigan element 44px dan katta
- [ ] Kodda qotirilgan hex va qotirilgan matn yo'q
- [ ] Bo'sh, yuklanmoqda va xato holatlari ishlaydi
- [ ] Ekranda bitta lime to'ldirilgan element va bitta asosiy tugma
- [ ] Kichik telefonda (360px) tekshirildi

## 10. Ochiq savol

Fon `#F2F2F3` sovuq kulrang. O'zbek taomi rasmlari (osh, somsa, non — sarg'ish va iliq)
sovuq fonda kir ko'rinishi mumkin. S2'da haqiqiy rasmlar bilan tekshiriladi; kerak bo'lsa
fon `#F5F3F0` ga iliqlashtiriladi — bu qolgan tokenlarni o'zgartirmaydi.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
