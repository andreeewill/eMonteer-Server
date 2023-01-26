// import { Order } from '@prisma/client';

import DB from '../database/db.database';
import { OrderPayload } from '../common/basic.types';
import { HttpError } from '../utils/error';

export const createOneOrder = async (
  payload: OrderPayload,
  userId: string,
  mechVendorId: string,
  garageId: string
) => {
  try {
    return await DB.order.create({
      data: {
        pickup_latitude: payload.pickup_latitude,
        pickup_longitude: payload.pickup_longitude,
        pickup_address: payload.pickup_address,
        service_cost: 0,
        customer_paid: 0,
        user: {
          connect: {
            id: userId,
          },
        },
        garage: {
          connect: {
            id: garageId,
          },
        },
        mechanic: {
          connect: {
            vendor_id: mechVendorId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  } catch (error: any) {
    const err = new HttpError(
      `Database Error: ${error.message}`,
      'INTERNAL_SERVER_ERROR'
    );
    err.setDatabaseCode(error.code as string);
    throw err;
  }
};
