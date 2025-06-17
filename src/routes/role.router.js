const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { verifyToken, isAdmin } = require('../middleware/Authentication');

// router.use(verifyToken, isAdmin);

router.post('/', roleController.create);
router.get('/', roleController.getAll);
router.get('/:id', roleController.getById);
router.put('/:id', roleController.update);
router.delete('/:id', roleController.delete);

module.exports = router;
