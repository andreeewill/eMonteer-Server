import 'dotenv/config';
import express from 'express';
import cors from 'cors';

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

app.listen(process.env.PORT, () => {
  logger.info(`Listening on port ${process.env.PORT}`, {
    label: 'Server',
  });
});
