import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import logger from './utils/logger';
import AuthRouter from './component/auth/route';

dotenv.config();

const app = express();

// Middlewares and Parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(
    `[${req.protocol} - ${req.method}] ${req.hostname}${req.originalUrl}`,
    { label: 'HTTP' }
  );
  next();
});

// Routes
app.use('/auth', AuthRouter);

app.listen(process.env.PORT, () => {
  logger.info(`Listening on port ${process.env.PORT}`, {
    label: 'Server',
  });
});
