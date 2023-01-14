import { Response } from 'express';
import { CustomRequest } from '../../common/basic.types';

import ResProvider from '../../provider/httpResponse.provider';

export const getUserInfo = (req: CustomRequest, res: Response) => {
  ResProvider(res, {
    options: { message: 'Get user info success', statusCode: 200 },
    data: req.user,
  });
};
