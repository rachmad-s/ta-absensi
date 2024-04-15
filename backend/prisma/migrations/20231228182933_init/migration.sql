/*
  Warnings:

  - You are about to drop the column `attendanceId` on the `OverTimeRequest` table. All the data in the column will be lost.
  - Added the required column `date` to the `OverTimeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OverTimeRequest" DROP CONSTRAINT "OverTimeRequest_attendanceId_fkey";

-- AlterTable
ALTER TABLE "OverTimeRequest" DROP COLUMN "attendanceId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
