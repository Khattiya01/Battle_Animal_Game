"use server";

import {
  deleteGameSchema,
  insertGameSchema,
  updateGameSchema,
  updateIsActivegameSchema,
} from "@/db/schemas/games";
import { gameException } from "@/exceptions/game";
import {
  addGame,
  deleteGame,
  editGame,
  editIsActiveGame,
  getGameById,
  getGameByName,
} from "@/services/games";
import { revalidatePath } from "next/cache";

export async function createGameAction(formData: FormData) {
  try {
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const image_url = formData.get("image_url")?.toString();

    const validatedFields = insertGameSchema.safeParse({
      name: name,
      image_url: image_url,
      description: image_url,
    });
    if (!validatedFields.success) {
      return gameException.createError("The name is incorrect.");
    }

    if (name && description && image_url) {
      const responseGetGameByname = await getGameByName({
        name,
      });
      if (responseGetGameByname && responseGetGameByname.length > 0) {
        return gameException.duplicate();
      }

      const payload = {
        name,
        description,
        image_url,
      };
      await addGame(payload);

      revalidatePath("/", "layout");
      return {
        success: true,
        message: "Create game successfully",
        result: null,
      };
    } else {
      return gameException.createError("name is required.");
    }
  } catch (error) {
    if (error instanceof Error) {
      return gameException.createError(error?.message);
    }
  }
}

export async function updateGameAction({
  formData,
  id,
}: {
  formData: FormData;
  id: string;
}) {
  try {
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const image_url = formData.get("image_url")?.toString();

    const validatedFields = updateGameSchema.safeParse({
      id,
      name,
      description,
      image_url,
    });

    if (!validatedFields.success) {
      return gameException.updateFail();
    }

    if (id && name && description && image_url) {
      const responseGameById = await getGameById(id);

      if (!responseGameById) {
        return gameException.createError("ID not found");
      }
      if (responseGameById.name !== name) {
        const responseGetGamesBNname = await getGameByName({
          name,
        });
        if (responseGetGamesBNname && responseGetGamesBNname.length > 0) {
          return gameException.duplicate();
        }
      }

      const payload = {
        id,
        name,
        description,
        image_url,
      };
      await editGame(payload);

      revalidatePath("/", "layout");
      return {
        success: true,
        message: "update game successfully",
        result: null,
      };
    } else {
      return gameException.createError("name are required.");
    }
  } catch (error) {
    if (error instanceof Error) {
      return gameException.createError(error?.message);
    }
  }
}
export async function updateIsActiveGameAction({
  formData,
  id,
}: {
  formData: FormData;
  id: string;
}) {
  try {
    const is_active = formData.get("is_active")?.toString();

    const validatedFields = updateIsActivegameSchema.safeParse({
      id,
      is_active: is_active === "true" ? true : false,
    });
    if (!validatedFields.success) {
      return gameException.updateFail();
    }

    if ((is_active === "true" || is_active === "false") && id) {
      await editIsActiveGame({
        id: id,
        is_active: is_active === "true" ? true : false,
      });

      revalidatePath("/", "layout");
      return {
        success: true,
        message: "update game successfully",
        result: null,
      };
    } else {
      return gameException.createError("isActive or id are required.");
    }
  } catch (error) {
    if (error instanceof Error) {
      return gameException.createError(error?.message);
    }
  }
}

export async function deleteGameAction({ id }: { id: string }) {
  try {
    const validatedFields = deleteGameSchema.safeParse({
      id: id,
    });
    if (!validatedFields.success) {
      return gameException.deleteFail();
    }

    if (id) {
      await deleteGame(id);

      revalidatePath("/", "layout");
      return {
        success: true,
        message: "delete game successfully",
        result: null,
      };
    } else {
      return gameException.createError("id is required.");
    }
  } catch (error) {
    if (error instanceof Error) {
      return gameException.createError(error?.message);
    }
  }
}
