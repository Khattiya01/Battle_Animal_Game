import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const usersTable = pgTable("users", {
  id: uuid("id").default(uuidv4()).primaryKey(),
  username: varchar("username").notNull().unique(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  is_active: boolean("is_active").default(true),
  role: varchar("role").notNull(), // 'admin' หรือ 'user'
  term: boolean("term").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type DeleteUser = {
  id: string;
};
export type UpdateUser = {
  username?: string;
  password?: string;
  email?: string;
  role?: string;
  id: string;
  is_active?: boolean;
  term?: boolean;
  created_at?: Date | null | undefined;
  updated_at?: Date | null | undefined;
};

export const insertUserSchema = createInsertSchema(usersTable, {
  role: z.string().min(1, { message: "Role is required" }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(10, "Password must not exceed 10 characters"),
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email().min(1, { message: "Email is required" }),
  is_active: z.boolean().optional(),
  term: z.boolean().optional(),
});

export const updateUserSchema = createInsertSchema(usersTable, {
  id: z.string().min(1, { message: "User ID is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email().min(1, { message: "Email is required" }),
  password: z.string().optional(),
  role: z.string().min(1, { message: "Role is required" }),
  is_active: z.boolean().optional(),
  term: z.boolean().optional(),
});

export const updateIsActiveUserSchema = createInsertSchema(usersTable, {
  id: z.string().min(1, { message: "User ID is required" }),
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  role: z.string().optional(),
  is_active: z.boolean(),
  term: z.boolean(),
});

export const deleteUserSchema = createInsertSchema(usersTable, {
  id: z.string().min(1, { message: "User ID is required" }),
  username: z.string().optional(),
  password: z.string().optional(),
  email: z.string().optional(),
  role: z.string().optional(),
  is_active: z.boolean().optional(),
  term: z.boolean().optional(),
});
