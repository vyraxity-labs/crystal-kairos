import type { SeedContext } from "./types";
import { TransactionType } from "../../generated/prisma/client";

export async function seedEAjoTransactions(ctx: SeedContext): Promise<void> {
  const { prisma, userIds, eAjoIds } = ctx;
  if (eAjoIds.length < 1 || userIds.length < 1) return;

  await prisma.eAjoTransaction.createMany({
    data: [
      {
        eAjoId: eAjoIds[0],
        amount: 10000,
        transactionType: TransactionType.DEPOSIT,
        recordedBy: userIds[0],
        transactionDate: new Date(),
      },
    ],
  });
}
