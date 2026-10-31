import { createPrismaClient, hashPassword } from "./index.js";

const DEFAULT_SEED_PASSWORD = "satuwaktu";

const ACCOUNTS = [
  { id: "akun-rizky", name: "rizkymfrz", title: "Pemilik arsip" },
  { id: "akun-ann", name: "annfarta", title: "Pemilik arsip" },
];

type Db = ReturnType<typeof createPrismaClient>;

async function seedAccounts(db: Db) {
  const seedPassword = process.env.SEED_PASSWORD || DEFAULT_SEED_PASSWORD;
  const passwordHash = await hashPassword(seedPassword);
  for (const account of ACCOUNTS) {
    await db.account.upsert({
      where: { id: account.id },
      update: { name: account.name, title: account.title },
      create: account,
    });
    await db.account.updateMany({
      where: { id: account.id, passwordHash: null },
      data: { passwordHash },
    });
    await db.accountSettings.upsert({
      where: { accountId: account.id },
      update: {},
      create: { accountId: account.id },
    });
  }
}

async function seedArchiveMeta(db: Db) {
  await db.archiveMeta.upsert({
    where: { id: "archive" },
    update: {},
    create: { id: "archive", startedAt: new Date(), visitCount: 0 },
  });
}

async function main() {
  const db = createPrismaClient();
  try {
    await seedAccounts(db);
    await seedArchiveMeta(db);
    console.log(`Seeded ${ACCOUNTS.length} accounts and the archive record`);
  } finally {
    await db.$disconnect();
  }
}

await main();
