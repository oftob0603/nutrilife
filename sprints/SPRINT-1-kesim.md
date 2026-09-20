# SPRINT 1 — kesim

**Maqsad:** Yurak amalni boshidan oxirigacha bitta vertikal kesimda ishlatib ko'rish —
taom tanlash ekrani -> jurnalga yozish -> kunlik doira to'lishi -> jonli domen.

**Savol:** Ishlaydimi?

## Tasklar

- [x] `taomlar` jadvali (Prisma; maydonlar prototipga moslandi: nomi, o'lchov miqdori va birligi, kaloriya, oqsil, yog', uglevod, porsiyalar) + prototipdagi 8 ta seed yozuv
- [x] Taomlar ro'yxati sahifasi — seed'dagi 8 ta taom karta ko'rinishida chiqadi (`/taomlar`)
- [x] Taom detal ekrani (E5): porsiya tanlash (150 g / 250 g / 350 g) va "Boshqa", tanlangan porsiyaga qarab kaloriya va makrolar qayta hisoblanadi, hech qanday tekshiruv yo'q
- [x] `ovqat_yozuvlari` jadvali (taom, porsiya, kaloriya, makrolar, ovqat turi, vaqt) va ikki API yo'li: `POST /api/ovqat-yozuvlari`, `GET /api/ovqat-yozuvlari?sana=`
- [x] E5 to'ldiriladi: ovqat turi tanlagichi (nonushta / tushlik / kechki / gazak) va "Jurnalga qo'shish" tugmasi — yuklanmoqda holati va "Saqlanmadi. Qayta urinish" xatosi bilan
- [x] Home sahifasi (E1) — kunlik doira: bugungi jami / qat'iy belgilangan norma (2,190 kkal, hozircha kodda yozilgan son), ostida "qoldi: N kkal" (normadan oshsa yoy va matn `--xato` rangida), uch makro chizig'i, "Bugungi ovqatlar" (oxirgi 3 yozuv), bo'sh va xato holatlari, suzuvchi "+" tugmasi
- [x] Tasdiq ekrani (E8): "Jurnalga qo'shildi" belgisi, qo'shilgan yozuv kartasi, to'lgan doira (600 ms animatsiya), "Home'ga qaytish" va "Yana qo'shish", hech narsa bosilmasa 2 soniyadan keyin Home'ga
- [x] Ovqat qo'shish paneli (E2): "+" bosilganda pastdan chiqadi; S1'da faqat "Qo'lda qo'shish" faol, Kamera va Galereya o'chgan holatda ("S2'da ochiladi")
- [x] Taom qidiruvi (E4): `/taomlar` sahifasiga qidiruv maydoni va "«…» topilmadi" holati
- [x] O'zbekcha `not-found` sahifasi — Next'ning inglizcha standart 404 ekrani o'rniga
- [x] Deploy: Vercel (sahifa va API) + Railway (PostgreSQL) — mahsulot o'z domenida ochiladi; STACK.md'dagi Hetzner/Caddy qatorlari tuzatiladi

## Qabul mezoni

- Domen ochilganda taomlar ro'yxatida 8 ta taom ko'rinadi va qidiruv ishlaydi
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
- 2026-09-16: 18+ tekshiruvi katakchadan O5 yosh qadamiga ko'chirildi (PRD.md, onboarding-tz.md, SPRINT-3-auth.md)
- 2026-09-16: Loyiha skeleti ochildi — Next.js 16, TypeScript 6, Tailwind 4, Prisma 7; "Loyiha tayyor" sahifasi va /api/health (app/, lib/db.ts, prisma/)
- 2026-09-16: Loyiha konvensiyalari o'rnatildi, Railway PostgreSQL ulanishi tekshirildi (CLAUDE.md, .claude/settings.json, .env.example, .mcp.json, scripts/mcp-db.mjs)
- 2026-09-20: 1-task bajarildi — prototip referens sifatida olindi, `taomlar` jadvali, migratsiya va 8 ta seed yozuv (prototip/, prisma/schema.prisma, prisma/seed.mjs)
- 2026-09-20: 2-task bajarildi — /taomlar sahifasi, GET /api/taomlar va taom kartasi (app/taomlar/, app/api/taomlar/, app/_components/TaomKartasi.tsx, lib/services/taomlar.ts)
- 2026-09-20: 3-task bajarildi — E5 taom detali va porsiya tanlash; sof hisob bazadan ajratildi, chunki klient komponent `pg` ni brauzer bandliga tortib keldi (app/taomlar/[id]/, app/_components/PorsiyaTanlagich.tsx, lib/services/taom-hisob.ts)
- 2026-09-20: Task ro'yxati prototip va dizayn-tz bo'yicha to'ldirildi — ovqat turi, "Jurnalga qo'shish", doiradagi "qoldi" satri, bugungi ovqatlar, E2 paneli, E4 qidiruvi va o'zbekcha 404 S1'ga qo'shildi; deploy taski Hetzner o'rniga Vercel/Railway'ga o'tkazildi
- 2026-09-20: 4-task bajarildi — `ovqat_yozuvlari` jadvali, migratsiya, POST va GET /api/ovqat-yozuvlari; kun chegarasi UTC+5 bo'yicha hisoblanadi (prisma/schema.prisma, lib/services/ovqat-yozuvlari.ts, lib/services/yozuv-hisob.ts, app/api/ovqat-yozuvlari/)
- 2026-09-20: 5-task bajarildi — E5'ga ovqat turi tanlagichi va "Jurnalga qo'shish" tugmasi qo'shildi, yuklanish va xato holatlari bilan (app/_components/OvqatTuriTanlagich.tsx, app/_components/Tugma.tsx)
- 2026-09-20: 6-task bajarildi — E1 Home: kunlik doira, makro chiziqlari, bugungi ovqatlar, bo'sh/xato/yuklanish holatlari (app/page.tsx, app/loading.tsx, app/_components/KunlikDoira.tsx, MakroChizigi.tsx, YozuvQatori.tsx, lib/norma.ts)
- 2026-09-20: 7-task bajarildi — E8 tasdiq ekrani, doira eski qiymatdan yangisiga to'ladi, 2 soniyadan keyin Home'ga qaytadi (app/qoshildi/[id]/, app/_components/QaytishTaymeri.tsx)
- 2026-09-20: 8-task bajarildi — E2 ovqat qo'shish paneli; kamera va galereya o'chgan holatda (app/_components/QoshishPaneli.tsx)
- 2026-09-20: 9-task bajarildi — E4 taom qidiruvi va "topilmadi" holati (app/_components/TaomlarRoyxati.tsx)
- 2026-09-20: 10-task bajarildi — o'zbekcha not-found sahifasi (app/not-found.tsx)
- 2026-09-20: 11-task bajarildi — Vercel loyihasi `nutrilife` GitHub repoga ulandi, `DATABASE_URL` Environment Variables'da, mahsulot https://nutrilife-khaki.vercel.app da jonli; domenda yozuv qo'shish va doira to'lishi tekshirildi (lib/api-asos.ts)
- 2026-09-20: Sinov yozuvlari bazadan o'chirildi (foydalanuvchi ruxsati bilan); STACK.md'dagi Hetzner/Caddy qatorlari Vercel/Railway bilan almashtirildi

## Handoff

S1 yopildi — barcha 11 task bajarildi, mahsulot https://nutrilife-khaki.vercel.app da.
Keyingi: S2 (sprints/SPRINT-2-xotira.md). S1'dan meros: norma `lib/norma.ts` da qotirilgan,
yozuvlar `s1-sinov` egasiga yoziladi, taom rasmlari o'rnida bo'sh joy, matnlar faqat o'zbekcha.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
