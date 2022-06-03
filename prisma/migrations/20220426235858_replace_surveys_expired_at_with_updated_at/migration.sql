/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `Survey` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "expiredAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
