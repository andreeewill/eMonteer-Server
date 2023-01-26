import moment from 'moment';

export function generateSocketOrderId(orderId: string) {
  const orderDate = moment().format('DDMMYYhmms');

  return `socket-${orderId}-${orderDate}`;
}
