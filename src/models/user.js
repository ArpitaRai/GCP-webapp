import sequelize from '../config/db-config.js'; 
import Sequelize, {DataTypes} from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

const User = sequelize.define("user",
  {
    id: {
      type: Sequelize.INTEGER,
      type: DataTypes.UUID, // Change the data type to UUID
      defaultValue: () => uuidv4(), 
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false

    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false

    },
  
},{
  timestamps: true, // Add timestamps to the table
  createdAt: 'account_created', 
  updatedAt: 'account_updated'
});

export default User;
