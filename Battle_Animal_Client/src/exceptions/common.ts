import { FormStateType } from "@/types/response";

export class exception {
  static createError(message?: string): FormStateType {
    return {
      code: 500,
      message: message ?? "Create Error",
      success: false,
      result: null
    };
  }

  static misMatchData(): FormStateType {
    return {
      code: 401,
      message: "Invalid data",
      success: false,
    };
  }
}
