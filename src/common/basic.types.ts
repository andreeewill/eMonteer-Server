import { Request } from 'express';
import { User } from '@prisma/client';

export interface CustomRequest<T = any> extends Request {
  body: T;
  user?: Partial<User> | null;
}
