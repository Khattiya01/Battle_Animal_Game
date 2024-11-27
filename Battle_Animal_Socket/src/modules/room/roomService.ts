import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { logger } from '@src/server';
import { PaginatedResult } from 'prisma-pagination';
import { TypeCreateRoom, TypeUpdateRoom } from './roomModal';
import { roomRepository } from './roomRepository';
import { Room } from '@prisma/client';

export const roomService = {
  findAll: async ({ page, size }: { page: number; size: number }) => {
    try {
      const rooms = await roomRepository.findAllAsync({ page, size });
      if (!rooms) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Rooms found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<PaginatedResult<Room>>(ResponseStatus.Success, 'Rooms found', rooms, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all rooms: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findById: async (id: string) => {
    try {
      const room = await roomRepository.findByIdAsync(id);
      if (!room) {
        return new ServiceResponse(ResponseStatus.Failed, 'Room not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Room>(ResponseStatus.Success, 'Room found', room, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding room with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  create: async (userId: string, payload: TypeCreateRoom) => {
    try {
      const room = await roomRepository.create(userId, payload);
      return new ServiceResponse<Room>(ResponseStatus.Success, 'Create room success', room, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error create room :, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  updateUserJoinRoom: async (id: string) => {
    try {
      const checkRoom = await roomRepository.findByIdAsync(id);
      if (!checkRoom) {
        return new ServiceResponse(ResponseStatus.Failed, 'Room not found', null, StatusCodes.NOT_FOUND);
      }
      const room = await roomRepository.updateUserJoinRoom(id);
      return new ServiceResponse<Room>(ResponseStatus.Success, 'Room found', room, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding room with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateUserLeaveRoom: async (id: string) => {
    try {
      const checkRoom = await roomRepository.findByIdAsync(id);
      if (!checkRoom) {
        return new ServiceResponse(ResponseStatus.Failed, 'Room not found', null, StatusCodes.NOT_FOUND);
      }
      const room = await roomRepository.updateUserLeaveRoom(id);
      return new ServiceResponse<Room>(ResponseStatus.Success, 'Room found', room, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding room with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateStatusRoom: async (id: string, statusRoom: 'Waiting' | 'Starting' | 'Ended') => {
    try {
      const checkRoom = await roomRepository.findByIdAsync(id);
      if (!checkRoom) {
        return new ServiceResponse(ResponseStatus.Failed, 'Room not found', null, StatusCodes.NOT_FOUND);
      }
      const room = await roomRepository.updateStatusRoom(id, statusRoom);
      return new ServiceResponse<Room>(ResponseStatus.Success, 'Room found', room, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding room with id ${id}:, ${(ex as Error).message}`;
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
