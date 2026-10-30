/*
  Warnings:

  - You are about to drop the column `mediaId` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `mediaType` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `poster` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `List` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "List" DROP COLUMN "mediaId",
DROP COLUMN "mediaType",
DROP COLUMN "poster",
DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "visits" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "ListItem" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "mediaType" "MediaType" NOT NULL DEFAULT 'movie',
    "title" TEXT NOT NULL DEFAULT 'Unknown',
    "poster" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ListItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListItem_listId_idx" ON "ListItem"("listId");

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
