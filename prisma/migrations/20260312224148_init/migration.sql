/*
  Warnings:

  - You are about to drop the column `postId` on the `UserRecentlyVisited` table. All the data in the column will be lost.
  - Added the required column `movieId` to the `UserRecentlyVisited` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserRecentlyVisited" DROP COLUMN "postId",
ADD COLUMN     "movieId" TEXT NOT NULL;
