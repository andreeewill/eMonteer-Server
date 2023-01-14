import type { Response } from 'express';
import type { User } from '@prisma/client';

import type { CustomRequest } from '../../common/basic.types';
import ResProvider from '../../provider/httpResponse.provider';
import { createOneUser, findUserByEmail } from '../../service/user.service';
import { HttpError } from '../../utils/error';
import { comparePassword } from '../../utils/crypto';
import { createAuthToken } from '../../utils/token';

export const registerBasic = async (
  req: CustomRequest<User>,
  res: Response
) => {
  const isExists = await findUserByEmail(req.body.email);

  if (isExists) throw new HttpError('User already exists', 'BAD_REQUEST');

  const user = await createOneUser(req.body);

  ResProvider(res, {
    options: {
      message: 'User created !',
      statusCode: 201,
    },
    data: user,
  });
};

export const loginBasic = async (req: CustomRequest<User>, res: Response) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user || !comparePassword(password, user.password))
    throw new HttpError('Email or password is incorrect', 'UNAUTHORIZED');

  const { jweToken, csrfToken } = await createAuthToken(user);
  res.cookie('authorization', `Bearer ${jweToken}`);

  ResProvider(res, {
    options: {
      message: 'Logic success!',
      statusCode: 200,
    },
    data: {
      csrfToken,
    },
  });
};
