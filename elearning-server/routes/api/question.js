const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/api/question.controler');
router.post('/', questionController.addQuestion);
router.post('/:id', questionController.editQuestion);
router.delete('/:id', questionController.deleteQuestion);
module.exports = router;