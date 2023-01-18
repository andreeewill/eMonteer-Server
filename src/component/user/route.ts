/* eslint-disable security/detect-unsafe-regex */
import express from 'express';
import { body } from 'express-validator';
import 'express-async-errors';

import uploader from '../../provider/cloudinary.provider';
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
  uploader.dirname('vendor_identity').single('identity'),
  validateAll([
    body('email')
      .exists()
      .withMessage('Email must be filled')
      .isString()
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      .withMessage('Please enter a valid email address'),
    body('password')
      .exists()
      .withMessage('Password must be filled')
      .isLength({ min: 5, max: 255 })
      .withMessage('Password must be at least 5 chars long')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-z]).*$/)
      .withMessage(
        'Password must contain at least one uppercased and special character'
      ),
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
    body('contact_number')
      .exists()
      .withMessage('contact_number must be filled')
      .isLength({ min: 10 })
      .withMessage('contact_number must be at least 10 chars long'),
    body('garage_id').exists().withMessage('garage_id must be filled'),
  ]),
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
