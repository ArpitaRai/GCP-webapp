import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();


const sequelize = new Sequelize(process.env.MYSQL_DATABASE || 'nodeexpressmysql', process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql'
});

// Sync the database and create tables if they don't exist
sequelize.sync({ force: process.env.DB_FORCE_SYNC === 'true' })
    .then(() => {
        console.log('Database synchronized successfully');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });


sequelize.authenticate()
.then(()=>{
    console.log("connected . . .")
})
.catch(err=>{
    console.log("Error :: ", err);
})




export default sequelize;


