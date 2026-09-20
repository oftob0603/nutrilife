-- CreateTable
CREATE TABLE "taomlar" (
    "id" TEXT NOT NULL,
    "nomi" TEXT NOT NULL,
    "olchov_miqdori" INTEGER NOT NULL,
    "olchov_birligi" TEXT NOT NULL,
    "kaloriya" DOUBLE PRECISION NOT NULL,
    "oqsil" DOUBLE PRECISION NOT NULL,
    "yog" DOUBLE PRECISION NOT NULL,
    "uglevod" DOUBLE PRECISION NOT NULL,
    "porsiyalar" INTEGER[],
    "yaratilgan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "taomlar_pkey" PRIMARY KEY ("id")
);
