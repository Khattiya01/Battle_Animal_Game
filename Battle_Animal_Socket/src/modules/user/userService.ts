import { StatusCodes } from "http-status-codes";

import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { userRepository } from "@modules/user/userRepository";
import { logger } from "@src/server";
import { User } from "@prisma/client";
import { PaginatedResult } from "prisma-pagination";
import { TypePayloadUser, TypeUpdateUser } from "./userModel";

export const userService = {
  findAll: async ({ page, size }: { page: number; size: number }) => {
    try {
      const users = await userRepository.findAllAsync({ page, size });
      if (!users) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "No Users found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse<PaginatedResult<User>>(
        ResponseStatus.Success,
        "Users found",
        users,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findById: async (id: string) => {
    try {
      const user = await userRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse<User>(
        ResponseStatus.Success,
        "User found",
        user,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  create: async (payload: TypePayloadUser) => {
    try {
      const checkUser = await userRepository.findByEmail(payload.Email);
      const checkUserName = await userRepository.findByUserName(
        payload.Username
      );
      if (checkUser) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Email already taken",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      if (checkUserName) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "UserName already taken",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const user = await userRepository.create(payload);
      return new ServiceResponse<User>(
        ResponseStatus.Success,
        "Create user success",
        user,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error create user :, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  update: async (id: string, payload: TypeUpdateUser) => {
    try {
      const checkUser = await userRepository.findByIdAsync(id);
      if (!checkUser) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      const user = await userRepository.update(id, payload);
      return new ServiceResponse<User>(
        ResponseStatus.Success,
        "User found",
        user,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  delete: async (id: string) => {
    try {
      const checkUser = await userRepository.findByIdAsync(id);
      if (!checkUser) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await userRepository.delete(id);
      return new ServiceResponse<string>(
        ResponseStatus.Success,
        "User found",
        "Delete user success",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
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
