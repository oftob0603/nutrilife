-- CreateIndex
CREATE INDEX "rasmlar_foydalanuvchi_id_idx" ON "rasmlar"("foydalanuvchi_id");

-- AddForeignKey
ALTER TABLE "ovqat_yozuvlari" ADD CONSTRAINT "ovqat_yozuvlari_foydalanuvchi_id_fkey" FOREIGN KEY ("foydalanuvchi_id") REFERENCES "foydalanuvchilar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rasmlar" ADD CONSTRAINT "rasmlar_foydalanuvchi_id_fkey" FOREIGN KEY ("foydalanuvchi_id") REFERENCES "foydalanuvchilar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kunlik_xulosa" ADD CONSTRAINT "kunlik_xulosa_foydalanuvchi_id_fkey" FOREIGN KEY ("foydalanuvchi_id") REFERENCES "foydalanuvchilar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skan_hisobi" ADD CONSTRAINT "skan_hisobi_foydalanuvchi_id_fkey" FOREIGN KEY ("foydalanuvchi_id") REFERENCES "foydalanuvchilar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
