# Order strategy / flow (step by step)

1. on creating new order (search garage), client **MUST** create socket connection to the server first.
2. Once connected, server will response

NOTE: a new Socket ID is generated upon reconnection, so every time a user gets disconnected and reconnects, it will get a new user ID.
