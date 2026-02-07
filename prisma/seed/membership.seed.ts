import type { SeedContext } from "./types";
import {
  MembershipInterest,
  Assumptions,
  MembershipTier,
  MembershipStatus,
} from "../../generated/prisma/client";

export async function seedMemberships(ctx: SeedContext): Promise<string[]> {
  const { prisma, userIds } = ctx;
  if (userIds.length < 2) return [];

  const memberships = await prisma.membership.createManyAndReturn({
    data: [
      {
        userId: userIds[1],
        sourceOfIncome: ["Employment", "Business"],
        interests: [MembershipInterest.SAVINGS, MembershipInterest.LOAN],
        referralName: "Admin User",
        referralPhoneNumber: "+2348000000000",
        membershipNumber: "CRK-2025-0001",
        assumptions: [
          Assumptions.HAS_SMART_PHONE,
          Assumptions.HAS_INTEGRITY,
          Assumptions.IS_TRUSTWORTHY,
          Assumptions.HAS_INTERNET_ACCESS,
          Assumptions.HAS_EMAIL,
          Assumptions.HAS_WHATS_APP,
        ],
        tier: MembershipTier.GOLD_MEMBER,
        status: MembershipStatus.APPROVED,
      },
      {
        userId: userIds[2],
        sourceOfIncome: ["Employment"],
        interests: [MembershipInterest.AJO, MembershipInterest.LOAN],
        referralName: "John Doe",
        referralPhoneNumber: "+2348012345678",
        membershipNumber: "CRK-2025-0002",
        assumptions: [
          Assumptions.HAS_SMART_PHONE,
          Assumptions.HAS_INTEGRITY,
          Assumptions.IS_TRUSTWORTHY,
          Assumptions.HAS_INTERNET_ACCESS,
          Assumptions.HAS_EMAIL,
          Assumptions.HAS_WHATS_APP,
        ],
        tier: MembershipTier.SILVER_MEMBER,
        status: MembershipStatus.APPROVED,
      },
    ],
  });
  return memberships.map((m) => m.id);
}
