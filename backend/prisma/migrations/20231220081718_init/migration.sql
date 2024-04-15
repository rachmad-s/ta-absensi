/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "avatarUrl",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "photoUrl" TEXT;
