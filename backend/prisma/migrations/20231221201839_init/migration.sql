-- DropForeignKey
ALTER TABLE "RequestActions" DROP CONSTRAINT "RequestActions_overTimeRequestId_fkey";

-- DropForeignKey
ALTER TABLE "RequestActions" DROP CONSTRAINT "RequestActions_timeOffRequestId_fkey";

-- AlterTable
ALTER TABLE "RequestActions" ALTER COLUMN "overTimeRequestId" DROP NOT NULL,
ALTER COLUMN "timeOffRequestId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RequestActions" ADD CONSTRAINT "RequestActions_timeOffRequestId_fkey" FOREIGN KEY ("timeOffRequestId") REFERENCES "TimeOffRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestActions" ADD CONSTRAINT "RequestActions_overTimeRequestId_fkey" FOREIGN KEY ("overTimeRequestId") REFERENCES "OverTimeRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
