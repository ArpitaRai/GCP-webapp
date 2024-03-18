import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import logger from './logger.js';

dotenv.config();


const sequelize = new Sequelize(process.env.MYSQL_DATABASE || 'nodeexpressmysql', process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql'
});

// Sync the database and create tables if they don't exist
sequelize.sync({ force: process.env.DB_FORCE_SYNC === 'true' })
    .then(() => {
        logger.info('Database synchronized successfully');
    })
    .catch((error) => {
        logger.fatal('Error syncing database:', error);
    });


sequelize.authenticate()
.then(()=>{
    logger.info("connected . . .")
})
.catch(err=>{
    logger.fatal("Error :: ", err);
})




export default sequelize;


