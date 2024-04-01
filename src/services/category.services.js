const { Category } = require('../models/index');
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
module.exports = {
     findAllCategory: async (children) => {
          if (children) {
               return await Category.findAll(
                    {
                         include: 'children'
                    });
          }
          return await Category.findAll();
     },
     findOneByNameAndDifferentCategory: async (id, name) => {
          return await Category.findOne({
               where: {
                    [Op.and]: [
                         {
                              id: {
                                   [Op.ne]: id,
                              }
                         },
                         {
                              name
                         }
                    ]
               }
          })
     },
     findOneByNameCategory: async (name) => {
          return await Category.findOne(
               {
                    where: {
                         name
                    }
               });
     },
     findByPkCategory: async (id, children) => {
          if (children) {
               return await Category.findByPk(id, { include: children });
          }
          return await Category.findByPk(id);
     },
     createCategory: async (data) => {
          const { name, parentId, status } = data;
          return await Category.create(
               {
                    id: uuidv4(),
                    name,
                    parent_id: parentId,
                    status: status
               });
     },
     updateCategory: async function (id, data) {
          const { name, parentId, status } = data;
          await Category.update(
               {
                    name,
                    parent_id: parentId,
                    status: status
               },
               {
                    where: {
                         id
                    }
               });
          return await this.findByPkCategory(id);

     }

}