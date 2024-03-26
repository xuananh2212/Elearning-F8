const Transformer = require('../core/Transformer');
class DiscountTransformer extends Transformer {
     response(instance) {
          return {
               id: instance.id,
               discountType: instance.discount_type,
               percent: instance.percent,
               quantity: instance.quantity,
               expired: instance.expired,
               createdAt: instance.created_at,
               updatedAt: instance.updated_at,
          };
     }
}

module.exports = DiscountTransformer;