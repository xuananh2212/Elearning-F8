const { object, string, number, date, InferType } = require('yup');
const { Course, TypeCourse, Category } = require('../../models/index');
const { v4: uuidv4 } = require('uuid');
function validateCourse() {
     return object({
          title: string().required("vui lòng nhập tiêu đề khoá học"),
          desc: string().required("vui lòng nhập nội dụng khoá học"),
          thumb: string().required("vui lòng chọn ảnh đại diện cho khoá học"),
          status: number().required("vui lòng chọn trạng thái"),
          price: number().required("vui lòng nhập giá tiền"),
          nameCategory: string().required("vui lòng chọn tên danh mục"),
          nameTypeCourse: string().required("vui lòng cho kiểu khoá học")
     })
}
module.exports = {
     getAll: async (req, res) => {
          const response = {};
          try {
               const courses = await Course.findAll();
               if (!courses.length) {
                    throw new Error('không có khoá học nào!')
               }
               Object.assign(response, {
                    status: 200,
                    message: 'success',
                    courses
               })
          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: e.message,
               })
          }
          return res.status(response.status).json(response);
     },

     addCourse: async (req, res) => {
          const response = {};
          try {
               let courseSchema = validateCourse();
               const body = await courseSchema.validate(req.body, { abortEarly: false });
               const { title, desc, thumb, status, price } = body;
               const [category] = await Category.findOrCreate({
                    where: {
                         name: body.nameCategory
                    },
                    defaults: {
                         id: uuidv4(),
                         name: body.nameCategory
                    }
               });
               const [typeCourse] = await TypeCourse.findOrCreate({
                    where: {
                         name: body.nameTypeCourse
                    },
                    defaults: {
                         id: uuidv4(),
                         name: body.nameTypeCourse
                    }
               });
               const course = await Course.create({
                    id: uuidv4(),
                    title,
                    desc,
                    thumb,
                    status,
                    price
               })
               await category.addCourse(course);
               await typeCourse.addCourse(course);
               Object.assign(response, {
                    status: 201,
                    message: 'success',
                    course: {
                         ...course.dataValues,
                         type_course_id: typeCourse.id,
                         category_id: category.id
                    }
               });
          } catch (e) {
               console.log(e);
               Object.assign(response, {
                    status: 400,
                    message: 'bad request',

               });

          }
          return res.status(response.status).json(response);
     },
     editCourse: async (req, res) => {
          const { id } = req.params;
          const response = {};
          try {
               const course = await Course.findByPk(id);
               if (!course) {
                    throw new Error('id không tồn tại');
               }
               let courseSchema = validateCourse();
               const body = await courseSchema.validate(req.body, { abortEarly: false });
               const { title, desc, thumb, status, price, nameCategory, nameTypeCourse } = body;
               const [category] = await Category.findOrCreate({
                    where: {
                         name: body.nameCategory
                    },
                    defaults: {
                         id: uuidv4(),
                         name: body.nameCategory
                    }
               });
               const [typeCourse] = await TypeCourse.findOrCreate({
                    where: {
                         name: body.nameTypeCourse
                    },
                    defaults: {
                         id: uuidv4(),
                         name: body.nameTypeCourse
                    }
               });
               await Course.update({
                    title,
                    desc,
                    thumb,
                    status,
                    price
               },
                    {
                         where: {
                              id
                         }

                    }
               );
               const categoryOld = await Category.findByPk(course.category_id);
               const typeCourseOld = await TypeCourse.findByPk(course.type_course_id);
               if (categoryOld.name !== nameCategory) {
                    await categoryOld.removeCourse(course);
                    await category.addCourse(course);
                    Object.assign(response, {
                         status: 200,
                         message: 'success'
                    });
               }
               if (typeCourseOld.name !== nameTypeCourse) {
                    await typeCourseOld.removeCourse(course);
                    await typeCourse.addCourse(course);
                    Object.assign(response, {
                         status: 200,
                         message: 'success'
                    });
               }



          } catch (e) {
               console.log(e);
               Object.assign(response, {
                    status: 400,
                    message: e.message
               });

          }
          return res.status(response.status).json(response);

     }
}