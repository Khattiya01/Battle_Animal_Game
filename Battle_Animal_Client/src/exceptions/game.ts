import { FormStateType } from "@/types/response";
import { exception } from "./common";

export class gameException extends exception {
  static createFail(): FormStateType {
    return {
      code: 400,
      message: "Create game failed",
      success: false,
    };
  }

  static duplicate(): FormStateType {
    return {
      code: 400,
      message: "Duplicate game name",
      success: false,
    };
  }

  static notFound(): FormStateType {
    return {
      code: 404,
      message: "Not found game",
      success: false,
    };
  }

  static updateFail(): FormStateType {
    return {
      code: 422,
      message: "Update game error",
      success: false,
    };
  }

  static deleteFail(): FormStateType {
    return {
      code: 422,
      message: "Delete game error",
      success: false,
    };
  }
}
