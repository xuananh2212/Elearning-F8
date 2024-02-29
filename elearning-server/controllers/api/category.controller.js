const { Category } = require('../../models/index');
module.exports = {
     getAll: async (req, res) => {
          const response = {};
          try {

               const categorys = await Category.finAll();
               Object.assign(response, {
                    status: 200,
                    message: 'success',
                    categorys
               })
          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: 'bad request',

               })
          }

          return res.status(response.status).json(response);
     },
     addcategory: async (req, res) => {

     }
}