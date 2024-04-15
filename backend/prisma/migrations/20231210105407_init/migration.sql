/*
  Warnings:

  - You are about to drop the column `isSupervising` on the `Position` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Position" DROP COLUMN "isSupervising",
ADD COLUMN     "isSupervisor" BOOLEAN NOT NULL DEFAULT false;
