/*
  Warnings:

  - You are about to drop the column `legacyId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_legacyId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "legacyId";
