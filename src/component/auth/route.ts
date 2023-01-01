/* eslint-disable security/detect-unsafe-regex */
import express from 'express';
import { body } from 'express-validator';

import DB from '../../database/db.database';
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
      .withMessage('Please enter a valid email address')
      .custom(async (value: string) => {
        const user = await DB.user.findUnique({ where: { email: value } });
        if (user) throw new Error('User already exists');
      }),
    body('password')
      .exists()
      .withMessage('Password must be filled')
      .isString()
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

export default route;
