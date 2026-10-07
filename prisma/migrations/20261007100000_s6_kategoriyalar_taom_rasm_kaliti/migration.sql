-- S6 4-task: taom bazasini admin paneldan tahrirlash. Kategoriyalar jadvali (taom va retsept
-- uchun umumiy), taomlarda kategoriya va admin yuklagan rasmning ombor kaliti.

-- AlterTable
ALTER TABLE "taomlar" ADD COLUMN "rasm_kaliti" TEXT,
ADD COLUMN "kategoriya_id" TEXT;

-- CreateTable
CREATE TABLE "kategoriyalar" (
    "id" TEXT NOT NULL,
    "nomi" TEXT NOT NULL,
    "yaratilgan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kategoriyalar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kategoriyalar_nomi_key" ON "kategoriyalar"("nomi");

-- AddForeignKey
ALTER TABLE "taomlar" ADD CONSTRAINT "taomlar_kategoriya_id_fkey" FOREIGN KEY ("kategoriya_id") REFERENCES "kategoriyalar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Boshlang'ich kategoriyalar (admin-tz.md A7).
INSERT INTO "kategoriyalar" ("id", "nomi") VALUES
  (gen_random_uuid()::text, 'Birinchi taom'),
  (gen_random_uuid()::text, 'Ikkinchi taom'),
  (gen_random_uuid()::text, 'Non'),
  (gen_random_uuid()::text, 'Salat'),
  (gen_random_uuid()::text, 'Shirinlik'),
  (gen_random_uuid()::text, 'Ichimlik')
ON CONFLICT ("nomi") DO NOTHING;
