/*
  Warnings:

  - Changed the type of `mediaId` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `movieId` on the `Rating` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `mediaType` on the `Rating` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `mediaId` on the `Watchlist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "mediaId",
ADD COLUMN     "mediaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "movieId",
ADD COLUMN     "movieId" INTEGER NOT NULL,
DROP COLUMN "mediaType",
ADD COLUMN     "mediaType" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "mediaId",
ADD COLUMN     "mediaId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_mediaId_key" ON "Watchlist"("userId", "mediaId");
