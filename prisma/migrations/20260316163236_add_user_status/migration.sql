-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'BANNED', 'SUSPENDED', 'PENDING');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
