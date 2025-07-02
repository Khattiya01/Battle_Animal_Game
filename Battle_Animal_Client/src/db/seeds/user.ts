import { hashPassword } from "@/utils/hashPassword";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { usersTable } from "../schemas";

const dataUsers = [
  {
    username: "admin",
    email: "admin@gmail.com",
    password: "admin1234",
    role: "admin",
  },
];
export const seedUser = async () => {
  const client = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
  const db = drizzle(client);
  const promises = dataUsers.map(async (user) => {
    const responseGetUsersByUsername = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, user.username));

    if (responseGetUsersByUsername && responseGetUsersByUsername.length > 0) {
      return;
    }

    const hashedPassword = await hashPassword(user.password);
    const payload = {
      username: user.username,
      email: user.email,
      password: hashedPassword,
      role: user.role,
    };
    await db.insert(usersTable).values(payload);
  });

  await Promise.all(promises);
};
