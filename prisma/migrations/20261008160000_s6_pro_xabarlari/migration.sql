-- PRO xabarlari zanjiri (PRO olgan foydalanuvchilarga, DECISIONS 2026-10-08): zanjir ankori va turi,
-- yuborilgan oxirgi kun, reaktivatsiya bosqichi va oxirgi muhim amal vaqti.

-- AlterTable
ALTER TABLE "foydalanuvchilar" ADD COLUMN "pro_xabar_boshi" TIMESTAMP(3),
ADD COLUMN "pro_zanjir" TEXT,
ADD COLUMN "pro_xabar_kuni" INTEGER,
ADD COLUMN "reaktivatsiya_bosqichi" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "oxirgi_faollik" TIMESTAMP(3);
