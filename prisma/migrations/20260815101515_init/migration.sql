/*
  Warnings:

  - You are about to drop the column `categoryId` on the `video` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "video" DROP CONSTRAINT "video_categoryId_fkey";

-- DropIndex
DROP INDEX "video_categoryId_idx";

-- AlterTable
ALTER TABLE "video" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "_CategoryToVideo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToVideo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToVideo_B_index" ON "_CategoryToVideo"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToVideo" ADD CONSTRAINT "_CategoryToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToVideo" ADD CONSTRAINT "_CategoryToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
