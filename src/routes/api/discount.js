const express = require('express');
const router = express.Router();
const discountController = require("../../controllers/api/discount.controller");
router.get('/', discountController.getAll);
router.post('/delete/many-discount', discountController.handleDeleteManyDiscount)
router.post('/:id', discountController.handleEditDiscount);
router.post('/', discountController.handleAddDiscount);
router.delete('/:id', discountController.handleDeleteDiscount);
module.exports = router;