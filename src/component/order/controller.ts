import { Response } from 'express';

import io from '../../provider/socket.provider';
import { createOneOrder } from '../../service/order.service';
import { CustomAuthRequest, Category } from '../../common/basic.types';
import ResProvider from '../../provider/httpResponse.provider';

interface OrderPayload {
  category: Category;
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_address: string;
  vehicle_type: 'car' | 'motor';
}

export const createOrder = async (
  req: CustomAuthRequest<OrderPayload>,
  res: Response
) => {
  // find nearest garage and find the active mechanic

  const result = await createOneOrder(req.body, '', '', '');

  ResProvider(res, {});
};
