const express = require('express');
const router = express.Router();
const roleRoutes = require('./role.router');
const adminRoutes = require('./admin.router');
// Role routes
router.use('/roles', roleRoutes);
router.use('/admin', adminRoutes);





// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});


module.exports = router;
