-- CreateEnum
CREATE TYPE "AttendanceStatuses" AS ENUM ('APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "status" "AttendanceStatuses" NOT NULL DEFAULT 'APPROVED';
