import userService from '../services/user-service.js';
import User from '../models/user.js';
import authRoute from '../middleware/authRoute.js';
import auth from 'basic-auth';

const validateCreateUserFields = ({ first_name, last_name, password, userName }) => {
  if (!first_name || !last_name || !password || !userName) {
    return 'Bad Request, All fields are required';
  }
  if (!first_name.trim() || !last_name.trim()) {
    return 'Bad Request, First name and last name are required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userName)) {
    return 'Bad Request, Invalid email address';
  }
  if (
    first_name.trim() === '' ||
    last_name.trim() === '' ||
    userName.trim() === '' ||
    password.trim() === ''
  ) {
    return { error: 'Bad Request! All fields must be non-empty.' };
  }
  return null; 
};


const validateUpdateUserFields = ({ first_name, last_name, password }) => {
  if (!first_name || !last_name || !password ) {
    return 'Bad Request, All fields are required';
  }
  if (!first_name.trim() || !last_name.trim()) {
    return 'Bad Request, First name and last name are required';
  }
  if (
    first_name.trim() === '' ||
    last_name.trim() === '' ||
    password.trim() === ''
  ) {
    return { error: 'Bad Request! All fields must be non-empty.' };
  }
  return null; 
};

export const getCurrentUser = async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
      return res.status(400).end();
    }
    if (req.get('Content-Length') && parseInt(req.get('Content-Length')) !== 0) {
      console.error('Invalid Content-Length for GET request');
      return res.status(400).send();
    }
    const status = await authRoute(req, res); 
    if (status === 200) {
        const userResponse = await userService.getCurrentUser(req, res);
        return res.status(200).json(userResponse);
      } else {
        return res.status(status).send("");
      }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateCurrentUser = async (req, res) => {
  try {
   
    const status = await authRoute(req, res); 

    if(status ===200) {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Bad Request, Empty request body' });
         }
         if (Object.keys(req.query).length > 0 ) {
          return res.status(400).end();
        }
         
        // Validate fields
       
        const validationError = validateUpdateUserFields(req.body);
        if (validationError) {
          return res.status(400).json({ message: validationError });
        }
        const { first_name, last_name, password, userName, id, account_created, account_updated } = req.body;

          // Check for additional fields in the request
        const allowedFields = ['first_name', 'last_name', 'password'];
        const receivedFields = Object.keys(req.body);

        const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));
        console.log("invalidFields :: ", invalidFields, allowedFields, receivedFields);
         if (invalidFields.length > 0) {
         return res.status(400).json({ message: 'Invalid fields!' });
          }
        
        if(userName || id || account_created || account_updated){
            console.log("user is trying to update inalid fields!");
            return res.status(400).send({
                message: "User is trying to update the invalid fields!"
            });
    }
    
    const userResponse = await userService.updateCurrentUser(req, res, { first_name, last_name, password });
    return res.status(204).json(userResponse);}else {
        return res.status(status).send("");
      }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0 ) {
      return res.status(400).end();
    }
    const user = await auth(req);
    if (user) {
      console.log("User is authenticated:", user);
      return res.status(400).json({ message: 'Bad request! Authentication is not allowed for this operation.' });
    }
   
    // Validate fields
       
    const validationError = validateCreateUserFields(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const { first_name, last_name, password, userName } = req.body;

   // Check for additional fields in the request
   const allowedFields = ['first_name', 'last_name', 'userName', 'password'];
   const receivedFields = Object.keys(req.body);

   const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));
   console.log("invalidFields :: ", invalidFields, allowedFields, receivedFields);
   if (invalidFields.length > 0) {
     return res.status(400).json({ message: 'Invalid fields!' });
   }

    // Check if user with the email already exists
    const existingUser = await User.findOne({ where: { userName: userName } });
    if (existingUser) {
      return res.status(400).json({ message: 'Bad Request, User already exists!' });
    }

    const userResponse = await userService.createUser({ first_name, last_name, password, userName });
    return res.status(201).json(userResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
