import { Response } from 'express';

import io from '../../provider/socket.provider';
import { createOneOrder } from '../../service/order.service';
import { CustomAuthRequest, OrderPayload } from '../../common/basic.types';
import { findNearestGarage } from '../../provider/google-map.provider';
import { generateSocketOrderId } from '../../utils/order';
import ResProvider from '../../provider/httpResponse.provider';

export const createOrder = async (
  req: CustomAuthRequest<OrderPayload>,
  res: Response
) => {
  // find nearest garage from customer pickup location
  const { pickup_latitude, pickup_longitude } = req.body;
  const { distance, garageId, garageMapAddress } = await findNearestGarage({
    lat: pickup_latitude,
    lng: pickup_longitude,
  });

  const result = await createOneOrder(req.body, '', '', garageId);
  const socketId = generateSocketOrderId(result.id);

  // find random mechanic based on the active socket
  // mechanic socket is expected to have garageId prop
  for (const [, socket] of io.of('/mechanics').sockets) {
    if (socket.data.garageId === garageId) {
      socket.join(socketId);
      return;
    }
  }

  ResProvider(res, {
    options: { message: 'Order created!', statusCode: 201 },
    data: {
      socketId,
      garageLocation: garageMapAddress,
      garageDistance: distance,
    },
  });
};
