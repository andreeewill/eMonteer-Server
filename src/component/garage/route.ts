import express from 'express';
import { body } from 'express-validator';

import * as GarageController from './controller';
import { validateAll } from '../../utils/validation';
import authorize from '../../middlewares/auth.middleware';

const route = express();

route.post(
  '/',
  authorize('OWNER'),
  validateAll([
    body('name')
      .exists()
      .withMessage('Full name must be filled')
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 chars long'),

    body('address')
      .exists()
      .withMessage('address must be filled')
      .isLength({ min: 10 })
      .withMessage('Address must be at least 10 chars long'),

    body('latitude')
      .isFloat()
      .withMessage('Latitude coordinate is not a valid float point'),

    body('longitude')
      .isFloat()
      .withMessage('Longitude coordinate is not a valid float point'),

    body('speciality')
      .exists()
      .withMessage('Speciality must be filled')
      .isIn(['ALL', 'CAR', 'MOTOR'])
      .withMessage('Speciality should be ALL/CAR/MOTOR'),

    body('contact_number')
      .exists()
      .withMessage('contact_number must be filled')
      .isLength({ min: 10 })
      .withMessage('contact_number must be at least 10 chars long'),

    body('open_hour').exists().withMessage('open_hour must be filled'),
    body('open_day').exists().withMessage('open_day must be filled'),
  ]),
  GarageController.addGarage
);

export default route;
