/*
  Warnings:

  - You are about to drop the column `adult` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `backdropPath` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `firstAirDate` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `genreIds` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `mediaType` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `originalLanguage` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `posterPath` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `adult` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `backdropPath` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `firstAirDate` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `genreIds` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `mediaType` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `originalLanguage` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `posterPath` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `Watchlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,mediaId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,mediaId]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "adult",
DROP COLUMN "backdropPath",
DROP COLUMN "firstAirDate",
DROP COLUMN "genreIds",
DROP COLUMN "mediaType",
DROP COLUMN "name",
DROP COLUMN "originalLanguage",
DROP COLUMN "overview",
DROP COLUMN "posterPath",
DROP COLUMN "rating",
DROP COLUMN "releaseDate",
DROP COLUMN "title",
DROP COLUMN "video";

-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "adult",
DROP COLUMN "backdropPath",
DROP COLUMN "firstAirDate",
DROP COLUMN "genreIds",
DROP COLUMN "mediaType",
DROP COLUMN "name",
DROP COLUMN "originalLanguage",
DROP COLUMN "overview",
DROP COLUMN "posterPath",
DROP COLUMN "rating",
DROP COLUMN "releaseDate",
DROP COLUMN "title",
DROP COLUMN "video";

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_mediaId_key" ON "Favorite"("userId", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_mediaId_key" ON "Watchlist"("userId", "mediaId");
