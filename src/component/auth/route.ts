/* eslint-disable security/detect-unsafe-regex */
import express from 'express';
import 'express-async-errors';
import { body } from 'express-validator';

import { validateAll } from '../../utils/validation';
import * as AuthController from './controller';

const route = express.Router();

route.post(
  '/register',
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
    body('contact_number')
      .exists()
      .withMessage('contact_number must be filled')
      .isLength({ min: 10 })
      .withMessage('contact_number must be at least 10 chars long'),
  ]),
  AuthController.registerBasic
);

route.post(
  '/login/basic',
  validateAll([
    body('email').exists().withMessage('Email must be filled'),
    body('password').exists().withMessage('Password must be filled'),
  ]),
  AuthController.loginBasic
);

export default route;
