const { v4: uuidv4 } = require('uuid');
const { Course, Topic } = require('../../models/index');
const { object, string, number, date, InferType } = require('yup');
module.exports = {
     addTopic: async (req, res) => {
          const { courseId, title } = req.body;
          const response = {};
          try {
               const course = await Course.findByPk(courseId);
               if (!course) {
                    throw new Error('id khoá học không tồn tại');
               }
               let topicSchema = object({
                    title: string().required('vui lòng nhập chương học!'),
               })
               topicSchema.validate(req.body, { abortEarly: false });
               const topic = await Topic.create({
                    id: uuidv4(),
                    title
               });
               course.addTopic(topic);
               Object.assign(response, {
                    status: 201,
                    message: 'create success',
                    topic
               })

          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: e.message
               })
          }
          return res.status(response.status).json(response);

     },
     editTopic: async (req, res) => {
          const { id } = req.params;
          const response = {};
          try {
               const topic = await Topic.findByPk(id);
               if (!topic) {
                    throw new Error('id không tồn tại');
               }
               let topicSchema = object({
                    title: string().required('vui lòng nhập chương học!'),
               })
               const body = await topicSchema.validate(req.body, { abortEarly: false });
               await Topic.update({
                    title: body.title
               },
                    {
                         where: {
                              id
                         }
                    });
               Object.assign(response, {
                    status: 200,
                    message: 'update success'
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