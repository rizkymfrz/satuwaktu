import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const main = async () => {
  const SALT_ROUNDS = 12;

  await prisma.user.upsert({
    where: { email: "rizkymfrz@satuwaktu.id" },
    update: {},
    create: {
      email: "rizkymfrz@satuwaktu.id",
      name: "rizkymfrz",
      password: await bcrypt.hash("Karawang123!", SALT_ROUNDS),
    },
  });

  await prisma.user.upsert({
    where: { email: "annfarta@satuwaktu.id" },
    update: {},
    create: {
      email: "annfarta@satuwaktu.id",
      name: "annfarta",
      password: await bcrypt.hash("ann15afa7ahz3tt@", SALT_ROUNDS),
    },
  });

  console.log("Seed selesai — 2 akun dibuat.");
};

void main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
