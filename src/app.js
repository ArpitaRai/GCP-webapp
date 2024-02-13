import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import sequelize from './config/db-config.js';

const app = express();

var corsOptions = {
    origin: 'http://localhost:8080'
}

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


sequelize.sync()
    .then(() => {
        console.log('Database connected and models synchronized');
    })
    .catch((error) => {
        console.error('Error syncing models with the database:', error);
    });

// Error handling for JSON parsing
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && error.message.includes('JSON') && error.type === 'entity.parse.failed' && 'body' in error) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.status(400).end();
    }
    next();
});

// --Health Check Endpoint call--
// Set Cache-Control globally
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});


routes(app);

// port
const PORT = process.env.PORT || 8080;

// server
app.listen(PORT,()=> {
    console.log(`Server is running on PORT number: ${PORT}`)
})

export default app;

