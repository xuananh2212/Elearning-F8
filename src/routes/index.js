var express = require("express");

var router = express.Router();

const authRouter = require('./api/auth');
const userRouter = require('./api/user');
const uploadRouter = require('./api/upload');
const courseRouter = require('./api/course');
const categoryRouter = require('./api/category');
const topicRouter = require('./api/topic');
const typeCourseRouter = require('./api/typeCourse');
const lessonRouter = require('./api/lesson');
const lessonVideoRouter = require('./api/lessonVideo');
const lessonDocumentRouter = require('./api/lessonDocument');
const lessonQuizRouter = require('./api/lessonQuiz');
const questionRouter = require('./api/question');
const answerRouter = require('./api/answer');

router.use("/auth/v1", authRouter);
router.use("/user/v1", userRouter);
router.use("/upload/v1", uploadRouter);
router.use("/course/v1", courseRouter);
router.use("/type-course/v1", typeCourseRouter);
router.use("/category/v1", categoryRouter);
router.use("/topic/v1", topicRouter);
router.use("/lesson/v1", lessonRouter);
router.use("/lessonVideo/v1", lessonVideoRouter);
router.use("/lessonDocument/v1", lessonDocumentRouter);
router.use("/lessonQuiz/v1", lessonQuizRouter);
router.use("/question/v1", questionRouter);
router.use("/answer/v1", answerRouter);
module.exports = router;