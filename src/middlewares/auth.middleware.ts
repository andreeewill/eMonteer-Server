import { Response, NextFunction } from 'express';

import { findUserByEmail } from '../service/user.service';
import { CustomRequest } from '../common/basic.types';
import { HttpError } from '../utils/error';
import { verifyAuthToken } from '../utils/token';
import { createHMACSignature } from '../utils/crypto';

/**
 * Route guard middleware
 *
 * @description This middleware is used by routes that can only be accessed by authenticated users
 * @description CSFT token in request headers is mandatory to prevent CSRF attacks
 * @returns
 */
const authorize =
  () => async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.cookies.authorization) {
      throw new HttpError('Unauthorized user', 'UNAUTHORIZED');
    }

    // Verify csrf token
    const jwtToken = (req.cookies.authorization as string).replace(
      'Bearer ',
      ''
    );
    if (
      !req.headers.csrf ||
      req.headers.csrf !== createHMACSignature(jwtToken)
    ) {
      throw new HttpError('Invalid CSRF token', 'BAD_REQUEST');
    }

    const tokenResult = await verifyAuthToken(jwtToken);

    req.user = await findUserByEmail(tokenResult.email);

    return next();
  };

export default authorize;
