/*
  Warnings:

  - You are about to drop the column `movieId` on the `UserRecentlyVisited` table. All the data in the column will be lost.
  - Added the required column `mediaId` to the `UserRecentlyVisited` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserRecentlyVisited" DROP COLUMN "movieId",
ADD COLUMN     "mediaId" TEXT NOT NULL;
