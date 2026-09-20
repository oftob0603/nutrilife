# SPRINT 2 — xotira

**Maqsad:** Ma'lumot modeli to'lsin, rasm yuklash ishlasin va AI skan oqimi birinchi
marta boshidan oxirigacha o'tsin.

**Savol:** Eslab qoladimi?

## Tasklar

- [x] PRD'dagi to'liq ma'lumot modelini migratsiya bilan qo'shish: `foydalanuvchilar`, `profillar`, `vazn_yozuvlari`, `rejalar`, `rasmlar`, `kunlik_xulosa` — S1'dagi mavjud yozuvlar omon qolsin. `ovqat_yozuvlari` ga `manba` (qo'lda / AI) va rasm bog'lanishi qo'shiladi; `foydalanuvchi_id` hozircha matn (`s1-sinov`) bo'lib qoladi, tashqi kalitga S3'da aylanadi
- [x] `taomlar` bazasini kengaytirish: nomi uch tilda (o'zbek, rus, ingliz) + kamida 30 ta o'zbek taomi (osh, manti, somsa, lag'mon, norin, dimlama, mastava, shurpa, chuchvara, qozonkabob, non va salatlar). S1'dagi 8 ta taom va tuzilma saqlanadi (o'lchov miqdori, o'lchov birligi, porsiyalar ro'yxati); taom rasmi maydoni qo'shiladi — ro'yxat, E5, E8 va Home'dagi bo'sh rasm o'rinlari to'ladi
- [x] Rasm yuklash va ombor: kamera (E3) va galereyadan rasm olish, serverga yuborish, `rasmlar` jadvaliga bog'lash. S1'dagi E2 panelida (`QoshishPaneli`) o'chgan turgan Kamera va Galereya qatorlari faollashadi. Ombor — Cloudflare R2 (DECISIONS 2026-09-20): Vercel'da doimiy disk yo'q; R2 kalitlari Vercel Environment Variables'da. R2 S3-mos API bilan ishlaydi — klient kutubxonasi yangi dependency, qo'shishdan oldin so'raladi
- [x] AI skan API yo'li: `POST /api/skan` — rasm yoki matn qabul qiladi, taom nomi, taxminiy porsiya, kaloriya va makrolarni qaytaradi. E4 qidiruvining "topilmadi" holatiga "Matn bilan tasvirlash" va "Rasmga olish" chiqish yo'llari qo'shiladi (S1'da o'rnida "S2'da ochiladi" matni turibdi). AI kaliti Vercel Environment Variables'da
- [x] AI tahlil ekrani: "Ovqatingiz tahlil qilinmoqda…" holati, keyin natija — "AI taxmini" belgisi va aniqlik ogohlantirishi bilan
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
- 2026-09-20: 5-task yopildi — AI tahlil ekrani (E6, kutish/natija/taniy olmadik/xato holatlari), egasiz rasm o'chirish (DELETE /api/rasmlar/[id]) va "AI taxmini" belgisi qo'shildi (app/_components/Tahlil.tsx, app/_components/AiBelgisi.tsx, app/tahlil/[rasmId]/page.tsx, app/api/rasmlar/[id]/route.ts, lib/services/rasmlar.ts)

## Handoff

S1'dan meros: API yo'llari `/api/taomlar`, `/api/taomlar/[id]`, `/api/ovqat-yozuvlari` tayyor; klient komponent
ishlatadigan sof hisob `lib/services/*-hisob.ts` da turadi — bazaga ulanadigan modulni klientga import qilma.
S2 ekranlari (E3 kamera, E6 AI tahlil, E7 AI natija tasdiq/tahrir, E9 jurnal,
E10 yozuv tahriri) uchun dizayn-tz.md va DESIGN.md tayyor, boshlashda shulardan foydalan.

Keyingi: 6-task — Tasdiqlash va tahrirlash ekrani (E7). E7 alohida sahifa emas: Tahlil.tsx ga yangi holat bo'lib qo'shiladi (natija React holatida, uzatish muammosi yo'q). Natija holatidagi tugmalar hozir vaqtinchalik ("Qo'lda qo'shish", "Bekor qilish" — ikkalasi rasmni o'chiradi); 6-taskda "Tasdiqlash va qo'shish" asosiy tugma bo'ladi va tasdiqlanganda rasm O'CHIRILMAYDI, yozuvga bog'lanadi (`rasmlar.ovqat_yozuvi_id`). "Taniy olmadik" holatiga "Baribir tahrirlab kiritish" (-> bo'sh E7) ham 6-taskda qo'shiladi.
Porsiya o'zgarganda qayta hisob: `skanJami(natija, gramm)` (lib/services/skan-hisob.ts) tayyor. `POST /api/ovqat-yozuvlari` ga `manba: "ai"` va rasm bog'lash qo'shilishi kerak; `GET` javobida `manba` hali yo'q.
MUHIM holat: 5-task foydalanuvchi so'rovi bilan production'ga push qilindi — 6-taskgacha production'da AI natijasidan jurnalga qo'shib bo'lmaydi (natija faqat ko'rsatiladi).
Sinov asbobi xususiyati: Claude brauzer paneli kadr chizmaguncha (skrinshot olinmaguncha) Next.js oqimli sahifasi skelet holatida qoladi va klient komponent ishga tushmaydi — bu ilova nuqsoni emas; matn o'qishdan oldin skrinshot ol.
`rasmlar` da 12 ta yozuvga bog'lanmagan sinov rasmi bor (oldingi "7 ta" hisobi noto'g'ri edi — 3-taskdagi production sinovlari ham shu jadvalda); o'chirish foydalanuvchi ruxsatini kutmoqda.
AI aniqligi kuzatuvi: Haiku aralash ovqatni ("ikki dona tuxum va non" -> 250 g, 7,5 g uglevod) bitta 100 g ga keltirishda xato qiladi; imlo xatolari ham bor ("gushti"). Gemini'ga o'tishda 20 taomlik aniqlik testida baholanadi.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
