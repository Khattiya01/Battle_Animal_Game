import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { logger } from '@src/server';
import { PaginatedResult } from 'prisma-pagination';
import { Message, Room } from '@prisma/client';
import { messageRepository } from './messageRepository';
import { TypeCreateMessage } from './messageModel';

export const messageService = {
  findAll: async ({ page, size }: { page: number; size: number }) => {
    try {
      const messages = await messageRepository.findAllAsync({ page, size });
      if (!messages) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Message found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<PaginatedResult<Message>>(
        ResponseStatus.Success,
        'Message found',
        messages,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding all messages: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

    // findByRoomId: async (id: string) => {
    //   try {
    //     const user = await userRepository.findByIdAsync(id);
    //     if (!user) {
    //       return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
    //     }
    //     return new ServiceResponse<User>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    //   } catch (ex) {
    //     const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
    //     logger.error(errorMessage);
    //     return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    //   }
    // },

  create: async (userId: string, payload: TypeCreateMessage) => {
    try {
      const message = await messageRepository.create(userId, payload);
      return new ServiceResponse<Message>(ResponseStatus.Success, 'Create message success', message, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error create message :, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  //   update: async (id: string, payload: TypeUpdateUser) => {
  //     try {
  //       const checkUser = await userRepository.findByIdAsync(id);
  //       if (!checkUser) {
  //         return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
  //       }
  //       const user = await userRepository.update(id, payload);
  //       return new ServiceResponse<User>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
  //     } catch (ex) {
  //       const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
  //       logger.error(errorMessage);
  //       return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
  //     }
  //   },

  //   delete: async (id: string) => {
  //     try {
  //       const checkUser = await userRepository.findByIdAsync(id);
  //       console.log(checkUser);
  //       if (!checkUser) {
  //         return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
  //       }
  //       await userRepository.delete(id);
  //       return new ServiceResponse<string>(ResponseStatus.Success, 'User found', 'Delete user success', StatusCodes.OK);
  //     } catch (ex) {
  //       const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
  //       logger.error(errorMessage);
  //       return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
  //     }
  //   },
};
