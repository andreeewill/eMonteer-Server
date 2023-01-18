import { Request } from 'express';
import { User } from '@prisma/client';

export interface CustomRequest<T = any> extends Request {
  body: T;
  user: Partial<User> | null;
}

export interface CustomAuthRequest<T = any> extends Request {
  body: T | any;
  user: User;
}
