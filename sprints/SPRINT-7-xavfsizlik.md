# SPRINT 7 — xavfsizlik

**Maqsad:** Production baza va sirlarni yopish, API'ni hajm va chastota hujumlaridan himoyalash,
pullik limitlarni serverda mustahkamlash va maxfiylik hujjatlarini kodga moslash.

**Savol:** Buzib bo'lmaydimi?

**Manba:** `XAVFSIZLIK-AUDITI.md` (2026-10-10, commit 973b82c). Har taskda audit ID'lari
qavs ichida, tafsilot va tavsiya o'sha faylda. Tartib auditning "Eng avval tuzatilishi
kerak bo'lgan 3 ta narsa" bo'limiga mos: A → B → C → D → E. A blokida 1-task 2-taskdan
oldin bajariladi (avval eski deploy'lar o'chadi, keyin sirlar almashadi). **(egasi)**
belgili qadamlarni egasi Vercel, Railway, BotFather yoki Windows'da o'zi bajaradi.

## Tasklar

### A. Baza, sirlar va ish muhiti

- [x] Eski Vercel deploy'lari yopildi: 2026-09-22 08:46 UTC dan oldingi 36 ta production deploy o'chirildi (birinchi bo'lib f6a0e66 niki), har biri 404 qaytaradi; Deployment Protection (Standard) va qisqa Deployment Retention yoqildi; Preview muhitidagi `BACKEND_URL` olib tashlandi (M3) **(egasi)**
- [ ] Sirlar almashtirildi: `postgres` paroli (`DATABASE_URL`), `SESSION_SECRET` (kamida 32 bayt), `AI_API_KEY`, R2 kalitlari, `TELEGRAM_BOT_TOKEN` (BotFather `/revoke`, so'ng `scripts/bot-webhook.mjs` bilan webhook qayta o'rnatiladi), `TELEGRAM_WEBHOOK_SECRET` (kamida 32 belgi); Railway va lokal `.env` yangilandi; SPRINT-5 yo'riqnomasiga "Sir oshkor bo'lsa" bo'limi qo'shildi (M3, L22) **(egasi)**
- [ ] Alohida dev baza: Railway'da `nutrilife-dev` (yoki lokal Postgres), lokal `.env` faqat unga qaraydi; production'da rollar `nutrilife_app` (faqat DML), `nutrilife_migrate` (DDL), `nutrilife_mcp` (SELECT/INSERT/UPDATE, DELETE'siz, `statement_timeout = 15s`); production TCP proxy o'chiq, backend `postgres.railway.internal` orqali ulanadi; lokal uchun alohida test bot, production skriptlari `railway run` orqali (M1, L21)
- [ ] Bazaga TLS bilan ulanish: lokal va MCP URL'larida `sslmode=require&uselibpqcompat=true`, `pg_stat_ssl` da `ssl = true` ko'rinadi (M2)
- [ ] Railway backup yoqildi: kunlik va haftalik jadval, bo'sh bazaga bir marta tiklash sinovi o'tdi; DECISIONS'ga tarif, jadval, saqlash muddati, RPO/RTO yozildi; sprint shabloniga "DROP bor migratsiyadan oldin qo'lda nusxa" qoidasi qo'shildi (M6) **(egasi + agent)**
- [ ] Baza MCP qorovuli tuzatildi: `queryMode: 'extended'`, yangi chapdan-o'ngga `stripSql()`, ko'p buyruqli va `COMMIT|ROLLBACK|BEGIN|SET` li matn rad etiladi, skript faqat `MCP_DATABASE_URL` ni o'qiydi; audit H1 dagi ikki misol lokal sinovda rad etiladi (H1)
- [ ] Dev server faqat lokalda: `"dev": "next dev -H 127.0.0.1"`; dev zaxirasi faqat `DEV_ZAXIRA_ID` va localhost host'ida, admin hisobga hech qachon tushmaydi; `adminTekshiruvi` va `joriyAdminId` zaxirasiz; `begonaManba` o'z manzillarini env'dan oladi; sessiya.ts dagi noto'g'ri izohlar tuzatildi; Windows Firewall'dagi Node.js Public kiruvchi qoidalari o'chirildi (M4) **(oxirgi qadam egasi)**
- [ ] Agent ruxsatlari va ignore fayllari: `Bash(npm install:*)` o'rniga `npm install` va `npm ci`, `deny` ga `npm install -g`, `git diff --no-index`, `git grep --no-index`; `Bash(git:*)` toraytirildi; hook `.env` ni o'qishni to'xtatadi; `.gitignore` da `.env*` + `!.env.example` va dump fayllari (`*.sql`, `*.dump`, `*.csv` ...) migratsiyalardan tashqari; `.env.example` ga yetishmayotgan 5 kalit izoh bilan (M12, L17, L19, L20)

### B. Yuklama va DoS

- [ ] So'rov tanasi chegarasi: `lib/services/` da umumiy yordamchi (nom bandligini tekshirib), `content-length` yo'q bo'lsa 411, katta bo'lsa 413, oqimni bo'laklab o'qiydi; barcha `sorov.json()` va `formData()` route'lari unga o'tdi, `null` tana 400 qaytaradi; chegaralar auditdagidek (auth 8 KB ... retsept shakli 4 MB + 256 KB); sinov: 1 MB tana `POST /api/auth/telegram` ga 413 (H2, L24)
- [ ] Rate limiting: xotiradagi sliding-window — auth 15/daq/IP, retsept rasmlari 60/daq/IP, rasm va skan 10/daq/foydalanuvchi, qolgani 120/daq/IP; oshsa 429 va `Retry-After` (L29)
- [ ] Skan va rasm oqimi: tranzaksiyadan oldin arzon `qoldiq` tekshiruvi, `pg_try_advisory_xact_lock` band bo'lsa darhol 429, pool `max: 20, connectionTimeoutMillis: 5000`; R2'dan o'qish limit band qilingandan keyin; limiti tugagan hisob rasm yuklay olmaydi, bog'lanmagan rasmlar 5 tadan oshmaydi; bir foydalanuvchiga bir vaqtda bitta skan (M8, M9, M11, L7)
- [ ] AI xarajati chegarasi: `AI_KUNLIK_GLOBAL_CHEGARA` (masalan 1500) `skanBandQil` tranzaksiyasida, kunlik token yig'indisiga ogohlantirish; AI hisoblagan xatolar tanilmagan sifatida sanaladi; admin tarjimasi kuniga `TARJIMA_KUNLIK_CHEGARA` va har chaqiruv jurnalga (M10, L8, L9)
- [ ] Tashqi xizmatlar barqarorligi: R2 so'rovlarida `AbortSignal.timeout` va `retries: 1–2`, o'chirish javobi tekshiriladi va DELETE'lar 8 tadan navbatda, yetim rasm tozalash fon qulfidan tashqarida, `sorov.signal` skanga uzatiladi; Telegram 429 da `retry_after` kutib bir marta qayta urinish; til sozlamasi faqat o'zgarganda va `after()` ichida; fon siklida `ishlayapti` bayrog'i (L14, L30, L31, L32, L34)

### C. Pullik limitlar

- [ ] Skan izi hisobdan mustaqil: kaskadsiz `skan_izi` jadvali (kalit `HMAC-SHA256(telegramId, SKAN_IZI_SECRET)`), o'chirishning ikkala yo'li izni shu tranzaksiyada yozadi, `qoldiq()` izni sarfga qo'shadi; sinov: FREE hisob 3 skanni ishlatib, hisobini o'chirib qayta kirsa qoldiq 0 (M5, L15)
- [ ] Makro va porsiya serverda yopiq: `makroKuzatish` false bo'lsa `GET /api/ovqat-yozuvlari` faqat kaloriyani qaytaradi, porsiya tavsiyasi server hisoblab faqat PRO javobiga qo'shadi; sinov: FREE javobida oqsil/yog'/uglevod yo'q (L6)
- [ ] Onboarding va shartlar serverda: qadam tartibi tekshiriladi, yakunlashda rozilik va profil maydonlari shart; skan, rasm va yozuv API'larida shartlar qabul qilinmagan bo'lsa 403 `{kod:"onboarding"}`; admin o'z hisobini F5 dan o'chira olmaydi (409, tugma yashirin) (L4, L5)

### D. Maxfiylik va shaxsiy ma'lumotlar

- [ ] Maxfiylik siyosati uch tilda kodga moslandi: username saqlanishi, provayderlar joylashuvi bilan (Anthropic, Cloudflare R2, Railway, Vercel), transchegaraviy uzatish, "Saqlash muddati" bo'limi, backup va xeshlangan ID, marketing va PRO bot xabarlari, ma'lumot so'rash tartibi @NutriLiferPro orqali; bot o'chirish matni mutlaq va'dasiz; versiya va sana ko'tarildi, `node scripts/hujjat-yig.mjs` bilan qayta yig'ildi (M7, L11, L15, L16)
- [ ] Bot xabarlaridan voz kechish: Sozlamalarda "Bot xabarlari" qatori, botda `/stop`, PRO zanjiri ham `marketingToxtatildi` ni tekshiradi (L10)
- [ ] Hujjat sahifalari ochiq: `/maxfiylik`, `/oferta`, `/shartlar` oddiy brauzerda Telegram'siz ochiladi (L18)
- [ ] Saqlash muddatlari: 400 kundan eski `kunlik_faollik` hodisalari fon vazifasida o'chadi; o'chirilgan hisob jurnalida Telegram ID o'rniga HMAC xesh, 90 kundan keyin anonimlashtirish (DECISIONS'da istisno) (L12, L13)

### E. Sessiya, kiritma va qattiqlashtirish

- [ ] Sessiyani bekor qilish: `foydalanuvchilar.sessiya_bekor` ustuni, token berilgan vaqti bilan solishtiriladi, Profil'da "Barcha qurilmalardan chiqish", admin sessiyasi 12–24 soat; `SESSION_SECRET` 32 baytdan qisqa bo'lsa production ishga tushmaydi; CSRF `sec-fetch-site` va Referer bilan; webhook siri 32 belgidan qisqa bo'lsa 500 (L1, L2, L3, L23)
- [ ] Kiritma tozalash: yozuv vaqti qat'iy ISO va yozuv kuni ichida, umumiy `ismniNormallashtir()` bot va Mini App'da, `matnniTozala()` nol-kenglik va RTL belgilarni olib tashlaydi, admin ro'yxat parametrlariga yuqori chegara, kuniga 100 yozuv (L25, L26, L27, L28, L33)
- [ ] Bot va fon xabarlari tuzatishlari: obuna xabarlari https `APP_URL` siz yuborilmaydi va bloklangan/admin hisoblarga ketmaydi, marketingda umumiy `faolObunaSharti()`, til tugmasi faqat egasining shaxsiy chatida, kategoriya qo'shish jurnalga yoziladi, qoralama retsept rasmi faqat admin sessiyasi bilan va `private, no-store` (L35, L36, L37, L38, L39, L40)
- [ ] Dependency va deploy: `next@16.3.8` va `eslint-config-next@16.3.8`, `npm update sharp source-map-js` (`audit fix --force` emas); `engines` node 24, `.node-version`, `.github/dependabot.yml`, Vercel'da `npm ci`; xavfsizlik sarlavhalari (`poweredByHeader: false`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, CSP `frame-ancestors` Telegram uchun); `db:deploy` va `db:status` skriptlari, `migrate deploy` Railway deploy'idan oldin, `migrate dev` faqat dev bazaga (L41, L42, L43, L44)

## Qabul mezoni

- 2026-09-22 dan oldingi har qanday eski Vercel deploy URL'i 404 qaytaradi, eski `DATABASE_URL` paroli bazaga ulana olmaydi
- Lokal `.env` production bazaga emas, dev bazaga qaraydi; MCP `sorov` vositasi audit H1 misollarini rad etadi
- 1 MB tanali `POST /api/auth/telegram` 413 oladi, daqiqasiga 16-chi kirish urinishi 429 oladi
- FREE foydalanuvchi hisobini o'chirib qayta kirsa skan qoldig'i tiklanmaydi
- FREE foydalanuvchining `GET /api/ovqat-yozuvlari` javobida makrolar yo'q
- Maxfiylik siyosati oddiy brauzerda ochiladi va username, provayderlar hamda saqlash muddatini aytadi
- Railway backup jadvali yoqilgan va bitta tiklash sinovi DECISIONS'da yozilgan
- `npm audit` da next bo'yicha zaiflik qolmagan

## Bu sprintda YO'Q

To'lov API'lari (Click, Payme, Stars) — qo'shilganda callback imzosi, summani serverda
tekshirish va idempotentlik shart (audit T-45) · foydalanuvchi ma'lumoti eksporti
`GET /api/profil/eksport` (V2) · tashqi pentest va WAF · auditning 5-bo'limidagi rad
etilgan topilmalar qayta ko'tarilmaydi.

## Hisobot

- 2026-10-10: sprint fayli XAVFSIZLIK-AUDITI.md (2026-10-10, commit 973b82c) asosida tuzildi — 24 task 5 blokda (A baza va sirlar, B yuklama, C pullik limitlar, D maxfiylik, E qattiqlashtirish), har taskda audit ID'lari
- 2026-10-10: A1 — Vercel'da Standard Protection (ssoProtection all_except_custom_domains) yoqildi: avtomatik deploy URL'lari, nutrilife-onlyboy va git-main domenlari Vercel login'ini so'raydi, ochiq faqat nutrilife-khaki.vercel.app (200); bot webhook Railway'ga to'g'ridan-to'g'ri, o'zgarmadi
- 2026-10-10: A1 — 2026-09-22 08:46 UTC dan oldingi 36 ta production deploy `vercel rm` bilan o'chirildi (birinchi f6a0e66), har birining URL'i 404, Vercel API'da chegaradan oldingi deploy 0 ta
- 2026-10-10: A1 — Preview muhitidagi BACKEND_URL olib tashlandi (faqat production qoldi), Deployment Retention: Canceled/Errored/Pre-Production 1 hafta, Production 30 kun (egasi dashboard'da); DECISIONS 2026-10-10 yozuvi
- 2026-10-10: .claude/settings.local.json (agent ruxsatlari: Vercel MCP update_project, npx vercel) yaratildi va .gitignore ga qo'shildi

## Handoff

S7 1-task yopildi. Keyingisi — 2-task (sirlarni almashtirish), kechiktirilmasin: eski DATABASE_URL paroli va 2026-09-20..22 davridagi boshqa sirlar hali ishlaydi. Vercel CLI `npx vercel` orqali, alohida npm kesh bilan ishlatiladi (umumiy kesh buzuq); egasining PowerShell'ida `npx.cmd`.
Env o'zgarishlarini agent qila olmaydi (auto mode rad etadi) — egasi dashboard'da qiladi. XAVFSIZLIK-AUDITI.md git'ga qo'shilmagan (egasining qarori kutilmoqda).

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
