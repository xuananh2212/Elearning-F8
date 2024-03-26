const express = require('express');
const router = express.Router();
const answerController = require('../../controllers/api/answer.controller');
router.post('/', answerController.addAnswer);
module.exports = router;