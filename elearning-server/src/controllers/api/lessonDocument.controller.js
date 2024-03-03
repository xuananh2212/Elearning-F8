const { LessonDocument, Lesson } = require('../../models/index');
const { object, string } = require('yup');
const { v4: uuidv4 } = require('uuid');
module.exports = {
     addLessonDocument: async (req, res) => {
          const response = {};
          try {
               const lessonDocumentSchema = object({
                    document: string().required('vui lòng nhập document!'),
                    lessonId: string().required('vui lòng nhập id bài học!')
               });
               const body = await lessonDocumentSchema.validate(req.body, { abortEarly: false });
               const { document, lessonId } = body;
               const lesson = await Lesson.findByPk(lessonId);
               if (!lesson) {
                    throw new Error('id không tồn tại!');
               };
               const id = uuidv4();
               await lesson.createLessonDocument({
                    id,
                    document
               });
               Object.assign(response, {
                    status: 201,
                    message: 'success',
                    lessonDocument: {
                         id,
                         document
                    }
               })
          } catch (e) {
               Object.assign(response,
                    {
                         status: 400,
                         message: e.message
                    });

          }
          return res.status(response.status).json(response);
     },
     editLessonDocument: async (req, res) => {
          const response = {};
          const { id } = req.params;
          try {
               const lessonDocumentSchema = object({
                    document: string().required('vui lòng nhập document!')
               });
               const body = await lessonDocumentSchema.validate(req.body, { abortEarly: false });
               const { document } = body;
               const lessonDocument = await LessonDocument.findByPk(id);
               if (!lessonDocument) {
                    throw new Error('id không tồn tại');
               }
               await LessonDocument.update({
                    document
               },
                    {
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
     },
     deleteLessonDocument: async (req, res) => {
          const response = {};
          const { id } = req.params;
          try {
               const lessonDocument = await LessonDocument.findByPk(id);
               if (!lessonDocument) {
                    throw new Error('id không tồn tại');
               }
               await LessonDocument.destroy({
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