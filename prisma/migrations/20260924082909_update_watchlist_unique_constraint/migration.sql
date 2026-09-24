/*
  Warnings:

  - The `mediaType` column on the `Rating` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,mediaId,mediaType]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,mediaId,mediaType]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,mediaId,mediaType]` on the table `UserRecentlyVisited` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,mediaId,mediaType]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Bookmark_userId_mediaId_key";

-- DropIndex
DROP INDEX "Favorite_userId_mediaId_key";

-- DropIndex
DROP INDEX "UserRecentlyVisited_userId_mediaId_key";

-- DropIndex
DROP INDEX "Watchlist_userId_mediaId_key";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "mediaType",
ADD COLUMN     "mediaType" "MediaType" NOT NULL DEFAULT 'movie';

-- AlterTable
ALTER TABLE "UserRecentlyVisited" ADD COLUMN     "mediaType" "MediaType" NOT NULL DEFAULT 'movie';

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_mediaId_mediaType_key" ON "Bookmark"("userId", "mediaId", "mediaType");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_mediaId_mediaType_key" ON "Favorite"("userId", "mediaId", "mediaType");

-- CreateIndex
CREATE UNIQUE INDEX "UserRecentlyVisited_userId_mediaId_mediaType_key" ON "UserRecentlyVisited"("userId", "mediaId", "mediaType");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_mediaId_mediaType_key" ON "Watchlist"("userId", "mediaId", "mediaType");
