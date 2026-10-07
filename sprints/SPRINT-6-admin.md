# SPRINT 6 — admin

**Maqsad:** Egasi mahsulotni kod yozmasdan boshqara olsin: kontent kiritsin, obunani
nazorat qilsin, xatolarni tuzatsin.

**Savol:** Boshqarib bo'ladimi?

## Tasklar

- [x] Admin paneli va kirish nazorati: faqat admin roli ochadi, alohida bo'lim
- [x] Foydalanuvchilar ro'yxati: qidiruv, filtr (FREE / PRO / bloklangan), bitta foydalanuvchi kartasi
- [x] Obunani qo'lda boshqarish: PRO berish, muddatini uzaytirish, olib qo'yish
- [x] Taom bazasini tahrirlash: yangi taom qo'shish, nomi uch tilda, taxminiy kaloriya va makrolar, shuningdek S1 modelidagi o'lchov miqdori va birligi (100 g yoki 1 dona), porsiya variantlari ro'yxati va rasm
- [x] Retseptlar bo'limi (PRO ostida): `retseptlar` jadvali, admin panelidan kiritish — nomi, rasmi, kaloriya, oqsil, tayyorlash vaqti, murakkablik, kategoriya
- [ ] Retseptlar sahifasi foydalanuvchi tomonida: qidiruv, kategoriyalar, filtr oynasi (tayyorlash vaqti, kaloriya, afzalliklar), retsept detali. FREE'ga sarlavha ko'rinadi, to'liq matn PRO'da. Pastki panel to'liq ko'rinishga o'tadi: Home · Retseptlar · [+] · Progress · Profil
- [ ] Statistika: ro'yxatdan o'tganlar, kunlik faol foydalanuvchilar, skanlar soni, PRO obunachilar, 7-kun retention
- [ ] Foydalanuvchini bloklash va ma'lumotini o'chirish, shikoyatlarni ko'rish
- [ ] Narxlarni panel orqali o'zgartirish

## Qabul mezoni

- Admin bo'lmagan foydalanuvchi admin havolasini ochsa rad javobi keladi
- Admin paneldan kiritilgan retsept foydalanuvchi tomonida chiqadi; FREE foydalanuvchi to'liq matnni ocholmaydi
- Admin qo'lda PRO bergan foydalanuvchida skan limiti kuniga 20 ga o'zgaradi
- Statistika sahifasida kunlik faol foydalanuvchilar soni ko'rinadi

## Bu sprintda YO'Q

Haftalik hisobot va chuqur analitika · PDF/CSV eksport · murabbiy roli ·
avtomatik takroriy to'lov.

## Hisobot

- 2026-10-05: A0 kirish/rad javobi — Telegram Login Widget, imzo sha256(token) bilan tekshiriladi, admin bo'lmaganga sessiya berilmaydi va hisob yaratilmaydi (lib/services/telegram-login.ts, app/admin/_components/AdminKirish.tsx, app/admin/layout.tsx)
- 2026-10-05: admin qobig'i qurildi — chap panel 8 bo'lim, yorug'/qorong'i tugmasi, kim kirgani, chiqish, 1024px dan torda tasma; Mini App darvozasi /admin ga aralashmaydi (app/admin/_components/AdminQobiq.tsx, Belgi.tsx, StatKarta.tsx, AdminJadval.tsx, AdminSahifa.tsx, app/_components/KirishDarvozasi.tsx)
- 2026-10-05: A1 boshqaruv paneli — to'rt raqam (bugungi yangi, kunlik faol, bugungi skanlar, faol PRO) va 7 kun ichida tugaydigan obunalar jonli ma'lumotda, takliflar/so'rovlar/jurnal "—" bilan joyida (lib/services/admin.ts, app/admin/page.tsx, app/admin/loading.tsx)
- 2026-10-05: /api/admin/men, /boshqaruv, /kirish, /chiqish qo'shildi, har biri rolni bazadan qayta tekshiradi
- 2026-10-05: admin paneli tokenlari qo'shildi — "siyoh" ko'rinishdagi Tugma, DESIGN.md 11-bo'lim "Admin paneli" (app/globals.css, DESIGN.md, app/_components/Tugma.tsx)
- 2026-10-05: BotFather'da /setdomain nutrilife-khaki.vercel.app bajarildi, Login Widget shu domenga bog'landi
- 2026-10-05: admin paneliga kirish usuli Mini App'ga o'zgartirildi — bot /add26 yashirin buyrug'i "Panelni ochish" tugmasini beradi, /admin ilovadagi Mini App darvozasidan initData bilan avtomatik kiradi, admin bo'lmasa "ruxsat yo'q" (lib/services/bot.ts, app/_components/KirishDarvozasi.tsx, app/admin/_components/AdminKirish.tsx, app/admin/layout.tsx, app/admin/yukla.ts)
- 2026-10-05: Telegram Login Widget va unga bog'liq /api/admin/kirish, /api/admin/chiqish, lib/services/telegram-login.ts olib tashlandi; Desktop/macOS'da Bot API 8.0+ bo'lsa to'liq oyna (requestFullscreen), telefonda tasma ko'rinishi (lib/telegram.ts, app/admin/_components/AdminQobiq.tsx)
- 2026-10-06: A2 foydalanuvchilar ro'yxati — qidiruv (ism, username, Telegram ID), filtr FREE / PRO / bloklangan, 50 tadan sahifalash, oxirgi faollik, holat URL'da (app/admin/foydalanuvchilar/page.tsx, app/admin/_components/QidiruvPaneli.tsx, AdminJadval.tsx, lib/services/admin.ts, lib/services/admin-hisob.ts)
- 2026-10-06: A3 foydalanuvchi kartasi — profil, obuna holati va tarixi, skan limiti qoldig'i, oxirgi 10 ovqat yozuvi; amallar tasmasi tugmalari o'chiq (app/admin/foydalanuvchilar/[id]/page.tsx, app/api/admin/foydalanuvchilar/route.ts, app/api/admin/foydalanuvchilar/[id]/route.ts, app/admin/yukla.ts)
- 2026-10-06: migratsiya s6_username_bloklangan — foydalanuvchilar.username (initData'dan, har kirishda yangilanadi) va bloklangan ustuni qo'shildi (prisma/migrations/20261006070241_s6_username_bloklangan, lib/services/telegram-initdata.ts, lib/services/foydalanuvchilar.ts, app/api/auth/telegram/route.ts)
- 2026-10-06: migratsiya s6_obuna_manba_admin_amallari — obunalar.manba (tolov/qolda, eski tarif=qolda qatorlari manba=qolda) va faqat yoziladigan admin_amallari jurnali jadvali (prisma/migrations/20261006113925_s6_obuna_manba_admin_amallari, prisma/schema.prisma)
- 2026-10-06: A3 obunani qo'lda boshqarish — PRO berish, muddatni uzaytirish, PRO ni olib qo'yish (sabab majburiy, har amal jurnalga bitta tranzaksiyada), karta manbasi va A1 "Oxirgi amallar" jurnaldan (lib/services/obuna-admin.ts, lib/services/obuna-admin-hisob.ts, app/api/admin/foydalanuvchilar/[id]/obuna/route.ts, app/admin/_components/ObunaAmallari.tsx, AdminOyna.tsx, app/admin/page.tsx)
- 2026-10-06: A4/A5 taom takliflari navbati — taom_takliflari jadvali, E7 tuzatishi (nom o'zgargan yoki zichlik >3 %) navbatga tushadi, uch qaror (yangi taom, birlashtirish, rad) jurnalga yoziladi (lib/services/taom-takliflari.ts, app/admin/takliflar/, app/api/admin/takliflar/)
- 2026-10-07: migratsiya s6_kategoriyalar_taom_rasm_kaliti — kategoriyalar jadvali (6 ta boshlang'ich), taomlar.kategoriya_id va rasm_kaliti; seed mavjud taomni endi yangilamaydi (prisma/migrations/20261007100000_s6_kategoriyalar_taom_rasm_kaliti, prisma/schema.prisma, prisma/seed.mjs)
- 2026-10-07: A6 taomlar bazasi — qidiruv uch tilda, filtr Hammasi / Tarjimasi yo'q / Rasmsiz, 50 tadan sahifalash, ustunlar uch til · o'lchov · kkal · makrolar · rasm · sana; QidiruvPaneli A2 va A6 uchun umumiy qilindi (app/admin/taomlar/page.tsx, loading.tsx, ustunlar.ts, app/admin/_components/QidiruvPaneli.tsx, lib/services/taom-admin.ts, lib/services/taom-admin-hisob.ts, app/api/admin/taomlar/route.ts)
- 2026-10-07: A7 taom muharriri — yangi (/admin/taomlar/yangi, POST) va tahrir (/admin/taomlar/[id], PATCH, id o'zgarmaydi): uch nom majburiy, o'lchov miqdori + birlik chiplari, kaloriya va makrolar, 20 % makro ogohlantirishi (prototip Note warn), porsiya variantlari, kategoriya tanlovi va "Yangi kategoriya" oynasi, rasm yuklash (brauzerda siqiladi, R2'ga `taomlar/<id>/...`, ochiq /api/taom-rasmlari/[id]); har saqlash admin_amallari'ga taom_qoshish / taom_tahrir (app/admin/_components/TaomShakli.tsx, app/api/admin/taomlar/[id]/route.ts, app/api/admin/taomlar/shakl.ts, app/api/admin/kategoriyalar/route.ts, app/api/taom-rasmlari/[id]/route.ts)
- 2026-10-07: taom takliflari navbati butunlay olib tashlandi (DECISIONS 2026-10-07) — E7 tuzatishi faqat o'z yozuvida qoladi; A4/A5 ekranlari, /api/admin/takliflar, /api/admin/rasmlar, taom-takliflari.ts va taom-taklif-hisob.ts o'chirildi, yon paneldan "Takliflar navbati" bo'limi va A1 dan "Tasdiq kutayotgan takliflar" kartasi olib tashlandi; migratsiya s6_taom_takliflari_olib_tashlandi jadvalni tashladi (prisma/migrations/20261007090000_s6_taom_takliflari_olib_tashlandi)
- 2026-10-07: migratsiya s6_retseptlar — `retseptlar` jadvali (uch tilda nom, kategoriya_id, bitta porsiya uchun kaloriya va makrolar, porsiya, vaqt_daqiqa, murakkablik, holat qoralama/chop_etilgan, masalliqlar va qadamlar JSON uch tilda, rasm_kaliti), Prisma modeli Retsept, Railway bazasiga tushdi (prisma/migrations/20261007140000_s6_retseptlar, prisma/schema.prisma)
- 2026-10-07: retseptlar xizmati va API — qoralama faqat o'zbekcha nom bilan, chop etish uchun to'liqlik tekshiruvi, chop etilgan qayta saqlanganda chop etilgan qoladi, rasm R2'ga `retseptlar/<id>/...`, ochiq /api/retsept-rasmlari/[id], jurnal retsept_qoshish / retsept_tahrir / retsept_chop_etish (lib/services/retsept-admin.ts, lib/services/retsept-admin-hisob.ts, app/api/admin/retseptlar/route.ts, app/api/admin/retseptlar/[id]/route.ts, app/api/retsept-rasmlari/[id]/route.ts)
- 2026-10-07: A8 retseptlar ro'yxati (kategoriya tanlovi, chiplar Hammasi / Chop etilgan / Qoralama, sahifalash) va A9 retsept muharriri (til segmenti, "FREE ga ko'rinadi" va "PRO ostida" kartalari, rasm, Bekor · Saqlash · Chop etish); prototipda yo'q yog' va uglevod maydonlari qo'shildi; yon panelda "Retseptlar" ulandi (app/admin/retseptlar/page.tsx, app/admin/_components/RetseptShakli.tsx, RetseptFiltri.tsx, AdminQobiq.tsx)
- 2026-10-07: A7 dan umumiy bo'laklar chiqarildi — KategoriyaTanlovi va ShaklMaydonlari, TaomShakli ularni ishlatadi, xatti-harakati o'zgarmadi (app/admin/_components/KategoriyaTanlovi.tsx, ShaklMaydonlari.tsx, TaomShakli.tsx)

## Handoff

Admin paneli ekranlari (A0-A12) uchun admin-tz.md tayyor, boshlashda shundan foydalan.

Panelga kirish — botga /add26 → "Panelni ochish"; Desktop'da to'liq oyna; deploy'dan keyin telefon va Telegram
Desktop'da sinov kutilmoqda.

Lokal dev'da /admin "ruxsat yo'q" ko'rsatadi — dev zaxirasi birinchi hisobni oddiy foydalanuvchi qilib kiritadi, admin
ikkinchi yaratilgan hisobda; /admin sinovi uchun admin sessiyasini qo'lda berish kerak. A1 dagi so'rovlar navbati 7-taskda (bloklash va shikoyatlar) ulanadi; takliflar navbati yo'q (2026-10-07 qarori), yon panelda 7 bo'lim; amallar jurnali (`admin_amallari`) ulangan.
Keyingi task — 6 (Retseptlar sahifasi foydalanuvchi tomonida: prototip ui_kits/mobile-app/screens-recipes.jsx va shared/recipes.js; `retseptlar` jadvali, `/api/retsept-rasmlari/<id>` tayyor; faqat `holat = chop_etilgan` ko'rsatiladi; FREE'ga sarlavha, rasm, kaloriya, vaqt; masalliqlar va qadamlar PRO ostida; qadamlar bo'sh bo'lsa «Tayyorlash» bo'limi chiqmaydi; pastki panel to'liq ko'rinishga o'tadi).
4-task A6/A7 jonli sinovi deploy'dan keyin Telegram Desktop'da: ro'yxat va filtrlar, yangi taom (slug, kategoriya, rasm yuklash → /api/taom-rasmlari/<id> ko'rinishi, E5 kartasida ham), mavjud taomni tahrirlash, A1 jurnalida "Taom qo'shildi / tahrirlandi". Lokal sinov: build, API 403/404 javoblari va sof hisob funksiyalari (slug, porsiyalar, shakl tekshiruvi) node bilan o'tdi.
Dev hisobga ikkita sinov yozuvi qo'shilgan: "Toshkent oshi" 950 kkal va "Somsa" 435 kkal. 2- va 3-task jonli sinovi deploy'dan keyin Telegram Desktop'da kutilmoqda (PRO berish → kartada Faol · qo'lda berilgan, limit 20/kun; uzaytirish; olib qo'yish → FREE; A1 jurnali). Lokal admin sessiyasini qo'lda yasash ruxsat tizimi tomonidan rad etiladi — lokal sinov uchun foydalanuvchi admin sessiyasini o'zi beradi. `bloklangan` ustuni bor, bloklash amali 7-taskda.
5-task A8/A9 jonli sinovi deploy'dan keyin Telegram Desktop'da: ro'yxat va filtrlar, yangi retsept qoralama → chop etish (yetishmayotgan maydonlar xabari), rasm yuklash → /api/retsept-rasmlari/<id>, mavjudni tahrirlash, A1 jurnalida «Retsept chop etildi». Lokal sinov: build, API 403/404 va sof hisob funksiyalari node bilan o'tdi.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
