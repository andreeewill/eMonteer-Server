import { ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

import { HttpError } from './error';

//* Error Handling
export const validateAll =
  (validations: ValidationChain[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    await Promise.allSettled(
      validations.map((validation) => validation.run(req))
    );

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const error = new HttpError(
      'Request validation error',
      'UNPROCESSABLE_ENTITY'
    );
    error.setValidatorError(errors.array({ onlyFirstError: false }));

    return next(error);
  };
