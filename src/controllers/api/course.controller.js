const { object, string, number } = require('yup');
const { Course, TypeCourse, Category, Lesson, Topic, LessonVideo, LessonQuiz, LessonDocument, Question, Answer } = require('../../models/index');
const { v4: uuidv4 } = require('uuid');
const CourseTransformer = require("../../transformers/course.transformer");
const { Op } = require("sequelize");
function validateCourse(typeCourseId) {
     return object({
          title: string().required("vui lòng nhập tiêu đề khoá học").test("unique", "Tên khoá học đã tồn tại!",
               async (value) => {
                    const course = await Course.findOne({
                         where: {
                              title: value
                         }
                    })
                    return !course;


               }),
          thumb: string().required("vui lòng chọn ảnh đại diện cho khoá học"),
          status: number().required("vui lòng chọn trạng thái"),
          price: number().test("pro", "vui lòng nhập giá tiền", (value) => {
               if (typeCourseId === 2) {
                    if (!value) {
                         return false;
                    }
               }
               return true;
          }),
          slug: string().required("vui lòng nhập đường dẫn"),
          typeCourseId: string().required("vui lòng cho loại khoá học"),
          categoryId: string().required("vui lòng cho danh mục"),

     })
}
module.exports = {
     getAll: async (req, res) => {
          const response = {};
          try {
               const courses = await Course.findAll({
                    include: [{
                         model: TypeCourse
                    }, { model: Category }]
               });
               const coursesTranformer = new CourseTransformer(courses);
               Object.assign(response, {
                    status: 200,
                    message: 'success',
                    courses: coursesTranformer,
               })
          } catch (e) {
               console.log(e);
               Object.assign(response, {
                    status: 400,
                    message: e.message,
               })
          }
          return res.status(response.status).json(response);
     },

     getCourseDetail: async (req, res) => {
          const { id } = req.params;
          const response = {};
          try {
               const course = await Course.findOne({
                    where: { id },
                    include: [{
                         model: Topic,
                         include: [{
                              model: Lesson,
                              include: [
                                   { model: LessonVideo },
                                   { model: LessonDocument },
                                   {
                                        model: LessonQuiz,
                                        include: [{
                                             model: Question,
                                             include: [
                                                  {
                                                       model: Answer
                                                  }
                                             ]
                                        }]
                                   }
                              ]
                         }]
                    }]
               })
               if (!course) {
                    throw new Error('id không tồn tại');
               }
               Object.assign(response, {
                    status: 200,
                    message: 'success',
                    course
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
               let courseSchema = validateCourse(req.body.typeCourseId);
               const body = await courseSchema.validate(req.body, { abortEarly: false });
               let { title, desc, thumb, status, price, categoryId, typeCourseId } = body;
               let category = null;
               if (categoryId) {
                    category = await Category.findByPk(categoryId);
                    if (!category) {
                         return res.status(404).json({ status: 404, message: "category not found" });
                    }
               }
               const typeCourse = await TypeCourse.findByPk(typeCourseId);
               if (!typeCourse) {
                    return res.status(404).json({ status: 404, message: "typeCourse not found" });
               }
               if (typeCourse.id === 1) {
                    price = 0;
               }
               const course = await Course.create({
                    id: uuidv4(),
                    title,
                    desc,
                    thumb,
                    status,
                    price
               })
               await category?.addCourse(course);
               await typeCourse.addCourse(course);
               const courseTransformer = new CourseTransformer(course);
               Object.assign(response, {
                    status: 201,
                    message: 'success',
                    course:
                    {
                         ...courseTransformer,
                         typeCourseId: typeCourse.id,
                         categoryId: category?.id,
                         categoryName: category?.name,
                         typeCourseName: typeCourse?.name
                    }
               });
          } catch (e) {
               console.log(e);
               const errors = Object.fromEntries(e?.inner?.map((item) => [item.path, item.message]));
               Object.assign(response, {
                    status: 400,
                    message: 'bad request',
                    errors

               });

          }
          return res.status(response.status).json(response);
     },
     editCourse: async (req, res) => {
          const { id } = req.params;
          const response = {};
          try {
               const course = await Course.findByPk(id, { include: [{ model: TypeCourse }, { model: Category }] });
               if (!course) {
                    return res.status(404).json({ status: 404, message: 'course Not Found' });
               }
               let courseSchema = object({
                    title: string().required("vui lòng nhập tiêu đề khoá học").test("unique", "Tên khoá học đã tồn tại!",
                         async (value) => {
                              const course = await Course.findOne(
                                   {
                                        where: {
                                             [Op.and]: [
                                                  {
                                                       id: {
                                                            [Op.ne]: id
                                                       }
                                                  },
                                                  {
                                                       title: value
                                                  }
                                             ]
                                        }

                                   }
                              )
                              return !course;


                         }),
                    thumb: string().required("vui lòng chọn ảnh đại diện cho khoá học"),
                    status: number().required("vui lòng chọn trạng thái"),
                    price: number().test("pro", "vui lòng nhập giá tiền", (value) => {
                         if (req.body?.typeCourseId === 2) {
                              if (!value) {
                                   return false;
                              }
                         }
                         return true;
                    }),
                    typeCourseId: string().required("vui lòng cho loại khoá học")
               });
               const body = await courseSchema.validate(req.body, { abortEarly: false });
               const { title, desc, thumb, status, price, categoryId, typeCourseId } = body;
               let category = null;
               if (categoryId) {
                    category = await Category.findByPk(categoryId);
                    if (!category) {
                         return res.status(404).json({ status: 404, message: "category not found" });
                    }
               }
               const typeCourse = await TypeCourse.findByPk(typeCourseId);
               if (!typeCourse) {
                    return res.status(404).json({ status: 404, message: "typeCourse not found" });
               }
               course.title = title;
               course.desc = desc;
               course.thumb = thumb;
               course.status = status;
               if (typeCourse.id === 1) {
                    course.price = 0;
               } else {
                    course.price = price;
               }
               await course.save();
               const categoryOld = await Category.findByPk(course?.category_id);
               const typeCourseOld = await TypeCourse.findByPk(course?.type_course_id);
               const courseTransformer = new CourseTransformer(course);
               let typeCourseName = courseTransformer.typeCourseName;
               let categoryName = courseTransformer.categoryName;
               if (categoryOld || typeCourseOld) {
                    if (categoryOld && (+categoryOld?.id !== +categoryId)) {
                         await categoryOld?.removeCourse(course);
                         await category?.addCourse(course);
                         course.category_id = category?.id;
                         categoryName = category?.name;
                    }
                    if (typeCourseOld && (+typeCourseOld?.id !== +typeCourseId)) {
                         await typeCourseOld?.removeCourse(course);
                         await typeCourse?.addCourse(course);
                         course.type_course_id = typeCourse?.id;
                         typeCourseName = typeCourse?.name;
                    }
                    await course.save();
                    const courseTransformer = new CourseTransformer(course);
                    Object.assign(response, {
                         status: 200,
                         message: 'success',
                         course: {
                              ...courseTransformer, typeCourseName, categoryName
                         }
                    });
               } else {

                    Object.assign(response, {
                         status: 200,
                         message: 'success',
                         course: courseTransformer
                    });
               }
          } catch (e) {
               console.log(e);
               const errors = Object.fromEntries(e?.inner?.map((item) => [item.path, item.message]));
               Object.assign(response, {
                    status: 400,
                    message: "bad request",
                    errors
               });

          }
          return res.status(response.status).json(response);

     },
     deleteCourse: async (req, res) => {
          const { id } = req.params;
          const response = {};
          try {
               const course = await Course.findByPk(id);
               if (!course) {
                    throw new Error('id không tồn tại!');
               }
               course.setTopics([]);
               await Course.destroy({
                    where: {
                         id
                    }
               });
               Object.assign(response, {
                    status: 200,
                    courseId: id,
                    message: 'delete success'
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