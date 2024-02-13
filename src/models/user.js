import sequelize from '../config/db-config.js'; 
import Sequelize, {DataTypes} from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

const User = sequelize.define("users",
  {
    id: {
      type: Sequelize.INTEGER,
      type: DataTypes.UUID, // Change the data type to UUID
      defaultValue: () => uuidv4(), 
      allowNull: false,
      primaryKey: true,
    },
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false

    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false

    },
    // account_created: {
    //   type: Sequelize.DATE,
    //   allowNull: false,
    // },
    // account_updated: {
    //   type: Sequelize.DATE,
    //   allowNull: false,
    // },
  
});

export default User;
