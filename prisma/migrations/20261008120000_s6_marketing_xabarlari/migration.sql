-- 7 kunlik bot xabarlari (PRO olmagan foydalanuvchilarga, DECISIONS 2026-10-08): yuborilgan
-- oxirgi kun va foydalanuvchi to'xtatgan vaqt.

-- AlterTable
ALTER TABLE "foydalanuvchilar" ADD COLUMN "marketing_bosqichi" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "marketing_toxtatildi" TIMESTAMP(3);
