import type { SeedContext } from "./types";
import { Relationship } from "../../generated/prisma/client";

export async function seedNextOfKin(ctx: SeedContext): Promise<void> {
  const { prisma, userIds } = ctx;
  if (userIds.length < 2) return;

  await prisma.nextOfKin.createMany({
    data: [
      {
        userId: userIds[1],
        name: "Mary Doe",
        phoneNumber: "+2348011111111",
        relationship: Relationship.SPOUSE,
        bankName: "GTBank",
        accountNumber: "0111111111",
        accountName: "Mary Doe",
        occupation: "Nurse",
        address: "123 Main Street, Lagos",
      },
      {
        userId: userIds[2],
        name: "Bob Smith",
        phoneNumber: "+2348022222222",
        relationship: Relationship.SIBLING,
        bankName: "UBA",
        accountNumber: "0222222222",
        accountName: "Bob Smith",
        occupation: "Business Owner",
        address: "456 Oak Avenue, Abuja",
      },
    ],
  });
}
