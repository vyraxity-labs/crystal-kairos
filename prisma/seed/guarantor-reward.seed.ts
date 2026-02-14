import type { SeedContext } from "./types";

export async function seedGuarantorRewards(ctx: SeedContext): Promise<void> {
  const { prisma, userIds, loanIds } = ctx;
  if (loanIds.length < 1 || userIds.length < 2) return;

  await prisma.guarantorReward.createMany({
    data: [
      {
        guarantorId: userIds[2],
        loanId: loanIds[0],
        rewardAmount: 500,
      },
    ],
  });
}
