-- AlterTable
ALTER TABLE "ovqat_yozuvlari" ADD COLUMN     "manba" TEXT NOT NULL DEFAULT 'qolda';

-- CreateTable
CREATE TABLE "foydalanuvchilar" (
    "id" TEXT NOT NULL,
    "telegram_id" BIGINT,
    "til" TEXT NOT NULL DEFAULT 'uz',
    "mavzu" TEXT NOT NULL DEFAULT 'tizim',
    "birliklar" TEXT NOT NULL DEFAULT 'metrik',
    "shartlar_qabul" TIMESTAMP(3),
    "tasdiq_18plus" TIMESTAMP(3),
    "yaratilgan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foydalanuvchilar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profillar" (
    "id" TEXT NOT NULL,
    "foydalanuvchi_id" TEXT NOT NULL,
    "ism" TEXT,
    "jins" TEXT,
    "yosh" INTEGER,
    "boyi" INTEGER,
    "maqsad" TEXT,
    "faollik" TEXT,
    "ovqat_afzalliklari" TEXT[],
    "ovqatlanish_odati" JSONB,
    "motivatsiya" TEXT,
    "onboarding_qadami" INTEGER NOT NULL DEFAULT 0,
    "yangilangan" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profillar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vazn_yozuvlari" (
    "id" TEXT NOT NULL,
    "foydalanuvchi_id" TEXT NOT NULL,
    "vazn" DOUBLE PRECISION NOT NULL,
    "maqsad" DOUBLE PRECISION,
    "vaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vazn_yozuvlari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rejalar" (
    "id" TEXT NOT NULL,
    "foydalanuvchi_id" TEXT NOT NULL,
    "kaloriya" DOUBLE PRECISION NOT NULL,
    "oqsil" DOUBLE PRECISION NOT NULL,
    "yog" DOUBLE PRECISION NOT NULL,
    "uglevod" DOUBLE PRECISION NOT NULL,
    "hisoblangan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rejalar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rasmlar" (
    "id" TEXT NOT NULL,
    "foydalanuvchi_id" TEXT NOT NULL,
    "ovqat_yozuvi_id" TEXT,
    "kalit" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "hajm" INTEGER NOT NULL,
    "yaratilgan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rasmlar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kunlik_xulosa" (
    "id" TEXT NOT NULL,
    "foydalanuvchi_id" TEXT NOT NULL,
    "sana" DATE NOT NULL,
    "kaloriya" DOUBLE PRECISION NOT NULL,
    "oqsil" DOUBLE PRECISION NOT NULL,
    "yog" DOUBLE PRECISION NOT NULL,
    "uglevod" DOUBLE PRECISION NOT NULL,
    "nutrition_score" INTEGER,

    CONSTRAINT "kunlik_xulosa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "foydalanuvchilar_telegram_id_key" ON "foydalanuvchilar"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "profillar_foydalanuvchi_id_key" ON "profillar"("foydalanuvchi_id");

-- CreateIndex
CREATE INDEX "vazn_yozuvlari_foydalanuvchi_id_vaqt_idx" ON "vazn_yozuvlari"("foydalanuvchi_id", "vaqt");

-- CreateIndex
CREATE INDEX "rejalar_foydalanuvchi_id_hisoblangan_idx" ON "rejalar"("foydalanuvchi_id", "hisoblangan");

-- CreateIndex
CREATE UNIQUE INDEX "rasmlar_kalit_key" ON "rasmlar"("kalit");

-- CreateIndex
CREATE INDEX "rasmlar_ovqat_yozuvi_id_idx" ON "rasmlar"("ovqat_yozuvi_id");

-- CreateIndex
CREATE UNIQUE INDEX "kunlik_xulosa_foydalanuvchi_id_sana_key" ON "kunlik_xulosa"("foydalanuvchi_id", "sana");

-- AddForeignKey
ALTER TABLE "profillar" ADD CONSTRAINT "profillar_foydalanuvchi_id_fkey" FOREIGN KEY ("foydalanuvchi_id") REFERENCES "foydalanuvchilar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vazn_yozuvlari" ADD CONSTRAINT "vazn_yozuvlari_foydalanuvchi_id_fkey" FOREIGN KEY ("foydalanuvchi_id") REFERENCES "foydalanuvchilar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rejalar" ADD CONSTRAINT "rejalar_foydalanuvchi_id_fkey" FOREIGN KEY ("foydalanuvchi_id") REFERENCES "foydalanuvchilar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rasmlar" ADD CONSTRAINT "rasmlar_ovqat_yozuvi_id_fkey" FOREIGN KEY ("ovqat_yozuvi_id") REFERENCES "ovqat_yozuvlari"("id") ON DELETE SET NULL ON UPDATE CASCADE;
