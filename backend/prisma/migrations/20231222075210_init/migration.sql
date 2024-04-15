-- CreateTable
CREATE TABLE "RequestActions" (
    "id" TEXT NOT NULL,
    "status" "RequestStatuses" NOT NULL,
    "timeOffRequestId" TEXT,
    "overTimeRequestId" TEXT,
    "remarks" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestActions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestActions_id_key" ON "RequestActions"("id");

-- AddForeignKey
ALTER TABLE "RequestActions" ADD CONSTRAINT "RequestActions_timeOffRequestId_fkey" FOREIGN KEY ("timeOffRequestId") REFERENCES "TimeOffRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestActions" ADD CONSTRAINT "RequestActions_overTimeRequestId_fkey" FOREIGN KEY ("overTimeRequestId") REFERENCES "OverTimeRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestActions" ADD CONSTRAINT "RequestActions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
