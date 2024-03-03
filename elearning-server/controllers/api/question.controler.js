const { object, string } = require('yup');
const { v4: uuidv4 } = require('uuid');
const { LessonQuiz, Question } = require('../../models/index');
const QuestionTransformer = require('../../transformers/question.transformer');
module.exports = {
     addQuestion: async (req, res) => {
          const response = {};
          try {
               const questionSchema = object({
                    question: string().required('câu hỏi trống')
               });
               const body = await questionSchema.validate(req.body, { abortEarly: false });
               const { lessonQuizId, question, explain } = body;
               const lessonQuiz = await LessonQuiz.findByPk(lessonQuizId);
               if (!lessonQuiz) {
                    throw new Error('id question không tồn tại!');
               }
               const newQuestion = await Question.create({
                    id: uuidv4(),
                    question,
                    explain
               });
               const questionTransformer = new QuestionTransformer(newQuestion);
               lessonQuiz.addQuestion(newQuestion);
               Object.assign(response, {
                    status: 201,
                    message: 'success',
                    question: {
                         ...questionTransformer,
                         lessonQuizId: lessonQuiz.id
                    }
               });
          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: e.message
               })

          }
          return res.status(response.status).json(response);
     },
     editQuestion: async (req, res) => {
          const { id } = req.params;
          const response = {};
          try {
               const questionSchema = object({
                    question: string().required('câu hỏi trống')
               });
               const body = await questionSchema.validate(req.body, { abortEarly: false });
               const { question: name, explain } = body;
               const question = await Question.findByPk(id);
               if (!question) {
                    throw new Error('id question không tồn tại!');
               }
               await Question.update({
                    question: name,
                    explain
               }, {
                    where: {
                         id
                    }
               })
               Object.assign(response,
                    {
                         status: 200,
                         message: 'success',
                    });
          } catch (e) {
               Object.assign(response,
                    {
                         status: 400,
                         message: e.message
                    })

          }
          return res.status(response.status).json(response);
     },
     deleteQuestion: async (req, res) => {
          const { id } = req.params;
          const response = {};
          try {
               const question = await Question.findByPk(id);

               if (!question) {
                    throw new Error('id question không tồn tại!');
               }
               question.setAnswers([]);
               await Question.destroy({
                    where: { id }
               });
               Object.assign(response,
                    {
                         status: 200,
                         message: 'success',
                    });
          } catch (e) {
               console.log(e);
               Object.assign(response,
                    {
                         status: 400,
                         message: e.message
                    })
          }
          return res.status(response.status).json(response);

     }


}