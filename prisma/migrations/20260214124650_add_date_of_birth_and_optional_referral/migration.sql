/*
  Warnings:

  - Added the required column `dateOfBirth` to the `user_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "memberships" ALTER COLUMN "referralName" DROP NOT NULL,
ALTER COLUMN "referralPhoneNumber" DROP NOT NULL;

-- AlterTable (use default for existing rows, then drop default)
ALTER TABLE "user_info" ADD COLUMN "dateOfBirth" TIMESTAMP(3) NOT NULL DEFAULT '1970-01-01 00:00:00';
ALTER TABLE "user_info" ALTER COLUMN "dateOfBirth" DROP DEFAULT;
