const { v4: uuidv4 } = require('uuid');
const { object, string, boolean } = require('yup');
const { Answer, Question } = require('../../models/index');
module.exports = {
     addAnswer: async (req, res) => {
          const response = {};
          try {
               const answerSchema = object({
                    name:
                         string()
                              .required('tên đáp án trống'),
                    result:
                         boolean()
                              .required('kết quả đáp án trống'),
                    questionId:
                         string()
                              .required('id question trống')
                              .test("check", "id question không tồn tại",
                                   async (value) => {
                                        const question = await Question.findByPk(value);
                                        return question;
                                   })
               });
               const body = await answerSchema.validate(req.body, { abortEarly: false });
               const { questionId, name, result } = body;
               const question = await Question.findByPk(questionId);
               const answer = await Answer.create({
                    id: uuidv4(),
                    name,
                    result
               });
               question.addAnswer(answer);
               Object.assign(response, {
                    status: 201,
                    message: 'success',
                    answer: {
                         ...answer,
                         question_id: question.id
                    }
               });
          } catch (e) {
               const errors = Object.fromEntries(e?.inner.map(item => [item.path, item.message]));
               Object.assign(response, {
                    status: 400,
                    errors: {
                         ...errors
                    }
               });


          }
          return res.status(response.status).json(response);
     }
}