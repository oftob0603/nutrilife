# SPRINT 2 — xotira

**Maqsad:** Ma'lumot modeli to'lsin, rasm yuklash ishlasin va AI skan oqimi birinchi
marta boshidan oxirigacha o'tsin.

**Savol:** Eslab qoladimi?

## Tasklar

- [x] PRD'dagi to'liq ma'lumot modelini migratsiya bilan qo'shish: `foydalanuvchilar`, `profillar`, `vazn_yozuvlari`, `rejalar`, `rasmlar`, `kunlik_xulosa` — S1'dagi mavjud yozuvlar omon qolsin. `ovqat_yozuvlari` ga `manba` (qo'lda / AI) va rasm bog'lanishi qo'shiladi; `foydalanuvchi_id` hozircha matn (`s1-sinov`) bo'lib qoladi, tashqi kalitga S3'da aylanadi
- [x] `taomlar` bazasini kengaytirish: nomi uch tilda (o'zbek, rus, ingliz) + kamida 30 ta o'zbek taomi (osh, manti, somsa, lag'mon, norin, dimlama, mastava, shurpa, chuchvara, qozonkabob, non va salatlar). S1'dagi 8 ta taom va tuzilma saqlanadi (o'lchov miqdori, o'lchov birligi, porsiyalar ro'yxati); taom rasmi maydoni qo'shiladi — ro'yxat, E5, E8 va Home'dagi bo'sh rasm o'rinlari to'ladi
- [x] Rasm yuklash va ombor: kamera (E3) va galereyadan rasm olish, serverga yuborish, `rasmlar` jadvaliga bog'lash. S1'dagi E2 panelida (`QoshishPaneli`) o'chgan turgan Kamera va Galereya qatorlari faollashadi. Ombor — Cloudflare R2 (DECISIONS 2026-09-20): Vercel'da doimiy disk yo'q; R2 kalitlari Vercel Environment Variables'da. R2 S3-mos API bilan ishlaydi — klient kutubxonasi yangi dependency, qo'shishdan oldin so'raladi
- [x] AI skan API yo'li: `POST /api/skan` — rasm yoki matn qabul qiladi, taom nomi, taxminiy porsiya, kaloriya va makrolarni qaytaradi. E4 qidiruvining "topilmadi" holatiga "Matn bilan tasvirlash" va "Rasmga olish" chiqish yo'llari qo'shiladi (S1'da o'rnida "S2'da ochiladi" matni turibdi). AI kaliti Vercel Environment Variables'da
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

- 2026-09-20: 6 ta yangi model (foydalanuvchilar, profillar, vazn_yozuvlari, rejalar, rasmlar, kunlik_xulosa) va `ovqat_yozuvlari.manba` migratsiya bilan qo'shildi, Railway bazasiga qo'llandi (prisma/schema.prisma, prisma/migrations/20260920083412_s2_malumot_modeli/)
- 2026-09-20: taomlar bazasi uch tilli qilindi va 41 taomga, 35 tasiga rasm qo'shildi; rasm yuklash/ombor (R2) kodi yozildi, jonli kamera sinovi va Vercel R2_* o'zgaruvchilari kutilmoqda (prisma/seed.mjs, app/_components/TaomRasmi.tsx, lib/services/ombor.ts, app/api/rasmlar/, app/kamera/, app/tahlil/)
- 2026-09-20: 3-task yopildi — R2_* o'zgaruvchilari Vercel'ga qo'shildi, production'ga deploy qilindi; foydalanuvchi telefonda galereyadan va jonli kameradan rasm yukladi, `rasmlar` da 3 ta production yozuvi paydo bo'ldi
- 2026-09-20: klientdagi rasm siqish 1600 px / 85% dan 2560 px / 90% ga yumshatildi; 5 MB 4000×3000 rasm 2560×1920, ~1,2 MB bo'lib yuklandi (lib/services/rasm-yuklash.ts)
- 2026-09-20: 4-task yopildi — `POST /api/skan` (matn va rasm, Claude API), kunlik skan chegarasi va E4'dan matn/rasm bilan tasvirlash oqimi qo'shildi (app/api/skan/route.ts, lib/services/ai.ts, lib/services/skan.ts, lib/services/skan-hisob.ts, lib/services/skan-hisobi.ts, app/tasvirlash/)

## Handoff

S1'dan meros: API yo'llari `/api/taomlar`, `/api/taomlar/[id]`, `/api/ovqat-yozuvlari` tayyor; klient komponent
ishlatadigan sof hisob `lib/services/*-hisob.ts` da turadi — bazaga ulanadigan modulni klientga import qilma.
S2 ekranlari (E3 kamera, E6 AI tahlil, E7 AI natija tasdiq/tahrir, E9 jurnal,
E10 yozuv tahriri) uchun dizayn-tz.md va DESIGN.md tayyor, boshlashda shulardan foydalan.

Keyingi: 5-task — AI tahlil ekrani (E6). `/tahlil/[rasmId]` sahifasi hozir faqat rasmni ko'rsatadi; u `POST /api/skan` `{rasmId}` ga ulanadi. Klient uchun tiplar va `skanJami` lib/services/skan-hisob.ts da (sof, klientga import qilsa bo'ladi); lib/services/ai.ts, skan.ts, skan-hisobi.ts ni klientga import qilma.
/tasvirlash dagi sodda natija kartasi vaqtinchalik — E6/E7 qurilganda shu oqimga ulanadi.
Foydalanuvchi vaznni kiritib aniqroq javob olishi (vaznGramm) API'da tayyor, UI'si tasdiqlash ekranida (6-task).
Haiku o'zbekcha nomlarda ba'zan imlo xatosi qiladi ("gushti"); Gemini'ga o'tishda 20 taomlik aniqlik testi bilan birga baholanadi.
Next.js 16 bir papkada ikkinchi `next dev` ga ruxsat bermaydi; `prisma generate` dan keyin dev server qayta ishga tushirilishi SHART (eski klient yangi modelni ko'rmaydi).
`rasmlar` va R2'da endi 7 ta yetim sinov rasmi (oldingi 6 + osh.webp sinovi) — o'chirish foydalanuvchi ruxsatini kutmoqda.
Chatda oshkor bo'lgan eski Claude API kaliti almashtirildi (foydalanuvchi yangisini .env va Vercel'ga qo'ydi); eski kalit Console'da bekor qilinganini foydalanuvchi tasdiqlashi kerak.
Doiradan tashqarida qolgan: tasdiqlanmay qolgan yetim rasmlarni tozalash va AI xatosida rasmni o'chirish (PRD 8-bo'lim) — 5-taskdan keyin; rasmni yozuvga bog'lash — 6-taskda.
`GET /api/ovqat-yozuvlari` javobida `manba` hali chiqmaydi — AI tasdiq/jurnal tasklarida qo'shiladi.
Yangi migratsiya `prisma migrate dev --create-only` bilan yaratilib, SQL o'qilgach `prisma migrate deploy` bilan qo'llanadi.
Kamera (E3) suratni video kadrdan oladi — telefonda odatda 1280×720; sifatni oshirish (yuqoriroq o'lcham so'rash, Android'da `takePhoto`) ochiq, foydalanuvchi hali so'ramagan.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
