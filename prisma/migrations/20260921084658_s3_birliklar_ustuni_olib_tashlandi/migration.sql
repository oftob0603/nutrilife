-- DIQQAT: faqat yangi kod production'ga chiqishi bilan birga qo'llanadi (commit/push paytida,
-- `npx prisma migrate deploy`). Eski kod kirishda `birliklar` ustunini o'qiydi — ustun oldinroq
-- olib tashlansa production'da hech kim kira olmaydi.

-- Oraliqda eski kod orqali onboardingdan o'tgan foydalanuvchining tanlovi yo'qolmasin.
UPDATE "foydalanuvchilar" SET "vazn_birligi" = 'lb', "boy_birligi" = 'ft'
WHERE "birliklar" = 'imperial' AND "vazn_birligi" = 'kg' AND "boy_birligi" = 'sm';

ALTER TABLE "foydalanuvchilar" DROP COLUMN "birliklar";
