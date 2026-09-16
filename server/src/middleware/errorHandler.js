import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.statusCode >= 500) {
        logger.error(err.message, { stack: err.stack });
    } else {
        logger.warn(err.message);
    }

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    }

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message
        });
    }

    logger.error('UNEXPECTED ERROR: ', err);

    return res.status(500).json({
        success: false,
        status: 'error',
        message: 'Something went wrong!'
    });
};


export default errorHandler;
