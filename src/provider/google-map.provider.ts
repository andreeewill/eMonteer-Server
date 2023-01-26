import { Client } from '@googlemaps/google-maps-services-js';

import { getAllGarageLocation } from '../service/garage.service';
import { HttpError } from '../utils/error';

const client = new Client({});

interface Location {
  lat: number;
  lng: number;
}
/**
 * Find nearest garage from a given locations
 *
 * @param pickupLocation customer's pickup location
 */

export const findNearestGarage = async (pickupLocation: Location) => {
  try {
    const garages = await getAllGarageLocation();

    const origins = garages.map((garage) => ({
      lat: garage.latitude as number,
      lng: garage.longitude as number,
    }));

    const { data } = await client.distancematrix({
      params: {
        key: process.env.GOOGLE_MAPS_API_KEY as string,
        origins,
        destinations: [pickupLocation],
      },
    });

    const result = data.rows.reduce(
      (acc, val, idx) => {
        const distance = val.elements[0].distance.value;

        if (idx === 0 || distance < acc.distance) {
          return {
            distance,
            garageMapAddress: data.origin_addresses[`${idx}`],
            garageId: garages[`${idx}`].id,
          };
        }

        return acc;
      },
      { distance: 0, garageMapAddress: '', garageId: '' }
    );

    return result;
  } catch (error: any) {
    throw new HttpError(
      `findNearestGarage error: ${error.message}`,
      'INTERNAL_SERVER_ERROR'
    );
  }
};
