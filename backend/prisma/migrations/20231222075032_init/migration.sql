/*
  Warnings:

  - You are about to drop the `RequestActions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RequestActions" DROP CONSTRAINT "RequestActions_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "RequestActions" DROP CONSTRAINT "RequestActions_overTimeRequestId_fkey";

-- DropForeignKey
ALTER TABLE "RequestActions" DROP CONSTRAINT "RequestActions_timeOffRequestId_fkey";

-- DropTable
DROP TABLE "RequestActions";
