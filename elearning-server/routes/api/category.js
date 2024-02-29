const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/api/category.controller');
router.get('/', categoryController.getAll);
router.post('/', categoryController.addcategory);
module.exports = router;