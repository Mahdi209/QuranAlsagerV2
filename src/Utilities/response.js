const handleMongooseOperation = async (query, options = {}) => {
    const {
        populate = [],
        select = '',
        sort = { createdAt: -1 },
        page = 1,
        limit = 10,
        lean = true
    } = options;

    try {
        if (populate.length > 0) {
            populate.forEach(path => {
                query = query.populate(path);
            });
        }

        if (select) {
            query = query.select(select);
        }

        query = query.sort(sort);

        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }

        const data = await (lean ? query.lean() : query.exec());

        const total = await query.model.countDocuments(query.getFilter());

        return {
            data,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        throw error;
    }
};

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

const sendPaginatedResponse = async (res, query, options = {}) => {
    try {
        const result = await handleMongooseOperation(query, options);
        return sendResponse(res, {
            items: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        return sendResponse(res, null, error.message, 500);
    }
};

module.exports = {
    sendResponse,
    sendPaginatedResponse,
    handleMongooseOperation
};
