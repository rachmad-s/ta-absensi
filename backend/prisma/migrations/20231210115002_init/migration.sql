/*
  Warnings:

  - You are about to drop the column `positionId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `Position` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_positionId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "positionId",
DROP COLUMN "role",
ADD COLUMN     "position" VARCHAR(255);

-- DropTable
DROP TABLE "Position";
