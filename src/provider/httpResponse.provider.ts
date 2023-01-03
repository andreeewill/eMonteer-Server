import type { Response } from 'express';

import { HttpStatusCode } from '../common/statusCode';
import { HttpError } from '../utils/error';

interface ResponseDetails {
  err?: HttpError;
  options?: {
    statusCode?: HttpStatusCode;
    message?: string;
  };
  data?: any;
}

/**
 * Construct server's response based on given argument
 * @param res - Express response object
 * @param param1
 */
const responseProvider = (res: Response, details: ResponseDetails) => {
  const { err, options, data } = details;

  let statusCode;
  const baseResponse = {
    success: true,
    message: options?.message || 'Success',
    errors: {},
    data: undefined,
    code: 0,
  };

  if (err) {
    baseResponse.success = false;
    statusCode = err.statusCode || 500;

    switch (statusCode) {
      case 422: {
        baseResponse.message = err.message;
        baseResponse.errors = err.fields;
        break;
      }

      case 500: {
        baseResponse.message =
          'Internal server error, please contact help desk';
        if (err.databaseCode) {
          baseResponse.code = err.databaseCode;
        }
        break;
      }

      default: {
        // Unhandled error condition, please add error code handler when getting this message
        baseResponse.message = 'Unknown error, please contact help desk';
      }
    }
    // eslint-disable-next-line no-console
    console.log('ERROR', err);
  } else {
    statusCode = options?.statusCode || 200;
    baseResponse.data = data;
  }

  return res.status(statusCode).json(baseResponse);
};

export default responseProvider;
