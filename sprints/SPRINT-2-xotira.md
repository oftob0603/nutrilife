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
- [x] Tasdiqlash va tahrirlash ekrani: taom nomi, porsiya, kaloriya, oqsil, yog', uglevod tahrirlanadi. Faqat tasdiqlangandan keyin jurnalga tushadi
- [x] Jurnal (E9) sahifasi: kun yozuvlari ovqat turi bo'yicha guruhlanadi (nonushta / tushlik / kechki / gazak — S1'da yozuvga yozilyapti), tepada kunlik jami, har yozuvda rasm, vaqt va makrolar. Mavjud `GET /api/ovqat-yozuvlari?sana=` ishlatiladi; Home'dagi "Bugungi ovqatlar" sarlavhasiga "Hammasi" havolasi qo'shiladi
- [x] Yozuv amallari (E10): tahrirlash, o'chirish, nusxalash, porsiyani o'zgartirish — `PATCH` va `DELETE /api/ovqat-yozuvlari/[id]`. Home va jurnaldagi yozuv qatori (`YozuvQatori`) bosiladigan bo'ladi
- [x] Mavzu tizimi: yorug', qorong'i va tizim. Tizim mavzusi S1'dan beri ishlaydi (tokenlar `prefers-color-scheme` bo'yicha almashadi); bu yerda qo'lda tanlash va tanlovni eslab qolish qo'shiladi
- [x] Home to'ldiriladi (E1): haftalik kun tanlagich — tanlangan kun `?sana=` orqali yuklanadi; pastki navigatsiya paneli Home · [+] · Jurnal ko'rinishida, suzuvchi "+" panel markaziga ko'chadi va oqim ichidagi ekranlarda (E5, E8) yashiriladi (dizayn-tz 2-bo'lim)

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
- 2026-09-20: 6–8-tasklar yopildi — E7 tasdiq/tahrir formasi va rasm bog'lash, jurnal (E9) sana va guruhlar bo'yicha, yozuv tahrirlash/o'chirish/nusxalash (E10) lokal dev'da sinovdan o'tdi (app/_components/Tahlil.tsx, app/_components/YozuvFormasi.tsx, app/jurnal/page.tsx, app/yozuv/[id]/page.tsx, app/_components/YozuvTahriri.tsx, app/api/ovqat-yozuvlari/route.ts, app/api/ovqat-yozuvlari/[id]/route.ts, lib/services/yozuv-forma.ts, lib/services/yozuv-kirish.ts, lib/services/ovqat-yozuvlari.ts, lib/services/yozuv-hisob.ts)
- 2026-09-20: 9-task yopildi — mavzu tizimi (yorug' / qorong'i / tizim), localStorage saqlash va <head> inline skript bilan gidratsiyasiz qo'llash, kartalar `border-karta-chegara`ga o'tdi (lib/mavzu.ts, app/_components/MavzuTanlagich.tsx, app/layout.tsx, app/globals.css)
- 2026-09-20: 10-task yopildi — Home'da haftalik kun tanlagich (KunTanlagich) va pastki navigatsiya paneli (Asosiy · [+] · Jurnal) qo'shildi, S2 ning 10 taski yopildi (app/page.tsx, app/_components/KunTanlagich.tsx, app/_components/QoshishPaneli.tsx, app/jurnal/page.tsx, lib/services/yozuv-hisob.ts)

## Handoff

Keyingi: S2 ning barcha 10 taski yopildi — keyingi sessiya S3 (auth) sprint faylini o'qishdan boshlanadi. Undan oldin foydalanuvchi telefonda production'da bir marta "rasm -> tasdiqlash -> jurnal" oqimini o'tkazib ko'rishi kerak (S2 qabul mezoni; 6–10-tasklar asosan lokal dev'da va brauzer panelida sinalgan).
Tekshirilmagan: rasmli yozuvni o'chirishda rasmning R2'dan o'chishi (sinov ruxsati yo'qligi sababli); saqlash xato holatlari (E7, E10) va jurnal xato holati faqat kodda; mavzu: E7 yorug' mavzuda ochilmadi (E10 bilan bitta YozuvFormasi, u ko'rilgan), boshqa tabdan `storage` hodisasi orqali sinxronlash sinalmadi; 10-task: kun tanlagichdagi kelajak kunlarning o'chgan kataklari (sinov kuni yakshanba edi — haftada kelajak kun yo'q) va bugungi bo'sh holatdagi "Birinchi ovqatni qo'shish" tugmasi ekranda ko'rilmadi; telefondagi haqiqiy safe-area chekinishi sinalmadi.
Bazada sinov yozuvlari ("Osh 200 g · 300 kkal", "Non 80 g · 212 kkal" — ikkalasi AI) va 11 ta egasiz sinov rasmi qoldi — rasmlarni o'chirish hamon foydalanuvchi ruxsatini kutmoqda. "Non" yozuvi ilovadan o'chirilsa, rasmli o'chirish yo'li ham sinaladi.
Kuzatuv: mavjud bo'lmagan yozuvga birinchi `DELETE` bir marta 500 qaytardi, keyingi 10+ urinishda barqaror 404 — qayta chaqirib bo'lmadi, sababi noma'lum.
Reja bo'yicha qoldirilgan (foydalanuvchi tasdiqlagan): E7'dagi "tahrir qilingani" bayrog'i (ustun + migratsiya, S6'da); E9'da chapga surib tezkor amallar; o'chirgandan keyingi 5 soniyalik "Bekor qilish" (yumshoq o'chirish kerak) — hozir faqat tasdiq paneli.
Kod qoidalari: klient komponent ishlatadigan sof hisob `lib/services/*-hisob.ts`, `yozuv-forma.ts`, `yozuv-kirish.ts` da turadi — bazaga ulanadigan modulni klientga import qilma. E7 va E10 bitta `YozuvFormasi` ni ishlatadi. `react-hooks/purity` render ichida `Date.now()` ni taqiqlaydi — "hozir" modul darajasidagi yordamchidan, hodisa ishlovchisida o'qiladi (`YozuvTahriri.tsx`, `kelajakdami`).
Sinov asbobi xususiyati: Claude brauzer paneli kadr chizmaguncha (skrinshot olinmaguncha) Next.js oqimli sahifasi skelet holatida qoladi va klient komponent ishga tushmaydi — bu ilova nuqsoni emas; matn o'qishdan oldin skrinshot ol.
AI aniqligi kuzatuvi: Haiku aralash ovqatni ("ikki dona tuxum va non" -> 250 g, 7,5 g uglevod) bitta 100 g ga keltirishda xato qiladi; imlo xatolari ham bor ("gushti"). Gemini'ga o'tishda 20 taomlik aniqlik testida baholanadi.
Mavzu: `MavzuTanlagich` (app/_components/) tayyor, lekin hech bir ekranga qo'yilmagan — S3'da Sozlamalar (F2) ga ulanadi va tanlov `foydalanuvchilar.mavzu` ga ham yoziladi; ungacha ilova faqat tizim mavzusiga ergashadi. Sinash uchun vaqtinchalik sahifaga qo'yib ko'riladi (commitga kiritilmaydi) yoki konsolda `localStorage.setItem('nutrilife-mavzu','qorongi')`.
Rang qoidasi: karta chegarasi uchun `border-karta-chegara` (qorong'ida shaffof), kiritish maydoni va segment uchun `border-chegara`; panel pardasi uchun `bg-parda` — `bg-siyoh/NN` ishlatma (qorong'ida `--siyoh` och rang). globals.css da qorong'i tokenlar ikki blokda takrorlanadi — birini o'zgartirsang ikkinchisini ham o'zgartir.
Ochiq qoldiq (S1'dan): Home xato kartasida dizayn-tz'dagi "Qayta urinish" tugmasi yo'q (app/page.tsx, XatoKartasi) — 10-task doirasiga kirmadi. Kuzatuv: 10-task sinovida Home bir marta "Ma'lumotni yuklab bo'lmadi" ko'rsatdi, API o'sha payt 200 qaytarayotgan edi, qayta yuklashda ishladi — ehtimol dev server qayta kompilyatsiyasi; qayta chaqirib bo'lmadi.
Navigatsiya: pastki panel QoshishPaneli ichida (`faol` parametri) va faqat E1/E9 da chiziladi. S4'da panel Asosiy · [+] · Progress · Profil bo'ladi (dizayn-tz 2-bo'lim) — Jurnal bo'limi o'shanda paneldan chiqadi, Home'dagi "Hammasi" orqali ochiladi.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
