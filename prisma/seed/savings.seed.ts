import type { SeedContext } from "./types";
import {
  SavingsType,
  SavingsFrequency,
  SavingsMaturity,
  SavingsStatus,
} from "../../generated/prisma/client";

export async function seedSavings(ctx: SeedContext): Promise<string[]> {
  const { prisma, userIds } = ctx;
  if (userIds.length < 2) return [];

  const savings = await prisma.savings.createManyAndReturn({
    data: [
      {
        userId: userIds[1],
        savingsType: SavingsType.REGULAR,
        targetAmount: 50000,
        frequency: SavingsFrequency.MONTHLY,
        maturity: SavingsMaturity.TWELVE_MONTHS,
        interestRate: 10.5,
        bankName: "GTBank",
        accountNumber: "0123456789",
        accountName: "John Doe",
        status: SavingsStatus.ACTIVE,
      },
      {
        userId: userIds[2],
        savingsType: SavingsType.FIXED,
        targetAmount: 100000,
        frequency: SavingsFrequency.ONCE,
        maturity: SavingsMaturity.SIX_MONTHS,
        interestRate: 12,
        bankName: "Access Bank",
        accountNumber: "0987654321",
        accountName: "Jane Smith",
        status: SavingsStatus.PENDING,
      },
    ],
  });
  return savings.map((s) => s.id);
}
