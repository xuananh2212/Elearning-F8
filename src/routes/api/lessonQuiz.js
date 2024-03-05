const express = require('express');
const router = express.Router();
const lessonQuizController = require('../../controllers/api/lessonQuiz.controller');
router.post('/', lessonQuizController.addLessonQuiz);
router.delete('/:id', lessonQuizController.deleteLessonQuiz);
module.exports = router
