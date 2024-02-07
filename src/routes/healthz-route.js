import express from 'express';
import healthzController from '../controllers/healthz-controller.js';

const healthzRoute = express.Router();

healthzRoute.get('/healthz', healthzController);

healthzRoute.all('/healthz', (req, res) => {
  return res.status(405).end();
});

healthzRoute.all('*', (req, res) => {
  res.status(404).end();
});

export default healthzRoute;

