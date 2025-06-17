const bcrypt = require('bcryptjs');
const Admin = require('../models/admins');
const { signupSchema, loginSchema } = require('../Validation/admin.validation');
const { generateTokens, verifyRefreshToken } = require('../Utilities/tokens');
const { sendResponse } = require('../Utilities/response');

const signup = async (req, res) => {
    try {
        const { error } = signupSchema.validate(req.body);
        if (error) {
            return sendResponse(res, null, error.details[0].message, 400);
        }

        const { username, email, password, roleId } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return sendResponse(res, null, 'Email already registered', 400);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new Admin({
            username,
            email,
            password: hashedPassword,
            roleId
        });

        await admin.save();

        const { accessToken, refreshToken } = generateTokens(admin);

        admin.refreshToken = refreshToken;
        await admin.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const adminData = {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            roleId: admin.roleId
        };

        return sendResponse(res, { admin: adminData, accessToken });
    } catch (error) {
        console.error('Signup error:', error);
        return sendResponse(res, null, 'Internal server error', 500);
    }
};

const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return sendResponse(res, null, error.details[0].message, 400);
        }

        const { email, password } = req.body;

        const admin = await Admin.findOne({ email }).populate('roleId');
        if (!admin) {
            return sendResponse(res, null, 'Invalid email or password', 401);
        }

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return sendResponse(res, null, 'Invalid email or password', 401);
        }

        const { accessToken, refreshToken } = generateTokens(admin);

        admin.refreshToken = refreshToken;
        await admin.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const adminData = {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            roleId: admin.roleId
        };

        return sendResponse(res, { admin: adminData, accessToken }, null, 200);
    } catch (error) {
        console.error('Login error:', error);
        return sendResponse(res, null, 'Internal server error', 500);
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return sendResponse(res, null, 'No refresh token provided', 400);
        }

        const { valid, data } = verifyRefreshToken(refreshToken);
        if (!valid) {
            return sendResponse(res, null, 'Invalid refresh token', 401);
        }
        const admin = await Admin.findById(data.id);
        if (admin) {
            admin.tokenVersion += 1;
            admin.refreshToken = null;
            await admin.save();
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return sendResponse(res, "Logout Successful", null, 200);
    } catch (error) {
        console.error('Logout error:', error);
        return sendResponse(res, null, 'Internal server error', 500);
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return sendResponse(res, null, 'No refresh token provided', 400);
        }
        const { valid, data } = verifyRefreshToken(refreshToken);
        if (!valid) {
            return sendResponse(res, null, 'Invalid refresh token', 401);
        }
        const admin = await Admin.findById(data.id);
        if (!admin || admin.tokenVersion !== data.tokenVersion) {
            return sendResponse(res, null, 'Invalid refresh token', 401);
        }
        const tokens = generateTokens(admin);

        admin.refreshToken = tokens.refreshToken;
        await admin.save();

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return sendResponse(res, { accessToken: tokens.accessToken },null,200);
    } catch (error) {
        console.error('Token refresh error:', error);
        return sendResponse(res, null, 'Internal server error', 500);
    }
};

module.exports = {
    signup,
    login,
    logout,
    refreshAccessToken
};
