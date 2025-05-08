/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "dateOfBirth",
DROP COLUMN "passwordHash",
ADD COLUMN     "clerkId" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "emailVerified" DROP NOT NULL,
ALTER COLUMN "onboarding" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");
