/*
  Warnings:

  - You are about to drop the column `status` on the `SystemLog` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `SystemLog` table. All the data in the column will be lost.
  - Added the required column `level` to the `SystemLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SystemLog" DROP COLUMN "status",
DROP COLUMN "user",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endpoint" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "level" "LogLevel" NOT NULL,
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "SystemLog_level_idx" ON "SystemLog"("level");

-- CreateIndex
CREATE INDEX "SystemLog_userId_idx" ON "SystemLog"("userId");
