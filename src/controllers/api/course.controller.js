const { object, string, number } = require('yup');
const CourseTransformer = require("../../transformers/course.transformer");
const courseServices = require('../../services/course.services');
const typeCourseServices = require('../../services/typeCourse.services');
const categoryServices = require('../../services/category.services');
const discountServices = require('../../services/discount.services');
module.exports = {
     getAll: async (req, res) => {
          const response = {};
          try {
               const courses = await courseServices.findAllCourse();
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
          const { slug } = req.params;
          const response = {};
          try {
               const course = await courseServices.findOneBySlugCourseDetail(slug);
               if (!course) {
                    throw new Error('slug không tồn tại');
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

     handleAddCourse: async (req, res) => {
          const response = {};
          const { typeCourseId } = req.body;
          try {
               let courseSchema = object({
                    title: string().required("vui lòng nhập tiêu đề khoá học").test("unique", "Tên khoá học đã tồn tại!",
                         async (value) => {
                              const course = await courseServices.findOneByTitle(value);
                              return !course;


                         }),
                    slug: string()
                         .required("vui lòng nhập đường dẫn")
                         .test("unique", "đường dẫn đã tồn tại!",
                              async (value) => {
                                   const course = await courseServices.findOneBySlug(value)
                                   return !course;
                              }),
                    thumb: string()
                         .required("vui lòng chọn ảnh đại diện cho khoá học"),
                    status: number()
                         .required("vui lòng chọn trạng thái"),
                    price: number()
                         .test("pro", "vui lòng nhập giá tiền", async (value) => {
                              const typeCourse = await typeCourseServices.findByPkTypeCourse(typeCourseId);
                              console.log(typeCourse);
                              if (typeCourse?.name !== "miễn phí") {
                                   if (!value) {
                                        return false;
                                   }
                              }
                              return true;
                         }),
                    typeCourseId: number().required("vui lòng cho loại khoá học"),
                    categoryId: string().required("vui lòng cho danh mục"),

               });
               const body = await courseSchema.validate(req.body, { abortEarly: false });
               let { discountId, categoryId } = body;
               const typeCourse = await typeCourseServices.findByPkTypeCourse(typeCourseId);
               const category = await categoryServices.findByPkCategory(categoryId);
               let discount = null;
               if (discountId) {
                    discount = await discountServices.findByPkDiscount(discountId);
                    if (!discount) {
                         return res.status(404).json({ status: 404, message: "discount not found" });
                    }
               }
               if (!typeCourse) {
                    return res.status(404).json({ status: 404, message: "typeCourse not found" });
               }
               if (!category) {
                    return res.status(404).json({ status: 404, message: "category not found" });
               }
               const course = await courseServices.createCourse(body);
               await category?.addCourse(course);
               await typeCourse?.addCourse(course);
               await discount?.addCourse(course);
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
                         typeCourseName: typeCourse?.name,
                         discountId: discount?.id,
                         discountType: discount?.discount_type
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
     handleEditCourse: async (req, res) => {
          const { id } = req.params;
          const response = {};
          const { typeCourseId } = req.body;
          try {
               let course = await courseServices.findByPkCourse(id);
               if (!course) {
                    return res.status(404).json({ status: 404, message: 'course Not Found' });
               }
               let courseSchema = object({
                    title: string()
                         .required("vui lòng nhập tiêu đề khoá học")
                         .test("unique", "Tên khoá học đã tồn tại!",
                              async (title) => {
                                   const course = await courseServices.findOneByTitleAnDifferentId(id, title);
                                   return !course;


                              })
                    ,
                    thumb: string()
                         .required("vui lòng chọn ảnh đại diện cho khoá học"),
                    status: number()
                         .required("vui lòng chọn trạng thái"),
                    price: number()
                         .notRequired()
                         .test("pro", "vui lòng nhập giá tiền", async (value) => {
                              const { name } = await typeCourseServices.findByPkTypeCourse(typeCourseId);
                              if (name !== "miễn phí") {
                                   if (!value) {
                                        return false;
                                   }
                              }
                              return true;
                         }),
                    slug: string()
                         .required("vui lòng nhập đường dẫn")
                         .test("unique-slug", "đường dẫn đã tồn tại!",
                              async (value) => {
                                   const course = await courseServices.findOneBySlugAndDifferentId(id, value);
                                   return !course;
                              })
                    ,
                    typeCourseId: number().required("vui lòng cho loại khoá học"),
                    categoryId: string().required("vui lòng chọn danh mục")
               });
               const body = await courseSchema.validate(req.body, { abortEarly: false });
               let { categoryId, discountId } = body;
               const category = await categoryServices.findByPkCategory(categoryId);
               if (!category) {
                    return res.status(404).json({ status: 404, message: "category not found" });
               }
               const typeCourse = await typeCourseServices.findByPkTypeCourse(typeCourseId);
               if (!typeCourse) {
                    return res.status(404).json({ status: 404, message: "typeCourse not found" });
               }
               const categoryOld = await categoryServices.findByPkCategory(course?.category_id);
               const typeCourseOld = await typeCourseServices.findByPkTypeCourse(course?.type_course_id);
               const discountOld = await discountServices.findByPkDiscount(course?.discount_id);
               if (typeCourse.name === "miễn phí") {
                    body.price = 0;
                    await discountOld?.removeCourse(course);
               } else {
                    const discount = await discountServices.findByPkDiscount(discountId);
                    console.log(discount, discountOld, 2333333)
                    if (discountOld || discountId) {
                         if (discountOld?.id !== discountId) {
                              await discountOld?.removeCourse(course);
                              await discount?.addCourse(course);
                         }
                    }
               }
               course = await courseServices.updateCourse(id, body);
               if (categoryOld?.id !== categoryId) {
                    await categoryOld?.removeCourse(course);
                    await category?.addCourse(course);
               }
               if (typeCourseOld?.id !== typeCourseId) {
                    await typeCourseOld?.removeCourse(course);
                    await typeCourse?.addCourse(course);
               }

               const courseNew = await courseServices.findByPkCourse(id);
               const courseTransformer = new CourseTransformer(courseNew);
               Object.assign(response, {
                    status: 200,
                    message: 'success',
                    course: courseTransformer
               });
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
     handleDeleteCourse: async (req, res) => {
          const { id } = req.params;
          const response = {};
          try {
               const course = await courseServices.findByPkCourse(id);
               if (!course) {
                    throw new Error('id không tồn tại!');
               }
               course.setTopics([]);
               await course.destroy();
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
     ,
     handleDeleteManyCourse: async (req, res) => {
          const response = {};
          const { courseIds } = req.body;
          try {
               if (!Array.isArray(courseIds)) {
                    return res.status(400).json({ status: 400, message: 'Định dạng dữ liệu không hợp lệ!' })
               }
               if (courseIds.length === 0) {
                    throw new Error('danh sách id rỗng!');
               }
               await courseServices.deleteManyCourse(courseIds);

               Object.assign(response, {
                    status: 200,
                    message: 'delete success',
                    courseIds
               });

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