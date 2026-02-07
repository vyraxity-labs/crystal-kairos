import type { SeedContext } from "./types";

export async function seedBankAccounts(ctx: SeedContext): Promise<void> {
  const { prisma, userIds } = ctx;
  if (userIds.length < 2) return;

  await prisma.bankAccount.createMany({
    data: [
      {
        userId: userIds[1],
        accountNumber: "0123456789",
        accountName: "John Doe",
        bankName: "GTBank",
        isPrimary: true,
      },
      {
        userId: userIds[2],
        accountNumber: "0987654321",
        accountName: "Jane Smith",
        bankName: "Access Bank",
        isPrimary: true,
      },
    ],
  });
}
