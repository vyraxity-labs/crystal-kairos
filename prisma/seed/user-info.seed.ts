import type { SeedContext } from "./types";

export async function seedUserInfo(ctx: SeedContext): Promise<void> {
  const { prisma, userIds } = ctx;
  if (userIds.length < 2) return;

  await prisma.userInfo.createMany({
    data: [
      {
        userId: userIds[1],
        address: "123 Main Street, Lagos",
        gender: "Male",
        occupation: "Software Engineer",
        phoneNumber: "+2348012345678",
        stateOfOrigin: "Lagos",
      },
      {
        userId: userIds[2],
        address: "456 Oak Avenue, Abuja",
        gender: "Female",
        occupation: "Teacher",
        phoneNumber: "+2348098765432",
        stateOfOrigin: "Abuja",
      },
    ],
  });
}
