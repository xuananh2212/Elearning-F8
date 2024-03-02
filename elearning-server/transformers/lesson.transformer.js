const Transformer = require('../core/Transformer');
class LessonTransformer extends Transformer {
     response(instance) {
          return {
               id: instance.id,
               title: instance.title,
               topicId: instance.topic_id,
               createdAt: instance.created_at,
               updatedAt: instance.updated_at
          }
     }
}

module.exports = LessonTransformer;