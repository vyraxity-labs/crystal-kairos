import type { SeedContext } from "./types";

export async function seedSavingsWithdrawals(ctx: SeedContext): Promise<void> {
  const { prisma, userIds, savingsIds } = ctx;
  if (savingsIds.length < 1 || userIds.length < 1) return;

  await prisma.savingsWithdrawal.create({
    data: {
      savingsId: savingsIds[0],
      principalAmount: 50000,
      interestAmount: 2625,
      totalAmount: 52625,
      isEarlyWithdrawal: false,
      withdrawnAt: new Date(),
      processedBy: userIds[0],
      bankName: "GTBank",
      accountNumber: "0123456789",
      accountName: "John Doe",
    },
  });
}
