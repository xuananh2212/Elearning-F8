
const { object, number, string } = require('yup');
const { v4: uuidv4 } = require('uuid');
const { Lesson, Topic } = require('../../models/index');
const LessonTransformer = require('../../transformers/lesson.transformer');


module.exports = {
     addLesson: async (req, res) => {
          const response = {};
          try {
               const lessonSchema = object({
                    title: string().required("vui lòng nhập title bài học")
               });
               const body = await lessonSchema.validate(req.body, { abortEarly: false });
               const { title, topicId } = body;
               const topic = await Topic.findByPk(topicId);
               if (!topic) {
                    throw new Error('id topic không tồn tại!');
               }
               const lesson = await Lesson.create({
                    id: uuidv4(),
                    title
               });
               const lessonTransformer = new LessonTransformer(lesson);
               await topic.addLesson(lesson);
               Object.assign(response,
                    {
                         status: 201,
                         message: "success",
                         lesson: {
                              ...lessonTransformer,
                              topicId: topic.id
                         }
                    });
          } catch (e) {
               Object.assign(response,
                    {
                         status: 400,
                         message: e.message
                    });
          }
          return res.status(response.status).json(response);
     },
     editLesson: async (req, res) => {
          const response = {};
          const { id } = req.params;
          try {
               const lessonSchema = object({
                    title: string().required("vui lòng nhập title bài học")
               });
               const body = await lessonSchema.validate(req.body, { abortEarly: false });
               const { title } = body;
               const lesson = await Lesson.findByPk(id);
               if (!lesson) {
                    throw new Error('id không tồn tại');
               }
               await Lesson.update(
                    {
                         title
                    }, {
                    where: {
                         id
                    }
               });

               Object.assign(response,
                    {
                         status: 200,
                         message: "updated success",

                    });

          } catch (e) {

               Object.assign(response,
                    {
                         status: 400,
                         message: e.message
                    });
          }
          return res.status(response.status).json(response);
     },
     deleteLesson: async (req, res) => {
          const response = {};
          const { id } = req.params;
          try {
               const lesson = await Lesson.findByPk(id);
               if (!lesson) {
                    throw new Error('id không tồn tại');
               }
               lesson.setLessonVideo();
               lesson.setLessonDocument();
               lesson.setLessonQuiz();
               await Lesson.destroy(
                    {
                         where: {
                              id
                         }
                    });

               Object.assign(response,
                    {
                         status: 200,
                         message: "delete success",

                    });

          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: e.message
               });

          }
          return res.status(response.status).json(response);
     }
}