/*
  Warnings:

  - You are about to drop the column `folderId` on the `Folder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_folderId_fkey";

-- DropIndex
DROP INDEX "Folder_folderId_idx";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "folderId",
ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "Folder_parentId_idx" ON "Folder" USING HASH ("parentId");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
