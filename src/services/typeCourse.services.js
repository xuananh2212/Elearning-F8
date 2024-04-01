const { TypeCourse } = require('../models/index');
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
module.exports = {
     findByPkTypeCourse: async (typeCourseId) => {
          return await TypeCourse.findByPk(typeCourseId);
     },

}