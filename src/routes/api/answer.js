const express = require('express');
const router = express.Router();
const answerController = require('../../controllers/api/answer.controler');
router.post('/', answerController.addAnswer);
module.exports = router;