import express from 'express';

const route = express.Router();

route.get('/ok', (req, res) => {
  res.status(500).json({ success: 'oke' });
});

export default route;
