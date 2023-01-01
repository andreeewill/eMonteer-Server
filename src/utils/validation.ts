import { ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

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
    //! Error Ocurred
    return res.status(400).json({
      success: false,
      error: errors.array({ onlyFirstError: false }),
    });
  };
