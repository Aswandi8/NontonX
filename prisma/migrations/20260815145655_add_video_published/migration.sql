-- AlterTable
ALTER TABLE "video" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "video_isPublished_idx" ON "video"("isPublished");
