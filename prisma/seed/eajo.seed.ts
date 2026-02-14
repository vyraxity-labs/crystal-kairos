import type { SeedContext } from "./types";
import {
  EAjoDuration,
  EAjoFrequency,
  EAjoStatus,
} from "../../generated/prisma/client";

export async function seedEAjo(ctx: SeedContext): Promise<string[]> {
  const { prisma, userIds } = ctx;
  if (userIds.length < 2) return [];

  const eAjos = await prisma.eAjo.createManyAndReturn({
    data: [
      {
        userId: userIds[1],
        contributionAmount: 10000,
        totalParticipants: 12,
        duration: EAjoDuration.TWELVE_MONTHS,
        frequency: EAjoFrequency.MONTHLY,
        payoutPosition: 1,
        feePercentage: 5,
        feeAmount: 6000,
        totalExpectedPayout: 120000,
        netPayoutAmount: 114000,
        guarantorName: "Mary Doe",
        guarantorPhoneNumber: "+2348011111111",
        bankName: "GTBank",
        accountNumber: "0123456789",
        accountName: "John Doe",
        status: EAjoStatus.APPROVED,
      },
      {
        userId: userIds[2],
        contributionAmount: 5000,
        totalParticipants: 6,
        duration: EAjoDuration.SIX_MONTHS,
        frequency: EAjoFrequency.WEEKLY,
        payoutPosition: 3,
        feePercentage: 8,
        feeAmount: 2400,
        totalExpectedPayout: 30000,
        netPayoutAmount: 27600,
        guarantorName: "Bob Smith",
        guarantorPhoneNumber: "+2348022222222",
        bankName: "Access Bank",
        accountNumber: "0987654321",
        accountName: "Jane Smith",
        status: EAjoStatus.PENDING,
      },
    ],
  });
  return eAjos.map((e) => e.id);
}
