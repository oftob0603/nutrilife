-- S6 6-task: sevimli retseptlar (R1 yurak tugmasi, PRO imkoniyati). Foydalanuvchi yoki retsept
-- o'chsa qator ham ketadi.

-- CreateTable
CREATE TABLE "sevimli_retseptlar" (
    "foydalanuvchi_id" TEXT NOT NULL,
    "retsept_id" TEXT NOT NULL,
    "yaratilgan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sevimli_retseptlar_pkey" PRIMARY KEY ("foydalanuvchi_id","retsept_id")
);

-- AddForeignKey
ALTER TABLE "sevimli_retseptlar" ADD CONSTRAINT "sevimli_retseptlar_foydalanuvchi_id_fkey" FOREIGN KEY ("foydalanuvchi_id") REFERENCES "foydalanuvchilar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sevimli_retseptlar" ADD CONSTRAINT "sevimli_retseptlar_retsept_id_fkey" FOREIGN KEY ("retsept_id") REFERENCES "retseptlar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
