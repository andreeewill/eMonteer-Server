import express from 'express';

const route = express.Router();

route.get('/ok', (req, res) => {
  res.json({ success: 'oke' });
});

export default route;
