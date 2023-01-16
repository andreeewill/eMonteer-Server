import { Response } from 'express';
import { User, UserDetail } from '@prisma/client';
import { CustomRequest, CustomAuthRequest } from '../../common/basic.types';

import ResProvider from '../../provider/httpResponse.provider';

export const getUserInfo = (req: CustomRequest, res: Response) => {
  ResProvider(res, {
    options: { message: 'Get user info success', statusCode: 200 },
    data: req.user,
  });
};

export const editUserProfile = (
  req: CustomAuthRequest<User & UserDetail>,
  res: Response
) => {};
