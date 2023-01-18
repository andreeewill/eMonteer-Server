import { User, UserDetail } from '@prisma/client';

import DB from '../database/db.database';
import { HttpError } from '../utils/error';
import { encryptPassword } from '../utils/crypto';
import { generateVendorId } from '../utils/vendor';
import { getGarageById } from './garage.service';

/**
 * General User
 */
export const findUserByEmail = async (email: string) => {
  try {
    return await DB.user.findUnique({
      where: { email },
      include: { userDetail: true },
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

/**
 * Customer
 */
export const createOneCust = async (payload: User) => {
  const { email, name, contact_number } = payload;
  const hashedPassword = await encryptPassword(payload.password);

  try {
    return await DB.user.create({
      data: { email, name, password: hashedPassword, contact_number },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
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

/**
 * Owner
 */
export const createOneOwner = async (
  payload: User,
  file: Express.Multer.File
) => {
  const { email, name, contact_number, address } = payload;
  const hashedPassword = await encryptPassword(payload.password);
  const vendorId = generateVendorId('OWNER');

  try {
    return await DB.user.create({
      data: {
        email,
        name,
        contact_number,
        password: hashedPassword,
        address,
        role: 'OWNER',
        userDetail: {
          create: {
            vendor_id: vendorId,
            identity_url: file.path,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        userDetail: {
          select: {
            vendor_id: true,
            identity_url: true,
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

/**
 * Mechanic
 */
export const createOneMechanic = async (
  payload: User & UserDetail,
  file: Express.Multer.File,
  garageId: string
) => {
  const { email, name, contact_number, address } = payload;
  const hashedPassword = await encryptPassword(payload.password);
  const vendorId = generateVendorId('MECHANIC');

  const isExists = await getGarageById(garageId);

  if (!isExists) {
    throw new HttpError('Garage does not exists!', 'BAD_REQUEST');
  }

  try {
    return await DB.userDetail.create({
      data: {
        user: {
          create: {
            email,
            name,
            contact_number,
            address,
            password: hashedPassword,
            role: 'MECHANIC',
          },
        },
        mechanic_garage: {
          connect: {
            id: garageId,
          },
        },
        vendor_id: vendorId,
        identity_url: file.path,
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        mechanic_garage: {
          select: {
            id: true,
          },
        },
        vendor_id: true,
        identity_url: true,
      },
    });
  } catch (error: any) {
    const err = new HttpError('Database Error', 'INTERNAL_SERVER_ERROR');
    err.setDatabaseCode(error.code as string);
    throw err;
  }
};
