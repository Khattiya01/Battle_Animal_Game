import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { TypePayloadLogin } from "./authModel";
import { authRepository } from "./authRepository";
import { StatusCodes } from "http-status-codes";
import { logger } from "@src/server";
import { User } from "@prisma/client";

export const authService = {
  login: async (payload: TypePayloadLogin) => {
    try {
      const checkUser = await authRepository.findByUsername(payload.Username);
      if (!checkUser) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Incorrect email or password",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }
      const user = await authRepository.login(payload);

      if (!user) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Incorrect password",
          null,
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }
      return new ServiceResponse<{ user: User; token: string }>(
        ResponseStatus.Success,
        "Login success",
        user,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error login :, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
