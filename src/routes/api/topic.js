var express = require('express');
var router = express.Router();
var topicController = require('../../controllers/api/topic.controller');
router.post('/', topicController.addTopic);
router.post('/sort/many', topicController.handleSortManyTopic);
router.post('/:id', topicController.editTopic);
router.delete('/:id', topicController.deleteTopic);
module.exports = router;