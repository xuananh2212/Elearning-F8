const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/api/course.controller');
router.get('/', courseController.getAll);
router.get('/:id', courseController.getCourseDetail);
router.post('/', courseController.addCourse);
router.post('/:id', courseController.editCourse);
router.delete('/:id', courseController.deleteCourse);
module.exports = router;