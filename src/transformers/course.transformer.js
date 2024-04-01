const Transformer = require('../core/Transformer');

class CourseTransformer extends Transformer {
     response(instance) {
          return {
               id: instance.id,
               title: instance.title,
               desc: instance.desc,
               thumb: instance.thumb,
               status: instance.status,
               price: instance.price,
               slug: instance.slug,
               discountId: instance.discount_id,
               discountedPrice: instance.discounted_price,
               discountType: instance?.Discount?.discount_type,
               percent: instance?.Discount?.percent,
               categoryId: instance.category_id,
               typeCourseId: instance.type_course_id,
               categoryName: instance?.Category?.name,
               typeCourseName: instance?.TypeCourse?.name,
               createdAt: instance.created_at,
               updatedAt: instance.updated_at
          }

     }
}

module.exports = CourseTransformer;