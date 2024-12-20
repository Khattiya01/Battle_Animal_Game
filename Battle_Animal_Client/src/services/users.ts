import { eq, desc, and, count } from "drizzle-orm";
import { db } from "@/db";
import { InsertUser, UpdateUser, usersTable } from "@/db/schemas";
import { v4 as uuidv4 } from "uuid";

export const getUsers = async ({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) => {
  const pageNumber = parseInt(page, 10) || 1;
  const size = parseInt(pageSize, 10) || 25;
  const offset = (pageNumber - 1) * size;

  try {
    const data = await db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.created_at))
      .limit(size)
      .offset(offset);

    const total = await db.select({ count: count() }).from(usersTable);
    return { data, total: total[0].count };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Could not fetch users");
  }
};

export const getUserById = async (id: string) => {
  try {
    const data = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return data && data?.length > 0 ? data[0] : undefined;
  } catch (error) {
    console.error("Error fetching contact:", error);
    // throw new Error("Could not fetch products");
  }
};

export const getUsersByEmail = async ({ email }: { email: string }) => {
  try {
    const data = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    return data;
  } catch (error) {
    console.error("Error fetching users by email:", error);
    throw new Error("Could not fetch users by email");
  }
};
export const getUsersByEmailIsActive = async ({ email }: { email: string }) => {
  try {
    const data = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.email, email), eq(usersTable.is_active, true)));

    return data;
  } catch (error) {
    console.error("Error fetching users by email:", error);
    throw new Error("Could not fetch users by email");
  }
};

export const getUsersByUsername = async ({
  username,
}: {
  username: string;
}) => {
  try {
    const data = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    return data;
  } catch (error) {
    console.error("Error fetching users by username:", error);
    throw new Error("Could not fetch users by username");
  }
};

export const getUsersByUsernameIsActive = async ({
  username,
}: {
  username: string;
}) => {
  try {
    const data = await db
      .select()
      .from(usersTable)
      .where(
        and(eq(usersTable.username, username), eq(usersTable.is_active, true))
      );

    return data;
  } catch (error) {
    console.error("Error fetching users by username:", error);
    throw new Error("Could not fetch users by username");
  }
};

export const addUsers = async (data: InsertUser) => {
  await db.insert(usersTable).values({
    id: uuidv4(),
    username: data.username,
    password: data.password,
    email: data.email,
    role: data.role,
  });
};

export const editUser = async (data: UpdateUser) => {
  await db
    .update(usersTable)
    .set({
      username: data.username,
      email: data.email,
      role: data.role,
    })
    .where(eq(usersTable.id, data.id))
    .returning({ id: usersTable.id });
};

export const editPasswordUser = async (data: {
  password: string;
  id: string;
}) => {
  await db
    .update(usersTable)
    .set({
      password: data.password,
    })
    .where(eq(usersTable.id, data.id))
    .returning({ id: usersTable.id });
};

export const editIsActiveUser = async ({
  id,
  is_active,
}: {
  id: string;
  is_active: boolean;
}) => {
  await db
    .update(usersTable)
    .set({
      is_active: is_active,
    })
    .where(eq(usersTable.id, id))
    .returning({ id: usersTable.id });
};

export const editTermUser = async ({
  id,
  term,
}: {
  id: string;
  term: boolean;
}) => {
  await db
    .update(usersTable)
    .set({
      term: term,
    })
    .where(eq(usersTable.id, id))
    .returning({ id: usersTable.id });
};

export const deleteUser = async (id: string) => {
  await db
    .delete(usersTable)
    .where(eq(usersTable.id, id))
    // await db
    //   .update(usersTable)
    //   .set({
    //     is_active: false,
    //   })
    //   .where(eq(usersTable.id, id))
    .returning({ id: usersTable.id });
};
