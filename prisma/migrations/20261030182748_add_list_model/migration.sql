-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "mediaType" "MediaType" NOT NULL DEFAULT 'movie',
    "title" TEXT NOT NULL DEFAULT 'Unknown',
    "poster" TEXT NOT NULL DEFAULT '',
    "visits" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);
