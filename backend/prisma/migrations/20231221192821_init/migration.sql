/*
  Warnings:

  - You are about to alter the column `name` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `avatarUrl` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `position` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `dob` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(16)`.
  - A unique constraint covering the columns `[name]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "avatarUrl" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "position" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "dob" SET DATA TYPE VARCHAR(16);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
