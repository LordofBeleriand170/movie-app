/*
  Warnings:

  - You are about to drop the `MediaRating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRated` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRated" DROP CONSTRAINT "UserRated_mediaRatingId_fkey";

-- DropTable
DROP TABLE "MediaRating";

-- DropTable
DROP TABLE "UserRated";
