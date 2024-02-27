var express = require("express");
var router = express.Router();
const authRouter = require('./api/auth');
const userRouter = require('./api/user');
router.use(authRouter);
router.use(userRouter);
module.exports = router;