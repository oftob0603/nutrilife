# SPRINT 1 — kesim

**Maqsad:** Yurak amalni boshidan oxirigacha bitta vertikal kesimda ishlatib ko'rish —
taom tanlash ekrani -> jurnalga yozish -> kunlik doira to'lishi -> jonli domen.

**Savol:** Ishlaydimi?

## Tasklar

- [ ] `taomlar` jadvali (Prisma, minimal maydonlar: nomi, porsiya grammi, kaloriya, oqsil, yog', uglevod) + 4 ta seed yozuv: osh, manti, somsa, non
- [ ] Taomlar ro'yxati sahifasi — seed'dagi 4 ta taom karta ko'rinishida chiqadi
- [ ] Taom detal ekrani: porsiya tanlash (masalan 150 g / 250 g / 350 g), tanlangan porsiyaga qarab kaloriya qayta hisoblanadi, hech qanday tekshiruv yo'q
- [ ] `ovqat_yozuvlari` jadvali (minimal: taom, porsiya, kaloriya, makrolar, vaqt) va yozuv yaratadigan bitta API yo'li: `POST /api/ovqat-yozuvlari`
- [ ] Home sahifasi — kunlik doira: bugungi jami kaloriya / qat'iy belgilangan norma (masalan 2,190 kkal, hozircha kodda yozilgan son) va uch makro chizig'i
- [ ] Tasdiq ekrani: yozuv qo'shilgandan keyin "qo'shildi" xabari va Home'ga qaytish
- [ ] Deploy: Hetzner + Caddy + GitHub Actions — mahsulot o'z domenida ochiladi

## Qabul mezoni

- Domen ochilganda taomlar ro'yxatida 4 ta taom ko'rinadi
- Taomga bosilganda porsiya tanlash ochiladi va kaloriya porsiyaga qarab o'zgaradi
- "Jurnalga qo'shish" bosilgandan keyin Home doirasi to'ladi (masalan 0 / 2,190 -> 620 / 2,190)
- Sahifa yangilanganda ham yozuv joyida qoladi — ma'lumot bazada
- Telefon brauzerida ekran to'g'ri joylashadi

## Bu sprintda YO'Q

Ro'yxatdan o'tish va rollar · AI skan va rasm yuklash · onboarding · paywall va to'lov ·
Nutrition Score · to'liq ma'lumot modeli · dizayn nafisligi · uch til.

## Hisobot

- 2026-09-13: E1-E10 ekranlar uchun dizayn TZ va dizayn tizimi hujjatlari tayyorlandi (dizayn-tz.md, DESIGN.md)
- 2026-09-16: dizayn-tz.md'ga pastki navigatsiya bo'limi qo'shildi, onboarding-tz.md, admin-tz.md, progress-tz.md, profil-tz.md, paywall-tz.md yaratildi (kod yozilmadi)

## Handoff

Keyingi: S1 tasklarini kod darajasida boshlash — Prisma `taomlar` jadvali va seed'dan.
Ekran talablari uchun dizayn-tz.md (E1, E2, E4, E5, E8) va vizual qoidalar uchun
DESIGN.md tayyor, shulardan foydalanib boshlash mumkin.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
