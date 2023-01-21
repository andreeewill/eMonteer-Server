import { Garage } from '@prisma/client';

import DB from '../database/db.database';
import { HttpError } from '../utils/error';

export const getGarageById = async (garageId: string) => {
  try {
    const result = await DB.garage.findUnique({
      where: { id: garageId },
      include: { owner: true, mechanics: true },
    });

    return result;
  } catch (error: any) {
    const err = new HttpError(
      `Database Error: ${error.message}`,
      'INTERNAL_SERVER_ERROR'
    );
    err.setDatabaseCode(error.code as string);
    throw err;
  }
};

export const getAllGarageLocation = async () => {
  try {
    const result = await DB.garage.findMany({
      select: { id: true, name: true, latitude: true, longitude: true },
    });

    return result;
  } catch (error: any) {
    const err = new HttpError(
      `Database Error: ${error.message}`,
      'INTERNAL_SERVER_ERROR'
    );
    err.setDatabaseCode(error.code as string);
    throw err;
  }
};

export const addOneGarage = async (payload: Garage, userId: string) => {
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
        contact_number: payload.contact_number,
        open_day: payload.open_day,
        open_hour: payload.open_hour,
        owner: {
          connect: {
            vendor_id: ownerDetail?.vendor_id,
          },
        },
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
