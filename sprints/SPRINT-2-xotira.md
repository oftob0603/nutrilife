# SPRINT 2 — xotira

**Maqsad:** Ma'lumot modeli to'lsin, rasm yuklash ishlasin va AI skan oqimi birinchi
marta boshidan oxirigacha o'tsin.

**Savol:** Eslab qoladimi?

## Tasklar

- [ ] PRD'dagi to'liq ma'lumot modelini migratsiya bilan qo'shish: `foydalanuvchilar`, `profillar`, `vazn_yozuvlari`, `rejalar`, `rasmlar`, `kunlik_xulosa` — S1'dagi mavjud yozuvlar omon qolsin
- [ ] `taomlar` bazasini kengaytirish: nomi uch tilda (o'zbek, rus, ingliz) + kamida 30 ta o'zbek taomi (osh, manti, somsa, lag'mon, norin, dimlama, mastava, shurpa, chuchvara, qozonkabob, non va salatlar)
- [ ] Rasm yuklash va ombor: kamera va galereyadan rasm olish, serverga yuborish, `rasmlar` jadvaliga bog'lash
- [ ] AI skan API yo'li: `POST /api/skan` — rasm yoki matn qabul qiladi, taom nomi, taxminiy porsiya, kaloriya va makrolarni qaytaradi
- [ ] AI tahlil ekrani: "Ovqatingiz tahlil qilinmoqda…" holati, keyin natija — "AI taxmini" belgisi va aniqlik ogohlantirishi bilan
- [ ] Tasdiqlash va tahrirlash ekrani: taom nomi, porsiya, kaloriya, oqsil, yog', uglevod tahrirlanadi. Faqat tasdiqlangandan keyin jurnalga tushadi
- [ ] Jurnal (Meals) sahifasi: yozuvlar bugungi kun bo'yicha guruhlanadi, tepada kunlik jami, har yozuvda rasm, vaqt va makrolar
- [ ] Yozuv amallari: tahrirlash, o'chirish, nusxalash, porsiyani o'zgartirish
- [ ] Mavzu tizimi: yorug', qorong'i va tizim — barcha mavjud ekranlarda ishlaydi

## Qabul mezoni

- Galereyadan osh rasmi yuklanadi va tahlil ekrani chiqadi
- Natijada taom nomi va taxminiy kaloriya ko'rinadi, "AI taxmini" belgisi bor
- Porsiyani 350 g dan 250 g ga o'zgartirilsa kaloriya qayta hisoblanadi
- Tasdiqlanmagan natija Home doirasiga qo'shilmaydi — bekor qilinsa doira o'zgarmaydi
- Jurnal sahifasida yozuv rasmi bilan ko'rinadi
- Qorong'i mavzuga o'tilganda barcha ekran to'g'ri ko'rinadi

## Bu sprintda YO'Q

Ro'yxatdan o'tish va rollar · skan limitlari · Nutrition Score · to'lov · bot.

## Hisobot

<!-- hisobotchi to'ldiradi -->

## Handoff

S2 ekranlari (E3 kamera, E6 AI tahlil, E7 AI natija tasdiq/tahrir, E9 jurnal,
E10 yozuv tahriri) uchun dizayn-tz.md va DESIGN.md tayyor, boshlashda shulardan foydalan.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
