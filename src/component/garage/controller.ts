import { Response } from 'express';
import { Garage } from '@prisma/client';

import { CustomAuthRequest } from '../../common/basic.types';
import { addOwnerGarage } from '../../service/garage.service';
import ResProvider from '../../provider/httpResponse.provider';

/**
 * Controller to add garage (exclusive for owner)
 * @param req Custom express request
 * @param res Express response
 */
export const addGarage = async (
  req: CustomAuthRequest<Garage>,
  res: Response
) => {
  const result = await addOwnerGarage(req.body, req.user.id);

  ResProvider(res, {
    options: {
      message: 'Add garage success!',
      statusCode: 201,
    },
    data: result,
  });
};
