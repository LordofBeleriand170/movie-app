/*
  Warnings:

  - Made the column `releaseDate` on table `Favorite` required. This step will fail if there are existing NULL values in that column.
  - Made the column `releaseDate` on table `Watchlist` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Favorite" ALTER COLUMN "releaseDate" SET NOT NULL,
ALTER COLUMN "releaseDate" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Watchlist" ALTER COLUMN "releaseDate" SET NOT NULL,
ALTER COLUMN "releaseDate" SET DATA TYPE TEXT;
