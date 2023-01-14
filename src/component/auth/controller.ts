import type { Response } from 'express';
import type { User } from '@prisma/client';

import type { CustomRequest } from '../../common/basic.types';
import ResProvider from '../../provider/httpResponse.provider';
import {
  createOneCust,
  createOneOwner,
  findUserByEmail,
} from '../../service/user.service';
import { HttpError } from '../../utils/error';
import { comparePassword } from '../../utils/crypto';
import { createAuthToken } from '../../utils/token';

export const registerCustBasic = async (
  req: CustomRequest<User>,
  res: Response
) => {
  const isExists = await findUserByEmail(req.body.email);

  if (isExists) throw new HttpError('User already exists', 'BAD_REQUEST');

  const user = await createOneCust(req.body);

  ResProvider(res, {
    options: {
      message: 'User created! (customer)',
      statusCode: 201,
    },
    data: user,
  });
};

export const registerOwnerBasic = async (
  req: CustomRequest<User>,
  res: Response
) => {
  const isExists = await findUserByEmail(req.body.email);

  if (isExists) throw new HttpError('User already exists', 'BAD_REQUEST');
  if (!req.file)
    throw new HttpError('identity is not a file type', 'BAD_REQUEST');

  const owner = await createOneOwner(req.body, req.file);

  ResProvider(res, {
    options: {
      message: 'User created! (owner)',
      statusCode: 201,
    },
    data: owner,
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
