-- CreateTable
CREATE TABLE "MediaRating" (
    "id" TEXT NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MediaRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRated" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "mediaRatingId" TEXT NOT NULL,

    CONSTRAINT "UserRated_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaRating_mediaId_key" ON "MediaRating"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRated_userId_mediaRatingId_key" ON "UserRated"("userId", "mediaRatingId");

-- AddForeignKey
ALTER TABLE "UserRated" ADD CONSTRAINT "UserRated_mediaRatingId_fkey" FOREIGN KEY ("mediaRatingId") REFERENCES "MediaRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
