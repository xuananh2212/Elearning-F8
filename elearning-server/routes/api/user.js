var express = require('express');
var router = express.Router();
const userController = require('../../controllers/api/user.controller');
const verifyToken = require('../../middlewares/verifyToken');
router.get('/profile', verifyToken, userController.handleProfile);
module.exports = router;