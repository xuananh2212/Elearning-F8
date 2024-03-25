const { TypeCourse } = require('../../models/index');
const { object, string } = require('yup');
const { v4: uuidv4 } = require('uuid');
module.exports = {
     getAll: async (req, res) => {
          const response = {};
          try {
               const typeCourses = await TypeCourse.findAll();
               Object.assign(response, {
                    status: 200,
                    message: 'success',
                    typeCourses
               })
          } catch (e) {
               console.log(e);
               Object.assign(response, {
                    status: 400,
                    message: 'bad request',

               })
          }
          return res.status(response.status).json(response);

     },
     handleAddTypeCourse: async (req, res) => {
          const response = {};
          try {
               const typeCourseSchema = object({
                    name: string().required('vui lòng nhập kiểu khoá học').test("unique", "kiểu khoá học đã tồn tại",
                         async (value) => {
                              const typeCourse = await TypeCourse.findOne({ where: { name: value } });
                              return !typeCourse;

                         })
               });
               const body = await typeCourseSchema.validate(req.body, { abortEarly: false });
               const { name } = body;
               const typeCourse = await TypeCourse.create({
                    name
               });
               Object.assign(response, {
                    status: 201,
                    message: 'success',
                    typeCourse
               })
          } catch (e) {
               console.log(e);
               Object.assign(response, {
                    status: 400,
                    message: e?.message,

               })
          }
          return res.status(response.status).json(response);

     }
}