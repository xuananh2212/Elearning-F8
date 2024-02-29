const Transformer = require('../core/Transformer');

class CourseTransformer extends Transformer {
     response = (instance) => {
          return {
               id: instance.id,
               title: instance.title,
               desc: instance.desc,
               thumb: instance.thumb,
               status: instance.status ? 'public' : 'private',
               categoryId: instance.category_id,
               typeCourseId: instance.type_course_id,
               createdAt: instance.created_at,
               updatedAt: instance.updated_at
          }

     }
}

module.exports = CourseTransformer;