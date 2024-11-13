import { Prisma, User } from "@prisma/client";
import { createPaginator } from "prisma-pagination";

import prisma from "@src/db";
import { TypePayloadUser, TypeUpdateUser } from "./userModel";
import { CapitalizeFirstLetter } from "@common/utils/CapitalizeFirstLetter";
import { EncryptDecrypt } from "@common/utils/password";

export const Keys = [
  "UserID",
  "Email",
  "Username",
  "FirstName",
  "LastName",
  "Tel",
  "Role",
  "CreatedAt",
  "UpdatedAt",
];

export const userRepository = {
  findAllAsync: async <Key extends keyof User>({
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
    return await paginate<User, Prisma.UserFindManyArgs>(
      prisma.user,
      {
        orderBy: {
          CreatedAt: "desc",
        },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
      },
      { page: page }
    );
  },

  findByIdAsync: async <Key extends keyof User>(
    id: string,
    keys = Keys as Key[]
  ) => {
    return prisma.user.findUnique({
      where: { UserID: id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<User, Key> | null>;
  },

  findByEmail: async <Key extends keyof User>(
    email: string,
    keys = Keys as Key[]
  ) => {
    return prisma.user.findUnique({
      where: { Email: email },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<User, Key> | null>;
  },

  findByUserName: async <Key extends keyof User>(
    userName: string,
    keys = Keys as Key[]
  ) => {
    return prisma.user.findUnique({
      where: { Username: userName },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<User, Key> | null>;
  },

  create: async (payload: TypePayloadUser) => {
    const trimEmail = payload.Email.trim();
    const fname = await CapitalizeFirstLetter(payload.FirstName);
    const lname = await CapitalizeFirstLetter(payload.LastName);
    const passowrd = await EncryptDecrypt.encryption(payload.Password);
    const setPayload: any = {
      Username: payload.Username,
      Email: trimEmail,
      Password: passowrd,
      FirstName: fname,
      LastName: lname,
      Tel: payload?.Tel,
      Role: 0,
    };
    return prisma.user.create({
      data: setPayload,
    });
  },

  update: async (id: string, payload: TypeUpdateUser) => {
    return prisma.user.update({
      where: { UserID: id },
      data: payload,
    });
  },

  delete: async (id: string) => {
    return prisma.user.delete({
      where: { UserID: id },
    });
  },
};
