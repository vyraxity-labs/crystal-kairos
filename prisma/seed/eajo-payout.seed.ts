import type { SeedContext } from "./types";

export async function seedEAjoPayouts(ctx: SeedContext): Promise<void> {
  const { prisma, userIds, eAjoIds } = ctx;
  if (eAjoIds.length < 1 || userIds.length < 1) return;

  await prisma.eAjoPayout.create({
    data: {
      eAjoId: eAjoIds[0],
      grossAmount: 120000,
      feeAmount: 6000,
      netAmount: 114000,
      payoutDate: new Date(),
      processedBy: userIds[0],
      bankName: "GTBank",
      accountNumber: "0123456789",
      accountName: "John Doe",
    },
  });
}
