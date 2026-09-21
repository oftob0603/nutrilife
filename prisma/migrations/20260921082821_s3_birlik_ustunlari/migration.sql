-- Birliklar endi ikki alohida sozlama (prototip: "Vazn birligi" va "Bo'y birligi" qatorlari).
-- Eski `birliklar` ustuni keyingi migratsiyada olib tashlanadi — ungacha production'dagi
-- eski kod ishlab turadi.
ALTER TABLE "foydalanuvchilar" ADD COLUMN "vazn_birligi" TEXT NOT NULL DEFAULT 'kg';
ALTER TABLE "foydalanuvchilar" ADD COLUMN "boy_birligi" TEXT NOT NULL DEFAULT 'sm';

UPDATE "foydalanuvchilar" SET "vazn_birligi" = 'lb', "boy_birligi" = 'ft' WHERE "birliklar" = 'imperial';
