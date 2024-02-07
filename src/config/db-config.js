import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

console.log(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD);
// const sequelize = new Sequelize('nodeexpressmysql', 'root', 'rootroot', {
//     host: 'localhost',
//     dialect: 'mysql'
// });
const sequelize = new Sequelize(process.env.DB_DATABASE || 'nodeexpressmysql', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool : {
        max : process.env.POOL.max,
        min : process.env.POOL.min,
        acquire : process.env.POOL.acquire,
        idle : process.env.POOL.idle
    },
        
    //    // Option to create the database if it doesn't exist
    // define: {
    //     charset: 'utf8mb4',
    //     collate: 'utf8mb4_unicode_ci',
    //     timestamps: false,
    // },
    // // Option to create the database if it doesn't exist
    // sync: { force: process.env.DB_FORCE_SYNC === 'true' },
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


