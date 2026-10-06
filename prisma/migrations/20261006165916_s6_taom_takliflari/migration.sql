-- CreateTable
CREATE TABLE "taom_takliflari" (
    "id" TEXT NOT NULL,
    "foydalanuvchi_id" TEXT,
    "ovqat_yozuvi_id" TEXT,
    "rasm_id" TEXT,
    "taom_id" TEXT,
    "admin_id" TEXT,
    "ai_taom_nomi" TEXT NOT NULL,
    "ai_porsiya_gramm" INTEGER NOT NULL,
    "ai_kaloriya100" DOUBLE PRECISION NOT NULL,
    "ai_oqsil100" DOUBLE PRECISION NOT NULL,
    "ai_yog100" DOUBLE PRECISION NOT NULL,
    "ai_uglevod100" DOUBLE PRECISION NOT NULL,
    "taom_nomi" TEXT NOT NULL,
    "porsiya_gramm" INTEGER NOT NULL,
    "kaloriya" DOUBLE PRECISION NOT NULL,
    "oqsil" DOUBLE PRECISION NOT NULL,
    "yog" DOUBLE PRECISION NOT NULL,
    "uglevod" DOUBLE PRECISION NOT NULL,
    "til" TEXT NOT NULL DEFAULT 'uz',
    "holat" TEXT NOT NULL DEFAULT 'yangi',
    "rad_sababi" TEXT,
    "korilgan" TIMESTAMP(3),
    "yaratilgan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "taom_takliflari_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "taom_takliflari_holat_yaratilgan_idx" ON "taom_takliflari"("holat", "yaratilgan");

-- AddForeignKey
ALTER TABLE "taom_takliflari" ADD CONSTRAINT "taom_takliflari_foydalanuvchi_id_fkey" FOREIGN KEY ("foydalanuvchi_id") REFERENCES "foydalanuvchilar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taom_takliflari" ADD CONSTRAINT "taom_takliflari_ovqat_yozuvi_id_fkey" FOREIGN KEY ("ovqat_yozuvi_id") REFERENCES "ovqat_yozuvlari"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taom_takliflari" ADD CONSTRAINT "taom_takliflari_rasm_id_fkey" FOREIGN KEY ("rasm_id") REFERENCES "rasmlar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taom_takliflari" ADD CONSTRAINT "taom_takliflari_taom_id_fkey" FOREIGN KEY ("taom_id") REFERENCES "taomlar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taom_takliflari" ADD CONSTRAINT "taom_takliflari_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "foydalanuvchilar"("id") ON DELETE SET NULL ON UPDATE CASCADE;
