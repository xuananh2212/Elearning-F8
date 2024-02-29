const { Course } = require('../../models/index');
module.exports = {
     getAll: async (req, res) => {
          const response = {};
          try {

               const courses = Course.finAll();
               Object.assign(response, {
                    status: 200,
                    message: 'success',
                    courses
               })
          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: 'bad request',

               })
          }

          return res.status(response.status).json(response);
     }
}