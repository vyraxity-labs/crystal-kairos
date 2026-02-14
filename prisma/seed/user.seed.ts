import type { PrismaClient } from "../../generated/prisma/client";
import { UserRole } from "../../generated/prisma/client";

export async function seedUsers(prisma: PrismaClient): Promise<string[]> {
  const users = await prisma.user.createManyAndReturn({
    data: [
      {
        email: "admin@crystalkairos.com",
        username: "admin",
        name: "Admin User",
        passwordHash: "$2a$10$placeholder", // bcrypt placeholder
        role: UserRole.OWNER,
        hasSetPassword: true,
      },
      {
        email: "member1@example.com",
        username: "member1",
        name: "John Doe",
        passwordHash: "$2a$10$placeholder",
        role: UserRole.USER,
        hasSetPassword: true,
      },
      {
        email: "member2@example.com",
        username: "member2",
        name: "Jane Smith",
        passwordHash: "$2a$10$placeholder",
        role: UserRole.USER,
        hasSetPassword: true,
      },
    ],
  });
  return users.map((u) => u.id);
}
