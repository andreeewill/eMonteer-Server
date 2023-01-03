import type { Response } from 'express';
import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';

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

  const result = await DB.user.create({
    data: { email, name, password, contact_number },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  ResProvider(res, {
    options: {
      message: 'User created !',
      statusCode: 201,
    },
    data: result,
  });
};
