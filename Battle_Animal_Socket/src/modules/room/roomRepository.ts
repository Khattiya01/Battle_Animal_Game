import { createPaginator } from 'prisma-pagination';
import prisma from '@src/db';
import { TypeCreateRoom, TypeUpdateRoom } from './roomModal';
import { Prisma, Room } from '@prisma/client';

export const Keys = [
  'id',
  'status',
  'maxUsers',
  'currentUsers',
  'isPrivate',
  'roomName',
  'createdAt',
  'updatedAt',
  'createdBy',
  'student',
];

export const roomRepository = {
  findAllAsync: async <Key extends keyof Room>({
    page,
    size,
    keys = Keys as Key[],
  }: {
    page: number;
    size: number;
    keys?: Key[];
  }) => {
    const perPage = size;
    const paginate = createPaginator({ perPage: perPage });
    return await paginate<Room, Prisma.RoomFindManyArgs>(
      prisma.room,
      {
        include: {
          messages: true,
          users: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      { page: page }
    );
  },

  findByIdAsync: async <Key extends keyof Room>(id: string, keys = Keys as Key[]) => {
    return prisma.room.findUnique({
      where: {
        id: id,
      },
      include: {
        messages: {
          include: {
            user: true,
          },
        },
        users: true,
      },
    }) as Promise<Pick<Room, Key> | null>;
  },

  create: async (userId: string, payload: TypeCreateRoom) => {
    const setPayload = {
      roomName: payload.body.roomName,
      createdBy: userId,
    };
    return prisma.room.create({
      data: setPayload,
    });
  },

  updateCountPLayer: async (id: string) => {
    return prisma.room.update({
      where: { id: id },
      data: {
        currentUsers: {
          increment: 1, // เพิ่มค่า currentUsers ขึ้น 1
        },
      },
    });
  },

  updateUserJoinRoom: async (id: string) => {
    return prisma.room.update({
      where: { id: id },
      data: {
        currentUsers: { increment: 1 }, // เพิ่มจำนวน currentUsers
      },
    });
  },

  updateUserLeaveRoom: async (id: string) => {
    return prisma.room.update({
      where: { id: id },
      data: {
        currentUsers: { decrement: 1 }, // ลดจำนวน currentUsers
      },
    });
  },

  updateStatusRoom: async (id: string, statusRoom: 'Waiting' | 'Starting' | 'Ended') => {
    return prisma.room.update({
      where: { id: id },
      data: {
        status: statusRoom,
      },
    });
  },
};
