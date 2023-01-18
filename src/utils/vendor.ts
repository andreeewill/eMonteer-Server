import uniqid from 'uniqid';
import moment from 'moment';
import { Role } from '@prisma/client';

/**
 * Create unique vendor ID based on user role
 *
 * Vendor ID format :
 * 1. owner : OWN#<Date created in DDMMYY format><5 digit of uuid>
 * 2. mechanics : MEC#<Date created in DDMMYY><5 digit of uuid>
 */

export const generateVendorId = (role: Role) => {
  const uuidv4 = uniqid();

  const prefix = role === 'OWNER' ? 'OWN' : 'MEC';
  const vendorUuid = uuidv4.substring(uuidv4.length - 5);
  const date = moment().format('DDMMYY');

  return `${prefix}#${date.toString()}${vendorUuid}`;
};
