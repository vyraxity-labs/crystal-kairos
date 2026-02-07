import type { SeedContext } from "./types";

export async function seedActivityLogs(ctx: SeedContext): Promise<void> {
  const { prisma, userIds } = ctx;
  if (userIds.length < 1) return;

  await prisma.activityLog.createMany({
    data: [
      {
        adminId: userIds[0],
        action: "SEED_DATA_CREATED",
        entityType: "Seed",
        entityId: "initial-setup",
        details: { message: "Database seeded with sample data" },
      },
    ],
  });
}
