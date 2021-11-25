-- AlterTable
ALTER TABLE "PersonalAccessToken" ADD COLUMN     "label" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
