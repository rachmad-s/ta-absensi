/*
  Warnings:

  - Added the required column `duration` to the `OverTimeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OverTimeRequest" ADD COLUMN     "duration" INTEGER NOT NULL;
