import { eq, desc, and, count } from "drizzle-orm";
import { db } from "@/db";
import { v4 as uuidv4 } from "uuid";
import { gamesTable, Insertgame, Updategame } from "@/db/schemas/games";

export const getGames = async ({
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
      .from(gamesTable)
      .orderBy(desc(gamesTable.created_at))
      .limit(size)
      .offset(offset);

    const total = await db.select({ count: count() }).from(gamesTable);
    return { data, total: total[0].count };
  } catch (error) {
    console.error("Error fetching games:", error);
    throw new Error("Could not fetch games");
  }
};

export const getGameById = async (id: string) => {
  try {
    const data = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.id, id));
    return data && data?.length > 0 ? data[0] : undefined;
  } catch (error) {
    console.error("Error fetching game:", error);
    // throw new Error("Could not fetch products");
  }
};

export const getGameByName = async ({ name }: { name: string }) => {
  try {
    const data = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.name, name));

    return data;
  } catch (error) {
    console.error("Error fetching game by name:", error);
    throw new Error("Could not fetch game by name");
  }
};
export const getGamesByNameIsActive = async ({ name }: { name: string }) => {
  try {
    const data = await db
      .select()
      .from(gamesTable)
      .where(and(eq(gamesTable.name, name), eq(gamesTable.is_active, true)));

    return data;
  } catch (error) {
    console.error("Error fetching games by name:", error);
    throw new Error("Could not fetch games by name");
  }
};

export const addGame = async (data: Insertgame) => {
  await db.insert(gamesTable).values({
    id: uuidv4(),
    name: data.name,
    description: data.description,
    image_url: data.image_url,
    count_play: "0"
  });
};

export const editGame = async (data: Updategame) => {
  await db
    .update(gamesTable)
    .set({
      name: data.name,
      description: data.description,
      count_play: data.count_play,
      image_url: data.image_url,
      is_active: data.is_active,
    })
    .where(eq(gamesTable.id, data.id))
    .returning({ id: gamesTable.id });
};

export const editIsActiveGame = async ({
  id,
  is_active,
}: {
  id: string;
  is_active: boolean;
}) => {
  await db
    .update(gamesTable)
    .set({
      is_active: is_active,
    })
    .where(eq(gamesTable.id, id))
    .returning({ id: gamesTable.id });
};

export const deleteGame = async (id: string) => {
  await db
    .delete(gamesTable)
    .where(eq(gamesTable.id, id))
    .returning({ id: gamesTable.id });
};
