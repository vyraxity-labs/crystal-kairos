-- CreateEnum
CREATE TYPE "EAjoMemberStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "eAjoMemberId" TEXT;

-- CreateTable
CREATE TABLE "e_ajo_groups" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contributionAmount" DECIMAL(15,2) NOT NULL,
    "frequency" "EAjoFrequency" NOT NULL,
    "duration" "EAjoDuration" NOT NULL,
    "totalSlots" INTEGER NOT NULL,
    "filledSlots" INTEGER NOT NULL DEFAULT 0,
    "status" "EAjoStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "e_ajo_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_ajo_members" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "payoutPosition" INTEGER NOT NULL,
    "feePercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "feeAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalExpectedPayout" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "netPayoutAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "guarantorName" TEXT NOT NULL,
    "guarantorPhoneNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "currentBalance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalContributed" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "hasReceivedPayout" BOOLEAN NOT NULL DEFAULT false,
    "payoutDate" TIMESTAMP(3),
    "status" "EAjoMemberStatus" NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "e_ajo_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "e_ajo_groups_status_idx" ON "e_ajo_groups"("status");

-- CreateIndex
CREATE INDEX "e_ajo_members_userId_idx" ON "e_ajo_members"("userId");

-- CreateIndex
CREATE INDEX "e_ajo_members_groupId_idx" ON "e_ajo_members"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "e_ajo_members_groupId_payoutPosition_key" ON "e_ajo_members"("groupId", "payoutPosition");

-- CreateIndex
CREATE UNIQUE INDEX "e_ajo_members_groupId_userId_key" ON "e_ajo_members"("groupId", "userId");

-- AddForeignKey
ALTER TABLE "e_ajo_groups" ADD CONSTRAINT "e_ajo_groups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "e_ajo_members" ADD CONSTRAINT "e_ajo_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "e_ajo_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "e_ajo_members" ADD CONSTRAINT "e_ajo_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_eAjoMemberId_fkey" FOREIGN KEY ("eAjoMemberId") REFERENCES "e_ajo_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
