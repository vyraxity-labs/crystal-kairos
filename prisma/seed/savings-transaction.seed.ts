import type { SeedContext } from "./types";
import { TransactionType } from "../../generated/prisma/client";

export async function seedSavingsTransactions(ctx: SeedContext): Promise<void> {
  const { prisma, userIds, savingsIds } = ctx;
  if (savingsIds.length < 1 || userIds.length < 1) return;

  await prisma.savingsTransaction.createMany({
    data: [
      {
        savingsId: savingsIds[0],
        amount: 50000,
        transactionType: TransactionType.DEPOSIT,
        recordedBy: userIds[0],
        transactionDate: new Date(),
      },
    ],
  });
}
