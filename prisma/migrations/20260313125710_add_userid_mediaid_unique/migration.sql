/*
  Warnings:

  - A unique constraint covering the columns `[userId,mediaId]` on the table `UserRecentlyVisited` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserRecentlyVisited" ALTER COLUMN "type" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "UserRecentlyVisited_userId_mediaId_key" ON "UserRecentlyVisited"("userId", "mediaId");
