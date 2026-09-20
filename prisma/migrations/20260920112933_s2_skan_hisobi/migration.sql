-- CreateTable
CREATE TABLE "skan_hisobi" (
    "id" TEXT NOT NULL,
    "foydalanuvchi_id" TEXT NOT NULL,
    "sana" DATE NOT NULL,
    "soni" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "skan_hisobi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skan_hisobi_foydalanuvchi_id_sana_key" ON "skan_hisobi"("foydalanuvchi_id", "sana");
