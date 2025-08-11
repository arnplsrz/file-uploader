/*
  Warnings:

  - You are about to drop the column `userId` on the `File` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_userId_fkey";

-- DropIndex
DROP INDEX "File_userId_idx";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "userId";
