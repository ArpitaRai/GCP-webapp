import sequelize from '../config/db-config.js';
import logger from '../config/logger.js';

const healthzController = (req, res) => {
  if (!req.body) {
    logger.error('Invalid request: Request body is missing');
    return res.status(400).end();
  }

  if (req.method !== 'GET') {
    logger.error('Invalid request method:', req.method);
    return res.status(405).end();
  }

  if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
    logger.error('Invalid request: Query parameters or request body are present');
    return res.status(400).end();
  }

  if (req.get('Content-Length') && parseInt(req.get('Content-Length')) !== 0) {
    logger.error('Invalid Content-Length for GET request');
    return res.status(400).send();
  }

  logger.debug('Attempting database connection...');

  sequelize
    .authenticate()
    .then(() => {
      logger.info('Database connection successful');
      res.status(200).end();
    })
    .catch((error) => {
      logger.error('Database connection error:', error.message);
      res.status(503).end();
    });
    if (!res.headersSent) {
      logger.warn('Response not sent yet');
    }
};

export default healthzController;
