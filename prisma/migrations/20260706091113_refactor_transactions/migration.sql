/*
  Warnings:

  - You are about to drop the `e_ajo_payouts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `e_ajo_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loan_repayments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `savings_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `savings_withdrawals` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'DISBURSED', 'FAILED');

-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('AJO_CONTRIBUTION', 'AJO_PAYOUT', 'SAVINGS_DEPOSIT', 'SAVINGS_WITHDRAWAL', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'WALLET_TOPUP', 'WALLET_WITHDRAWAL', 'INTEREST', 'PENALTY', 'FEE');

-- DropForeignKey
ALTER TABLE "e_ajo_payouts" DROP CONSTRAINT "e_ajo_payouts_eAjoId_fkey";

-- DropForeignKey
ALTER TABLE "e_ajo_payouts" DROP CONSTRAINT "e_ajo_payouts_processedBy_fkey";

-- DropForeignKey
ALTER TABLE "e_ajo_transactions" DROP CONSTRAINT "e_ajo_transactions_eAjoId_fkey";

-- DropForeignKey
ALTER TABLE "e_ajo_transactions" DROP CONSTRAINT "e_ajo_transactions_recordedBy_fkey";

-- DropForeignKey
ALTER TABLE "loan_repayments" DROP CONSTRAINT "loan_repayments_loanId_fkey";

-- DropForeignKey
ALTER TABLE "loan_repayments" DROP CONSTRAINT "loan_repayments_recordedBy_fkey";

-- DropForeignKey
ALTER TABLE "savings_transactions" DROP CONSTRAINT "savings_transactions_recordedBy_fkey";

-- DropForeignKey
ALTER TABLE "savings_transactions" DROP CONSTRAINT "savings_transactions_savingsId_fkey";

-- DropForeignKey
ALTER TABLE "savings_withdrawals" DROP CONSTRAINT "savings_withdrawals_processedBy_fkey";

-- DropForeignKey
ALTER TABLE "savings_withdrawals" DROP CONSTRAINT "savings_withdrawals_savingsId_fkey";

-- DropTable
DROP TABLE "e_ajo_payouts";

-- DropTable
DROP TABLE "e_ajo_transactions";

-- DropTable
DROP TABLE "loan_repayments";

-- DropTable
DROP TABLE "savings_transactions";

-- DropTable
DROP TABLE "savings_withdrawals";

-- CreateTable
CREATE TABLE "ajo_fee_configs" (
    "id" TEXT NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "pickPosition" INTEGER NOT NULL,
    "feePercentage" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ajo_fee_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "category" "TransactionCategory" NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "eAjoId" TEXT,
    "savingsId" TEXT,
    "loanId" TEXT,
    "receiptUrl" TEXT,
    "rejectionReason" TEXT,
    "referenceNumber" TEXT,
    "notes" TEXT,
    "bankAccountId" TEXT,
    "recordedBy" TEXT NOT NULL,
    "processedBy" TEXT,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ajo_fee_configs_durationMonths_pickPosition_key" ON "ajo_fee_configs"("durationMonths", "pickPosition");

-- CreateIndex
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_category_idx" ON "transactions"("category");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_eAjoId_fkey" FOREIGN KEY ("eAjoId") REFERENCES "e_ajo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_savingsId_fkey" FOREIGN KEY ("savingsId") REFERENCES "savings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
