import { User } from '@prisma/client';

import DB from '../database/db.database';
import { HttpError } from '../utils/error';
import { encryptPassword } from '../utils/crypto';

export const createOneUser = async (payload: User) => {
  try {
    const { email, name, contact_number } = payload;
    const hashedPassword = await encryptPassword(payload.password);

    return await DB.user.create({
      data: { email, name, password: hashedPassword, contact_number },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  } catch (error: any) {
    const err = new HttpError('Database Error', 'INTERNAL_SERVER_ERROR');
    err.setDatabaseCode(error.code as string);
    throw err;
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    return await DB.user.findUnique({ where: { email } });
  } catch (error: any) {
    const err = new HttpError('Database Error', 'INTERNAL_SERVER_ERROR');
    err.setDatabaseCode(error.code as string);
    throw err;
  }
};
