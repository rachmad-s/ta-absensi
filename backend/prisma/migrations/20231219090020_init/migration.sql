/*
  Warnings:

  - You are about to drop the column `isSupervising` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "level" SMALLINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isSupervising";
