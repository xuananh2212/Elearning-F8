var express = require("express");
var router = express.Router();
const authRouter = require('./api/auth');
const userRouter = require('./api/user');
router.use("/auth/v1", authRouter);
router.use("/user/v1", userRouter);
module.exports = router;