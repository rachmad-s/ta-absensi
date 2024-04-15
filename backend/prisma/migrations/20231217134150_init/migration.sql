/*
  Warnings:

  - You are about to drop the `OvertimeRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supervision` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('TIME_OFF', 'OVERTIME');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ConfigName" ADD VALUE 'TIME_IN';
ALTER TYPE "ConfigName" ADD VALUE 'TIME_OUT';

-- DropForeignKey
ALTER TABLE "OvertimeRequest" DROP CONSTRAINT "OvertimeRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "Supervision" DROP CONSTRAINT "Supervision_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "Supervision" DROP CONSTRAINT "Supervision_userId_fkey";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "dob" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "supervisorId" TEXT;

-- DropTable
DROP TABLE "OvertimeRequest";

-- DropTable
DROP TABLE "Supervision";

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "type" "RequestType" NOT NULL DEFAULT 'OVERTIME',
    "message" TEXT,
    "isApproved" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicHoliday" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "date" VARCHAR(50) NOT NULL,
    "year" VARCHAR(4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicHoliday_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Request_id_key" ON "Request"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PublicHoliday_id_key" ON "PublicHoliday"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
