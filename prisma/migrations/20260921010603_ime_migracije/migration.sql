-- AlterTable
ALTER TABLE "Reply" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Unknown',
    "poster" TEXT NOT NULL DEFAULT '',
    "mediaType" "MediaType" NOT NULL DEFAULT 'movie',
    "releaseDate" TEXT NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_mediaId_key" ON "Bookmark"("userId", "mediaId");

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
