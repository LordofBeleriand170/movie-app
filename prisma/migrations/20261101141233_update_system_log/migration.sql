/*
  Warnings:

  - You are about to drop the column `userId` on the `SystemLog` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SystemLog_userId_idx";

-- AlterTable
ALTER TABLE "SystemLog" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "SystemLog_username_idx" ON "SystemLog"("username");
