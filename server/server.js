import app from './src/app.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import logger from './src/utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });

        process.on('unhandledRejection', (err) => {
            logger.error('UNHANDLED REJECTION! Shutting down...');
            logger.error(err.name, err.message);
            server.close(() => {
                process.exit(1);
            });
        });

        process.on('uncaughtException', (err) => {
            logger.error('UNCAUGHT EXCEPTION! Shutting down...');
            logger.error(err.name, err.message);
            process.exit(1);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
