
const sendResponse = (res, data = null, error = null, statusCode = 200) => {
    const response = {};

    if (error) {
        response.success = false;
        response.error = error;
        response.data = null;
    } else {
        response.success = true;
        response.error = null;
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

module.exports = {
    sendResponse
};
