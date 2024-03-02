const express = require('express');
const router = express.Router();
const lessonDocumentController = require('../../controllers/api/lessonDocument.controller');
router.post('/', lessonDocumentController.addLessonDocument);
router.post('/:id', lessonDocumentController.editLessonDocument);
router.delete('/:id', lessonDocumentController.deleteLessonDocument);
module.exports = router
