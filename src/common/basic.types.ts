import { Request } from 'express';
import { User } from '@prisma/client';

export enum Category {
  NEAREST = 'nearest',
  FAVOURITE = 'favourite',
  '24H' = 'alwaysopen',
}

export interface OrderPayload {
  category: Category;
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_address: string;
  vehicle_type: 'car' | 'motor';
}

export interface CustomRequest<T = any> extends Request {
  body: T;
  user: Partial<User> | null;
}

export interface CustomAuthRequest<T = any> extends Request {
  body: T;
  user: User;
}
