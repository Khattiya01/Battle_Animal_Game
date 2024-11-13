import { Message, Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import prisma from '@src/db';
import { TypeCreateMessage } from './messageModel';

export const Keys = ['id', 'name'];
export const messageRepository = {
  findAllAsync: async <Key extends keyof Message>({
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
    return await paginate<Message, Prisma.MessageFindManyArgs>(
      prisma.room,
      {
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
      },
      { page: page }
    );
  },

  findByIdAsync: async <Key extends keyof Message>(id: string, keys = Keys as Key[]) => {
    return prisma.message.findUnique({
      where: { id: id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<Message, Key> | null>;
  },

  // findByRoomNameAsync: async <Key extends keyof Room>(roomName: string, keys = Keys as Key[]) => {
  //   return prisma.room.findUnique({
  //     where: { roomName: roomName },
  //     select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  //   }) as Promise<Pick<Room, Key> | null>;
  // },
  create: async (userId: string, payload: TypeCreateMessage) => {
    const setPayload = {
      content: payload.body.content,
      UserID: userId,
      roomId: payload.body.roomId,
    };
    return prisma.message.create({
      data: setPayload,
    });
  },
};
