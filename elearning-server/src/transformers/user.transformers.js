const Transformer = require('../core/Transformer');
class UserTransformer extends Transformer {
     response(instance) {
          return {
               id: instance.id,
               fullName: instance.name,
               email: instance.email,
               createdAt: instance.created_at,
               updatedAt: instance.updated_at,
          };
     }
}

module.exports = UserTransformer;