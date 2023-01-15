import { Garage } from '@prisma/client';

import DB from '../database/db.database';
import { HttpError } from '../utils/error';

export const addOwnerGarage = async (payload: Garage, userId: string) => {
  try {
    // get owner vendor detail (user detail)
    const ownerDetail = await DB.userDetail.findFirst({
      where: {
        user_id: userId,
      },
    });

    return await DB.garage.create({
      data: {
        name: payload.name,
        address: payload.address,
        latitude: payload.latitude,
        longitude: payload.longitude,
        speciality: payload.speciality,
        contact_number: payload.speciality,
        open_day: payload.open_day,
        open_hour: payload.open_hour,
        userDetail: {
          connect: {
            vendor_id: ownerDetail?.vendor_id,
          },
        },
      },
    });
  } catch (error: any) {
    const err = new HttpError('Database Error', 'INTERNAL_SERVER_ERROR');
    err.setDatabaseCode(error.code as string);
    throw err;
  }
};
