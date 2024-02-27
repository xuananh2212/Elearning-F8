var express = require('express');
var router = express.Router();
var authController = require('../../controllers/api/auth.controller');
var verifyToken = require('../../middlewares/verifyToken');
router.post('/login', authController.handleLogin);
router.post('/resgiter', authController.handleRegister);
router.get('/logout', verifyToken, authController.handleLogout);
module.exports = router;