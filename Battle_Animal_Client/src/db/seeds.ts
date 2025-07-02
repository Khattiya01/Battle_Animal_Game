import * as dotenv from "dotenv";
import { seedUser } from "./seeds/user";
dotenv.config({ path: "./.env" });

if (!("POSTGRES_URL" in process.env))
  throw new Error("POSTGRES_URL not found on .env");

const runSeeds = async () => {
  console.log("⏳ Running seeds...");

  const start = Date.now();

  // Run seeds User
  await seedUser();

  const end = Date.now();

  console.log("✅ Seeds completed in", end - start, "ms");

  // Close the pool connection

  process.exit(0);
};

runSeeds().catch((err) => {
  console.error("❌ Seeds failed");
  console.error(err);
  process.exit(1);
});
