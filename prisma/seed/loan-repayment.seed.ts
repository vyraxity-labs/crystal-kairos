import type { SeedContext } from "./types";

export async function seedLoanRepayments(ctx: SeedContext): Promise<void> {
  const { prisma, userIds, loanIds } = ctx;
  if (loanIds.length < 1 || userIds.length < 1) return;

  await prisma.loanRepayment.createMany({
    data: [
      {
        loanId: loanIds[0],
        amount: 10000,
        penaltyAmount: 0,
        totalPaid: 10000,
        recordedBy: userIds[0],
        paymentDate: new Date(),
      },
    ],
  });
}
