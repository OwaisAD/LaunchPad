/*
  Warnings:

  - Added the required column `stack` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'REMOVED', 'PENDING');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "stack" TEXT NOT NULL,
ADD COLUMN     "status" "ProjectStatus" NOT NULL;
