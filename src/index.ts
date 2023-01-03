import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import { HttpError } from './utils/error';
import ResProvider from './provider/httpResponse.provider';
import logger, { loggerHTTP } from './utils/logger';
import AuthRouter from './component/auth/route';

const app = express();

// Middlewares and Parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerHTTP);

// Routes
app.use('/auth', AuthRouter);

/**
 * Express default error handler
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    return ResProvider(res, { err });
  }
  // Unhandled error
  return next(err);
});

app.listen(process.env.PORT, () => {
  logger.info(`Listening on port ${process.env.PORT || 8000}`, {
    label: 'Server',
  });
});
