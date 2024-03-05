const { LessonQuiz, Lesson } = require('../../models/index');
const { object, string } = require('yup');
const { v4: uuidv4 } = require('uuid');
module.exports = {
     addLessonQuiz: async (req, res) => {
          const response = {};
          try {
               const lessonQuizSchema = object({
                    lessonId: string().required('vui lòng nhập id bài học!')
               });
               const body = await lessonQuizSchema.validate(req.body, { abortEarly: false });
               const { lessonId } = body;
               const lesson = await Lesson.findByPk(lessonId);
               if (!lesson) {
                    throw new Error('id không tồn tại!');
               };
               const id = uuidv4();
               await lesson.createLessonQuiz({
                    id
               });
               Object.assign(response, {
                    status: 201,
                    message: 'success',
                    lessonQuiz: {
                         id,
                    }
               })
          } catch (e) {
               console.log(e);
               Object.assign(response,
                    {
                         status: 400,
                         message: e.message
                    });

          }
          return res.status(response.status).json(response);
     },
     deleteLessonQuiz: async (req, res) => {
          const response = {};
          const { id } = req.params;
          try {
               const lessonQuiz = await LessonQuiz.findByPk(id);
               if (!lessonQuiz) {
                    throw new Error('id không tồn tại');
               }
               lessonQuiz.setQuestions([]);
               await LessonQuiz.destroy({
                    where: {
                         id
                    }
               })

               Object.assign(response, {
                    status: 200,
                    message: 'success',
               })
          } catch (e) {
               Object.assign(response,
                    {
                         status: 400,
                         message: e.message
                    });
          }
          return res.status(response.status).json(response);
     }
}