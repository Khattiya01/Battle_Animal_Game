import { User } from '@prisma/client';
import { TypePayloadLogin } from './authModel';
import prisma from '../../db';
import { Keys } from '@modules/user/userRepository';
import { EncryptDecrypt } from '@common/utils/password';
import jwt from 'jsonwebtoken';
import { env } from '@common/utils/envConfig';

export const authRepository = {
  findByUsername: async <Key extends keyof User>(Username: string, keys = Keys as Key[]) => {
    return prisma.user.findUnique({
      where: { Username: Username },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<User, Key> | null>;
  },

  login: async (payload: TypePayloadLogin) => {
    const user = await prisma.user.findUnique({
      where: { Username: payload.Username },
    });

    if (user?.Password) {
      const passowrd = EncryptDecrypt.decryption(user.Password);
      const token = jwt.sign({ userId: user.UserID }, env.JWT_SECRET, {
        expiresIn: env.ACCESS_EXPIRATION_MINUTES,
      });
      if (passowrd !== payload.Password) {
        return null;
      }
      return { user, token: token };
    }
    return null;
  },
};
