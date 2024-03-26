import bcrypt from 'bcrypt';
import  User  from '../models/user.js';
import auth from 'basic-auth';
import logger from '../config/logger.js';
import generateVerificationToken from '../middleware/authToken.js'
import publishMessage from '../middleware/publishMessage.js'


class UserService {
  async getCurrentUser(req, res) {
    try {
        const user = await auth(req);
        const currentUser = await User.findOne({where: {username: user.name}})

        // Check if the account is verified
  //   if (!currentUser.account_verification) {
  //     throw new Error('Account not verified');
  // }
  if(currentUser.account_verified == false){
    return ({ status: 401 , message: 'User not verified!' });
  }

      if (!currentUser) {
        throw new Error('User not found');
      }

      return { status: 200, userResponse : {
        id: currentUser.id,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        username: currentUser.username,
        account_created: currentUser.account_created,
        account_updated: currentUser.account_updated,
    }};
    } catch (error) {
      logger.error('Error in getCurrentUser ', error.message);
      throw new Error('Internal Server Error');
    }
  }

  async updateCurrentUser(req, res, { first_name, last_name, password }) {
    try {
      const user = await auth(req);

      const currentUser = await User.findOne({where: {username: user.name}})

      // Check if the account is verified
      if(currentUser.account_verified == false){
        return ({ status: 401 , message: 'User not verified!' });
      }
      
     if (!currentUser) {
      throw new Error('User not found');
      }
     
      if(first_name){currentUser.first_name = first_name;}
      
      if(last_name){currentUser.last_name = last_name;}
      
      if (password && password.trim() !== '') {
        logger.info('Updating password for user ', currentUser.username);
        currentUser.password = await bcrypt.hash(password, 10);
      }

      currentUser.account_updated = new Date();
      await currentUser.save();
      logger.info('User details updated successfully');
      return ( {status: 204, message: 'User details updated successfully' });
    } catch (error) {
      logger.error('Error in updateCurrentUser ', error.message);
      throw new Error('Internal Server Error');
    }
  }

  async createUser({ req,first_name, last_name, password, username }) {
    try {
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = generateVerificationToken();

      const newUser = await User.create({
        username: username,
        password: hashedPassword,
        first_name: first_name,
        last_name: last_name,
        user_verified: false,
        verification_token: verificationToken

        //  account_created: new Date(),
        //  account_updated: new Date(),
      });
      const verificationLink = `${req.protocol}://${req.get('host')}${req.originalUrl}/authenticate?verificationToken=${verificationToken}`;
            logger.info(verificationLink);

       publishMessage( verificationLink, username);

      
   logger.info('New user created successfully!')
      return {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        username: newUser.username,
        account_created: newUser.account_created,
        account_updated: newUser.account_updated,
        account_verified: newUser.account_verified,
      };
    } catch (error) {
      logger.error('Error in createUser service', error.message);
      throw new Error('Internal Server Error');
    }
  }
}

export default new UserService();
