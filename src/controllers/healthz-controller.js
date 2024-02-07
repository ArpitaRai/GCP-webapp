import sequelize from '../config/db-config.js';

const healthzController = (req, res) => {
  if (!req.body) {
    return res.status(400).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
    return res.status(400).end();
  }

  if (req.get('Content-Length') && parseInt(req.get('Content-Length')) !== 0) {
    console.error('Invalid Content-Length for GET request');
    return res.status(400).send();
  }

  sequelize
    .authenticate()
    .then(() => {
      res.status(200).end();
    })
    .catch((error) => {
      console.error('Database connection error:', error.message);
      res.status(503).end();
    });
};

export default healthzController;
