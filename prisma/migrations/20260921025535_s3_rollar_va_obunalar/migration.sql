-- AlterTable
ALTER TABLE "foydalanuvchilar" ADD COLUMN     "rol" TEXT NOT NULL DEFAULT 'foydalanuvchi';

-- CreateTable
CREATE TABLE "obunalar" (
    "id" TEXT NOT NULL,
    "foydalanuvchi_id" TEXT NOT NULL,
    "tarif" TEXT NOT NULL,
    "boshlanish" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tugash" TIMESTAMP(3) NOT NULL,
    "yaratilgan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "obunalar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "obunalar_foydalanuvchi_id_tugash_idx" ON "obunalar"("foydalanuvchi_id", "tugash");

-- AddForeignKey
ALTER TABLE "obunalar" ADD CONSTRAINT "obunalar_foydalanuvchi_id_fkey" FOREIGN KEY ("foydalanuvchi_id") REFERENCES "foydalanuvchilar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
