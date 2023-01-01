import type { Response } from 'express';
// import bcrypt from 'bcrypt';

import type { User } from '@prisma/client';
// import logger from '../../utils/logger';
import DB from '../../database/db.database';
import type { CustomRequest } from '../../common/basic.types';

export const registerBasic = (req: CustomRequest<User>, res: Response) => {
  const { email, name, contact_number } = req.body;
  const password = req.body.password;

  const result = DB.user.create({
    data: { email, name, password, contact_number },
  });

  return res.status(200).json({
    success: true,
    data: result,
  });
};
