const express = require('express');
const router = express.Router();
const lessonController = require('../../controllers/api/lesson.controller');
router.post('/', lessonController.addLesson);
router.post('/sort/many', lessonController.handleSortManyLesson);
router.post('/sort/between-different-topics', lessonController.handleMoveLessonBetweenDifferentTopics);
router.post('/:id', lessonController.editLesson);
router.delete('/:id', lessonController.deleteLesson);
module.exports = router;