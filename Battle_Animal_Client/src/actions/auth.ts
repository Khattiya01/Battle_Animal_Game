"use server";

import { userException } from "@/exceptions/users";
import { loginSchema } from "@/schemas/auth";
import {
  getUsersByEmailIsActive,
  getUsersByUsernameIsActive,
} from "@/services/users";
import { checkPassword } from "@/utils/checkPassword";

import jwt from "jsonwebtoken";

export async function loginAction(formData: FormData) {
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  const validatedFields = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return userException.createError("The username or password is incorrect.");
  }

  if (username && password) {
    let user = null;
    const responseGetUsersByUsername = await getUsersByUsernameIsActive({
      username,
    });
    if (
      !(responseGetUsersByUsername && responseGetUsersByUsername.length > 0)
    ) {
      const responseGetUsersByEmail = await getUsersByEmailIsActive({
        email: username,
      });
      if (!(responseGetUsersByEmail && responseGetUsersByEmail.length > 0)) {
        return userException.createError("not-found-user");
      } else {
        user = responseGetUsersByEmail[0];
      }
    } else {
      user = responseGetUsersByUsername[0];
    }

    const isValidPassword = await checkPassword({
      password,
      hashedPassword: user.password,
    });

    if (!isValidPassword) {
      return userException.createError("invalid-password");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET ?? "");
    return {
      success: true,
      message: "Login successfully",
      result: { user: user, token: token },
    };
  } else {
    return userException.createError("username, password are required.");
  }
}
