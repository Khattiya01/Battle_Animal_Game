import { FormStateType } from "@/types/response";
import { exception } from "./common";

export class userException extends exception {
  static createFail(): FormStateType {
    return {
      code: 400,
      message: "Create user failed",
      success: false,
    };
  }

  static duplicate(): FormStateType {
    return {
      code: 400,
      message: "Duplicate user name",
      success: false,
    };
  }

  static notFound(): FormStateType {
    return {
      code: 404,
      message: "Not found user",
      success: false,
    };
  }

  static updateFail(): FormStateType {
    return {
      code: 422,
      message: "Update user error",
      success: false,
    };
  }

  static deleteFail(): FormStateType {
    return {
      code: 422,
      message: "Delete user error",
      success: false,
    };
  }
}
