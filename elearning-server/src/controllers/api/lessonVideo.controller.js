const { LessonVideo, Lesson } = require('../../models/index');
const { object, string } = require('yup');
const { v4: uuidv4 } = require('uuid');
module.exports = {
     addLessonVideo: async (req, res) => {
          const response = {};
          try {
               const lessonVideoSchema = object({
                    url: string().required('vui lòng nhập url!'),
                    lessonId: string().required('vui lòng nhập id bài học!')
               });
               const body = await lessonVideoSchema.validate(req.body, { abortEarly: false });
               const { url, lessonId } = body;
               const lesson = await Lesson.findByPk(lessonId);
               if (!lesson) {
                    throw new Error('id không tồn tại!');
               };
               const id = uuidv4();
               await lesson.createLessonVideo({
                    id,
                    url
               });
               Object.assign(response, {
                    status: 201,
                    message: 'success',
                    lessonVideo: {
                         id,
                         url
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
     editLessonVideo: async (req, res) => {
          const response = {};
          const { id } = req.params;
          try {
               const lessonVideoSchema = object({
                    url: string().required('vui lòng nhập url!')
               });
               const body = await lessonVideoSchema.validate(req.body, { abortEarly: false });
               const { url } = body;
               const lessonVideo = await LessonVideo.findByPk(id);
               if (!lessonVideo) {
                    throw new Error('id không tồn tại');
               }
               await LessonVideo.update({
                    url
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
     deleteLessonVideo: async (req, res) => {
          const response = {};
          const { id } = req.params;
          try {
               const lessonVideo = await LessonVideo.findByPk(id);
               if (!lessonVideo) {
                    throw new Error('id không tồn tại');
               }
               await LessonVideo.destroy({
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