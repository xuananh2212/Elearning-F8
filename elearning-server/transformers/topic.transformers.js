const Transformer = require('../core/Transformer');
class TopicTransformer extends Transformer {
     response(instance) {
          return {
               id: instance.id,
               title: instance.title,
               courseId: instance.course_id,
               createdAt: instance.created_at,
               updatedAt: instance.updated_at
          }
     }
}
module.exports = TopicTransformer;