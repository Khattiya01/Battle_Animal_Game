import { env } from "@/config/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const runMigrate = async () => {
  if (!env.POSTGRES_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  // Create a new Pool connection using pg
  const pool = new Pool({
    connectionString: env.POSTGRES_URL,
  });

  const db = drizzle(pool);

  console.log("⏳ Running migrations...");

  const start = Date.now();

  // Run migrations
  await migrate(db, { migrationsFolder: "./migrations" });

  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");

  // Close the pool connection
  await pool.end();

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
