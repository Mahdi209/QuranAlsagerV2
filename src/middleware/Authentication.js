const jwt = require('jsonwebtoken');
const Admin = require('../models/admins');
const { sendResponse } = require('../Utilities/response');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return sendResponse(res, null, 'No token provided', 401);
        }
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return sendResponse(res, null, 'Invalid token', 401);
        }

        req.admin = admin;
        next();
    } catch (error) {
        return sendResponse(res, null, 'Invalid token', 401);
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.admin.role.name !== 'admin') {
            return sendResponse(res, null, 'Access denied. Admin role required.', 403);
        }
        next();
    } catch (error) {
        return sendResponse(res, null, 'Authorization error', 500);
    }
};

const isSupervisor = async (req, res, next) => {
    try {
        if (req.admin.role.name !== 'supervisor') {
            return sendResponse(res, null, 'Access denied. Supervisor role required.', 403);
        }
        next();
    } catch (error) {
        return sendResponse(res, null, 'Authorization error', 500);
    }
};

const isAdminOrSupervisor = async (req, res, next) => {
    try {
        if (!['admin', 'supervisor'].includes(req.admin.role.name)) {
            return sendResponse(res, null, 'Access denied. Admin or Supervisor role required.', 403);
        }
        next();
    } catch (error) {
        return sendResponse(res, null, 'Authorization error', 500);
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isSupervisor,
    isAdminOrSupervisor
};
