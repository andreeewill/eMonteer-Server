import type { Response } from 'express';

import logger from '../utils/logger';
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

  let statusCode = options?.statusCode || 200;
  const baseResponse = {
    success: true,
    message: options?.message || 'Success',
    errors: {},
    data: undefined,
  };

  if (err) {
    baseResponse.success = false;
    statusCode = err.statusCode || 500;

    switch (err.statusCode) {
      case 422: {
        baseResponse.message = 'Not a Valid Data';
        baseResponse.errors = err.fields;
        break;
      }

      case 500: {
        baseResponse.message =
          'Internal server error, please contact help desk';

        break;
      }

      default: {
        // Unhandled error condition, please add error code handler when getting this message
        baseResponse.message = 'Unknown error, please contact help desk';
        logger.info('Unhandled Error', err);
      }
    }
    logger.error(`ERROR: something went wrong ${err.message}`, {
      label: 'HTTP',
    });
  } else {
    baseResponse.data = data;
  }

  return res.status(statusCode).json(baseResponse);
};

export default responseProvider;
