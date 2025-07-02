import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
  text,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const gamesTable = pgTable("games", {
  id: uuid("id").default(uuidv4()).primaryKey(),
  name: varchar("name").notNull().unique(),
  description: text("description"),
  count_play: decimal("count_play"),
  image_url: text("image_url").notNull(),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type Insertgame = typeof gamesTable.$inferInsert;
export type Selectgame = typeof gamesTable.$inferSelect;
export type Deletegame = {
  id: string;
};
export type Updategame = {
  id: string;
  name?: string;
  description?: string;
  count_play?: string;
  image_url?: string;
  is_active?: boolean;
  created_at?: Date | null | undefined;
  updated_at?: Date | null | undefined;
};

export const insertGameSchema = createInsertSchema(gamesTable, {
  name: z.string().min(1, { message: "game name is required" }),
  description: z.string().optional(),
  count_play: z.string().optional(),
  image_url: z.string().min(1, { message: "File URL is required" }),
  is_active: z.boolean().optional(),
});

export const updateGameSchema = createInsertSchema(gamesTable, {
  id: z.string().min(1, { message: "game ID is required" }),
  name: z.string().min(1, { message: "game name is required" }),
  description: z.string().optional(),
  count_play: z.string().optional(),
  image_url: z.string().optional(),
  is_active: z.boolean().optional(),
});

export const updateIsActivegameSchema = createInsertSchema(gamesTable, {
  id: z.string().min(1, { message: "game ID is required" }),
  name: z.string().optional(),
  description: z.string().optional(),
  count_play: z.string().optional(),
  image_url: z.string().optional(),
  is_active: z.boolean(),
});

export const deleteGameSchema = createInsertSchema(gamesTable, {
  id: z.string().min(1, { message: "game ID is required" }),
  name: z.string().optional(),
  description: z.string().optional(),
  count_play: z.string().optional(),
  image_url: z.string().optional(),
  is_active: z.boolean().optional(),
});
