/*
  Warnings:

  - You are about to drop the column `rating` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Watchlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "rating";

-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "rating";
