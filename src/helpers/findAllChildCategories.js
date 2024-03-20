const { Category } = require('../models/index');
const findAllChildCategories = async (parentId) => {
     try {
          const childCategories = await Category.findAll({
               where: {
                    parent_id: parentId

               }
          });
          let allChildCategories = [...childCategories];
          for (const childCategory of childCategories) {
               const subChildCategories = await findAllChildCategories(childCategory.id);
               allChildCategories = allChildCategories.concat(subChildCategories);
          }
          return allChildCategories;
     } catch (error) {
          console.error('Error finding child categories:', error);
          throw error;
     }
};
module.exports = { findAllChildCategories };