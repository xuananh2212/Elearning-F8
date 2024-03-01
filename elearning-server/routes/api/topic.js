var express = require('express');
var router = express.Router();
var topicController = require('../../controllers/api/topic.controller');
router.post('/', topicController.addTopic)
module.exports = router;