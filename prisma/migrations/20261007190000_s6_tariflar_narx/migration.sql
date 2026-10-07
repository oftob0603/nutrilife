-- S6 9-task (A12 narxlar): tariflar jadvali — narxlar koddan (lib/tariflar.ts) bazaga ko'chadi;
-- obunalar.narx — obuna olingan paytdagi narx, narx o'zgarishi mavjud obunalarga ta'sir qilmaydi.

-- CreateTable
CREATE TABLE "tariflar" (
    "id" TEXT NOT NULL,
    "narx" INTEGER NOT NULL,
    "oylar" INTEGER NOT NULL,
    "tavsiya" BOOLEAN NOT NULL DEFAULT false,
    "tartib" INTEGER NOT NULL,
    "yangilangan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tariflar_pkey" PRIMARY KEY ("id")
);

-- Boshlang'ich narxlar — lib/tariflar.ts dagi joriy qiymatlar.
INSERT INTO "tariflar" ("id", "narx", "oylar", "tavsiya", "tartib") VALUES
    ('oylik', 39000, 1, false, 1),
    ('yarim_yillik', 170000, 6, false, 2),
    ('yillik', 290000, 12, true, 3);

-- AlterTable
ALTER TABLE "obunalar" ADD COLUMN "narx" INTEGER;

-- Mavjud obunalar o'z tarifining hozirgi narxi bilan; tarifsiz "qolda" qatorlar bo'sh qoladi.
UPDATE "obunalar" o SET "narx" = t."narx" FROM "tariflar" t WHERE o."tarif" = t."id";
