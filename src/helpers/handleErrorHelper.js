const handleError = (res, logger, err) => {
    if (err.status && err.message) {
        logger.error(`Response: ${err.status} - ${err.message}`);
        return res.status(err.status).json({
            code: err.status,
            status: getStatusMessage(err.status),
            message: err.message,
        });
    } else {
        logger.error(`Response: 500 - Internal Server Error - ${err.message}`);
        return res.status(500).json({
            code: 500,
            status: "Internal Server Error",
            message: "Something went wrong",
        });
    }
};

const getStatusMessage = (statusCode) => {
    const messages = {
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        500: "Internal Server Error",
    };
    return messages[statusCode] || "Unknown Error";
};

module.exports = handleError;
