const express = require('express');
const router = express.Router();
const lessonVideoController = require('../../controllers/api/lessonVideo.controller');
router.post('/', lessonVideoController.addLessonVideo);
router.post('/:id', lessonVideoController.editLessonVideo);
router.delete('/:id', lessonVideoController.deleteLessonVideo);
module.exports = router
