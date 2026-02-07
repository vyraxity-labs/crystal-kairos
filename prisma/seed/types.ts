import type { PrismaClient } from "../../generated/prisma/client";

export interface SeedContext {
  prisma: PrismaClient;
  userIds: string[];
  membershipIds: string[];
  eAjoIds: string[];
  savingsIds: string[];
  loanIds: string[];
}
