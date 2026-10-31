import { createPrismaClient, hashPassword, Visibility } from "./index.js";

const DAY_MS = 86400000;
const FIRST_HOUR = 6;
const ACTIVE_HOURS = 17;

const ACCOUNTS = [
  { id: "akun-rizky", name: "rizkymfrz", title: "Pemilik arsip" },
  { id: "akun-ann", name: "annfarta", title: "Pemilik arsip" },
];

const CHAPTERS = [
  { id: "chapter-masa-kuliah", name: "Masa Kuliah", position: 0 },
  { id: "chapter-perjalanan", name: "Perjalanan", position: 1 },
  { id: "chapter-rumah", name: "Rumah", position: 2 },
  { id: "chapter-sore-di-kota", name: "Sore di Kota", position: 3 },
];

const PLACES = [
  { name: "Bandung", latitude: -6.9175, longitude: 107.6191 },
  { name: "Yogyakarta", latitude: -7.7956, longitude: 110.3695 },
  { name: "Jakarta Kota Tua", latitude: -6.1352, longitude: 106.8133 },
  { name: "Ubud, Bali", latitude: -8.5069, longitude: 115.2625 },
  { name: "Malang", latitude: -7.9666, longitude: 112.6326 },
  { name: "Semarang", latitude: -6.9932, longitude: 110.4203 },
  { name: "Gunung Bromo", latitude: -7.9425, longitude: 112.953 },
  { name: "Labuan Bajo", latitude: -8.4967, longitude: 119.8877 },
  { name: "Surabaya", latitude: -7.2575, longitude: 112.7521 },
];

const CAPTIONS = [
  "Kopi pertama setelah hujan",
  "Kereta pagi menuju Bandung",
  "Sunyi di teras belakang",
  "Rame banget malam itu",
  "Foto buram tapi hangat",
  "Lampu kota dari lantai tiga",
  "Nasi goreng tengah malam",
  "Pantai yang tidak pernah ramai",
  "Hari terakhir di kos lama",
  "Sepeda tua dan jalan menurun",
  "",
  "Langit jingga di atas atap",
  "Dapur ibu selalu wangi",
  "Wisuda yang basah oleh hujan",
  "Berdua di halte sepi",
  "Buku yang tak pernah selesai",
  "Pasar subuh dan kabut tipis",
  "Konser kecil di halaman kampus",
  "Surat yang tak terkirim",
  "Bukit sebelum matahari terbit",
  "",
  "Mie instan dan obrolan panjang",
  "Peron stasiun yang lengang",
  "Ulang tahun yang diam-diam",
  "Anak kucing di depan pagar",
  "Jalan pulang yang berbeda",
  "Pameran foto di gang sempit",
  "Teh manis dan kipas angin",
  "Foto kelas yang terlambat dicetak",
  "Malam takbiran dari balkon",
];

const COMMENT_TEXTS = [
  "Lihat ini jadi kangen suasananya.",
  "Fotonya hangat banget, kayak sore itu masih ada.",
  "Semoga tempat ini masih sama kalau kita balik lagi.",
  "Diam-diam aku suka banget foto ini.",
  "Pernah lewat sini juga, ternyata tidak berubah.",
  "Terima kasih sudah menyimpan yang ini.",
  "Kalimatnya sederhana tapi kena.",
  "Waktu itu hujan, dan itu justru yang bikin spesial.",
  "Langitnya cantik, sayang cuma bisa dilihat lewat layar.",
  "Ada yang ingat bau tanah basahnya?",
  "Fragmen kecil yang isinya besar.",
  "Rasanya baru kemarin.",
  "Bikin senyum sendiri pas lihat ini.",
  "Tolong jangan dihapus yang ini.",
  "Sunyi tapi tidak kesepian, entah kenapa.",
  "Aku masih simpan tiketnya.",
  "Ternyata hari itu sepenting ini.",
  "Pantas saja foto ini jadi favorit.",
  "Tempat yang sama, orang yang sama, cerita yang beda.",
  "Makasih sudah mengabadikan momen ini.",
];

const REPLY_TEXTS = [
  "Makasih ya, ini juga favoritku.",
  "Iya, aku juga ingat banget.",
  "Nanti kita ke sana lagi ya.",
  "Senang kamu mampir.",
  "Haha, ketahuan.",
  "Aku baca ini sambil senyum.",
];

const ASPECTS = [1.1, 1.3, 1.5, 1.7];
const PHOTO_WIDTH = 1000;
const FRAGMENT_COUNT = 48;
const TOTAL_VISITS = 1248;
const DEFAULT_SEED_PASSWORD = "satuwaktu";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededRandom(seed: number, index: number) {
  return mulberry32(seed * 7919 + index * 104729)();
}

function timeOfDayMs(index: number) {
  const minutes =
    FIRST_HOUR * 60 + Math.floor(seededRandom(41, index) * ACTIVE_HOURS * 60);
  return minutes * 60_000;
}

function pick<T>(items: readonly T[], index: number): T {
  return items[index % items.length] as T;
}

function buildData() {
  const today = new Date();
  const startedAt = new Date(today.getFullYear() - 3, 1, 14);
  const totalDays = Math.floor(
    (today.getTime() - startedAt.getTime()) / DAY_MS,
  );
  const next = mulberry32(2026);
  const likeCounts: number[] = [];
  const fragments = Array.from({ length: FRAGMENT_COUNT }, (_, index) => {
    const day =
      index === 0
        ? new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
        : new Date(
            startedAt.getTime() + Math.floor(next() * totalDays) * DAY_MS,
          );
    const takenAt = new Date(day.getTime() + timeOfDayMs(index));
    const chapter =
      next() > 0.2
        ? pick(CHAPTERS, Math.floor(next() * CHAPTERS.length))
        : null;
    likeCounts.push(
      Math.floor(next() * 14) +
        Math.floor(next() * 9) +
        Math.floor(next() * 22),
    );
    next();
    const aspect = pick(ASPECTS, Math.floor(next() * ASPECTS.length));
    const place = index % 7 === 3 ? null : pick(PLACES, index * 5);
    return {
      id: `frag-${String(index + 1).padStart(3, "0")}`,
      caption: pick(CAPTIONS, index),
      takenAt,
      visibility: index % 3 === 1 ? Visibility.PRIVATE : Visibility.PUBLIC,
      pinned: index % 9 === 2,
      photoUrl: null,
      photoWidth: PHOTO_WIDTH,
      photoHeight: Math.round(PHOTO_WIDTH * aspect),
      latitude: place
        ? place.latitude + (seededRandom(31, index) - 0.5) * 0.004
        : null,
      longitude: place
        ? place.longitude + (seededRandom(37, index) - 0.5) * 0.004
        : null,
      placeName: place?.name ?? null,
      chapterId: chapter?.id ?? null,
      uploaderId: pick(ACCOUNTS, index).id,
    };
  });
  const likes = fragments.flatMap((fragment, index) =>
    Array.from({ length: likeCounts[index] ?? 0 }, (_, voter) => ({
      fragmentId: fragment.id,
      voterKey: `seed-${index}-${voter}`,
    })),
  );
  const now = Date.now();
  const comments: {
    id: string;
    fragmentId: string;
    text: string;
    createdAt: Date;
  }[] = [];
  const replies: {
    id: string;
    commentId: string;
    authorId: string;
    text: string;
    createdAt: Date;
  }[] = [];
  fragments.forEach((fragment, f) => {
    const count = (f * 7 + 1) % 4;
    for (let c = 0; c < count; c += 1) {
      const n = comments.length + 1;
      const offset = ((f * 11 + c * 17) % 90) * DAY_MS;
      const comment = {
        id: `komentar-${n}`,
        fragmentId: fragment.id,
        text: pick(COMMENT_TEXTS, f * 3 + c * 5),
        createdAt: new Date(now - offset - c * 3600000),
      };
      comments.push(comment);
      if ((f + c) % 3 === 0) {
        replies.push({
          id: `balasan-${n}`,
          commentId: comment.id,
          authorId: pick(ACCOUNTS, f + c).id,
          text: pick(REPLY_TEXTS, f + c * 2),
          createdAt: new Date(now - offset + 3600000),
        });
      }
    }
  });
  return {
    startedAt,
    fragments,
    likes,
    comments,
    replies,
  };
}

type Db = ReturnType<typeof createPrismaClient>;

const ACCOUNTS_ONLY = process.argv.includes("--accounts-only");

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

async function seedArchiveMeta(db: Db, startedAt: Date, visitCount: number) {
  await db.archiveMeta.upsert({
    where: { id: "archive" },
    update: {},
    create: { id: "archive", startedAt, visitCount },
  });
}

async function seedAccountsOnly(db: Db) {
  await seedAccounts(db);
  await seedArchiveMeta(db, new Date(), 0);
  console.log(`Seeded ${ACCOUNTS.length} accounts and the archive record`);
}

async function seedSampleData(db: Db) {
  const data = buildData();
  await seedAccounts(db);
  for (const chapter of CHAPTERS) {
    await db.chapter.upsert({
      where: { id: chapter.id },
      update: { name: chapter.name, position: chapter.position },
      create: chapter,
    });
  }
  await seedArchiveMeta(db, data.startedAt, TOTAL_VISITS);
  const fragments = await db.fragment.createMany({
    data: data.fragments,
    skipDuplicates: true,
  });
  const likes = await db.like.createMany({
    data: data.likes,
    skipDuplicates: true,
  });
  const comments = await db.comment.createMany({
    data: data.comments,
    skipDuplicates: true,
  });
  const replies = await db.reply.createMany({
    data: data.replies,
    skipDuplicates: true,
  });
  console.log(
    `Seeded ${ACCOUNTS.length} accounts, ${CHAPTERS.length} chapters, ` +
      `${fragments.count} fragments, ${likes.count} likes, ` +
      `${comments.count} comments, ${replies.count} replies`,
  );
}

async function main() {
  const db = createPrismaClient();
  try {
    await (ACCOUNTS_ONLY ? seedAccountsOnly(db) : seedSampleData(db));
  } finally {
    await db.$disconnect();
  }
}

await main();
