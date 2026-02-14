/*
  Warnings:

  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MembershipInterest" AS ENUM ('AJO', 'SAVINGS', 'LOAN');

-- CreateEnum
CREATE TYPE "Assumptions" AS ENUM ('HAS_SMART_PHONE', 'HAS_INTEGRITY', 'IS_TRUSTWORTHY', 'HAS_INTERNET_ACCESS', 'HAS_EMAIL', 'HAS_WHATS_APP');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('MEMBER', 'SILVER_MEMBER', 'GOLD_MEMBER');

-- CreateEnum
CREATE TYPE "EAjoDuration" AS ENUM ('FOUR_MONTHS', 'SIX_MONTHS', 'TWELVE_MONTHS');

-- CreateEnum
CREATE TYPE "EAjoFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "EAjoStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SavingsType" AS ENUM ('FIXED', 'REGULAR', 'STAGGERED');

-- CreateEnum
CREATE TYPE "SavingsFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ONCE');

-- CreateEnum
CREATE TYPE "SavingsMaturity" AS ENUM ('SIX_MONTHS', 'TWELVE_MONTHS');

-- CreateEnum
CREATE TYPE "SavingsStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'MATURED', 'WITHDRAWN', 'EARLY_WITHDRAWAL');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DISBURSED', 'ACTIVE', 'COMPLETED', 'DEFAULTED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "LoanApplicantType" AS ENUM ('MEMBER_WITH_SAVINGS', 'MEMBER_WITHOUT_SAVINGS', 'NON_MEMBER');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'INTEREST_CREDIT', 'PENALTY', 'FEE_DEDUCTION', 'REFUND');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "password",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "hasSetPassword" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "user_info" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "stateOfOrigin" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "next_of_kins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "next_of_kins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "sourceOfIncome" TEXT[],
    "interests" "MembershipInterest"[],
    "referralName" TEXT NOT NULL,
    "referralPhoneNumber" TEXT NOT NULL,
    "membershipNumber" TEXT,
    "assumptions" "Assumptions"[],
    "tier" "MembershipTier" NOT NULL DEFAULT 'MEMBER',
    "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "rejectionReason" TEXT,
    "membershipFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "renewalFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "expiryDate" TIMESTAMP(3),
    "lastRenewalDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_ajo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contributionAmount" DECIMAL(65,30) NOT NULL,
    "totalParticipants" INTEGER NOT NULL,
    "duration" "EAjoDuration" NOT NULL,
    "frequency" "EAjoFrequency" NOT NULL,
    "payoutPosition" INTEGER NOT NULL,
    "feePercentage" DECIMAL(65,30) NOT NULL,
    "feeAmount" DECIMAL(65,30) NOT NULL,
    "totalExpectedPayout" DECIMAL(65,30) NOT NULL,
    "netPayoutAmount" DECIMAL(65,30) NOT NULL,
    "guarantorName" TEXT NOT NULL,
    "guarantorPhoneNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "currentBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalContributed" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "hasReceivedPayout" BOOLEAN NOT NULL DEFAULT false,
    "payoutDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isAnonymousRequest" BOOLEAN NOT NULL DEFAULT false,
    "status" "EAjoStatus" NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "e_ajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_ajo_transactions" (
    "id" TEXT NOT NULL,
    "eAjoId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "recordedBy" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT,
    "notes" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "e_ajo_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_ajo_payouts" (
    "id" TEXT NOT NULL,
    "eAjoId" TEXT NOT NULL,
    "grossAmount" DECIMAL(65,30) NOT NULL,
    "feeAmount" DECIMAL(65,30) NOT NULL,
    "netAmount" DECIMAL(65,30) NOT NULL,
    "payoutDate" TIMESTAMP(3) NOT NULL,
    "processedBy" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "notes" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "e_ajo_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "savingsType" "SavingsType" NOT NULL,
    "targetAmount" DECIMAL(65,30),
    "frequency" "SavingsFrequency" NOT NULL,
    "maturity" "SavingsMaturity" NOT NULL,
    "interestRate" DECIMAL(65,30) NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "currentBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "accruedInterest" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalDeposited" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "expectedMaturityAmount" DECIMAL(65,30),
    "isAnonymousRequest" BOOLEAN NOT NULL DEFAULT false,
    "status" "SavingsStatus" NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "rejectionReason" TEXT,
    "startDate" TIMESTAMP(3),
    "maturityDate" TIMESTAMP(3),
    "earlyWithdrawal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "savings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savings_transactions" (
    "id" TEXT NOT NULL,
    "savingsId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "recordedBy" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT,
    "notes" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "savings_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savings_withdrawals" (
    "id" TEXT NOT NULL,
    "savingsId" TEXT NOT NULL,
    "principalAmount" DECIMAL(65,30) NOT NULL,
    "interestAmount" DECIMAL(65,30) NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "isEarlyWithdrawal" BOOLEAN NOT NULL DEFAULT false,
    "withdrawnAt" TIMESTAMP(3) NOT NULL,
    "processedBy" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "notes" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "savings_withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicantType" "LoanApplicantType" NOT NULL,
    "requestedAmount" DECIMAL(65,30) NOT NULL,
    "approvedAmount" DECIMAL(65,30),
    "interestRate" DECIMAL(65,30) NOT NULL,
    "duration" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "guarantorId" TEXT,
    "guarantorName" TEXT,
    "guarantorPhoneNumber" TEXT,
    "collateralDetails" TEXT,
    "applicationFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "outstandingBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalRepaid" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "defaultPenalty" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "gracePeriodDays" INTEGER NOT NULL DEFAULT 7,
    "isAnonymousRequest" BOOLEAN NOT NULL DEFAULT false,
    "status" "LoanStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "disbursedAt" TIMESTAMP(3),
    "repaymentStartDate" TIMESTAMP(3),
    "repaymentEndDate" TIMESTAMP(3),
    "actualRepaymentDate" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "isDefaulted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_repayments" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "penaltyAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalPaid" DECIMAL(65,30) NOT NULL,
    "recordedBy" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT,
    "isEarlyPayment" BOOLEAN NOT NULL DEFAULT false,
    "hasDiscount" BOOLEAN NOT NULL DEFAULT false,
    "discountAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_repayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guarantor_rewards" (
    "id" TEXT NOT NULL,
    "guarantorId" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "rewardAmount" DECIMAL(65,30) NOT NULL,
    "reason" TEXT NOT NULL DEFAULT 'Successful loan completion by guaranteed member',
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guarantor_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_info_userId_key" ON "user_info"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "next_of_kins_userId_key" ON "next_of_kins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_membershipNumber_key" ON "memberships"("membershipNumber");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_userId_key" ON "memberships"("userId");

-- CreateIndex
CREATE INDEX "e_ajo_userId_idx" ON "e_ajo"("userId");

-- CreateIndex
CREATE INDEX "e_ajo_status_idx" ON "e_ajo"("status");

-- CreateIndex
CREATE INDEX "e_ajo_transactions_eAjoId_idx" ON "e_ajo_transactions"("eAjoId");

-- CreateIndex
CREATE INDEX "e_ajo_transactions_transactionDate_idx" ON "e_ajo_transactions"("transactionDate");

-- CreateIndex
CREATE UNIQUE INDEX "e_ajo_payouts_eAjoId_key" ON "e_ajo_payouts"("eAjoId");

-- CreateIndex
CREATE INDEX "savings_userId_idx" ON "savings"("userId");

-- CreateIndex
CREATE INDEX "savings_status_idx" ON "savings"("status");

-- CreateIndex
CREATE INDEX "savings_transactions_savingsId_idx" ON "savings_transactions"("savingsId");

-- CreateIndex
CREATE INDEX "savings_transactions_transactionDate_idx" ON "savings_transactions"("transactionDate");

-- CreateIndex
CREATE UNIQUE INDEX "savings_withdrawals_savingsId_key" ON "savings_withdrawals"("savingsId");

-- CreateIndex
CREATE INDEX "loans_userId_idx" ON "loans"("userId");

-- CreateIndex
CREATE INDEX "loans_guarantorId_idx" ON "loans"("guarantorId");

-- CreateIndex
CREATE INDEX "loans_status_idx" ON "loans"("status");

-- CreateIndex
CREATE INDEX "loan_repayments_loanId_idx" ON "loan_repayments"("loanId");

-- CreateIndex
CREATE INDEX "loan_repayments_paymentDate_idx" ON "loan_repayments"("paymentDate");

-- CreateIndex
CREATE INDEX "guarantor_rewards_guarantorId_idx" ON "guarantor_rewards"("guarantorId");

-- CreateIndex
CREATE INDEX "activity_logs_adminId_idx" ON "activity_logs"("adminId");

-- CreateIndex
CREATE INDEX "activity_logs_entityType_entityId_idx" ON "activity_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "next_of_kins" ADD CONSTRAINT "next_of_kins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "e_ajo" ADD CONSTRAINT "e_ajo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "e_ajo_transactions" ADD CONSTRAINT "e_ajo_transactions_eAjoId_fkey" FOREIGN KEY ("eAjoId") REFERENCES "e_ajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "e_ajo_transactions" ADD CONSTRAINT "e_ajo_transactions_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "e_ajo_payouts" ADD CONSTRAINT "e_ajo_payouts_eAjoId_fkey" FOREIGN KEY ("eAjoId") REFERENCES "e_ajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "e_ajo_payouts" ADD CONSTRAINT "e_ajo_payouts_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings" ADD CONSTRAINT "savings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_transactions" ADD CONSTRAINT "savings_transactions_savingsId_fkey" FOREIGN KEY ("savingsId") REFERENCES "savings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_transactions" ADD CONSTRAINT "savings_transactions_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_withdrawals" ADD CONSTRAINT "savings_withdrawals_savingsId_fkey" FOREIGN KEY ("savingsId") REFERENCES "savings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_guarantorId_fkey" FOREIGN KEY ("guarantorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_repayments" ADD CONSTRAINT "loan_repayments_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_repayments" ADD CONSTRAINT "loan_repayments_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
