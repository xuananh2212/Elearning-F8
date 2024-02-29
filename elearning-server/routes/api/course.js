const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/api/course.controller');
router.get('/', courseController.getAll);
router.post('/', courseController.addCourse);
router.post('/:id', courseController.editCourse);
module.exports = router;