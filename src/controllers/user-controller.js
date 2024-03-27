import userService from '../services/user-service.js';
import User from '../models/user.js';
import authRoute from '../middleware/authRoute.js';
import auth from 'basic-auth';
import logger from '../config/logger.js';
import moment from 'moment'; // Import the moment library for date/time manipulation

const validateCreateUserFields = ({ first_name, last_name, password, username }) => {
  const isString = (value) => {
    return typeof value === 'string' || value instanceof String;
  };
  if (!isString(first_name) || !isString(last_name) || !isString(password) || !isString(username)) {
    logger.error('Bad Request, All fields must be strings');
    return 'Bad Request, All fields must be strings';
  }
  if (!first_name || !last_name || !password || !username) {
    logger.error('Bad Request, All fields are required');
    return 'Bad Request, All fields are required';
  }
  if (!first_name.trim() || !last_name.trim()) {
    logger.error('Bad Request, First name and last name are required');
    return 'Bad Request, First name and last name are required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    logger.error('Bad Request, Invalid email address');
    return 'Bad Request, Invalid email address';
  }
  if (
    first_name.trim() === '' ||
    last_name.trim() === '' ||
    username.trim() === '' ||
    password.trim() === ''
  ) {logger.error('Bad Request! All fields must be non-empty.');
    return { error: 'Bad Request! All fields must be non-empty.' };
  }
  return null; 
};


const validateUpdateUserFields = ({ first_name, last_name, password }) => {
  const isString = (value) => {
    return typeof value === 'string' || value instanceof String;
  };
  if (!isString(first_name) || !isString(last_name) || !isString(password) ) {
    logger.error('Bad Request, All fields must be strings');
    return 'Bad Request, All fields must be strings';
  }
  if (!first_name || !last_name || !password ) {
    logger.error('Bad Request, All fields are required');
    return 'Bad Request, All fields are required';
  }
  if (!first_name.trim() || !last_name.trim()) {
    logger.error('Bad Request, First name and last name are required');
    return 'Bad Request, First name and last name are required';
  }
  if (
    first_name.trim() === '' ||
    last_name.trim() === '' ||
    password.trim() === ''
  ) {logger.error('Bad Request! All fields must be non-empty.');
    return { error: 'Bad Request! All fields must be non-empty.' };
  }
  return null; 
};

export const getCurrentUser = async (req, res) => {
  logger.debug('Attempting to get Current User...');

  try {
    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
      logger.warn('Bad Request, Empty request body in getCurrentUser');
      return res.status(400).end();
    }
    if (req.get('Content-Length') && parseInt(req.get('Content-Length')) !== 0) {
      logger.warn('Invalid Content-Length for GET request');
      return res.status(400).send();
    }
    const status = await authRoute(req, res); 
    if (status === 200) {
        const userResponse = await userService.getCurrentUser(req, res);
        return res.status(userResponse.status).json(userResponse.userResponse);
      } else {
        return res.status(status).send("");
      }
  } catch (error) {
    logger.error('Error in getting Current User of getCurrentUser', error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const updateCurrentUser = async (req, res) => {
  logger.debug('Attempting to update the current User...');

  try {
   
    const status = await authRoute(req, res); 

    if(status ===200) {
        if (Object.keys(req.body).length === 0) {
          logger.warn('Bad Request, Empty request body in updateCurrentUser');
            return res.status(400).json({ message: 'Bad Request, Empty request body' });
         }
         if (Object.keys(req.query).length > 0 ) {
          logger.warn('Bad Request for updating Current User in updateCurrentUser');

          return res.status(400).end();
        }
         
        // Validate fields
       
        const validationError = validateUpdateUserFields(req.body);
        if (validationError) {
          logger.error('Validation error in updateCurrentUser', validationError);
          return res.status(400).json({ message: validationError });
        }
        const { first_name, last_name, password, username, id, account_created, account_updated } = req.body;

          // Check for additional fields in the request
        const allowedFields = ['first_name', 'last_name', 'password'];
        const receivedFields = Object.keys(req.body);

        const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));
         if (invalidFields.length > 0) {
          logger.warn('Invalid fields in updateCurrentUser', invalidFields);
         return res.status(400).json({ message: 'Invalid fields!' });
          }
        
        if(username || id || account_created || account_updated){
            logger.warn('User is trying to update invalid fields in updateCurrentUser');
            return res.status(400).send({
                message: "User is trying to update the invalid fields!"
            });
    }
    
    const userResponse = await userService.updateCurrentUser(req, res, { first_name, last_name, password });
    return res.status(userResponse.status).json(userResponse.message);}else {
        return res.status(status).send("");
      }

  } catch (error) {
    logger.error('Error in updateCurrentUser ', error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  logger.debug('Attempting to create new User...');

  try {
    if (Object.keys(req.query).length > 0 ) {
      return res.status(400).end();
    }
    const user = await auth(req);
    if (user) {
      logger.warn('Bad request! User is authenticated in createUser ', user);
      return res.status(400).json({ message: 'Bad request! Authentication is not allowed for this operation.' });
    }
   
    // Validate fields
       
    const validationError = validateCreateUserFields(req.body);
    if (validationError) {
      logger.error('Validation error in createUser ', validationError);
      return res.status(400).json({ message: validationError });
    }
    const { first_name, last_name, password, username } = req.body;

   // Check for additional fields in the request
   const allowedFields = ['first_name', 'last_name', 'username', 'password'];
   const receivedFields = Object.keys(req.body);

   const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));
   if (invalidFields.length > 0) {
    logger.error('Invalid fields in createUser', invalidFields);
     return res.status(400).json({ message: 'Invalid fields!' });
   }

    // Check if user with the email already exists
    const existingUser = await User.findOne({ where: { username: username } });
    if (existingUser) {
      logger.warn('User already exists in createUser', username);
      return res.status(400).json({ message: 'Bad Request, User already exists!' });
    }

    const userResponse = await userService.createUser({ req, first_name, last_name, password, username });
    return res.status(201).json(userResponse);
  } catch (error) {
    logger.error('Error in createUser', error.message);
    return res.status(500).json({ error: error.message });
  }  
};

export const verifyUser = async (req, res) => {
  try {
    const { verificationToken } = req.query;
    logger.info(req.url);
    if (!verificationToken) {
      return res.status(400).json({ error: 'Verification token is missing.' });
    }

    // Find the user by the verification token
    const user = await User.findOne({ where: { verification_token: verificationToken } });

    if (!user) {
      return res.status(404).json({ error: 'User not found or invalid verification token.' });
    }
    // Check if the token has expired
    const tokenExpirationTime = moment(user.account_created).add(2, 'minutes');
    if (moment() > tokenExpirationTime) {
      return res.status(400).json({ error: 'Verification token has expired.' });
    }
    // Mark the user as verified
    user.account_verified = true;
    user.verificationToken = null; // Optionally clear the verification token from the user record
    await user.save();
    const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>User Verification Successful!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
          margin: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>User Verified</h1>
        <p>Congratulations! You have been successfully verified.</p>
        <img src="https://www.emugifs.net/wp-content/uploads/2021/07/Minions-Applause-GIF-Reaction-for-Congratulations-Well-Done-or-Excellent-Performance-Download-for-Free-and-Share-on-Facebook-Comment-or-WhatsApp-Messenger.gif" alt="Verified Image" style="max-width: 100%;">
      </div>
    </body>
    </html>
    
  `;
  return res.status(200).header('Content-Type', 'text/html').send(htmlResponse);  } catch (error) {
    logger.error('Error in user verification:', error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
};

