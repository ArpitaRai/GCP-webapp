import healthzRoute from './healthz-route.js';
import userRoute from './user-route.js';

const routes = (app) => {
  // Include other routes if any
  app.use('/v2/user', userRoute);
  app.use('/', healthzRoute);
};

export default routes;