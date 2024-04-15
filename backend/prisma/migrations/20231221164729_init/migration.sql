/*
  Warnings:

  - The values [RATE_PER_HOUR,MAX_ALLOWANCE] on the enum `ConfigName` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Config` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isActive` to the `Config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ConfigName_new" AS ENUM ('OVERTIME_RATE_PER_HOUR', 'WORKING_HOUR', 'TIME_IN', 'TIME_OUT', 'OVERTIME_AFTER', 'LATE_CUT_AFTER', 'MAX_OVERTIME_ALLOWANCE', 'ANNUAL_LEAVE', 'SICK_LEAVE', 'MATERNITY_LEAVE', 'MARRIAGE_LEAVE', 'MOURNING_LEAVE', 'SPECIAL_LEAVE');
ALTER TABLE "Config" ALTER COLUMN "name" TYPE "ConfigName_new" USING ("name"::text::"ConfigName_new");
ALTER TYPE "ConfigName" RENAME TO "ConfigName_old";
ALTER TYPE "ConfigName_new" RENAME TO "ConfigName";
DROP TYPE "ConfigName_old";
COMMIT;

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "remarks" TEXT;

-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "isActive" BOOLEAN NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "attachment" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Config_name_key" ON "Config"("name");
