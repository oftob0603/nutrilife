-- AlterTable
ALTER TABLE "obunalar" ADD COLUMN     "manba" TEXT NOT NULL DEFAULT 'tolov';

-- Avval admin bergan muddat `tarif = 'qolda'` bilan belgilanardi — endi manba ustunida.
UPDATE "obunalar" SET "manba" = 'qolda' WHERE "tarif" = 'qolda';

-- CreateTable
CREATE TABLE "admin_amallari" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT,
    "foydalanuvchi_id" TEXT,
    "tur" TEXT NOT NULL,
    "tafsilot" TEXT NOT NULL,
    "sabab" TEXT NOT NULL,
    "eski" JSONB,
    "yangi" JSONB,
    "vaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_amallari_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_amallari_vaqt_idx" ON "admin_amallari"("vaqt");

-- CreateIndex
CREATE INDEX "admin_amallari_foydalanuvchi_id_vaqt_idx" ON "admin_amallari"("foydalanuvchi_id", "vaqt");

-- AddForeignKey
ALTER TABLE "admin_amallari" ADD CONSTRAINT "admin_amallari_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "foydalanuvchilar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_amallari" ADD CONSTRAINT "admin_amallari_foydalanuvchi_id_fkey" FOREIGN KEY ("foydalanuvchi_id") REFERENCES "foydalanuvchilar"("id") ON DELETE SET NULL ON UPDATE CASCADE;
