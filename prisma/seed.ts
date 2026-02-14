import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { seedUsers } from "./seed/user.seed";
import { seedUserInfo } from "./seed/user-info.seed";
import { seedBankAccounts } from "./seed/bank-account.seed";
import { seedNextOfKin } from "./seed/next-of-kin.seed";
import { seedMemberships } from "./seed/membership.seed";
import { seedEAjo } from "./seed/eajo.seed";
import { seedSavings } from "./seed/savings.seed";
import { seedLoans } from "./seed/loan.seed";
import { seedEAjoTransactions } from "./seed/eajo-transaction.seed";
import { seedEAjoPayouts } from "./seed/eajo-payout.seed";
import { seedSavingsTransactions } from "./seed/savings-transaction.seed";
import { seedSavingsWithdrawals } from "./seed/savings-withdrawal.seed";
import { seedLoanRepayments } from "./seed/loan-repayment.seed";
import { seedGuarantorRewards } from "./seed/guarantor-reward.seed";
import { seedActivityLogs } from "./seed/activity-log.seed";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set.");
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const userIds = await seedUsers(prisma);
  const ctx = {
    prisma,
    userIds,
    membershipIds: [] as string[],
    eAjoIds: [] as string[],
    savingsIds: [] as string[],
    loanIds: [] as string[],
  };

  await seedUserInfo(ctx);
  await seedBankAccounts(ctx);
  await seedNextOfKin(ctx);

  ctx.membershipIds = await seedMemberships(ctx);
  ctx.eAjoIds = await seedEAjo(ctx);
  ctx.savingsIds = await seedSavings(ctx);
  ctx.loanIds = await seedLoans(ctx);

  await seedEAjoTransactions(ctx);
  await seedEAjoPayouts(ctx);
  await seedSavingsTransactions(ctx);
  await seedSavingsWithdrawals(ctx);
  await seedLoanRepayments(ctx);
  await seedGuarantorRewards(ctx);
  await seedActivityLogs(ctx);

  console.log("✅ Seeding completed.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
