/*
  Warnings:

  - A unique constraint covering the columns `[loanId]` on the table `guarantor_rewards` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `relationship` on the `next_of_kins` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `gender` on the `user_info` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Relationship" AS ENUM ('SPOUSE', 'SIBLING', 'PARENT', 'CHILD', 'FRIEND', 'COLLEAGUE', 'NEIGHBOR', 'ACQUAINTANCE', 'RELATIVE', 'EMPLOYER', 'EMPLOYEE', 'CUSTOMER', 'VENDOR', 'SUPPLIER', 'PARTNER', 'CLIENT', 'LEADER', 'MEMBER', 'GUEST', 'OTHER');

-- AlterTable
ALTER TABLE "next_of_kins" DROP COLUMN "relationship",
ADD COLUMN     "relationship" "Relationship" NOT NULL;

-- AlterTable
ALTER TABLE "user_info" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "guarantor_rewards_loanId_key" ON "guarantor_rewards"("loanId");

-- AddForeignKey
ALTER TABLE "savings_withdrawals" ADD CONSTRAINT "savings_withdrawals_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guarantor_rewards" ADD CONSTRAINT "guarantor_rewards_guarantorId_fkey" FOREIGN KEY ("guarantorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guarantor_rewards" ADD CONSTRAINT "guarantor_rewards_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
