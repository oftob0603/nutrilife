-- S6 5-task: retseptlar kutubxonasi admin paneldan (A8/A9). Qoralama foydalanuvchiga
-- ko'rinmaydi; masalliqlar va qadamlar uch tilda JSON ustunlarda.

-- CreateTable
CREATE TABLE "retseptlar" (
    "id" TEXT NOT NULL,
    "nomi" TEXT NOT NULL,
    "nomi_ru" TEXT NOT NULL,
    "nomi_en" TEXT NOT NULL,
    "kategoriya_id" TEXT,
    "kaloriya" DOUBLE PRECISION,
    "oqsil" DOUBLE PRECISION,
    "yog" DOUBLE PRECISION,
    "uglevod" DOUBLE PRECISION,
    "porsiya" TEXT NOT NULL DEFAULT '',
    "vaqt_daqiqa" INTEGER,
    "murakkablik" TEXT,
    "holat" TEXT NOT NULL DEFAULT 'qoralama',
    "chop_etilgan" TIMESTAMP(3),
    "masalliqlar" JSONB NOT NULL DEFAULT '{"uz":[],"ru":[],"en":[]}',
    "qadamlar" JSONB NOT NULL DEFAULT '{"uz":[],"ru":[],"en":[]}',
    "rasm_kaliti" TEXT,
    "yaratilgan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "yangilangan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "retseptlar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "retseptlar_holat_chop_etilgan_idx" ON "retseptlar"("holat", "chop_etilgan");

-- AddForeignKey
ALTER TABLE "retseptlar" ADD CONSTRAINT "retseptlar_kategoriya_id_fkey" FOREIGN KEY ("kategoriya_id") REFERENCES "kategoriyalar"("id") ON DELETE SET NULL ON UPDATE CASCADE;
