
const { object, number, string } = require('yup');
const { v4: uuidv4 } = require('uuid');
const { Lesson, Topic } = require('../../models/index');
const LessonTransformer = require('../../transformers/lesson.transformer');
const lessonServices = require('../../services/lesson.services');
const topicServices = require('../../services/topic.services');


module.exports = {
     addLesson: async (req, res) => {
          const response = {};
          try {
               const lessonSchema = object({
                    title: string().required("vui lòng nhập title bài học"),
                    sort: number().required('vui lòng nhập sort')
               });
               const body = await lessonSchema.validate(req.body, { abortEarly: false });
               const { title, topicId, sort } = body;
               const topic = await Topic.findByPk(topicId);
               if (!topic) {
                    throw new Error('id topic không tồn tại!');
               }
               const lesson = await Lesson.create({
                    id: uuidv4(),
                    title,
                    sort
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
     },
     handleSortManyLesson: async (req, res) => {
          const response = {};
          const { lessons } = req.body;
          console.log(req.body);
          try {
               if (!lessons || Object.keys(lessons).length === 0) {
                    return res.status(400).json({ error: 'Invalid or empty request body' });
               }
               if (!Array.isArray(lessons)) {
                    return res.status(400).json({ error: 'Invalid data type in request body' });
               }
               const lessonFinds = await Promise.all(lessons.map(async ({ id, sort }) => {
                    const lesson = await lessonServices.findByPklesson(id);
                    if (!lesson) {
                         throw new Error('lessonId không tồn tại!');
                    }
                    lesson.sort = sort;
                    await lesson.save();
                    return lesson;
               }));
               Object.assign(response, {
                    status: 200,
                    message: "update successfully",
                    lessons: lessonFinds
               });

          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: e.message
               });
          }
          return res.status(response.status).json(response);
     },
     handleMoveLessonBetweenDifferentTopics: async (req, res) => {
          const response = {};
          const { lessonId, index, topicId } = req.body;
          // console.log("lesssonId", lesssonId);

          try {
               const lesson = await lessonServices.findByPklesson(lessonId);
               const topic = await topicServices.findByPkTopic(topicId);
               if (!lesson) {
                    return res.status(404).json({ status: 404, message: 'lessonId không tồn tại' });
               }
               if (!topic) {
                    return res.status(404).json({ status: 404, message: 'lessonId không tồn tại' });
               }
               const lessonSchema = object({
                    index: number().required("vui lòng nhập index"),
                    topicId: string().required("vui lòng nhập topicId")
               });
               await lessonSchema.validate(req.body, { abortEarly: false });
               lesson.sort = index;
               lesson.topic_id = topicId;
               await lesson.save();
               console.log(lesson)
               Object.assign(response, {
                    status: 200,
                    message: "update successfully",
                    lesson: lesson
               })


          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: e.message
               })

          }
          return res.status(response.status).json(response);
     }
}