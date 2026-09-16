# Nutrilife — loyiha qoidalari

## Stek va arxitektura

- Next.js (App Router) + TypeScript + Tailwind + Prisma + PostgreSQL.
- Frontend Vercel'ga, backend Railway'ga deploy qilinadi.
- PostgreSQL Railway PostgreSQL orqali ishlaydi.
- Docker va Docker Compose ishlatilmaydi.
- Lokal ilova dev rejimda, production esa Vercel/Railway orqali ishlaydi.

## Manbalar

- Loyiha miyasi: PRD.md · STACK.md · ROADMAP.md · DECISIONS.md · sprints/
- Dizayn manbai DESIGN.md; ranglar va shriftlar faqat shu yerdan.
- prototip.html faqat vizual referens, kodi loyihaga ko'chirilmaydi.

## Ish tartibi

- Har sessiya boshida joriy sprint faylini o'qi.
- Bitta task tugamasdan keyingisiga o'tilmaydi.
- Qurishdan oldin reja ko'rsat, tasdiqdan keyin bajar.
- Faqat so'ralgan task bajariladi.
- Commit faqat "commit qil" deyilganda qilinadi.

## Kod

- Biznes mantiq lib/services + app/api ichida bo'ladi.
- Baza ulanishi lib/db.ts orqali bitta joyda bo'ladi.
- Foydalanuvchiga ko'rinadigan matnlar o'zbekcha lotin tilida bo'ladi.
- Auth kutubxonasi, UI kit va holat boshqaruvi kutubxonasi qo'shilmaydi.
- Yangi katta dependency faqat oldindan so'raladi.

## Sirlar

- Sirlar faqat .env'da saqlanadi, kodga yoki commitga tushmaydi.
- Sirlar terminalga chiqarilmaydi.
- Sir oshkor bo'lsa, o'chirish emas, almashtirish kerak.
- Production'da localhost yoki 127.0.0.1 ishlatilmaydi.
- Production sirlar Railway/Vercel Environment Variables orqali beriladi.
- Production sirlar repo yoki chatga chiqarilmaydi.

## Baza

- PostgreSQL Railway'da ishlaydi.
- DATABASE_URL .env orqali olinadi.
- MCP'da SELECT erkin, INSERT/UPDATE mumkin, DELETE/DROP/TRUNCATE esa faqat aniq ruxsat bilan bajariladi.
