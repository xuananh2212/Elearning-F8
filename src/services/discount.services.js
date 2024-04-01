const { Discount } = require("../models/index");
const { v4: uuidv4 } = require("uuid");
const { Op } = require('sequelize');
module.exports = {
     findAllDiscount: async () => {
          return await Discount.findAll();
     },
     findByPkDiscount: async (id) => {
          return await Discount.findByPk(id);
     },
     findOneByTypeAndDifferent: async (id, discountType) => {
          return await Discount.findOne(
               {
                    where: {
                         [Op.and]: {
                              discount_type: discountType,
                              id: {
                                   [Op.ne]: id
                              }
                         }

                    }
               });
     },
     findOneByTypeDiscount: async (discountType) => {
          return await Discount.findOne(
               {
                    where: {
                         discount_type: discountType
                    }
               });
     },
     createDiscount: async (data) => {
          const { discountType, percent, quantity, expired } = data;
          return await Discount.create(
               {
                    id: uuidv4(),
                    discount_type: discountType,
                    percent,
                    quantity,
                    expired
               });

     },
     updateDiscount: async function (id, data) {
          const { discountType, percent, quantity, expired } = data;
          await Discount.update(
               {
                    discount_type: discountType,
                    percent,
                    quantity,
                    expired
               },
               {
                    where: {
                         id
                    }
               });
          return await this.findByPkDiscount(id);


     },
     deleteManyDiscount: async (discountIds) => {
          await Discount.destroy({
               where: {
                    id: discountIds
               }
          });
     }
}