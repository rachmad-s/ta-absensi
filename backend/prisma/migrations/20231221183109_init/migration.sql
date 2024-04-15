-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ConfigName" ADD VALUE 'ANNUAL_LEAVE';
ALTER TYPE "ConfigName" ADD VALUE 'SICK_LEAVE';
ALTER TYPE "ConfigName" ADD VALUE 'MATERNITY_LEAVE';
ALTER TYPE "ConfigName" ADD VALUE 'MARRIAGE_LEAVE';
ALTER TYPE "ConfigName" ADD VALUE 'MOURNING_LEAVE';
ALTER TYPE "ConfigName" ADD VALUE 'SPECIAL_LEAVE';
