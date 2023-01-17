import express from 'express';
import 'express-async-errors';

import authorize from '../../middlewares/auth.middleware';
import { validateAll } from '../../utils/validation';
import * as UserController from './controller';

const route = express.Router();

/**
 * Route to get current user info (all fields in User table)
 */
route.get('/me', authorize(), UserController.getUserInfo);

/**
 * Route to add mechanics
 *
 * Only owner that is allowed to add mechanics
 * Owner needs to have the garage first !
 */
route.post(
  '/mechanics',
  authorize('OWNER'),
  validateAll([]),
  UserController.addOneMechanic
);

/**
 * Route to edit user profile (customer, owner, and mechanics)
 */
route.put(
  '/:id',
  authorize(['CUSTOMER', 'MECHANIC', 'OWNER']),
  UserController.editUserProfile
);

export default route;
