import type { SeedContext } from "./types";
import {
  LoanApplicantType,
  LoanStatus,
} from "../../generated/prisma/client";

export async function seedLoans(ctx: SeedContext): Promise<string[]> {
  const { prisma, userIds } = ctx;
  if (userIds.length < 2) return [];

  const loans = await prisma.loan.createManyAndReturn({
    data: [
      {
        userId: userIds[1],
        applicantType: LoanApplicantType.MEMBER_WITH_SAVINGS,
        requestedAmount: 50000,
        approvedAmount: 50000,
        interestRate: 3.5,
        duration: 6,
        purpose: "Business expansion",
        guarantorId: userIds[2],
        guarantorName: "Jane Smith",
        guarantorPhoneNumber: "+2348098765432",
        status: LoanStatus.APPROVED,
      },
      {
        userId: userIds[2],
        applicantType: LoanApplicantType.MEMBER_WITHOUT_SAVINGS,
        requestedAmount: 30000,
        interestRate: 5,
        duration: 4,
        purpose: "Personal expenses",
        status: LoanStatus.PENDING,
      },
    ],
  });
  return loans.map((l) => l.id);
}
