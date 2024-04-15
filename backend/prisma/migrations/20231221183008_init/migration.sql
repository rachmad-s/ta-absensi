/*
  Warnings:

  - The values [ANNUAL_LEAVE,SICK_LEAVE,MATERNITY_LEAVE,MARRIAGE_LEAVE,MOURNING_LEAVE,SPECIAL_LEAVE] on the enum `ConfigName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ConfigName_new" AS ENUM ('OVERTIME_RATE_PER_HOUR', 'WORKING_HOUR', 'TIME_IN', 'TIME_OUT', 'OVERTIME_AFTER', 'LATE_CUT_AFTER', 'MAX_OVERTIME_ALLOWANCE');
ALTER TABLE "Config" ALTER COLUMN "name" TYPE "ConfigName_new" USING ("name"::text::"ConfigName_new");
ALTER TYPE "ConfigName" RENAME TO "ConfigName_old";
ALTER TYPE "ConfigName_new" RENAME TO "ConfigName";
DROP TYPE "ConfigName_old";
COMMIT;
