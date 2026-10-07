-- Taomlar bazasi olib tashlandi (DECISIONS 2026-10-07): Home taklifi retseptlardan olinadi,
-- E5 taom sahifasi va admin A6/A7 yo'q. Jurnal yozuvlari taom nomi va raqamlarini o'z ichida
-- saqlaydi — faqat bazadagi taomga havola (taom_id) ketadi.

-- DropForeignKey
ALTER TABLE "ovqat_yozuvlari" DROP CONSTRAINT "ovqat_yozuvlari_taom_id_fkey";

-- AlterTable
ALTER TABLE "ovqat_yozuvlari" DROP COLUMN "taom_id";

-- DropTable
DROP TABLE "taomlar";
