import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

import { findUserByEmail } from '../service/user.service';
import { CustomRequest } from '../common/basic.types';
import { HttpError } from '../utils/error';
import { verifyAuthToken } from '../utils/token';
import { validateUserRole } from '../utils/validation';
import { createHMACSignature } from '../utils/crypto';

/**
 * Route guard middleware
 *
 * @description This middleware is used by routes that can only be accessed by authenticated users
 * @description CSFT token in request headers is mandatory to prevent CSRF attacks
 * @returns
 */
const authorize =
  (role?: Role | Role[]) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
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

    // Check if user is permitted to use this endpoint
    const isAllowed = validateUserRole(tokenResult.role, role);

    if (!isAllowed)
      throw new HttpError('Not allowed to perform this action', 'UNAUTHORIZED');

    req.user = await findUserByEmail(tokenResult.email);

    return next();
  };

export default authorize;
