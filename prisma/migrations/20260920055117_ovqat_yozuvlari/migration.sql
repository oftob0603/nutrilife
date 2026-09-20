-- CreateTable
CREATE TABLE "ovqat_yozuvlari" (
    "id" TEXT NOT NULL,
    "foydalanuvchi_id" TEXT NOT NULL,
    "taom_id" TEXT,
    "taom_nomi" TEXT NOT NULL,
    "porsiya" TEXT NOT NULL,
    "kaloriya" DOUBLE PRECISION NOT NULL,
    "oqsil" DOUBLE PRECISION NOT NULL,
    "yog" DOUBLE PRECISION NOT NULL,
    "uglevod" DOUBLE PRECISION NOT NULL,
    "ovqat_turi" TEXT NOT NULL,
    "vaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ovqat_yozuvlari_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ovqat_yozuvlari_foydalanuvchi_id_vaqt_idx" ON "ovqat_yozuvlari"("foydalanuvchi_id", "vaqt");

-- AddForeignKey
ALTER TABLE "ovqat_yozuvlari" ADD CONSTRAINT "ovqat_yozuvlari_taom_id_fkey" FOREIGN KEY ("taom_id") REFERENCES "taomlar"("id") ON DELETE SET NULL ON UPDATE CASCADE;
