-- Jadvalda S1'dan qolgan 8 ta taom bor, shuning uchun majburiy ustunlar uch bosqichda
-- qo'shiladi: avval bo'sh, keyin to'ldiriladi, oxirida NOT NULL qilinadi.

-- AlterTable
ALTER TABLE "taomlar" ADD COLUMN     "nomi_en" TEXT,
ADD COLUMN     "nomi_ru" TEXT,
ADD COLUMN     "rasm" TEXT;

-- S1 taomlari
UPDATE "taomlar" SET "nomi_ru" = 'Плов', "nomi_en" = 'Plov' WHERE "id" = 'osh';
UPDATE "taomlar" SET "nomi_ru" = 'Манты', "nomi_en" = 'Manti' WHERE "id" = 'manti';
UPDATE "taomlar" SET "nomi_ru" = 'Самса', "nomi_en" = 'Samsa' WHERE "id" = 'somsa';
UPDATE "taomlar" SET "nomi_ru" = 'Лагман', "nomi_en" = 'Lagman' WHERE "id" = 'lagman';
UPDATE "taomlar" SET "nomi_ru" = 'Шурпа', "nomi_en" = 'Shurpa' WHERE "id" = 'shurpa';
UPDATE "taomlar" SET "nomi_ru" = 'Лепёшка', "nomi_en" = 'Uzbek flatbread' WHERE "id" = 'non';
UPDATE "taomlar" SET "nomi_ru" = 'Чучвара', "nomi_en" = 'Chuchvara' WHERE "id" = 'chuchvara';
UPDATE "taomlar" SET "nomi_ru" = 'Нарын', "nomi_en" = 'Naryn' WHERE "id" = 'norin';

-- Ro'yxatda yo'q qator uchrasa, o'zbekcha nomi ko'chiriladi — NOT NULL yiqilmasin.
UPDATE "taomlar" SET "nomi_ru" = "nomi" WHERE "nomi_ru" IS NULL;
UPDATE "taomlar" SET "nomi_en" = "nomi" WHERE "nomi_en" IS NULL;

-- AlterTable
ALTER TABLE "taomlar" ALTER COLUMN "nomi_en" SET NOT NULL,
ALTER COLUMN "nomi_ru" SET NOT NULL;
