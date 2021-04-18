const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/users/me', authenticate, userController.show);
router.patch('/users/me', authenticate, userController.updateProfile);
router.patch('/users/me/password', authenticate, userController.updatePassword);

module.exports = router;
