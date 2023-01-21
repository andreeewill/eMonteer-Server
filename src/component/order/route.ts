import express from 'express';
import { body } from 'express-validator';

import { createOrder } from './controller';
import { validateAll } from '../../utils/validation';
import authorize from '../../middlewares/auth.middleware';

const route = express();

/**
 * API to create new order (nearest, favorite, 24H)
 */
route.post(
  '/',
  authorize('CUSTOMER'),
  validateAll([
    body('category')
      .exists()
      .withMessage('category must be filled')
      .isIn(['nearest', 'favorite', 'alwaysopen'])
      .withMessage('category should be nearest/favorite/alwaysopen'),
    body('pickup_latitude')
      .isFloat()
      .withMessage('Latitude coordinate is not a valid float point'),

    body('pickup_longitude')
      .isFloat()
      .withMessage('Longitude coordinate is not a valid float point'),
    body('pickup_address')
      .exists()
      .withMessage('pickup_address must be filled'),
    body('vehicle_type')
      .exists()
      .withMessage('vehicle_type must be filled')
      .isIn(['car', 'motor'])
      .withMessage('vehicle_type should be car/motor'),
  ]),
  createOrder
);

export default route;
