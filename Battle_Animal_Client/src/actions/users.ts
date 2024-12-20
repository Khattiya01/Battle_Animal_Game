"use server";

import {
  deleteUserSchema,
  insertUserSchema,
  updateIsActiveUserSchema,
  updateUserSchema,
} from "@/db/schemas";
import { userException } from "@/exceptions/users";
import {
  addUsers,
  deleteUser,
  editIsActiveUser,
  editUser,
  getUserById,
  getUsersByEmail,
  getUsersByUsername,
} from "@/services/users";
import { hashPassword } from "@/utils/hashPassword";
import { revalidatePath } from "next/cache";

export async function createUserAction(formData: FormData) {
  try {
    const username = formData.get("username")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const role = formData.get("role")?.toString();

    const validatedFields = insertUserSchema.safeParse({
      username: formData.get("username"),
      password: formData.get("password"),
      email: formData.get("email"),
      role: formData.get("role"),
    });
    if (!validatedFields.success) {
      return userException.createError(
        "The username or password is incorrect."
      );
    }

    if (username && password && role && email) {
      const responseGetUsersByUsername = await getUsersByUsername({
        username,
      });
      if (responseGetUsersByUsername && responseGetUsersByUsername.length > 0) {
        return userException.duplicate();
      }

      const hashedPassword = await hashPassword(password);

      const payload = {
        username,
        email: email,
        password: hashedPassword,
        role,
      };
      await addUsers(payload);

      revalidatePath("/", "layout");
      return {
        success: true,
        message: "Create user successfully",
        result: null,
      };
    } else {
      return userException.createError(
        "username, password, and role are required."
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return userException.createError(error?.message);
    }
  }
}

export async function updateUserAction({
  formData,
  id,
}: {
  formData: FormData;
  id: string;
}) {
  try {
    const username = formData.get("username")?.toString();
    const email = formData.get("email")?.toString();
    const role = formData.get("role")?.toString();
    const validatedFields = updateUserSchema.safeParse({
      id,
      username,
      email,
      role,
    });

    if (!validatedFields.success) {
      return userException.updateFail();
    }

    if (username && role && id && email) {
      const responseUserById = await getUserById(id);

      if (!responseUserById) {
        return userException.createError("ID not found");
      }
      if (responseUserById.username !== username) {
        const responseGetUsersByUsername = await getUsersByUsername({
          username,
        });
        if (
          responseGetUsersByUsername &&
          responseGetUsersByUsername.length > 0
        ) {
          return userException.duplicate();
        }
      }

      if (responseUserById.email !== email) {
        const responseGetUsersByEmail = await getUsersByEmail({
          email,
        });
        if (responseGetUsersByEmail && responseGetUsersByEmail.length > 0) {
          return userException.createError("Duplicate email");
        }
      }

      const payload = {
        id: id,
        username,
        email,
        role,
      };
      await editUser(payload);

      revalidatePath("/", "layout");
      return {
        success: true,
        message: "update user successfully",
        result: null,
      };
    } else {
      return userException.createError("username and role are required.");
    }
  } catch (error) {
    if (error instanceof Error) {
      return userException.createError(error?.message);
    }
  }
}
export async function updateIsActiveUserAction({
  formData,
  id,
}: {
  formData: FormData;
  id: string;
}) {
  try {
    const is_active = formData.get("is_active")?.toString();

    const validatedFields = updateIsActiveUserSchema.safeParse({
      id,
      is_active: is_active === "true" ? true : false,
    });
    if (!validatedFields.success) {
      return userException.updateFail();
    }

    if ((is_active === "true" || is_active === "false") && id) {
      await editIsActiveUser({
        id: id,
        is_active: is_active === "true" ? true : false,
      });

      revalidatePath("/", "layout");
      return {
        success: true,
        message: "update user successfully",
        result: null,
      };
    } else {
      return userException.createError("isActive or id are required.");
    }
  } catch (error) {
    if (error instanceof Error) {
      return userException.createError(error?.message);
    }
  }
}

export async function deleteUserAction({ id }: { id: string }) {
  try {
    const validatedFields = deleteUserSchema.safeParse({
      id: id,
    });
    if (!validatedFields.success) {
      return userException.deleteFail();
    }

    if (id) {
      await deleteUser(id);

      revalidatePath("/", "layout");
      return {
        success: true,
        message: "delete user successfully",
        result: null,
      };
    } else {
      return userException.createError("id is required.");
    }
  } catch (error) {
    if (error instanceof Error) {
      return userException.createError(error?.message);
    }
  }
}
