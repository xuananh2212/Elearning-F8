const express = require('express');
const router = express.Router();
const upload = require("../../middlewares/multer");
const verifyToken = require("../../middlewares/verifyToken");
const uploadController = require("../../controllers/api/upload.controller");
router.post('/image', verifyToken, upload.single('image'), uploadController.handleUploadImage);
module.exports = router;