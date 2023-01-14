import express from 'express';
import 'express-async-errors';

import authorize from '../../middlewares/auth.middleware';

import * as UserController from './controller';

const route = express.Router();

route.get('/me', authorize(), UserController.getUserInfo);

export default route;
