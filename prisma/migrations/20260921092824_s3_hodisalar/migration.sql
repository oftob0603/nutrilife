-- CreateTable
CREATE TABLE "hodisalar" (
    "id" TEXT NOT NULL,
    "foydalanuvchi_id" TEXT,
    "tur" TEXT NOT NULL,
    "sana" DATE NOT NULL,
    "vaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hodisalar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hodisalar_tur_sana_idx" ON "hodisalar"("tur", "sana");

-- CreateIndex
CREATE UNIQUE INDEX "hodisalar_foydalanuvchi_id_tur_sana_key" ON "hodisalar"("foydalanuvchi_id", "tur", "sana");

-- AddForeignKey
ALTER TABLE "hodisalar" ADD CONSTRAINT "hodisalar_foydalanuvchi_id_fkey" FOREIGN KEY ("foydalanuvchi_id") REFERENCES "foydalanuvchilar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Mavjud hisoblar uchun o'tmishdagi hodisalar. Vaqtlar bazada UTC, kun esa Toshkent
-- vaqti bo'yicha (UTC+5). Kunlik faollikning manbasi yo'q — u shu kundan boshlab yig'iladi.
INSERT INTO "hodisalar" ("id", "foydalanuvchi_id", "tur", "sana", "vaqt")
SELECT gen_random_uuid()::text, "id", 'royxat', ("yaratilgan" + INTERVAL '5 hours')::date, "yaratilgan"
FROM "foydalanuvchilar"
ON CONFLICT DO NOTHING;

INSERT INTO "hodisalar" ("id", "foydalanuvchi_id", "tur", "sana", "vaqt")
SELECT gen_random_uuid()::text, "foydalanuvchi_id", 'onboarding_tugadi', ("onboarding_tugadi" + INTERVAL '5 hours')::date, "onboarding_tugadi"
FROM "profillar"
WHERE "onboarding_tugadi" IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO "hodisalar" ("id", "foydalanuvchi_id", "tur", "sana", "vaqt")
SELECT gen_random_uuid()::text, "foydalanuvchi_id", 'birinchi_skan', MIN("sana"), MIN("sana")::timestamp
FROM "skan_hisobi"
WHERE "soni" > 0
GROUP BY "foydalanuvchi_id"
ON CONFLICT DO NOTHING;
