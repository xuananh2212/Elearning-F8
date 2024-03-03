const Transformer = require('../core/Transformer');
class QuestionTransformer extends Transformer {
     response(instance) {
          return {
               id: instance.id,
               nameQuestion: instance.question,
               lessonQuizId: instance.lesson_quiz_id,
               explain: instance.explain,
               createdAt: instance.created_at,
               updatedAt: instance.updated_at
          }
     }
}

module.exports = QuestionTransformer;