-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "image" TEXT,
ALTER COLUMN "id" SET DEFAULT concat('ani_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(cast(gen_random_uuid() as text), '-', ''));
