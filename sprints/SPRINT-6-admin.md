# SPRINT 6 — admin

**Maqsad:** Egasi mahsulotni kod yozmasdan boshqara olsin: kontent kiritsin, obunani
nazorat qilsin, xatolarni tuzatsin.

**Savol:** Boshqarib bo'ladimi?

## Tasklar

- [x] Admin paneli va kirish nazorati: faqat admin roli ochadi, alohida bo'lim
- [x] Foydalanuvchilar ro'yxati: qidiruv, filtr (FREE / PRO / bloklangan), bitta foydalanuvchi kartasi
- [ ] Obunani qo'lda boshqarish: PRO berish, muddatini uzaytirish, olib qo'yish
- [ ] Taom takliflari navbati: foydalanuvchi tuzatishlari ro'yxati, tasdiqlash yoki rad etish, tasdiqlangani umumiy `taomlar` bazasiga qo'shiladi
- [ ] Taom bazasini tahrirlash: yangi taom qo'shish, nomi uch tilda, taxminiy kaloriya va makrolar, shuningdek S1 modelidagi o'lchov miqdori va birligi (100 g yoki 1 dona), porsiya variantlari ro'yxati va rasm
- [ ] Retseptlar bo'limi (PRO ostida): `retseptlar` jadvali, admin panelidan kiritish — nomi, rasmi, kaloriya, oqsil, tayyorlash vaqti, murakkablik, kategoriya
- [ ] Retseptlar sahifasi foydalanuvchi tomonida: qidiruv, kategoriyalar, filtr oynasi (tayyorlash vaqti, kaloriya, afzalliklar), retsept detali. FREE'ga sarlavha ko'rinadi, to'liq matn PRO'da. Pastki panel to'liq ko'rinishga o'tadi: Home · Retseptlar · [+] · Progress · Profil
- [ ] Statistika: ro'yxatdan o'tganlar, kunlik faol foydalanuvchilar, skanlar soni, PRO obunachilar, 7-kun retention
- [ ] Foydalanuvchini bloklash va ma'lumotini o'chirish, shikoyatlarni ko'rish
- [ ] Narxlarni panel orqali o'zgartirish

## Qabul mezoni

- Admin bo'lmagan foydalanuvchi admin havolasini ochsa rad javobi keladi
- Foydalanuvchi "bu manti emas, chuchvara" deb tuzatsa, taklif admin navbatida paydo bo'ladi
- Admin taklifni tasdiqlasa, taom umumiy bazada ko'rinadi
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

## Handoff

Admin paneli ekranlari (A0-A12) uchun admin-tz.md tayyor, boshlashda shundan foydalan.

Panelga kirish — botga /add26 → "Panelni ochish"; Desktop'da to'liq oyna; deploy'dan keyin telefon va Telegram
Desktop'da sinov kutilmoqda.

Lokal dev'da /admin "ruxsat yo'q" ko'rsatadi — dev zaxirasi birinchi hisobni oddiy foydalanuvchi qilib kiritadi, admin
ikkinchi yaratilgan hisobda; /admin sinovi uchun admin sessiyasini qo'lda berish kerak. A1 dagi takliflar/so'rovlar
navbati va amallar jurnali keyingi tasklarda ulanadi (jurnal uchun `admin_amallari` jadvali 3-taskda qo'shiladi).
Keyingi task — 3 (Obunani qo'lda boshqarish: PRO berish, uzaytirish, olib qo'yish; A3 amallar tasmasi tugmalari shu taskda ulanadi, `admin_amallari` jadvali shu yerda qo'shiladi).
2-task jonli sinovi deploy'dan keyin Telegram Desktop'da kutilmoqda (lokal admin sessiyasini qo'lda yasash ruxsat tizimi tomonidan rad etiladi — lokal sinov uchun foydalanuvchi admin sessiyasini o'zi beradi). `bloklangan` ustuni bor, bloklash amali 8-taskda.

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
