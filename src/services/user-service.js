import bcrypt from 'bcrypt';
import  User  from '../models/user.js';
import auth from 'basic-auth';

class UserService {
  async getCurrentUser(req, res) {
    try {
        const user = await auth(req);
        const currentUser = await User.findOne({where: {username: user.name}})
      if (!currentUser) {
        throw new Error('User not found');
      }

      return {
        id: currentUser.id,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        username: currentUser.username,
        account_created: currentUser.account_created,
        account_updated: currentUser.account_updated,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }

  async updateCurrentUser(req, res, { first_name, last_name, password }) {
    try {
      const user = await auth(req);

      const currentUser = await User.findOne({where: {username: user.name}})
      //console.log("currentUser", currentUser);
     if (!currentUser) {
      throw new Error('User not found');
      }
     
      if(first_name){currentUser.first_name = first_name;}
      
      if(last_name){currentUser.last_name = last_name;}
      
      if (password && password.trim() !== '') {
        console.log("password :: ", password);
        currentUser.password = await bcrypt.hash(password, 10);
      }

      currentUser.account_updated = new Date();
      await currentUser.save();
      return ({ message: 'User details updated successfully' });
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }

  async createUser({ first_name, last_name, password, username }) {
    try {
      
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username: username,
        password: hashedPassword,
        first_name: first_name,
        last_name: last_name,
        //  account_created: new Date(),
        //  account_updated: new Date(),
      });
      console.log("newuser:: ",newUser)

      return {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        username: newUser.username,
        account_created: newUser.account_created,
        account_updated: newUser.account_updated,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }
}

export default new UserService();
