/*
  Warnings:

  - You are about to drop the column `isApproved` on the `Request` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RequestStatuses" AS ENUM ('APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "isApproved";

-- CreateTable
CREATE TABLE "RequestActions" (
    "id" TEXT NOT NULL,
    "status" "RequestStatuses" NOT NULL,
    "requestId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestActions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestActions_id_key" ON "RequestActions"("id");

-- AddForeignKey
ALTER TABLE "RequestActions" ADD CONSTRAINT "RequestActions_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestActions" ADD CONSTRAINT "RequestActions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
