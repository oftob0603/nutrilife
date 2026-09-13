---
description: Hisobotchi agentni ishga tushiradi - sprint fayllariga hisobot yozadi va progress.html ni yangilaydi
---

`hisobotchi` agentini ishga tushir (Agent tool, `subagent_type: "hisobotchi"`).

Promptda unga quyidagilarni ber:

1. Shu sessiyada nima qilinganini qisqacha (qaysi fayllar, qaysi funksiya).
2. Foydalanuvchi qo'shimcha izoh bergan bo'lsa: $ARGUMENTS
3. Ko'rsatma: joriy sprintni topsin, haqiqatan bajarilgan tasklarni belgilasin,
   Hisobot va Handoff bo'limlarini yangilasin, `node scripts/progress.mjs` ni ishga
   tushirsin va `.vibecoding/hisobot-ok` markerini yaratsin.

Agent tugagach, uning qaytargan natijasini foydalanuvchiga qisqa yetkaz: qaysi sprint,
nechta task belgilandi, progress qancha foiz va tayyor commit xabari qanday.

Agent hech narsa o'zgartirmagan bo'lsa (bajarilgan ish yo'q) — buni ochiq ayt,
soxta progress ko'rsatma.
