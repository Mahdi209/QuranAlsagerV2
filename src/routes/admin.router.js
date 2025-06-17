const express = require('express');
const router = express.Router();
const { signup, login, logout, refreshAccessToken } = require('../controllers/admin.controller');
const { verifyToken } = require('../middleware/Authentication');

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.post('/refresh-token', refreshAccessToken);

module.exports = router;
