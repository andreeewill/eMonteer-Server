# Order strategy / flow (step by step)

1. To create new order (search garage), client will hit to `/api/order` to initialize order flow
2. if success, server will create an order based on client location, category (now only 'nearest' is supported), client_vehicle, **AND** will return a `socket-orderId` which is an id to represent the current customer order
3. On getting `socket-orderId`, server has found the nearest garage to be called and assigned the available mechanics to the order (for mechanic socket flow will be explained separately)
4.

NOTE: a new Socket ID is generated upon reconnection, so every time a user gets disconnected and reconnects, it will get a new user ID.
