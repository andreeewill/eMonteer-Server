import type { Response } from 'express';
import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { HttpError } from '../../utils/error';
import type { CustomRequest } from '../../common/basic.types';
// import logger from '../../utils/logger';
import ResProvider from '../../provider/httpResponse.provider';
import DB from '../../database/db.database';

export const registerBasic = async (
  req: CustomRequest<User>,
  res: Response
) => {
  const { email, name, contact_number } = req.body;
  const password = await bcrypt.hash(
    req.body.password,
    parseInt(process.env.HASH_ROUNDS || '10', 10)
  );

  let result;
  try {
    result = await DB.user.create({
      data: { email, name, password, contact_number },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  } catch (error: any) {
    const err = new HttpError('Database Error', 'INTERNAL_SERVER_ERROR');
    err.setDatabaseCode(error.code as number);
    throw err;
  }

  ResProvider(res, {
    options: {
      message: 'User created !',
      statusCode: 201,
    },
    data: result,
  });
};

// export const loginBasic = async (req: CustomRequest<User>, res: Response) => {
//   const { email, password } = req.body;
// };
