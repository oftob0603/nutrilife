# SPRINT 2 — xotira

**Maqsad:** Ma'lumot modeli to'lsin, rasm yuklash ishlasin va AI skan oqimi birinchi
marta boshidan oxirigacha o'tsin.

**Savol:** Eslab qoladimi?

## Tasklar

- [ ] PRD'dagi to'liq ma'lumot modelini migratsiya bilan qo'shish: `foydalanuvchilar`, `profillar`, `vazn_yozuvlari`, `rejalar`, `rasmlar`, `kunlik_xulosa` — S1'dagi mavjud yozuvlar omon qolsin. `ovqat_yozuvlari` ga `manba` (qo'lda / AI) va rasm bog'lanishi qo'shiladi; `foydalanuvchi_id` hozircha matn (`s1-sinov`) bo'lib qoladi, tashqi kalitga S3'da aylanadi
- [ ] `taomlar` bazasini kengaytirish: nomi uch tilda (o'zbek, rus, ingliz) + kamida 30 ta o'zbek taomi (osh, manti, somsa, lag'mon, norin, dimlama, mastava, shurpa, chuchvara, qozonkabob, non va salatlar). S1'dagi 8 ta taom va tuzilma saqlanadi (o'lchov miqdori, o'lchov birligi, porsiyalar ro'yxati); taom rasmi maydoni qo'shiladi — ro'yxat, E5, E8 va Home'dagi bo'sh rasm o'rinlari to'ladi
- [ ] Rasm yuklash va ombor: kamera (E3) va galereyadan rasm olish, serverga yuborish, `rasmlar` jadvaliga bog'lash. S1'dagi E2 panelida (`QoshishPaneli`) o'chgan turgan Kamera va Galereya qatorlari faollashadi. Ombor — Cloudflare R2 (DECISIONS 2026-09-20): Vercel'da doimiy disk yo'q; R2 kalitlari Vercel Environment Variables'da. R2 S3-mos API bilan ishlaydi — klient kutubxonasi yangi dependency, qo'shishdan oldin so'raladi
- [ ] AI skan API yo'li: `POST /api/skan` — rasm yoki matn qabul qiladi, taom nomi, taxminiy porsiya, kaloriya va makrolarni qaytaradi. E4 qidiruvining "topilmadi" holatiga "Matn bilan tasvirlash" va "Rasmga olish" chiqish yo'llari qo'shiladi (S1'da o'rnida "S2'da ochiladi" matni turibdi). AI kaliti Vercel Environment Variables'da
- [ ] AI tahlil ekrani: "Ovqatingiz tahlil qilinmoqda…" holati, keyin natija — "AI taxmini" belgisi va aniqlik ogohlantirishi bilan
- [ ] Tasdiqlash va tahrirlash ekrani: taom nomi, porsiya, kaloriya, oqsil, yog', uglevod tahrirlanadi. Faqat tasdiqlangandan keyin jurnalga tushadi
- [ ] Jurnal (E9) sahifasi: kun yozuvlari ovqat turi bo'yicha guruhlanadi (nonushta / tushlik / kechki / gazak — S1'da yozuvga yozilyapti), tepada kunlik jami, har yozuvda rasm, vaqt va makrolar. Mavjud `GET /api/ovqat-yozuvlari?sana=` ishlatiladi; Home'dagi "Bugungi ovqatlar" sarlavhasiga "Hammasi" havolasi qo'shiladi
- [ ] Yozuv amallari (E10): tahrirlash, o'chirish, nusxalash, porsiyani o'zgartirish — `PATCH` va `DELETE /api/ovqat-yozuvlari/[id]`. Home va jurnaldagi yozuv qatori (`YozuvQatori`) bosiladigan bo'ladi
- [ ] Mavzu tizimi: yorug', qorong'i va tizim. Tizim mavzusi S1'dan beri ishlaydi (tokenlar `prefers-color-scheme` bo'yicha almashadi); bu yerda qo'lda tanlash va tanlovni eslab qolish qo'shiladi
- [ ] Home to'ldiriladi (E1): haftalik kun tanlagich — tanlangan kun `?sana=` orqali yuklanadi; pastki navigatsiya paneli Home · [+] · Jurnal ko'rinishida, suzuvchi "+" panel markaziga ko'chadi va oqim ichidagi ekranlarda (E5, E8) yashiriladi (dizayn-tz 2-bo'lim)

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

S1'dan meros: API yo'llari `/api/taomlar`, `/api/taomlar/[id]`, `/api/ovqat-yozuvlari` tayyor; klient komponent
ishlatadigan sof hisob `lib/services/*-hisob.ts` da turadi — bazaga ulanadigan modulni klientga import qilma.
S2 ekranlari (E3 kamera, E6 AI tahlil, E7 AI natija tasdiq/tahrir, E9 jurnal,
E10 yozuv tahriri) uchun dizayn-tz.md va DESIGN.md tayyor, boshlashda shulardan foydalan.
`profillar` migratsiyasi uchun onboarding-tz.md 4-bo'limidagi ustunlar ro'yxatiga qara.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
