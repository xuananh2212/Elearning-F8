const Transformer = require('../core/Transformer');
class CategoryTransformer extends Transformer {
     response(instance) {
          return {
               id: instance.id,
               name: instance.name,
               status: instance.status,
               parentId: instance.parent_id,
               createdAt: instance.created_at,
               updatedAt: instance.updated_at,
          };
     }
}
module.exports = CategoryTransformer;