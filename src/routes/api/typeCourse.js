const express = require('express');
const router = express.Router();
const typeCourseController = require("../../controllers/api/typeCourse.controller");
router.get('/', typeCourseController.getAll);
router.post('/', typeCourseController.handleAddTypeCourse);
module.exports = router;