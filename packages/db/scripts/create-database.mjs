import "dotenv/config";
import pg from "pg";

const DEFAULT_URL =
  "postgresql://postgres:postgres@localhost:5432/satuwaktu?schema=public";

const url = new URL(process.env.DATABASE_URL ?? DEFAULT_URL);
const database = decodeURIComponent(url.pathname.slice(1));

const client = new pg.Client({
  host: url.hostname,
  port: Number(url.port || 5432),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: "postgres",
});

try {
  await client.connect();
  const { rowCount } = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [database],
  );
  if (rowCount === 0) {
    await client.query(`CREATE DATABASE "${database.replaceAll('"', '""')}"`);
    console.log(`Created database ${database}`);
  } else {
    console.log(`Database ${database} already exists`);
  }
} catch (error) {
  console.error(error.message || String(error));
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
