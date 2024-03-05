const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/api/category.controller');
router.get('/', categoryController.getAll);
router.post('/', categoryController.addCategory);
router.post('/:id', categoryController.editCategory);
router.delete('/:id', categoryController.deleteCategory);
module.exports = router;