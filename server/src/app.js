import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';
import AppError from './utils/AppError.js';

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api', limiter);


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(
        morgan('combined', {
            stream: {
                write: (message) => logger.info(message.trim())
            }
        })
    );
}


app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is OK'
    });
});


app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
