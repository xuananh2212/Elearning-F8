var express = require("express");
var router = express.Router();
const userController = require("../controllers/api/user.controller");
const authController = require("../controllers/api/auth.controller");
const authMiddleware = require("../middlewares/api/auth.middleware");

router.get("/users", authMiddleware, userController.index);
router.get("/users/:id", userController.find);
router.post("/users", userController.store);
router.put("/users/:id", userController.update);
router.patch("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);
router.post("/auth/login", authController.login);
router.get("/auth/profile", authMiddleware, authController.profile);
router.post("/auth/logout", authMiddleware, authController.logout);
router.post("/auth/refresh", authController.refresh);

module.exports = router;