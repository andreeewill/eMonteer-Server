import { Response } from 'express';
import { User, UserDetail } from '@prisma/client';

import { CustomRequest, CustomAuthRequest } from '../../common/basic.types';
import { createOneMechanic } from '../../service/user.service';
import ResProvider from '../../provider/httpResponse.provider';
import { HttpError } from '../../utils/error';

export const getUserInfo = (req: CustomRequest, res: Response) => {
  ResProvider(res, {
    options: { message: 'Get user info success', statusCode: 200 },
    data: req.user,
  });
};

export const addOneMechanic = async (
  req: CustomAuthRequest<User & UserDetail & { garage_id: string }>,
  res: Response
) => {
  if (!req.file)
    throw new HttpError('identity is not a file type', 'BAD_REQUEST');

  const result = await createOneMechanic(
    req.body,
    req.file,
    req.body.garage_id
  );

  ResProvider(res, {
    options: { message: 'Add mechanic success!', statusCode: 201 },
    data: result,
  });
};

export const editUserProfile = (
  req: CustomAuthRequest<User & UserDetail>,
  res: Response
) => {
  ResProvider(res, {});
};
