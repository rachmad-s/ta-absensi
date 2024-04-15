/*
  Warnings:

  - You are about to drop the column `requestId` on the `RequestActions` table. All the data in the column will be lost.
  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `overTimeRequestId` to the `RequestActions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeOffRequestId` to the `RequestActions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TimeOffQuotaPer" AS ENUM ('YEAR', 'CONTRACT');

-- CreateEnum
CREATE TYPE "TimeOffConfigName" AS ENUM ('ANNUAL_LEAVE', 'SICK_LEAVE', 'MATERNITY_LEAVE', 'MARRIAGE_LEAVE', 'MOURNING_LEAVE', 'SPECIAL_LEAVE');

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- DropForeignKey
ALTER TABLE "RequestActions" DROP CONSTRAINT "RequestActions_requestId_fkey";

-- AlterTable
ALTER TABLE "RequestActions" DROP COLUMN "requestId",
ADD COLUMN     "overTimeRequestId" TEXT NOT NULL,
ADD COLUMN     "timeOffRequestId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Request";

-- DropEnum
DROP TYPE "RequestType";

-- CreateTable
CREATE TABLE "TimeOffRequest" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "attachment" TEXT,
    "type" "TimeOffConfigName" NOT NULL,
    "days" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TimeOffRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OverTimeRequest" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "attendanceId" TEXT NOT NULL,

    CONSTRAINT "OverTimeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeOffConfig" (
    "id" TEXT NOT NULL,
    "name" "TimeOffConfigName" NOT NULL,
    "label" TEXT NOT NULL,
    "quota" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "per" "TimeOffQuotaPer" NOT NULL DEFAULT 'YEAR',

    CONSTRAINT "TimeOffConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TimeOffRequest_id_key" ON "TimeOffRequest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "OverTimeRequest_id_key" ON "OverTimeRequest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TimeOffConfig_id_key" ON "TimeOffConfig"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TimeOffConfig_name_key" ON "TimeOffConfig"("name");

-- AddForeignKey
ALTER TABLE "TimeOffRequest" ADD CONSTRAINT "TimeOffRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OverTimeRequest" ADD CONSTRAINT "OverTimeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OverTimeRequest" ADD CONSTRAINT "OverTimeRequest_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestActions" ADD CONSTRAINT "RequestActions_timeOffRequestId_fkey" FOREIGN KEY ("timeOffRequestId") REFERENCES "TimeOffRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestActions" ADD CONSTRAINT "RequestActions_overTimeRequestId_fkey" FOREIGN KEY ("overTimeRequestId") REFERENCES "OverTimeRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
