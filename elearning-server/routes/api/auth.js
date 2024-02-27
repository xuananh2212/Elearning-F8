var express = require('express');
var router = express.Router();
var authController = require('../../controllers/api/auth.controller');
router.post('/login', authController.handleLogin);
router.post('/resgiter', authController.handleRegister);
module.exports = router;