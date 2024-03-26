import express from 'express';
import * as userController from '../controllers/user-controller.js';

const userRoute = express.Router();

// Get current user details
userRoute.get('/self', userController.getCurrentUser);

// Update current user details
userRoute.put('/self', userController.updateCurrentUser);

// Create a new user
userRoute.post('/', userController.createUser);

userRoute.all('/self', (req, res) => {
  return res.status(405).end();
});

userRoute.get('/authenticate', userController.verifyUser);

userRoute.all('*', (req, res) => {
  res.status(404).end();
});

export default userRoute;
