-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN     "mediaType" "MediaType" NOT NULL DEFAULT 'movie',
ADD COLUMN     "poster" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Unknown';

-- AlterTable
ALTER TABLE "Watchlist" ADD COLUMN     "mediaType" "MediaType" NOT NULL DEFAULT 'movie',
ADD COLUMN     "poster" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Unknown';
