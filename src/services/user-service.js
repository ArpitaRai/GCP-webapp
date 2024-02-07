import bcrypt from 'bcrypt';
import  User  from '../models/user.js';
import auth from 'basic-auth';

class UserService {
  async getCurrentUser(req, res) {
    try {
        const user = await auth(req);
        const currentUser = await User.findOne({where: {userName: user.name}})
      if (!currentUser) {
        throw new Error('User not found');
      }

      return {
        id: currentUser.id,
        first_name: currentUser.firstName,
        last_name: currentUser.lastName,
        username: currentUser.userName,
        account_created: currentUser.createdAt,
        account_updated: currentUser.updatedAt,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }

  async updateCurrentUser(req, res, { first_name, last_name, password }) {
    try {
      const user = await auth(req);

      const currentUser = await User.findOne({where: {userName: user.name}})
      //console.log("currentUser", currentUser);
     if (!currentUser) {
      throw new Error('User not found');
      }
     
      if(first_name){currentUser.firstName = first_name;}
      
      if(last_name){currentUser.lastName = last_name;}
      
      if (password && password.trim() !== '') {
        console.log("password :: ", password);
        currentUser.password = await bcrypt.hash(password, 10);
      }

      currentUser.updatedAt = new Date();
      await currentUser.save();
      return ({ message: 'User details updated successfully' });
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }

  async createUser({ first_name, last_name, password, userName }) {
    try {
      
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        userName: userName,
        password: hashedPassword,
        firstName: first_name,
        lastName: last_name,
        //  account_created: new Date(),
        //  account_updated: new Date(),
      });
      console.log("newuser:: ",newUser)

      return {
        id: newUser.id,
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        userName: newUser.userName,
        account_created: newUser.createdAt,
        account_updated: newUser.updatedAt,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }
}

export default new UserService();
